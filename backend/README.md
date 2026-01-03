# Backend Setup Instructions

## Prerequisites
- Node.js installed
- MySQL database running

## Environment Setup

1. Create a `.env` file in the backend directory with the following:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=globetrotter
DB_PORT=3306
```

2. Replace `your_password` with your MySQL root password.

## Database Initialization

Run the following command to create the database tables:

```bash
npm run init-db
```

This will create the following tables:
- `users` - User accounts
- `trips` - Trip information
- `stops` - Destinations within trips
- `activities` - Activities for each stop
- `suggested_activities` - Activities suggested from the CreateTrip page

## Running the Backend

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The backend will start on `http://localhost:5000`

## API Endpoints

### Trips
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get single trip
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update trip
- `PATCH /api/trips/:id/budget` - Update trip budget
- `DELETE /api/trips/:id` - Delete trip

### Health Check
- `GET /api/health` - Check if backend is running

## Frontend Integration

The frontend (`TripContext.jsx`) is configured to:
1. First try to fetch data from the backend API
2. Fall back to localStorage if the backend is unavailable
3. Sync data to both backend and localStorage for redundancy

Make sure the backend is running before using the app to enable full database functionality.
