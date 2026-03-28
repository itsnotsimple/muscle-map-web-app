/**
 * Determines the API base URL depending on the current environment.
 * Evaluates the hostname to switch dynamically between local development and production.
 */
export const IS_LOCAL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
export const API_URL = IS_LOCAL 
  ? 'http://localhost:5000/api' 
  : 'https://electronic-nadiya-musclemap-a30e9055.koyeb.app/api';

/**
 * Standardized HTTP methods to restrict unexpected string values.
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * Options configuration for the base apiFetch function.
 */
interface FetchOptions {
  method?: HttpMethod;
  body?: Record<string, unknown> | string;
  token?: string;
}

/**
 * Core API request handler enforcing the DRY principle.
 * Streamlines URL building, applies standardized headers (including Auth),
 * and automatically serializes the request body when needed.
 * 
 * @param endpoint - The API endpoint path (e.g., '/register')
 * @param options - Additional fetch configurations (method, body, token)
 * @returns {Promise<Response>} Resolves with the standard DOM fetch Response
 */
const apiFetch = (endpoint: string, options: FetchOptions = {}): Promise<Response> => {
  const { method = 'GET', body, token } = options;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Append Bearer token if provided for authenticated requests
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  // Automatically stringify JSON body if provided as an object
  if (body) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  return fetch(`${API_URL}${endpoint}`, config);
};

/**
 * Centralized API Service providing specific data access methods.
 * Abstracts the network layer from the UI components.
 */
export const ApiService = {
  // --- Authentication ---
  register: (data: Record<string, unknown>) => apiFetch('/register', { method: 'POST', body: data }),
  login: (data: Record<string, unknown>) => apiFetch('/login', { method: 'POST', body: data }),
  googleLogin: (token: string) => apiFetch('/google', { method: 'POST', body: { access_token: token } }),
  verifyEmail: (token: string) => apiFetch(`/verify/${token}`),
  forgotPassword: (email: string) => apiFetch('/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token: string, password: string) => apiFetch(`/reset-password/${token}`, { method: 'POST', body: { password } }),
  
  // --- User Profile Management ---
  getUserStatus: (token: string) => apiFetch('/user/status', { token }),
  updateProfile: (token: string, data: Record<string, unknown>) => apiFetch('/user/profile', { method: 'PUT', token, body: data }),
  deleteAccount: (token: string, password?: string) => apiFetch('/user/profile', { method: 'DELETE', token, body: { password } }),
  updatePreferences: (token: string, data: Record<string, unknown>) => apiFetch('/user/preferences', { method: 'PUT', token, body: data }),
  addBadge: (token: string, badgeId: string) => apiFetch('/user/badges', { method: 'PUT', token, body: { badgeId } }),
  
  // --- User Bookmarks ---
  getBookmarks: (token: string) => apiFetch('/user/bookmarks', { token }),
  addBookmark: (token: string, exercise: Record<string, unknown>) => apiFetch('/user/bookmark', { method: 'POST', token, body: { exercise } }),
  deleteBookmark: (token: string, id: string) => apiFetch(`/user/bookmarks/${id}`, { method: 'DELETE', token }),

  // --- Public Data ---
  getMuscleDetails: (key: string) => apiFetch(`/muscles/${key}`),
  getDiets: () => apiFetch('/diets'),

  // --- AI Chat ---
  chat: (token: string, message: string, history: any[] = []) => apiFetch('/chat', { method: 'POST', token, body: { message, history } }),
  getChatStatus: (token: string) => apiFetch('/chat/status', { token }),
};
