# E-commerce Website

This is a full-stack E-commerce website built with Spring Boot for the backend and React with Vite for the frontend.

## Technologies Used

- **Backend**: Spring Boot, Spring Security, Spring Data JPA, MySQL
- **Frontend**: React, Vite, Tailwind CSS
- **Database**: H2 (for development), MySQL (for production)

## Project Structure

- `backend/`: Spring Boot application
  - Controllers for API endpoints
  - Models for database entities
  - Services for business logic
  - Security configuration
- `frontend/`: React application
  - Components for UI
  - Pages for different views
  - Services for API calls
  - Context for state management

## Getting Started

### Prerequisites

- Java 17 or higher
- Node.js 16 or higher
- Maven (or use mvnw)

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the application:
   ```
   ./mvnw spring-boot:run
   ```

   The backend will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

   The frontend will start on http://localhost:5173

## Features

- User authentication and authorization
- Product catalog
- Shopping cart
- Order management
- Admin dashboard

## API Endpoints

- Authentication: `/api/auth`
- Products: `/api/products`
- Categories: `/api/categories`
- Orders: `/api/orders`
- Admin: `/api/admin`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
