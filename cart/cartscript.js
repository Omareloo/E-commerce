document.addEventListener("DOMContentLoaded", function () {
    const cardContainer = document.getElementById("cart-items");
    const totalDisplay = document.querySelector(".aside-cart .total-row span:last-child");
    const continueBtn = document.querySelector(".Continue-btn");
    const removeAllBtn = document.querySelector(".removeall-btn");
    const proceedBtn = document.querySelector(".proceed-btn");

    function parsePrice(text) {
        return parseFloat(text.replace("$", "").trim());
    }

    function formatPrice(num) {
        return `$${num.toFixed(2)}`;
    }

    function updateItemTotal(item) {
        const price = parsePrice(item.querySelector(".col-price").textContent);
        const quantity = parseInt(item.querySelector(".quantity-input").value);
        const total = price * quantity;
        item.querySelector(".col-total").textContent = formatPrice(total);
    }
    function updateCartTotal() {
        const items = document.querySelectorAll("#cart-items .card-item");
        let totalSum = 0;
        items.forEach(item => {
            const itemTotal = parsePrice(item.querySelector(".col-total").textContent);
            totalSum += itemTotal;
        });
        totalDisplay.textContent = formatPrice(totalSum);
    }

    cardContainer.addEventListener("click", function (e) {
        const target = e.target;
        const item = target.closest(".card-item");
        if (!item) return;
        const productId = item.dataset.id;
        
        if (target.classList.contains("quantity-btn")) {
            const input = target.parentElement.querySelector(".quantity-input");
            let value = parseInt(input.value);
            if (target.textContent === "+") {
                input.value = value + 1;
            } else if (target.textContent === "-" && value > 1) {
                input.value = value - 1;
            }
            updateItemTotal(item);
            updateCartTotal();
        }
        if (target.classList.contains("remove-btn")) {
            if (productId) {
                db.collection("cart").doc(productId).delete().then(() => {
                    item.remove();
                    updateCartTotal();
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            } else {
                item.remove();
                updateCartTotal();
            }
        }
    });

    cardContainer.addEventListener("input", function (e) {
        if (e.target.classList.contains("quantity-input")) {
            const input = e.target;
            const item = input.closest(".card-item");
            if (parseInt(input.value) < 1 || isNaN(parseInt(input.value))) {
                input.value = 1;
            }
            updateItemTotal(item);
            updateCartTotal();
        }
    });
    continueBtn.addEventListener("click", function () {
        window.open("../home/index.html", "_blank");
    });
            // remove all products
    removeAllBtn?.addEventListener("click", async function() {
        const allItems = document.querySelectorAll(".card-item");
        if (allItems.length > 0) {
            try {
                const cartSnapshot = await db.collection("cart").get();
                const batch = db.batch();
                cartSnapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                allItems.forEach(item => item.remove());
                updateCartTotal();
                alert("All products have been removed from your cart.");
                window.open("../home/index.html","_blank");
            } catch (err) {
                console.error("Error removing all products:", err);
                alert("An error occurred while removing products.");
            }
        } else {
            alert("Your cart is already empty.");
            window.open("../home/index.html","_blank");
        }
    });
    //    order all products
    proceedBtn?.addEventListener("click", async function() {
        const allItems = document.querySelectorAll(".card-item");
        if (allItems.length > 0) {
            try {
                const cartSnapshot = await db.collection("cart").get();
                const batch = db.batch();
                cartSnapshot.forEach(doc => {
                    
                    const productData = doc.data();
                    productData.orderStatus="pending";
                    db.collection("orders").add(productData);
                    batch.delete(doc.ref);
                });
                await batch.commit(); // تنفيذ عملية الحذف
                allItems.forEach(item => item.remove());
                updateCartTotal();
                alert("Your order has been placed successfully ");
                window.open("../home/index.html","_blank"); 
            } catch (err) {
                console.error("Error proceeding to checkout:", err);
                alert("An error occurred during checkout.");
            }
        } else {
            alert("Your cart is empty. Please add Products to your cart first.");
            window.open("../home/index.html","_blank");
        }
    });

    loadProducts();

    async function loadProducts() {
        cardContainer.innerHTML = "";
        try {
            const snapshot = await db.collection("cart").get();
            if (snapshot.empty) {
                cardContainer.innerHTML = "<p>No products in cart.</p>";
                totalDisplay.textContent = "$0.00";
                return;
            }

            snapshot.forEach((doc) => {
                const cart = doc.data();
                const productId = doc.id;
                const card = document.createElement("div");
                card.className = "card-item";
                card.setAttribute("data-id", productId);
                card.innerHTML = `
                    <div class="col-product">
                        <button class="remove-btn">&times;</button>
                        <img src="${cart.imageUrl}" alt="${cart.name}">
                        <span>${cart.name}</span>
                    </div>
                    <div class="col-id">${productId}</div>
                    <div class="col-price">$${cart.price}</div>
                    <div class="col-quantity">
                        <button class="quantity-btn">-</button>
                        <input type="number" value="${cart.quantity || 1}" class="quantity-input">
                        <button class="quantity-btn">+</button>
                    </div>
                    <div class="col-total">$0.00</div>
                `;
                cardContainer.appendChild(card);
                updateItemTotal(card);
            });
            updateCartTotal();

        } catch (error) {
            console.error("Error loading products:", error);
            cardContainer.innerHTML = "<p>Something went wrong while loading your cart.</p>";
        }
    }
});