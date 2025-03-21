// Traffic Rules Data
const trafficRules = [
    "gaditun utartana falatavaril antaravar dhyan dya.",
    "Always wear your seatbelt while driving.",
    "Follow speed limits and traffic signals.",
    "Never drink and drive.",
    "Keep a safe distance from other vehicles.",
    "Use turn signals when changing lanes.",
    "Don't use mobile phones while driving.",
    "Ensure regular vehicle maintenance for safety.",
    "Be extra cautious in bad weather conditions.",
    "Always carry valid vehicle documents.",
    "Give way to emergency vehicles.",
    "Use child safety seats for children.",
    "Don't drive when tired or sleepy.",
    "Keep your vehicle's tires properly inflated.",
    "Use headlights during low visibility.",
    "Respect pedestrian crossings."
];

// Function to change traffic rule
function changeTrafficRule() {
    const ruleElement = document.getElementById('traffic-rule');
    const currentRule = ruleElement.textContent;
    let newRule;
    
    // Keep selecting a new rule until it's different from the current one
    do {
        newRule = trafficRules[Math.floor(Math.random() * trafficRules.length)];
    } while (newRule === currentRule);
    
    ruleElement.classList.add('changing');
    ruleElement.textContent = newRule;
    
    // Remove the animation class after animation completes
    setTimeout(() => {
        ruleElement.classList.remove('changing');
    }, 500);
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll event listener for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = 'white';
    }
});

// Check if user is logged in (basic implementation)
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const bookNowButtons = document.querySelectorAll('.book-now');
    
    bookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = 'auth.html';
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    
    // Change traffic rule every 5 seconds
    setInterval(changeTrafficRule, 5000);
    
    // Initial change
    changeTrafficRule();
});
