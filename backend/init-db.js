const db = require('./db');

const initDatabase = async () => {
  try {
    console.log('Creating database tables...');

    // Drop existing tables in reverse order to handle foreign keys
    console.log('Dropping existing tables if any...');
    await db.query('DROP TABLE IF EXISTS suggested_activities');
    await db.query('DROP TABLE IF EXISTS activities');
    await db.query('DROP TABLE IF EXISTS stops');
    await db.query('DROP TABLE IF EXISTS trips');
    console.log('✓ Old tables dropped (users table managed separately)');

    // Trips table
    await db.query(`
      CREATE TABLE trips (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT DEFAULT 1,
        name VARCHAR(255) NOT NULL,
        start_date DATE,
        end_date DATE,
        destination VARCHAR(255),
        destination_country VARCHAR(255),
        destination_lat DECIMAL(10, 8),
        destination_lng DECIMAL(11, 8),
        cover_image VARCHAR(500),
        budget DECIMAL(10, 2) DEFAULT 0,
        status ENUM('draft', 'upcoming', 'ongoing', 'completed') DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Trips table created');

    // Stops table (each destination in a trip)
    await db.query(`
      CREATE TABLE stops (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        city_name VARCHAR(255) NOT NULL,
        city_country VARCHAR(255),
        city_lat DECIMAL(10, 8),
        city_lng DECIMAL(11, 8),
        arrival_date DATE,
        departure_date DATE,
        notes TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Stops table created');

    // Activities table
    await db.query(`
      CREATE TABLE activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        stop_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        cost DECIMAL(10, 2) DEFAULT 0,
        icon VARCHAR(50),
        location VARCHAR(255),
        date DATE,
        time VARCHAR(20),
        notes TEXT,
        is_custom BOOLEAN DEFAULT FALSE,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Activities table created');

    // Suggested activities (saved from CreateTrip page)
    await db.query(`
      CREATE TABLE suggested_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        trip_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        cost DECIMAL(10, 2) DEFAULT 0,
        icon VARCHAR(50),
        location VARCHAR(255),
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Suggested activities table created');

    console.log('\n✅ All tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDatabase();
