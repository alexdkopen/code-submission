# Customer and Matter Management System

A RESTful API for managing customers and their associated matters, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- JWT-based authentication
- Customer management (CRUD operations)
- Matter management for customers
- RESTful API design
- TypeScript support
- PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Database Setup

1. Install PostgreSQL (if not already installed):
   ```bash
   # For Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Start PostgreSQL service:
   ```bash
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

3. Create database and user:
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE customer_matters_db;"
   sudo -u postgres psql -c "CREATE USER customer_matters_user WITH ENCRYPTED PASSWORD 'customer_matters_password';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE customer_matters_db TO customer_matters_user;"
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://customer_matters_user:customer_matters_password@localhost:5432/customer_matters_db"
   JWT_SECRET="your-secret-key"
   PORT=3000
   ```

## Application Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the database:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Build the project:
   ```bash
   npm run build
   ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- POST /api/auth/signup - Create a new user
- POST /api/auth/login - Login and receive JWT
- GET /api/auth/me - Get current user info (protected)

### Customers
- GET /api/customers - Get all customers (protected)
- POST /api/customers - Create a new customer (protected)
- GET /api/customers/:id - Get customer details (protected)
- PUT /api/customers/:id - Update a customer (protected)
- DELETE /api/customers/:id - Delete a customer (protected)

### Matters
- GET /api/customers/:customerId/matters - Get all matters for a customer (protected)
- POST /api/customers/:customerId/matters - Create a new matter (protected)
- GET /api/customers/:customerId/matters/:matterId - Get matter details (protected)

## Error Handling

The API uses a consistent error response format:
```json
{
  "status": "error",
  "message": "Error message"
}
```

## Security

- All routes except authentication are protected with JWT
- Passwords are hashed using bcrypt
- Input validation and sanitization
- Error handling middleware

## Troubleshooting

If you encounter any database connection issues:

1. Verify PostgreSQL is running:
   ```bash
   sudo systemctl status postgresql
   ```

2. Check database connection:
   ```bash
   psql -U customer_matters_user -d customer_matters_db -h localhost
   ```

3. Verify database user permissions:
   ```bash
   sudo -u postgres psql -c "\du"
   ``` 