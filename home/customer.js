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
  productSection.innerHTML = ""; // Clear static products

  try {
    const snapshot = await db.collection("products").get();
    snapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;

      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-img">
          <img src="${product.imageUrl}" alt="${product.name}" />
          <button class="quick-view-btn">Quick View</button>
        </div>
        <div class="product-info">
          <p class="product-title">${product.name}</p>
          <p class="product-price">$${product.price}</p>
          <button class="add-to-cart-btn" data-id="${productId}">Add to Cart</button>
        </div>
<button class="add-to-wishlist-btn" data-id="PRODUCT_ID">🤍 Add to Wishlist</button>
      `;

      productSection.appendChild(card);
    });

//////////////////////////////////////

    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
       alert("Added to cart:", id);
      });
    });

  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// utility: يحمّل منتجات مع فلترة حسب الفئة (category)
async function loadProducts(category = "all") {
  const productSection = document.querySelector(".product-section");
  productSection.innerHTML = "";

  try {
    let query = db.collection("products");
    if (category && category !== "all") {
      query = query.where("category", "==", category);
    }

    const snapshot = await query.get();

    if (snapshot.empty) {
      productSection.innerHTML = "<p>No products found in this category.</p>";
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
          <button class="quick-view-btn">Quick View</button>
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
            alert("✅ Product added to cart:", productData.name);
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
            // لو عايز تحذف من الـ wishlist لازم تحفظ الـ doc id وترجع تحذفه
            wishlistBtn.classList.remove("active");
            wishlistBtn.innerHTML = `<i class="fa-regular fa-heart"></i>`;
          } else {
            wishlistBtn.classList.add("active");
            wishlistBtn.innerHTML = `<i class="fa-solid fa-heart"></i>`;
            await db.collection("wishlist").add(productData);
            alert("💖 Product added to wishlist:", productData.name);
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
/////////////////////////////////////////////////////// fillter//////////////////////


const categoryLinks = document.querySelectorAll(".product-categories a");
categoryLinks.forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();

    // تفعيل الـ active class
    categoryLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    // نجيب النص، ونعالجه عشان "All Products" تبقى all
    let categoryText = link.textContent.trim().toLowerCase();
    if (categoryText === "all products") categoryText = "all";

    await loadProducts(categoryText);
  });
});

// تحميل افتراضي (كل المنتجات)
loadProducts("all");


