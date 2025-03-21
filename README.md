# CarCare Pro - Car Maintenance Platform

CarCare Pro is a comprehensive web-based platform that connects car owners with professional service providers for vehicle maintenance and repairs.

## Features

### For Customers
- **User Authentication**: Secure signup/login with OTP verification
- **Vehicle Management**: Add and manage your vehicles
- **Service Booking**: Easy booking of various car maintenance services
- **Service History**: Track all your past services
- **Real-time Fuel Prices**: Live ticker showing current fuel prices
- **Traffic Rules**: Auto-changing traffic safety rules display

### For Service Providers
- **Shop Registration**: Register your service center with detailed information
- **Appointment Management**: Handle customer appointments efficiently
- **Service Management**: Add/edit service offerings
- **Customer Management**: Track customer history and preferences
- **Reports & Analytics**: View business performance metrics

## Pages

1. **Landing Page** (`index.html`)
   - Service showcase
   - Why choose us section
   - Traffic rules display
   - Navigation to login/signup

2. **Authentication** (`auth.html`)
   - Customer login/signup
   - Service provider login/signup
   - OTP verification

3. **Customer Dashboard** (`dashboard.html`)
   - Vehicle overview
   - Service booking
   - Service history
   - Fuel price ticker

4. **Service Provider Dashboard** (`provider-dashboard.html`)
   - Appointment management
   - Service management
   - Customer database
   - Analytics

5. **Services List** (`services-list.html`)
   - Detailed service offerings
   - Pricing information
   - Booking options

6. **Payment** (`payment.html`)
   - Secure payment processing
   - Service summary
   - Payment confirmation

## Setup Instructions

1. Clone the repository or download the files
2. Ensure all files are in the same directory
3. Open `index.html` in a web browser

## File Structure

```
project/
│
├── index.html           # Landing page
├── auth.html           # Authentication page
├── dashboard.html      # Customer dashboard
├── provider-dashboard.html  # Service provider dashboard
├── services-list.html  # Services listing
├── payment.html        # Payment processing
│
├── css/
│   ├── landing.css
│   ├── auth.css
│   ├── dashboard.css
│   ├── provider-dashboard.css
│   ├── services-list.css
│   └── payment.css
│
├── js/
│   ├── landing.js
│   ├── script.js      # Authentication logic
│   ├── dashboard.js
│   └── provider-dashboard.js
│
└── images/            # Image assets
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons
- Local Storage for data persistence

## Security Features

- OTP-based authentication
- Session management
- Secure payment processing
- Data validation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Future Enhancements

1. Backend integration
2. Real-time chat support
3. Service provider ratings
4. Mobile app development
5. Online payment integration
6. Email notifications

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support or queries, contact:
- Email: support@carcarepro.com
- Phone: +91 9152539592
