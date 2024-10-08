# Hospital Appointment System API

A backend service for managing hospital appointments, user authentication, and authorization. This API allows users to register, log in, manage their profiles, change passwords, and book or cancel appointments.

## Features

- **User Registration**: Register new users (patients, doctors, admins) with role-based access.
- **Authentication & Authorization**: Secure JWT-based authentication for API endpoints.
- **User Profile Management**: Update user details and change passwords.
- **Appointment Management**: Book, update, or cancel hospital appointments.
- **Role-Based Access Control**: Different functionalities available based on user roles (patient, doctor, admin).

## Technology Stack

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for Node.js
- **TypeScript**: Typed JavaScript at scale
- **MongoDB**: NoSQL database for storing user and appointment data
- **Mongoose**: Object Data Modeling (ODM) library for MongoDB and Node.js
- **JWT (JSON Web Token)**: For secure user authentication
- **crypto**: For hashing passwords
- **dotenv**: For environment variable management

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.2 or higher)
- [npm](https://www.npmjs.com/) (Node Package Manager)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/hospital-appointment-system.git
   cd hospital-appointment-system
   ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    ```bash
    NODE_ENV='development' or 'test'
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=port_number
    ```

4. **Start the development server**:
    ```bash
    npm run dev
    ```

## API Endpoints

- **POST** `/api/users` - Register a new user

- **POST** `/api/users/login` - Log in a user and receive a JWT token

- **PUT** `/api/users/me` - Change a user's password (requires authentication)

- **GET** `/api/users/me` - Get current user's details (requires authentication)

- **DELETE** `/api/users/me` - Delete the current user's account (requires authentication)

## Usage

Use an API client like *Postman* or *curl* to interact with the API. Ensure you include the JWT token in the Authorization header when accessing protected routes.

## Running Tests

The application uses Jest for testing. To run tests, use the following command:
```bash
npm test
```