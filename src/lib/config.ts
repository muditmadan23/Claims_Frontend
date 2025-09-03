export const API_BASE_URL = "http://localhost:8000";

// Utility function to handle API calls with 401 error handling
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');

  const defaultHeaders: Record<string, string> = {
    'accept': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (response.status === 401) {
    // Clear all auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');

    // Return a special response object instead of throwing
    return {
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      is401: true,
      json: async () => ({ message: 'Session expired. Please login again.' })
    } as any;
  }

  return response;
};