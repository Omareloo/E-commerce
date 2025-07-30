// const quickViewBox = document.getElementById("quickViewBox");
// const quickViewOverlay = document.getElementById("quickViewOverlay");
// const closePopup = document.getElementById("closePopup");

// const popupImg = document.getElementById("popupImg");
// const popupTitle = document.getElementById("popupTitle");
// const popupPrice = document.getElementById("popupPrice");

// const quickViewButtons = document.querySelectorAll(".quick-view-btn");

// quickViewButtons.forEach((btn) => {
//   btn.addEventListener("click", () => {
//     const product = btn.closest(".product-card");
//     const imgSrc = product.querySelector("img").getAttribute("src");
//     const title = product.querySelector("h3").innerText;
//     const price = product.querySelector(".price").innerText;

//     popupImg.setAttribute("src", imgSrc);
//     popupTitle.innerText = title;
//     popupPrice.innerText = price;

//     quickViewBox.style.display = "block";
//     quickViewOverlay.style.display = "block";
//   });
// });

// closePopup.addEventListener("click", () => {
//   quickViewBox.style.display = "none";
//   quickViewOverlay.style.display = "none";
// });

// quickViewOverlay.addEventListener("click", () => {
//   quickViewBox.style.display = "none";
//   quickViewOverlay.style.display = "none";
// });


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
        </div>
        <span class="wishlist">♡</span>
      `;

      productSection.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// Load products on page load
loadProducts();