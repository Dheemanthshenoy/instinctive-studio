# API Documentation

## Directory Structure

- `controllers/`: Contains the business logic for handling API requests
- `routes/`: Defines API endpoints and their corresponding controller functions
- `models/`: Database models and schemas
- `constants/`: Application constants and configuration values
- `helpers/`: Utility functions and helper methods
- `seed/`: Database seed data and initialization scripts

## API Routes

### Products

- `GET /api/products`: Get all products
- `GET /api/products/:productId`: Get a specific product by ID

### Categories

- `GET /api/categories`: Get all categories
- `GET /api/categories/:categoryId`: Get a specific category by ID

### Search
- `GET /api/search`: Search across products and categories
  - Query Parameters:
    - `q`: Search query string
    - `category`: Filter by Category
    - `filters`: Dynamic Filters such as Size, Color, Material
    - `stock`: Filter by Stock
    - `limit`: Limit
    - `page`: Page

## Environment Variables (.env)

Create a `.env` file in the root of the `apis` directory with the following variables:

```env
PORT=8080
DB_HOST=localhost
DB_PORT=27017
DB_NAME=b2b-market
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create and configure your `.env` file

3. Start the development server:

```bash
npm run dev
```