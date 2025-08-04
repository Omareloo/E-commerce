document.addEventListener("DOMContentLoaded", async function () {
    const cardItemsContainer = document.querySelector(".card-container");
    const summaryCount = document.querySelector(".summary-value");
    const summaryTotal = document.querySelector(".totalprice-value");
    const removeAllBtn = document.querySelector(".remove-btn");
    const continueBtn = document.querySelector(".continue-btn");
    const proceedBtn = document.querySelector(".proceed-checkout-btn");

    function updateSummary() {
        const items = document.querySelectorAll(".card-item");
        let total = 0;
        items.forEach(item => {
            let priceText = item.querySelector(".col-price")?.textContent || "0";
            priceText = priceText.replace(/[^0-9.]/g, "");
            const price = parseFloat(priceText);
            if (!isNaN(price)) total += price;
        });
        summaryCount.textContent = items.length;
        summaryTotal.textContent = `$${total.toFixed(2)}`;
    }

    cardItemsContainer?.addEventListener("click", async function (e) {
        const target = e.target;
        const item = target.closest(".card-item");
        if (!item) return;
        const productId = item.dataset.id;
        if (!productId) return;

        // add one product to orders
        if (target.classList.contains("accept-btn")) {
            try {
                const productRef = db.collection("wishlist").doc(productId);
                const productDoc = await productRef.get();
                if (productDoc.exists) {
                    const productData = productDoc.data();
                    productData.orderStatus="pending";
                    await db.collection("orders").add(productData);
                    alert(`✅ "${productData.name}" has been added to orders.`);
                    await db.collection("wishlist").doc(productId).delete();
                    item.remove();
                    updateSummary();
                }
            } catch (err) {
                console.error("Error adding to orders:", err);
            }
        }

        // add one product to cart page
        if (target.classList.contains("col-procedures-btn")) {
            try {
                const productRef = db.collection("wishlist").doc(productId);
                const productDoc = await productRef.get();
                if (productDoc.exists) {
                    const productData = productDoc.data();
                    await db.collection("cart").doc(productId).set(productData);
                    alert(`✅ "${productData.name}" has been added to cart.`);
                    await db.collection("wishlist").doc(productId).delete();
                    item.remove();
                    updateSummary();
                }
            } catch (err) {
                console.error("Error adding to cart:", err);
            }
        }

        // remove one product
        if (target.classList.contains("col-procedures-btnre")) {
            item.remove();
            updateSummary();
            try {
                await db.collection("wishlist").doc(productId).delete();
            } catch (err) {
                console.error("Error removing from wishlist:", err);
            }
        }
    });
            // remove all products
    removeAllBtn?.addEventListener("click", async function () {
        const allItems = document.querySelectorAll(".card-item");
        for (const item of allItems) {
            const productId = item.dataset.id;
            item.remove();
            try {
                await db.collection("wishlist").doc(productId).delete();
            } catch (err) {
                console.error("Error deleting item:", err);
            }
        }
        updateSummary();
        alert("All Products Have Been Removed");
        window.open("../home/index.html","_blank");

    });

    continueBtn?.addEventListener("click", function () {
        window.open("../home/index.html", "_blank");
    });
            // add all products to cart page
    proceedBtn?.addEventListener("click", async function () {
        const allItems = document.querySelectorAll(".card-item");
        if (allItems.length > 0) {
            try {
                const cartSnapshot = await db.collection("cart").get();
                const batch = db.batch();
                cartSnapshot.forEach(doc => {
                    batch.delete(doc.ref);
                });
                await batch.commit();
                const wishlistSnapshot = await db.collection("wishlist").get();
                const wishlistBatch = db.batch();
                wishlistSnapshot.forEach(doc => {
                    const productData = doc.data();
                    db.collection("cart").doc(doc.id).set(productData);
                    wishlistBatch.delete(doc.ref);
                });
                await wishlistBatch.commit();
                
                allItems.forEach(item => item.remove());
                updateSummary();
                alert("All products have been added to the cart");
                window.open("../cart/cart.html","_blank");
            } catch (err) {
                console.error("Error adding all products to cart:", err);
                alert("An error occurred while adding products to the cart.");
            }
        } else {
            alert("Your wishlist is empty. Please add products to your wishlist first.");
            window.open("../home/index.html","_blank");

        }
    });

    await loadProducts();
});

async function loadProducts() {
    const productSection = document.querySelector(".card-container");
    productSection.innerHTML = "";
    function updateSummary(countOverride = null, totalOverride = null) {
        if (countOverride !== null && totalOverride !== null) {
            document.querySelector(".summary-value").textContent = countOverride;
            document.querySelector(".totalprice-value").textContent = `$${totalOverride.toFixed(2)}`;
            return;
        }
        const items = document.querySelectorAll(".card-item");
        let total = 0;
        items.forEach(item => {
            let priceText = item.querySelector(".col-price")?.textContent || "0";
            priceText = priceText.replace(/[^0-9.]/g, "");
            const price = parseFloat(priceText);
            if (!isNaN(price)) total += price;
        });
        document.querySelector(".summary-value").textContent = items.length;
        document.querySelector(".totalprice-value").textContent = `$${total.toFixed(2)}`;
    }
    try {
        const snapshot = await db.collection("wishlist").get();
        if (snapshot.empty) {
            productSection.innerHTML = "<p>No products in wishlist.</p>";
            updateSummary(0, 0); 
            return;
        }
        snapshot.forEach((doc) => {
            const wishlist = doc.data();
            const productId = doc.id;
            const card = document.createElement("div");
            card.className = "card-item";
            card.setAttribute("data-id", productId);
            card.innerHTML = `
                <button class="accept-btn">&#10003;</button>
                <div class="col-id">${productId || ""}</div>
                <div class="col-product">
                    <img src="${wishlist.imageUrl}" alt="${wishlist.name}">
                    <span>${wishlist.name}</span>
                </div>
                <div class="col-price">$${wishlist.price}</div>
                <div class="col-procedures">
                    <button class="col-procedures-btn">Add To Shopping cart</button>
                    <button class="col-procedures-btnre">Remove From Wish List</button>
                </div>
            `;
            productSection.appendChild(card);
        });
        updateSummary(); 
    } catch (error) {
        console.error("Error loading wishlist products:", error);
        productSection.innerHTML = "<p>Something went wrong while loading your wishlist.</p>";
        updateSummary(0, 0); 
    }
}

function updateSummary(countOverride = null, totalOverride = null) {
    if (countOverride !== null && totalOverride !== null) {
        document.querySelector(".summary-value").textContent = countOverride;
        document.querySelector(".totalprice-value").textContent = `$${totalOverride.toFixed(2)}`;
        return;
    }
    const items = document.querySelectorAll(".card-item");
    let total = 0;
    items.forEach(item => {
        let priceText = item.querySelector(".col-price")?.textContent || "0";
        priceText = priceText.replace(/[^0-9.]/g, "");
        const price = parseFloat(priceText);
        if (!isNaN(price)) total += price;
    });
    document.querySelector(".summary-value").textContent = items.length;
    document.querySelector(".totalprice-value").textContent = `$${total.toFixed(2)}`;
}