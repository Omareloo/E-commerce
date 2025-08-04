const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

     auth.signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    const user = userCredential.user;

    // Get role from Firestore
    return db.collection("users").doc(user.uid).get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const username = data.username || "User";
          const role = data.role || "user"; // default fallback

          alert("Login successful! Welcome " + username);

          // Middleware-style redirect
          if (role === "admin") {
            window.location.href = "../admin/index.html";
          } else {
            window.location.href = "../home/index.html"; // 👈 Normal user home
          }
        } else {
          alert("Login successful, but user data not found.");
          window.location.href = "../home/index.html";
        }
      });
  })
  .catch((error) => {
    if (error.code === "auth/user-not-found") {
      alert("This email is not registered. Please sign up first.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else {
      alert("Error: " + error.message);
    }
  });

    });
 