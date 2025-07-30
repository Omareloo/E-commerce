document.addEventListener("DOMContentLoaded", function () {
    var cartItemsContainer = document.querySelector(".wishlist-container");
    var summaryCount = document.querySelector(".summary-value");
    var summaryTotal = document.querySelector(".totalprice-value");
    var removeAllBtn = document.querySelector(".remove-btn");
    var continueBtn = document.querySelector(".continue-btn");

    function updateSummary() {
        var items = document.querySelectorAll(".cart-item");
        var total = 0;
        items.forEach(item => {
            var priceText = item.querySelector(".col-price").textContent.replace('$', '').trim();
            total += parseFloat(priceText);
        });
        summaryCount.textContent = items.length;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    // إضافة إلى السلة
    cartItemsContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("col-procedures-btn")) {
            var productName = e.target.closest(".cart-item").querySelector(".col-product span").textContent;
            alert(`"${productName}" has been added to your shopping cart!`);
        }

        // إزالة عنصر واحد
        if (e.target.classList.contains("col-procedures-btnre")) {
            var item = e.target.closest(".cart-item");
            item.remove();
            updateSummary();
        }
    });

    // إزالة جميع العناصر
    removeAllBtn.addEventListener("click", function () {
        var allItems = document.querySelectorAll(".cart-item");
        allItems.forEach(item => item.remove());
        updateSummary();
    });

    // متابعه التسوق
    continueBtn.addEventListener("click", function () {
    window.open("../home/index.html", "_blank");
    });

    updateSummary(); // أول مرة عند تحميل الصفحة
});
