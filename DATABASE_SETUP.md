# 🗄️ JugaduBazar Database Setup

This guide will help you set up MongoDB and populate the database with sample data for JugaduBazar.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas cloud)

## Option 1: Local MongoDB Setup

### Install MongoDB

**On macOS:**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Ubuntu/Debian:**

```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

**On Windows:**
Download and install from [MongoDB Downloads](https://www.mongodb.com/try/download/community)

### Verify Installation

```bash
mongosh
# Should connect to mongodb://localhost:27017
```

## Option 2: MongoDB Atlas (Cloud)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

## Environment Setup

1. **Copy environment file:**

```bash
cp .env.example .env
```

2. **Edit `.env` file:**

```env
# For local MongoDB
MONGODB_URI=mongodb://localhost:27017/jugadubazar

# For MongoDB Atlas
# MONGODB_URI=MONGO_URI=mongodb+srv://RAJU:RAJU123@rajcoding.sraipee.mongodb.net/jugadubazar

JWT_SECRET=your-super-secret-jwt-key-here
PORT=8080
FRONTEND_URL=http://localhost:8080
```

## Database Initialization

1. **Install dependencies:**

```bash
npm install
```

2. **Seed the database:**

```bash
npm run db:seed
```

This will create:

- **3 Suppliers** with different specialties
- **2 Vendors** (street food stalls)
- **8 Materials** across different categories
- **1 Sample order** for testing

## Test Accounts

After seeding, you can use these accounts to test the application:

### Suppliers:

- **Kumar Oil Mills**: `kumar@kumaroilmills.com` / `password123`
- **Spice Garden**: `priya@spicegarden.com` / `password123`
- **Grain Traders Co.**: `ramesh@graintraders.com` / `password123`

### Vendors:

- **Rajesh's Chaat Corner**: `rajesh@chaatcorner.com` / `password123`
- **Sharma Snacks**: `sunita@delhisnacks.com` / `password123`

## Database Schema Overview

### Collections:

1. **Users** (`users`)

   - Stores both vendors and suppliers
   - Includes business information, location, ratings
   - Supports geospatial queries for nearby suppliers

2. **Materials** (`materials`)

   - Raw materials/products from suppliers
   - Categories: Oils & Fats, Spices, Grains, Vegetables, etc.
   - Stock management and pricing

3. **Orders** (`orders`)
   - Order tracking from placement to delivery
   - Status: pending → confirmed → preparing → out_for_delivery → delivered
   - Supports ratings and reviews

## API Endpoints

Once the server is running, you can test these endpoints:

### Health Check:

```bash
curl http://localhost:8080/api/ping
```

### Authentication:

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"+91 9876543210","role":"vendor","businessName":"Test Stall","address":"Test Address"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rajesh@chaatcorner.com","password":"password123","role":"vendor"}'
```

### Materials:

```bash
# Get all materials
curl http://localhost:8080/api/materials

# Search materials
curl "http://localhost:8080/api/materials?search=oil&category=Oils%20%26%20Fats"
```

## Database Reset

To reset and reseed the database:

```bash
npm run db:reset
```

## Production Deployment

For production deployment:

1. **Use MongoDB Atlas** for hosted database
2. **Set strong JWT secret** in environment variables
3. **Enable MongoDB authentication** if using local installation
4. **Configure proper indexes** for production queries

## Troubleshooting

### Common Issues:

1. **Connection Error:**

   - Check if MongoDB is running: `sudo systemctl status mongodb`
   - Verify connection string in `.env`

2. **Permission Denied:**

   - Ensure MongoDB has proper file permissions
   - Check firewall settings for MongoDB port (27017)

3. **Seeding Fails:**
   - Clear existing data: `mongosh jugadubazar --eval "db.dropDatabase()"`
   - Run seed again: `npm run db:seed`

### MongoDB Commands:

```bash
# Connect to database
mongosh jugadubazar

# View collections
show collections

# Count documents
db.users.countDocuments()
db.materials.countDocuments()
db.orders.countDocuments()

# Query examples
db.users.find({role: "supplier"})
db.materials.find({category: "Spices"})
db.orders.find({status: "delivered"})
```

## Performance Optimization

The database includes optimized indexes for:

- **Geospatial queries** (finding nearby suppliers)
- **Text search** (searching materials by name/description)
- **Status filtering** (orders by status)
- **Price range** (materials by price)
- **Category filtering** (materials by category)

These indexes ensure fast queries even with large datasets.
