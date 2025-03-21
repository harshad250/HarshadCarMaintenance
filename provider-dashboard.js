// Check if user is logged in and has correct role
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userType = localStorage.getItem('userType');
    
    if (!currentUser || !userType) {
        window.location.href = 'auth.html';
        return null;
    }
    
    // Redirect customers to their dashboard
    if (userType === 'customer') {
        window.location.href = 'dashboard.html';
        return null;
    }
    
    return currentUser;
}

// Initialize dashboard
function initializeDashboard() {
    const currentUser = checkAuth();
    if (!currentUser) return;
    
    // Update provider information
    document.getElementById('shop-name').textContent = currentUser.name;
    document.getElementById('shop-username').textContent = '@' + currentUser.email.split('@')[0];
    
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

    // Load bookings
    loadBookings();
    
    // Load settings
    loadSettings();
    
    // Update stats
    updateStats();
}

// Load and display bookings
function loadBookings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const bookings = providers[currentUser.phone]?.bookings || [];
    
    const bookingsList = document.querySelector('.bookings-list');
    const historyTable = document.querySelector('.history-table tbody');
    
    // Clear existing content
    bookingsList.innerHTML = '';
    historyTable.innerHTML = '';
    
    // Sort bookings by date (newest first)
    bookings.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
    
    // Separate pending and completed bookings
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const completedBookings = bookings.filter(b => b.status === 'completed');
    
    // Display pending bookings
    pendingBookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <div class="booking-header">
                <h3>${booking.name}</h3>
                <span class="status ${booking.status}">${booking.status}</span>
            </div>
            <div class="booking-details">
                <p><i class="fas fa-user"></i> ${booking.customer.name}</p>
                <p><i class="fas fa-car"></i> ${booking.customer.vehicle} (${booking.customer.vehicleNumber})</p>
                <p><i class="fas fa-clock"></i> ${new Date(booking.bookingTime).toLocaleString()}</p>
                <p><i class="fas fa-tag"></i> ${booking.price}</p>
            </div>
            <div class="booking-actions">
                <button onclick="viewBooking('${booking.bookingTime}')" class="view-btn">View Details</button>
                <button onclick="updateBookingStatus('${booking.bookingTime}', 'completed')" class="complete-btn">Mark Complete</button>
            </div>
        `;
        bookingsList.appendChild(bookingCard);
    });
    
    // Display completed bookings in history
    completedBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(booking.bookingTime).toLocaleDateString()}</td>
            <td>${booking.customer.name}</td>
            <td>${booking.customer.vehicle}</td>
            <td>${booking.name}</td>
            <td>${booking.price}</td>
            <td><i class="fa-solid fa-check-circle" style="color: green;"></i></td>
        `;
        historyTable.appendChild(row);
    });
    
    // Update stats
    updateStats();
}

// View booking details
function viewBooking(bookingTime) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const booking = providers[currentUser.phone].bookings.find(b => b.bookingTime === bookingTime);
    
    if (!booking) return;
    
    const modal = document.getElementById('booking-modal');
    const details = document.getElementById('booking-details');
    
    details.innerHTML = `
        <div class="booking-info">
            <h3>Service Details</h3>
            <p><strong>Service:</strong> ${booking.name}</p>
            <p><strong>Price:</strong> ${booking.price}</p>
            <p><strong>Status:</strong> <span class="status ${booking.status}">${booking.status}</span></p>
            <p><strong>Booking Time:</strong> ${new Date(booking.bookingTime).toLocaleString()}</p>
            
            <h3>Customer Details</h3>
            <p><strong>Name:</strong> ${booking.customer.name}</p>
            <p><strong>Phone:</strong> ${booking.customer.phone}</p>
            <p><strong>Vehicle:</strong> ${booking.customer.vehicle}</p>
            <p><strong>Vehicle Number:</strong> ${booking.customer.vehicleNumber}</p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Update booking status
function updateBookingStatus(bookingTime, newStatus) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    const bookingIndex = providers[currentUser.phone].bookings.findIndex(b => b.bookingTime === bookingTime);
    
    if (bookingIndex !== -1) {
        providers[currentUser.phone].bookings[bookingIndex].status = newStatus;
        localStorage.setItem('providers', JSON.stringify(providers));
        
        // Reload bookings display
        loadBookings();
    }
}

// Update dashboard stats
function updateStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    const bookings = providers[currentUser.phone]?.bookings || [];
    
    const pendingCount = bookings.filter(b => b.status === 'pending').length;
    const completedCount = bookings.filter(b => b.status === 'completed').length;
    
    // Get unique customers count
    const uniqueCustomers = new Set(bookings.map(b => b.customer.phone)).size;
    
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('completed-count').textContent = completedCount;
    document.getElementById('customer-count').textContent = uniqueCustomers;
}

// Load settings
function loadSettings() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    document.getElementById('settings-shop-name').value = currentUser.name;
    document.getElementById('settings-username').value = currentUser.email.split('@')[0];
    document.getElementById('settings-email').value = currentUser.email;
    document.getElementById('settings-phone').value = currentUser.phone;
    document.getElementById('settings-hours').value = currentUser.businessHours || '';
}

// Handle settings form submission
document.getElementById('settings-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const providers = JSON.parse(localStorage.getItem('providers'));
    
    const updatedProvider = {
        ...currentUser,
        email: document.getElementById('settings-email').value,
        phone: document.getElementById('settings-phone').value,
        businessHours: document.getElementById('settings-hours').value
    };
    
    providers[currentUser.phone] = updatedProvider;
    localStorage.setItem('providers', JSON.stringify(providers));
    localStorage.setItem('currentUser', JSON.stringify(updatedProvider));
    
    alert('Settings updated successfully!');
});

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Close modal when clicking on X or outside
document.querySelector('.close')?.addEventListener('click', () => {
    document.getElementById('booking-modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    const modal = document.getElementById('booking-modal');
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);
