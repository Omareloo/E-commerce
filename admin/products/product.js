
// ✅ Highlight active page in sidebar
window.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  loadCategories();
  loadProducts();
});

// ✅ Load categories into select input
async function loadCategories() {
  const categorySelects = document.querySelectorAll("#product-category");
  const snapshot = await db.collection("categories").get();

  categorySelects.forEach(select => {
    select.innerHTML = `<option value="">Choose Category</option>`;
    snapshot.forEach(doc => {
      const option = document.createElement("option");
      option.value = doc.id;
      option.textContent = doc.data().name;
      select.appendChild(option);
    });
  });
}

// ✅ Add product
const addForm = document.querySelector(".add-product form");
if (addForm) {
  addForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("product-name").value.trim();
    const description = document.getElementById("product-description").value.trim();
    const price = parseFloat(document.getElementById("product-price").value);
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const categoryId = document.getElementById("product-category").value;
    const imageUrl = document.getElementById("product-image").value.trim();

    if (!name || isNaN(price) || isNaN(quantity) || !categoryId || !imageUrl) {
      alert("❌ Please fill in all fields");
      return;
    }

    try {
      await db.collection("products").add({
        name, description, price, quantity, imageUrl, categoryId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("✅ Product added");
      addForm.reset();
      loadProducts();
    } catch (err) {
      alert("❌ Failed to add product");
    }
  });
}

// ✅ Load products
async function loadProducts() {
  const tbody = document.querySelector(".products-list tbody");
  if (!tbody) return;

  const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
  tbody.innerHTML = "";

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const categoryDoc = await db.collection("categories").doc(data.categoryId).get();
    const categoryName = categoryDoc.exists ? categoryDoc.data().name : "Unknown";

    const row = `
      <tr>
        <td>${doc.id}</td>
        <td>${data.name}</td>
        <td>${data.price}</td>
        <td>${data.quantity}</td>
        <td><img src="${data.imageUrl}" width="50" /></td>
        <td>${categoryName}</td>
        <td>
          <a href="edit-product.html?id=${doc.id}">
            <button class="edit-btn">Edit</button>
          </a>
          <button class="delete-btn" onclick="deleteProduct('${doc.id}')">Delete</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  }
}

// ✅ Delete product
async function deleteProduct(id) {
  const confirmDelete = confirm("Delete this product?");
  if (!confirmDelete) return;

  try {
    await db.collection("products").doc(id).delete();
    alert("✅ Product deleted");
    loadProducts();
  } catch (err) {
    alert("❌ Failed to delete product");
  }
}

// ✅ Edit page logic
const params = new URLSearchParams(window.location.search);
const editId = params.get("id");

const editForm = document.querySelector(".edit-product form");
if (editForm && editId) {
  const nameInput = document.getElementById("product-name");
  const priceInput = document.getElementById("product-price");
  const quantityInput = document.getElementById("product-quantity");
  const categorySelect = document.getElementById("product-category");
  const imageInput = document.getElementById("product-image");

  db.collection("products").doc(editId).get().then(async (doc) => {
    if (doc.exists) {
      const data = doc.data();
      nameInput.value = data.name;
      priceInput.value = data.price;
      quantityInput.value = data.quantity;
      imageInput.value = data.imageUrl;

      await loadCategories();
      categorySelect.value = data.categoryId;
    } else {
      alert("❌ Product not found");
      window.location.href = "products.html";
    }
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const quantity = parseInt(quantityInput.value);
    const categoryId = categorySelect.value;
    const imageUrl = imageInput.value.trim();

    if (!name || isNaN(price) || isNaN(quantity) || !imageUrl || !categoryId) {
      alert("❌ Please fill in all fields");
      return;
    }

    try {
      await db.collection("products").doc(editId).update({
        name, price, quantity, categoryId, imageUrl
      });
      alert("✅ Product updated");
      window.location.href = "products.html";
    } catch (err) {
      alert("❌ Failed to update product");
    }
  });
}
