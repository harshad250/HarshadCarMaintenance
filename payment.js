// Check if user is logged in
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    return currentUser;
}

// Initialize payment page
function initializePayment() {
    const currentUser = checkAuth();
    const selectedService = JSON.parse(sessionStorage.getItem('selectedService'));

    if (!selectedService) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Update service details
    document.getElementById('service-type').textContent = selectedService.name;

    // Extract price value
    const priceMatch = selectedService.price.match(/₹(\d+)/);
    const baseAmount = priceMatch ? parseFloat(priceMatch[1]) : 1399.00;
    const gst = baseAmount * 0.18;
    const totalAmount = baseAmount + gst;

    // Update all price displays
    const serviceDetails = document.querySelector('.service-details');
    serviceDetails.innerHTML = `
        <div class="service-item">
            <span>Service Type</span>
            <span id="service-type">${selectedService.name}</span>
        </div>
        <div class="service-item">
            <span>Vehicle</span>
            <span>${selectedService.vehicle}</span>
        </div>
        <div class="service-item">
            <span>Base Price</span>
            <span>₹${baseAmount.toFixed(2)}</span>
        </div>
        <div class="service-item">
            <span>GST (18%)</span>
            <span>₹${gst.toFixed(2)}</span>
        </div>
        <div class="service-item total">
            <span>Total Amount</span>
            <span>₹${totalAmount.toFixed(2)}</span>
        </div>
    `;

    // Update payment button amount
    const payButton = document.getElementById('pay-button');
    payButton.innerHTML = `<i class="fas fa-lock"></i> Pay Securely ₹${totalAmount.toFixed(2)}`;

    // Handle payment button click
    payButton.addEventListener('click', function() {
        const upiId = document.getElementById('upi-id').value;
        
        if (!upiId) {
            alert('Please enter UPI ID or Phone Number');
            return;
        }

        // Simulate payment processing
        payButton.disabled = true;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        setTimeout(() => {
            showSuccessModal(selectedService, totalAmount);
        }, 2000);
    });
}

// Show success modal and store payment info
function showSuccessModal(service, amount) {
    const modal = document.getElementById('success-modal');
    modal.classList.add('show');

    // Store payment info in localStorage
    const paymentInfo = {
        service: service.name,
        vehicle: service.vehicle,
        amount: amount,
        date: new Date().toISOString(),
        status: 'completed'
    };

    // Store in user's payment history
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    
    if (!users[currentUser.phone].payments) {
        users[currentUser.phone].payments = [];
    }
    
    users[currentUser.phone].payments.push(paymentInfo);
    localStorage.setItem('users', JSON.stringify(users));

    // Clear selected service from session
    sessionStorage.removeItem('selectedService');
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializePayment);
