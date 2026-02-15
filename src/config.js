/**
 * API Configuration
 * 
 * Development: http://localhost:5000
 * Production: https://ecomcake-backend.onrender.com (or your Render URL)
 */

export const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

console.log(`🌐 API URL: ${API_BASE_URL}`);
