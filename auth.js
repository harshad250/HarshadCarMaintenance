// Firebase Phone Authentication
let confirmationResult = null;

// Function to send OTP
async function sendOTP(phoneNumber) {
    try {
        const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                console.log('reCAPTCHA verified');
            }
        });

        // Format phone number to E.164 format
        const formattedPhone = `+91${phoneNumber}`; // Assuming Indian phone numbers

        // Send OTP
        confirmationResult = await firebase.auth().signInWithPhoneNumber(formattedPhone, appVerifier);
        return { success: true, message: 'OTP sent successfully' };
    } catch (error) {
        console.error('Error sending OTP:', error);
        return { success: false, message: error.message };
    }
}

// Function to verify OTP
async function verifyOTP(otp) {
    try {
        if (!confirmationResult) {
            throw new Error('Please send OTP first');
        }

        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        const token = await user.getIdToken();

        // Store token in localStorage
        localStorage.setItem('authToken', token);

        return { success: true, token, user };
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return { success: false, message: error.message };
    }
}

// Function to handle user signup
async function handleSignup(userType) {
    try {
        let email, password, userData;
        
        if (userType === 'customer') {
            email = document.getElementById('email').value;
            password = document.getElementById('password').value;
            userData = {
                name: document.getElementById('name').value,
                email: email,
                phone: document.getElementById('phone').value,
                vehicle: document.getElementById('vehicle').value,
                vehicleNumber: document.getElementById('vehicle-number').value
            };
        } else {
            email = document.getElementById('shop-email').value;
            password = document.getElementById('shop-password').value;
            userData = {
                shopName: document.getElementById('shop-name').value,
                username: document.getElementById('shop-username').value,
                ownerName: document.getElementById('owner-name').value,
                phone: document.getElementById('shop-phone').value,
                email: email,
                address: document.getElementById('shop-address').value,
                shopType: document.getElementById('shop-type').value,
                licenseNumber: document.getElementById('shop-license').value
            };
        }

        // Create user with email and password
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (user) {
            // Store user type in localStorage
            localStorage.setItem('userType', userType);
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Redirect to dashboard immediately after Firebase authentication
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Error during signup:', error);
        alert(error.message || 'Failed to sign up. Please try again.');
    }
}

// Function to handle user login
async function handleLogin(userType) {
    try {
        const email = userType === 'customer' 
            ? document.getElementById('login-email').value
            : document.getElementById('shop-login-email').value;
        const password = userType === 'customer'
            ? document.getElementById('login-password').value
            : document.getElementById('shop-login-password').value;

        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (user) {
            // Create user data object
            const userData = {
                email: email,
                uid: user.uid,
                name: user.displayName || email.split('@')[0],
                userType: userType
            };

            // Store user data and type in localStorage
            localStorage.setItem('currentUser', JSON.stringify(userData));
            localStorage.setItem('userType', userType);
            
            // Redirect based on user type
            if (userType === 'customer') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'provider-dashboard.html';
            }
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert(error.message || 'Failed to login. Please try again.');
    }
}

// Function to check if user is authenticated
function isAuthenticated() {
    return !!firebase.auth().currentUser;
}

// Function to logout
function logout() {
    return firebase.auth().signOut()
        .then(() => {
            localStorage.clear(); // Clear all localStorage items
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        });
}

// API calls to backend
async function registerUser(userData) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Failed to register user');
        }

        const data = await response.json();
        return { success: true, user: data };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, message: error.message };
    }
}

async function registerProvider(providerData) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/providers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(providerData)
        });

        if (!response.ok) {
            throw new Error('Failed to register provider');
        }

        const data = await response.json();
        return { success: true, provider: data };
    } catch (error) {
        console.error('Error registering provider:', error);
        return { success: false, message: error.message };
    }
}

// Add these functions at the top of auth.js
function selectUserType(type) {
    document.querySelectorAll('.user-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.user-type-forms').forEach(form => form.classList.remove('active'));
    
    document.querySelector(`button[onclick="selectUserType('${type}')"]`).classList.add('active');
    document.getElementById(`${type}-forms`).classList.add('active');
}

function showForm(formType) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active-form'));
    
    document.querySelector(`button[onclick="showForm('${formType}')"]`).classList.add('active');
    document.getElementById(`${formType}-form`).classList.add('active-form');
}

function showProviderForm(formType) {
    document.querySelectorAll('#provider-forms .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('#provider-forms .auth-form').forEach(form => form.classList.remove('active-form'));
    
    document.querySelector(`button[onclick="showProviderForm('${formType}')"]`).classList.add('active');
    document.getElementById(`provider-${formType}-form`).classList.add('active-form');
}
