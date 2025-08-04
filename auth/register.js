  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;

    // Clear errors
    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';

    let isValid = true;

    if (!username) {
      document.getElementById('usernameError').textContent = 'Username is required.';
      isValid = false;
    }

    if (!emailPattern.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email.';
      isValid = false;
    }

    if (!passwordPattern.test(password)) {
      document.getElementById('passwordError').textContent =
        'Password must include uppercase, lowercase, number, special char and be at least 6 characters.';
      isValid = false;
    }

    if (password !== confirmPassword) {
      document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
      isValid = false;
    }

    if (!isValid) return;

    // Firebase register
    auth.createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;

        // Store user data in Firestore with role
        return db.collection('users').doc(user.uid).set({
          username,
          email,
          role: 'user',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      })
      .then(() => {
        alert(`Registration successful!`);
        document.getElementById('registerForm').reset();
        window.location.href = "login.html";
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          document.getElementById('emailError').textContent = 'This email is already registered.';
        } else {
          alert(`Firebase error: ${error.message}`);
        }
      });
  });