

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

  //  var addCategoryBtn = document.getElementById("add-category-btn");
  //  var categoryName = document.getElementById("category-name");

  






