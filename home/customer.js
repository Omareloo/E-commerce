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