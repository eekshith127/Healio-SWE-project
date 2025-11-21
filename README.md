# Healio - Comprehensive Healthcare Management System

Healio is an all-in-one healthcare management solution designed to modernize medical practice operations. This platform bridges the gap between healthcare providers and patients, offering a seamless digital experience for managing healthcare services.

## 📱 Live Demo

[View Live Demo](https://your-healio-demo-url.com) (Update with your actual demo URL when deployed)

## 🎯 Project Overview

Healio is built with a modern tech stack to provide a responsive, secure, and scalable healthcare management solution. The application consists of:

- **Frontend**: A React Native application for both web and mobile platforms
- **Backend**: A robust Node.js/Express server with RESTful API endpoints
- **Database**: MongoDB for flexible and scalable data storage
- **Authentication**: Secure JWT-based authentication system

## 🏥 Key Features

### For Healthcare Providers
- **Dashboard**: Real-time overview of appointments, patients, and clinic metrics
- **Patient Management**: Comprehensive patient profiles and medical history
- **Appointment Scheduling**: Intuitive calendar interface with automated reminders
- **E-Prescriptions**: Digital prescription generation and management
- **Billing & Invoicing**: Integrated billing system with payment tracking

### For Patients
- **Profile Management**: Personal and medical information management
- **Appointment Booking**: Easy online appointment scheduling
- **Medical Records**: Secure access to personal health records
- **Medication Tracking**: Reminders and tracking for prescribed medications
- **Telemedicine**: Integrated video consultation (if implemented)

## 🚀 Features

- **Patient Management**: Create and manage patient records
- **Appointment Scheduling**: Schedule and track patient appointments
- **Electronic Health Records (EHR)**: Maintain digital health records
- **User Authentication**: Secure login for healthcare providers and staff
- **Responsive Design**: Accessible on desktop and mobile devices

## 🛠 Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: React Native Paper / NativeBase
- **HTTP Client**: Axios
- **Form Handling**: Formik with Yup validation

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Swagger/OpenAPI
- **Validation**: Joi

### Development Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm / yarn
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, React Testing Library

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (for mobile development)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- MongoDB (local or MongoDB Atlas)
- Expo Go app (for mobile testing)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/healio.git
   cd healio/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   # For web
   npm run web
   
   # For mobile (requires Expo Go app)
   npm start
   ```

5. **Run on different platforms**
   - **Web**: Open `http://localhost:19006` in your browser
   - **Android**: Scan the QR code with Expo Go (Android)
   - **iOS**: Scan the QR code with your camera app (iOS)

## 🌐 API Documentation

Once the backend server is running, you can access:

- **Interactive API Docs**: `http://localhost:5000/api-docs`
- **API Base URL**: `http://localhost:5000/api`

### Available Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

#### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add a new patient
- `GET /api/patients/:id` - Get patient by ID
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

#### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/appointments/:id` - Get appointment details
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

## 🧪 Testing the Application

### Running Tests

#### Backend Tests
```bash
cd backend
npm test
```

#### Frontend Tests
```bash
cd frontend
npm test
```

### Demo Credentials

**Admin Account**
- Email: admin@healio.com
- Password: admin123

**Doctor Account**
- Email: doctor@healio.com
- Password: doctor123

**Patient Account**
- Email: patient@healio.com
- Password: patient123

## 🎥 Demo Walkthrough

### Key Features Demonstrated
1. **User Authentication**
   - Registration and login flow
   - Role-based access control
   - JWT token management

2. **Patient Management**
   - Adding new patients
   - Viewing patient history
   - Updating patient records

3. **Appointment System**
   - Booking appointments
   - Calendar view
   - Appointment reminders

4. **Prescription Management**
   - Creating e-prescriptions
   - Viewing prescription history
   - Medication tracking

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow

1. Create an issue describing the feature/bug
2. Assign the issue to yourself
3. Create a new branch from `main`
4. Make your changes with clear commit messages
5. Add tests for new features
6. Ensure all tests pass
7. Update documentation if needed
8. Create a pull request

## � Deployment

### Backend Deployment

1. **Prepare for Production**
   ```bash
   cd backend
   npm run build
   ```

2. **Environment Variables**
   Update `.env` with production values:
   ```env
   NODE_ENV=production
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_production_secret
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Expo**
   ```bash
   expo publish
   ```

3. **Web Deployment**
   Deploy the `web-build` folder to your preferred static hosting (Netlify, Vercel, etc.)

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For any queries, please contact:
- **Email**: your.email@healio.com
- **GitHub Issues**: [Open an Issue](https://github.com/yourusername/healio/issues)
- **Project Board**: [View Project Board](https://github.com/yourusername/healio/projects/1)

## 🔗 GitHub Repository

[![GitHub stars](https://img.shields.io/github/stars/yourusername/healio?style=social)](https://github.com/yourusername/healio/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/healio)](https://github.com/yourusername/healio/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/healio)](https://github.com/yourusername/healio/blob/main/LICENSE)

[View on GitHub](https://github.com/yourusername/healio)

---

<div align="center">
  Made with ❤️ by Team Healio
  <br>
  <a href="https://healio.com">Visit our Website</a> | 
  <a href="https://twitter.com/healio">Twitter</a> | 
  <a href="https://linkedin.com/company/healio">LinkedIn</a>
</div>
