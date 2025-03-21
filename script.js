// Store user and provider data
let users = JSON.parse(localStorage.getItem('users')) || {};
let providers = JSON.parse(localStorage.getItem('providers')) || {};

// Show the selected user type forms
function selectUserType(type) {
    const customerForms = document.getElementById('customer-forms');
    const providerForms = document.getElementById('provider-forms');
    const buttons = document.querySelectorAll('.user-type-btn');

    if (type === 'customer') {
        customerForms.classList.add('active');
        providerForms.classList.remove('active');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        providerForms.classList.add('active');
        customerForms.classList.remove('active');
        buttons[1].classList.add('active');
        buttons[0].classList.remove('active');
    }
}

// Show the selected form within a user type
function showForm(formType) {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const buttons = document.querySelectorAll('#customer-forms .tab-btn');

    if (formType === 'signup') {
        signupForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
        buttons[1].classList.add('active');
        buttons[0].classList.remove('active');
    }
}

// Show the selected form for service providers
function showProviderForm(formType) {
    const signupForm = document.getElementById('provider-signup-form');
    const loginForm = document.getElementById('provider-login-form');
    const buttons = document.querySelectorAll('#provider-forms .tab-btn');

    if (formType === 'signup') {
        signupForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        loginForm.classList.add('active-form');
        signupForm.classList.remove('active-form');
        buttons[1].classList.add('active');
        buttons[0].classList.remove('active');
    }
}

// Generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP for customer
function requestOTP(type) {
    let phoneNumber;
    let otpGroup;
    
    if (type === 'signup') {
        const name = document.getElementById('name').value;
        const vehicle = document.getElementById('vehicle').value;
        const vehicleNumber = document.getElementById('vehicle-number').value;
        phoneNumber = document.getElementById('phone').value;
        otpGroup = document.querySelector('#signup-form .otp-group');

        // Validate vehicle number format (e.g., MH-01-AB-1234)
        const vehicleNumberPattern = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
        if (!vehicleNumberPattern.test(vehicleNumber)) {
            alert('Please enter a valid vehicle number in format: XX-00-XX-0000 (e.g., MH-01-AB-1234)');
            return;
        }

        if (!name || !vehicle || !vehicleNumber || !phoneNumber) {
            alert('Please fill in all fields');
            return;
        }

        sessionStorage.setItem('tempUser', JSON.stringify({
            name: name,
            phone: phoneNumber,
            vehicle: vehicle,
            vehicleNumber: vehicleNumber
        }));
    } else {
        phoneNumber = document.getElementById('login-phone').value;
        otpGroup = document.querySelector('#login-form .otp-group');

        if (!phoneNumber) {
            alert('Please enter your phone number');
            return;
        }

        if (!users[phoneNumber]) {
            alert('User not found. Please sign up first.');
            showForm('signup');
            return;
        }
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    const otp = generateOTP();
    sessionStorage.setItem(`${type}-otp-${phoneNumber}`, otp);
    otpGroup.style.display = 'block';
    alert(`Your OTP is: ${otp} (In a real application, this would be sent via SMS)`);
}

// Request OTP for service provider
function requestShopOTP(type) {
    let phoneNumber;
    let otpGroup;
    
    if (type === 'signup') {
        const shopName = document.getElementById('shop-name').value;
        const shopUsername = document.getElementById('shop-username').value;
        const ownerName = document.getElementById('owner-name').value;
        phoneNumber = document.getElementById('shop-phone').value;
        const email = document.getElementById('shop-email').value;
        const address = document.getElementById('shop-address').value;
        const shopType = document.getElementById('shop-type').value;
        const license = document.getElementById('shop-license').value;
        otpGroup = document.querySelector('#provider-signup-form .otp-group');

        // Validate username format (alphanumeric only)
        const usernamePattern = /^[a-zA-Z0-9_-]+$/;
        if (!usernamePattern.test(shopUsername)) {
            alert('Username can only contain letters, numbers, underscore and hyphen');
            return;
        }

        // Check if username is already taken
        const providers = JSON.parse(localStorage.getItem('providers')) || {};
        for (let provider of Object.values(providers)) {
            if (provider.username === shopUsername) {
                alert('This username is already taken. Please choose another one.');
                return;
            }
        }

        if (!shopName || !shopUsername || !ownerName || !phoneNumber || !email || !address || !shopType || !license) {
            alert('Please fill in all fields');
            return;
        }

        sessionStorage.setItem('tempProvider', JSON.stringify({
            shopName: shopName,
            username: shopUsername,
            ownerName: ownerName,
            phone: phoneNumber,
            email: email,
            address: address,
            shopType: shopType,
            license: license,
            bookings: []
        }));
    } else {
        phoneNumber = document.getElementById('shop-login-phone').value;
        otpGroup = document.querySelector('#provider-login-form .otp-group');

        if (!phoneNumber) {
            alert('Please enter your business phone number');
            return;
        }

        if (!providers[phoneNumber]) {
            alert('Service provider not found. Please register first.');
            showProviderForm('signup');
            return;
        }
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
        alert('Please enter a valid 10-digit phone number');
        return;
    }

    const otp = generateOTP();
    sessionStorage.setItem(`shop-${type}-otp-${phoneNumber}`, otp);
    otpGroup.style.display = 'block';
    alert(`Your OTP is: ${otp} (In a real application, this would be sent via SMS)`);
}

// Verify OTP for customer
function verifyOTP(type) {
    let phoneNumber, otpInput;
    
    if (type === 'signup') {
        const tempUser = JSON.parse(sessionStorage.getItem('tempUser'));
        phoneNumber = tempUser.phone;
        otpInput = document.getElementById('signup-otp').value;

        const storedOTP = sessionStorage.getItem(`${type}-otp-${phoneNumber}`);
        
        if (otpInput === storedOTP) {
            users[phoneNumber] = tempUser;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(tempUser));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid OTP. Please try again.');
        }
    } else {
        phoneNumber = document.getElementById('login-phone').value;
        otpInput = document.getElementById('login-otp').value;

        const storedOTP = sessionStorage.getItem(`${type}-otp-${phoneNumber}`);
        
        if (otpInput === storedOTP && users[phoneNumber]) {
            localStorage.setItem('currentUser', JSON.stringify(users[phoneNumber]));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid OTP. Please try again.');
        }
    }

    // Clean up session storage
    sessionStorage.removeItem(`${type}-otp-${phoneNumber}`);
    sessionStorage.removeItem('tempUser');
}

