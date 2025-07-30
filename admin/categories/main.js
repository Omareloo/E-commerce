// ✅ تفعيل رابط الصفحة الحالية في الـ sidebar
window.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop(); // اسم الصفحة
  const links = document.querySelectorAll(".sidebar a");

  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });

  loadCategories(); // تحميل التصنيفات
});

///////////////////////////// CATEGORY LOGIC /////////////////////////////

const addCategoryBtn = document.getElementById("add-category-btn");
const categoryName = document.getElementById("category-name");
const categoryForm = document.querySelector(".add-category form");
const categoryTable = document.querySelector(".categories-list tbody");

if (addCategoryBtn && categoryForm) {
  categoryForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = categoryName.value.trim();

    // تحقق من الاسم
    const isExist = await db.collection("categories").where("name", "==", name).get();
    if (!isExist.empty || name.length < 3 || name === "") {
      categoryName.nextElementSibling.textContent = "Category already exists or too short ❌";
      return;
    }

    try {
      await db.collection("categories").add({ name });
      console.log("✅ Category added:", name);
      alert("✅ Category added successfully");
      categoryName.value = "";
      categoryName.nextElementSibling.textContent = "";
      loadCategories(); // تحديث القائمة
    } catch (error) {
      console.error("❌ Error adding category:", error);
      alert("❌ Failed to add category");
    }
  });
}

// ✅ تحميل التصنيفات في الجدول
async function loadCategories() {
  if (!categoryTable) return;

  categoryTable.innerHTML = ""; // امسح القديم
  const snapshot = await db.collection("categories").get();

  snapshot.forEach(doc => {
    const data = doc.data();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.name}</td>
      <td>
        <a href="edit-category.html?id=${doc.id}">
          <button class="edit-btn">Edit</button>
        </a>
        <button class="delete-btn" onclick="deleteCategory('${doc.id}')">Delete</button>
      </td>
    `;

    categoryTable.appendChild(row);
  });
}

// ✅ حذف تصنيف
function deleteCategory(id) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  db.collection("categories").doc(id).delete()
    .then(() => {
      console.log("✅ Category deleted");
      alert("Category deleted successfully");
      loadCategories(); // إعادة التحميل بعد الحذف
    })
    .catch((error) => {
      console.error("❌ Error deleting category:", error);
      alert("❌ Failed to delete category");
    });
}

///////////////////////////// EDIT CATEGORY PAGE /////////////////////////////

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");

const editForm = document.querySelector(".edit-category form");
const editInput = document.getElementById("edit-category-name");
const errorMsg = document.querySelector(".edit-category span");

if (editForm && editInput && categoryId) {
  db.collection("categories").doc(categoryId).get().then(doc => {
    if (doc.exists) {
      editInput.value = doc.data().name; 
    } else {
      alert("❌ Category not found");
      window.location.href = "categories.html";
    }
  });

  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = editInput.value.trim();

    if (newName.length < 3) {
      errorMsg.textContent = "❌ Name too short";
      return;
    }

    const duplicate = await db.collection("categories").where("name", "==", newName).get();
    if (!duplicate.empty) {
      errorMsg.textContent = "❌ Category name already exists";
      return;
    }

    try {
      await db.collection("categories").doc(categoryId).update({ name: newName });
      alert("✅ Category updated successfully");
      window.location.href = "categories.html";
    } catch (err) {
      console.error("❌ Failed to update:", err);
      alert("❌ Update failed");
    }
  });
}
