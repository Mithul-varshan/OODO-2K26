const bcrypt = require('bcryptjs');

/**
 * Password Hashing Utility
 * Run this script to generate hashed passwords for test users
 * 
 * Usage:
 * node backend/utils/hashPassword.js password123
 */

const password = process.argv[2] || 'password123';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  
  console.log('\n=================================');
  console.log('Password Hashing Utility');
  console.log('=================================');
  console.log('Original Password:', password);
  console.log('Hashed Password:', hash);
  console.log('=================================\n');
  console.log('SQL to create test users:\n');
  
  console.log('-- Regular User');
  console.log(`INSERT INTO users (email, password, is_active, user_type) VALUES ('user@test.com', '${hash}', 1, 'user');\n`);
  
  console.log('-- Admin User');
  console.log(`INSERT INTO users (email, password, is_active, user_type) VALUES ('admin@test.com', '${hash}', 1, 'admin');\n`);
});