// Verify OTP for service provider
function verifyShopOTP(type) {
    let phoneNumber, otpInput;
    
    if (type === 'signup') {
        const tempProvider = JSON.parse(sessionStorage.getItem('tempProvider'));
        phoneNumber = tempProvider.phone;
        otpInput = document.getElementById('shop-signup-otp').value;

        const storedOTP = sessionStorage.getItem(`shop-${type}-otp-${phoneNumber}`);
        
        if (otpInput === storedOTP) {
            providers[phoneNumber] = tempProvider;
            localStorage.setItem('providers', JSON.stringify(providers));
            localStorage.setItem('currentProvider', JSON.stringify(tempProvider));
            window.location.href = 'provider-dashboard.html';
        } else {
            alert('Invalid OTP. Please try again.');
        }
    } else {
        phoneNumber = document.getElementById('shop-login-phone').value;
        otpInput = document.getElementById('shop-login-otp').value;

        const storedOTP = sessionStorage.getItem(`shop-${type}-otp-${phoneNumber}`);
        
        if (otpInput === storedOTP && providers[phoneNumber]) {
            localStorage.setItem('currentProvider', JSON.stringify(providers[phoneNumber]));
            window.location.href = 'provider-dashboard.html';
        } else {
            alert('Invalid OTP. Please try again.');
        }
    }
    
    sessionStorage.removeItem(`shop-${type}-otp-${phoneNumber}`);
    sessionStorage.removeItem('tempProvider');
}
