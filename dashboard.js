// Check if user is logged in and has correct role
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userType = localStorage.getItem('userType');
    
    if (!currentUser || !userType) {
        window.location.href = 'auth.html';
        return null;
    }
    
    // Redirect service providers to their dashboard
    if (userType !== 'customer') {
        window.location.href = 'provider-dashboard.html';
        return null;
    }
    
    return currentUser;
}

// Initialize dashboard
function initializeDashboard() {
    const currentUser = checkAuth();
    if (!currentUser) return;
    
    // Update user name
    document.getElementById('user-name').textContent = `Welcome ${currentUser.name}`;
    
    // Update vehicle information if available
    const vehicleInfo = document.querySelector('.vehicle-info');
    if (vehicleInfo && currentUser.vehicle) {
        vehicleInfo.querySelector('h3').textContent = currentUser.vehicle;
        vehicleInfo.querySelector('.vehicle-number').textContent = currentUser.vehicleNumber || '';
    }

    // Update vehicle name in overview section
    const carImage = document.querySelector('.car-image');
    if (carImage) {
        carImage.alt = currentUser.vehicle || 'Vehicle';
    }
    
    // Handle navigation
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('logout')) {
                handleLogout();
                return;
            }
            
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Handle service booking
    setupServiceBooking();

    // Update fuel prices
    updateFuelPrices();

    // Load service history
    loadServiceHistory();
}

// Setup service booking functionality
function setupServiceBooking() {
    const bookButtons = document.querySelectorAll('.book-now');
    bookButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const serviceCard = e.target.closest('.service-card');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const providerUsername = serviceCard.querySelector('.provider-username').value.trim();
            
            if (!providerUsername) {
                alert('Please enter a provider username');
                return;
            }

            // Find provider by username
            const providers = JSON.parse(localStorage.getItem('providers')) || {};
            let targetProvider = null;
            for (let provider of Object.values(providers)) {
                if (provider.username === providerUsername) {
                    targetProvider = provider;
                    break;
                }
            }

            if (!targetProvider) {
                alert('Provider not found. Please check the username and try again.');
                return;
            }

            const service = serviceCard.querySelector('h3').textContent;
            const price = serviceCard.querySelector('p').textContent;
            
            // Store service details for payment page
            const bookingDetails = {
                name: service,
                price: price,
                vehicle: currentUser.vehicle,
                vehicleNumber: currentUser.vehicleNumber,
                provider: {
                    username: targetProvider.username,
                    shopName: targetProvider.shopName,
                    phone: targetProvider.phone
                },
                status: 'pending',
                bookingTime: new Date().toISOString()
            };

            sessionStorage.setItem('selectedService', JSON.stringify(bookingDetails));
            
            // Add booking to provider's list
            providers[targetProvider.phone].bookings = providers[targetProvider.phone].bookings || [];
            providers[targetProvider.phone].bookings.push({
                ...bookingDetails,
                customer: {
                    name: currentUser.name,
                    phone: currentUser.phone,
                    vehicle: currentUser.vehicle,
                    vehicleNumber: currentUser.vehicleNumber
                }
            });
            
            localStorage.setItem('providers', JSON.stringify(providers));
            
            window.location.href = 'payment.html';
        });
    });
}

// Show service selection modal
function showServiceSelectionModal() {
    // Create modal if it doesn't exist
    let modal = document.getElementById('service-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'service-modal';
        modal.classList.add('modal');
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Select Service</h2>
                <div class="service-list">
                    <div class="service-option" data-service="Oil Change" data-price="₹1399">
                        <i class="fas fa-oil-can"></i>
                        <h3>Oil Change</h3>
                        <p>From ₹1399</p>
                        <div class="provider-select">
                            <input type="text" placeholder="Enter provider username" class="provider-username">
                        </div>
                    </div>
                    <div class="service-option" data-service="Dent Removal" data-price="₹2999">
                        <i class="fas fa-car-crash"></i>
                        <h3>Dent Removal</h3>
                        <p>From ₹2999</p>
                        <div class="provider-select">
                            <input type="text" placeholder="Enter provider username" class="provider-username">
                        </div>
                    </div>
                    <div class="service-option" data-service="AC Service" data-price="₹1699">
                        <i class="fas fa-snowflake"></i>
                        <h3>AC Service</h3>
                        <p>From ₹1699</p>
                        <div class="provider-select">
                            <input type="text" placeholder="Enter provider username" class="provider-username">
                        </div>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        // Add click handlers for service options
        const serviceOptions = modal.querySelectorAll('.service-option');
        serviceOptions.forEach(option => {
            option.addEventListener('click', () => {
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                const providerUsername = option.querySelector('.provider-username').value.trim();

                if (!providerUsername) {
                    alert('Please enter a provider username');
                    return;
                }

                // Find provider by username
                const providers = JSON.parse(localStorage.getItem('providers')) || {};
                let targetProvider = null;
                for (let provider of Object.values(providers)) {
                    if (provider.username === providerUsername) {
                        targetProvider = provider;
                        break;
                    }
                }

                if (!targetProvider) {
                    alert('Provider not found. Please check the username and try again.');
                    return;
                }

                const bookingDetails = {
                    name: option.dataset.service,
                    price: option.dataset.price,
                    vehicle: currentUser.vehicle,
                    vehicleNumber: currentUser.vehicleNumber,
                    provider: {
                        username: targetProvider.username,
                        shopName: targetProvider.shopName,
                        phone: targetProvider.phone
                    },
                    status: 'pending',
                    bookingTime: new Date().toISOString()
                };

                sessionStorage.setItem('selectedService', JSON.stringify(bookingDetails));

                // Add booking to provider's list
                providers[targetProvider.phone].bookings = providers[targetProvider.phone].bookings || [];
                providers[targetProvider.phone].bookings.push({
                    ...bookingDetails,
                    customer: {
                        name: currentUser.name,
                        phone: currentUser.phone,
                        vehicle: currentUser.vehicle,
                        vehicleNumber: currentUser.vehicleNumber
                    }
                });

                localStorage.setItem('providers', JSON.stringify(providers));

                window.location.href = 'payment.html';
            });
        });

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
    
    modal.style.display = 'block';
}

// Load service history
function loadServiceHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users'));
    const historyTableBody = document.querySelector('.history-table tbody');
    
    if (users[currentUser.phone]?.payments) {
        historyTableBody.innerHTML = users[currentUser.phone].payments
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(payment => `
                <tr>
                    <td>${new Date(payment.date).toLocaleDateString()}</td>
                    <td>${payment.service}</td>
                    <td><span class="status completed">${payment.status}</span></td>
                    <td>₹${payment.amount.toFixed(2)}</td>
                </tr>
            `).join('');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Update fuel prices (simulated)
function updateFuelPrices() {
    const prices = {
        petrol: (Math.random() * (110 - 100) + 100).toFixed(2),
        diesel: (Math.random() * (95 - 85) + 85).toFixed(2),
        cng: (Math.random() * (90 - 80) + 80).toFixed(2)
    };

    // Update ticker content
    const tickerContent = document.querySelector('.ticker-content');
    if (tickerContent) {
        const items = tickerContent.querySelectorAll('.ticker-item');
        items[0].querySelector('.fuel-price').textContent = `₹${prices.petrol}/L`;
        items[1].querySelector('.fuel-price').textContent = `₹${prices.diesel}/L`;
        items[2].querySelector('.fuel-price').textContent = `₹${prices.cng}/kg`;
    }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);

// Update fuel prices every hour
setInterval(updateFuelPrices, 3600000);
