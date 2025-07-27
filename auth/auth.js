/* auth.js
Firebase config setup

register.html – with role selection

login.html – basic login

auth.js – logic to handle both forms

firebase-config.js – reusable config file
*/ 

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    if (document.getElementById('loginForm')) {
        const loginForm = document.getElementById('loginForm');
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // In a real app, you would send this to a server
            console.log('Login attempt:', { username, password });
            
            // Check if user exists in localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                alert('Login successful!');
                // Store current user in session
                sessionStorage.setItem('currentUser', JSON.stringify(user));
                // Redirect to home page
                window.location.href = 'home.html'; // You would create this page
            } else {
                alert('Invalid username or password');
            }
        });
    }
    
    // Check if we're on the register page
    if (document.getElementById('registerForm')) {
        const registerForm = document.getElementById('registerForm');
        
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;
            const accountType = document.querySelector('input[name="account-type"]:checked').value;
            
            // Simple validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }
            
            // Check if username already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userExists = users.some(u => u.username === username);
            
            if (userExists) {
                alert('Username already exists!');
                return;
            }
            
            // Create new user
            const newUser = {
                username,
                email,
                password, // In a real app, you should hash the password
                accountType,
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registration successful! You can now login.');
            window.location.href = 'index.html';
        });
    }
});