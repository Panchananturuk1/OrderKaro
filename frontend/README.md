# OrderKaro - Grocery Delivery App

A modern mobile app for grocery shopping and delivery built with React Native and PostgreSQL (Supabase).

## Features

- User authentication (login, signup, logout)
- Browse products by categories
- Product search and filtering
- Shopping cart functionality
- Order placement and tracking
- User profile management
- Address management

## Tech Stack

- React Native / Expo
- Redux Toolkit for state management
- Supabase for PostgreSQL database and authentication
- TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- PostgreSQL (installed locally or use Supabase cloud)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/orderkaro.git
cd orderkaro
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install
```

### Setting up PostgreSQL with Supabase

#### Option 1: Local PostgreSQL Setup

1. Install PostgreSQL on your machine if you haven't already
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. Create a new database
```bash
psql -U postgres
CREATE DATABASE orderkaro;
\c orderkaro
```

3. Run the setup script
```bash
psql -U postgres -d orderkaro -f frontend/src/utils/setupDatabase.sql
```

4. Seed the database with initial data
```bash
psql -U postgres -d orderkaro -f frontend/src/utils/seedData.sql
```

5. Update the Supabase connection in `frontend/src/utils/supabase.ts` with your local PostgreSQL connection details

#### Option 2: Supabase Cloud Setup

1. Create a Supabase account at https://supabase.com

2. Create a new project and note your project URL and anon key

3. Go to the SQL Editor in the Supabase dashboard

4. Run the setup script by copying and pasting the contents of `frontend/src/utils/setupDatabase.sql`

5. Run the seed script by copying and pasting the contents of `frontend/src/utils/seedData.sql`

6. Update the Supabase connection in `frontend/src/utils/supabase.ts` with your Supabase project URL and anon key

### Running the App

1. Start the Expo development server
```bash
cd frontend
npm start
```

2. Open the app in your choice of:
   - iOS Simulator
   - Android Emulator
   - Physical device using the Expo Go app

## Demo User Account

For testing, you can use the following credentials:
- Email: demo@example.com
- Password: password123

## Database Schema

### Users
- id (UUID, PK)
- email (TEXT)
- name (TEXT)
- phone (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Addresses
- id (UUID, PK)
- user_id (UUID, FK to users)
- type (TEXT)
- address (TEXT)
- city (TEXT)
- state (TEXT)
- postal_code (TEXT)
- is_default (BOOLEAN)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Categories
- id (UUID, PK)
- name (TEXT)
- icon (TEXT)
- image_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Products
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- price (DECIMAL)
- sale_price (DECIMAL)
- image_url (TEXT)
- unit (TEXT)
- stock (INTEGER)
- category_id (UUID, FK to categories)
- rating (DECIMAL)
- reviews_count (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Orders
- id (UUID, PK)
- user_id (UUID, FK to users)
- status (TEXT)
- total (DECIMAL)
- items_count (INTEGER)
- delivery_address_id (UUID, FK to addresses)
- payment_method (TEXT)
- payment_status (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Order Items
- id (UUID, PK)
- order_id (UUID, FK to orders)
- product_id (UUID, FK to products)
- quantity (INTEGER)
- price (DECIMAL)
- total (DECIMAL)
- product_name (TEXT)
- product_image (TEXT)
- created_at (TIMESTAMP)

## License

MIT 