// Authentication utility functions

/**
 * Get authentication token from localStorage
 * @returns {string|null} - The auth token or null if not found
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Get user data from localStorage
 * @returns {object|null} - The user object or null if not found
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has a valid token
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Check if user is an admin
 * @returns {boolean} - True if user is an admin
 */
export const isAdmin = () => {
  const user = getUser();
  return user && user.userType === 'admin';
};

/**
 * Logout user by clearing localStorage
 */
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

/**
 * Get authorization header for API requests
 * @returns {object} - Headers object with Authorization token
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

/**
 * Verify token with backend
 * @returns {Promise<boolean>} - True if token is valid
 */
export const verifyToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    return response.ok && data.success;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
};

export default {
  getAuthToken,
  getUser,
  isAuthenticated,
  isAdmin,
  logout,
  getAuthHeaders,
  verifyToken
};
