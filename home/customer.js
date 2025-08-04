 let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    const inner = document.querySelector('.carousel-inner');

    function updateCarousel() {
      inner.style.transform = `translateX(-${currentSlide * 100}%)`;
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
      });
    }

    function moveSlide(direction) {
      currentSlide += direction;
      if (currentSlide < 0) currentSlide = slides.length - 1;
      else if (currentSlide >= slides.length) currentSlide = 0;
      updateCarousel();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateCarousel();
    }

    // Auto-slide every 5s
    setInterval(() => {
      moveSlide(1);
    }, 5000);

    



async function loadProducts() {
  const productSection = document.querySelector(".product-section");
  productSection.innerHTML = "";

  try {
    const snapshot = await db.collection("products").get();

    if (snapshot.empty) {
      productSection.innerHTML = "<p>No products found.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;

      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <div class="product-img">
          <img src="${product.imageUrl}" alt="${product.name}" />
        </div>
        <div class="product-info">
          <p class="product-title">${product.name}</p>
          <p class="product-price">$${product.price}</p>
          <button class="add-to-cart-btn" data-id="${productId}">Add to Cart</button>
          <button class="wishlist-btn" data-id="${productId}" aria-label="Add to wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
      `;

      productSection.appendChild(card);

      // Add to Cart
      const addToCartBtn = card.querySelector(".add-to-cart-btn");
      addToCartBtn.addEventListener("click", async () => {
        try {
          const productRef = db.collection("products").doc(productId);
          const productDoc = await productRef.get();
          if (productDoc.exists) {
            const productData = productDoc.data();
            await db.collection("cart").add(productData);
            alert(`✅ Product added to cart: ${productData.name}`);
          }
        } catch (err) {
          console.error("Error adding to cart:", err);
        }
      });

      // Wishlist toggle + add
      const wishlistBtn = card.querySelector(".wishlist-btn");
      wishlistBtn.addEventListener("click", async () => {
        try {
          const productRef = db.collection("products").doc(productId);
          const productDoc = await productRef.get();
          if (!productDoc.exists) return;
          const productData = productDoc.data();

          if (wishlistBtn.classList.contains("active")) {
            wishlistBtn.classList.remove("active");
            wishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
          } else {
            wishlistBtn.classList.add("active");
            wishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
            await db.collection("wishlist").add(productData);
            alert(`💖 Product added to wishlist: ${productData.name}`);
          }
        } catch (err) {
          console.error("Error toggling wishlist:", err);
        }
      });
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}
///////////////// fillter//////////////////////


document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll(".product-categories a");
  const productSection = document.querySelector(".product-section");
  let currentFilter = "";

  async function showProducts(filter) {
    currentFilter = (filter || "").toLowerCase();
    productSection.innerHTML = "";

    try {
      const snapshot = await db.collection("products").get();

      snapshot.forEach(doc => {
        const p = doc.data();
        const id = doc.id;

        if (currentFilter) {
          const desc = (p.description || "").toLowerCase();
          if (!desc.includes(currentFilter)) return;
        }

        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
          <div class="product-img">
            <img src="${p.imageUrl}" alt="${p.name}" />
          </div>
          <div class="product-info">
            <p class="product-title">${p.name}</p>
            <p class="product-price">$${p.price}</p>
            <button class="add-to-cart-btn" data-id="${id}">Add to Cart</button>
            <button class="wishlist-btn" data-id="${id}">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
        `;
        productSection.appendChild(card);
      });

    } catch (e) {
      console.error(e);
      productSection.textContent = "Failed to load products.";
    }
  }

  links.forEach(link => {
    link.onclick = function (e) {
      e.preventDefault();
      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");

      const cat = (link.getAttribute("data-category") || "").toLowerCase();
      if (cat === "all") {
        showProducts();
      } else {
        showProducts(cat);
      }
    };
  });

});


loadProducts("all");


