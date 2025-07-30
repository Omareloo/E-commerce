document.addEventListener("DOMContentLoaded", function () {
    var cartContainer = document.querySelector(".cart-container");
    var totalDisplay = document.querySelector(".total-row span:last-child");
    var continueBtn = document.querySelector(".Continue-btn");

    function parsePrice(text) {
        return parseFloat(text.replace("$", "").trim());
    }

    function formatPrice(num) {
        return `$${num.toFixed(2)}`;
    }

    function updateItemTotal(item) {
        var price = parsePrice(item.querySelector(".col-price").textContent);
        var quantity = parseInt(item.querySelector(".quantity-input").value);
        var total = price * quantity;
        item.querySelector(".col-total").textContent = formatPrice(total);
    }

    function updateCartTotal() {
        var items = document.querySelectorAll(".cart-item");
        var totalSum = 0;
        items.forEach(item => {
            var itemTotal = parsePrice(item.querySelector(".col-total").textContent);
            totalSum += itemTotal;
        });
        totalDisplay.textContent = formatPrice(totalSum);
    }

    cartContainer.addEventListener("click", function (e) {
        var target = e.target;

        // زيادة الكمية
        if (target.classList.contains("quantity-btn") && target.textContent === "+") {
            var input = target.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            var item = target.closest(".cart-item");
            updateItemTotal(item);
            updateCartTotal();
        }

        // تقليل الكمية
        if (target.classList.contains("quantity-btn") && target.textContent === "-") {
            var input = target.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
                var item = target.closest(".cart-item");
                updateItemTotal(item);
                updateCartTotal();
            }
        }

        // إزالة منتج
        if (target.classList.contains("remove-btn")) {
            var item = target.closest(".cart-item");
            item.remove();
            updateCartTotal();
        }

        // تأكيد المنتج
        if (target.classList.contains("accept-btn")) {
            var productName = target.closest(".cart-item").querySelector(".col-product span:last-child").textContent;
            alert(`"${productName}" has been confirmed.`);
        }
    });

    // تغيير مباشر في input الكمية
    cartContainer.addEventListener("input", function (e) {
        if (e.target.classList.contains("quantity-input")) {
            var item = e.target.closest(".cart-item");
            if (parseInt(e.target.value) < 1 || isNaN(parseInt(e.target.value))) {
                e.target.value = 1;
            }
            updateItemTotal(item);
            updateCartTotal();
        }
    });

    // زر متابعة التسوق
    continueBtn.addEventListener("click", function () {
    window.open("../home/index.html", "_blank");
    });

    // تحديث المجموع عند التحميل
    document.querySelectorAll(".cart-item").forEach(updateItemTotal);
    updateCartTotal();
});
