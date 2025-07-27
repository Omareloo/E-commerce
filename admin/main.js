

  // لما الصفحة تفتح
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
  });
  



  /////////////////////////////CATEGORY JS /////////////////////////////////

   var addCategoryBtn = document.getElementById("add-category-btn");
   var categoryName = document.getElementById("category-name");
   var categoryForm = document.querySelector(".add-category form");
   
   // تأكد من Firebase Firestore
   // لازم تكون عامل التهيئة في firebase_conf.js
   // const db = firebase.firestore();
   
   if (addCategoryBtn && categoryForm) {
     categoryForm.addEventListener("submit", async function (e) {
       e.preventDefault(); // منع إرسال الفورم
       const name = categoryName.value.trim();
       var isExistName = await db.collection("categories").where("name", "==", name).get()
     if(!isExistName.empty || name.length < 3 || name == ""){
      categoryName.nextSibling.textContent = " Category already exists or to short name ❌";
     }
     else{
       try {
         await db.collection("categories").add({ name });
         console.log("✅ Category added:", name);
         alert("Category added successfully ✅");
         categoryName.value = ""; // Clear the input after successful addition
        } catch (error) {
          console.error("❌ Error adding category:", error);
          alert("Failed to add category ❌");
        }
        }
      });
      
      
    }

    //////////////////////show category list ////////////////////////
    async function onLoad() {
      const snapshot = await db.collection("categories").get();
      snapshot.forEach(doc => {
        const data = doc.data();
    
        const container = `
          <tr>
            <td>${data.name}</td>
            <td>
              <button class="edit-btn" onclick="editCategory('${doc.id})">Edit</button>
              <button class="delete-btn" onclick="deleteCategory('${doc.id}')">Delete</button>
            </td>
          </tr>
        `;
        document.querySelector(".categories-list tbody").innerHTML += container;
      });
    }
    onLoad()


    //////////////////////delete category ////////////////////////
    function deleteCategory(id) { 
      db.collection("categories").doc(id).delete().then(() => {
        console.log("Category deleted successfully");
        alert("Category deleted successfully");
      }).catch((error) => {
        console.error("Error deleting category:", error);
        alert("Failed to delete category");
      });
    }