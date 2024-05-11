const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const SSL_ENABLED = import.meta.env.VITE_API_SSL_ENABLED === 'true';

// Auto-adds `s` if there is SSL certificate in the API endpoints...
export const REST_API_ENDPOINT = `http${SSL_ENABLED ? "s" : ""}://${API_ENDPOINT}`
export const SOCKET_API_ENDPOINT = `ws${SSL_ENABLED ? "s" : ""}://${API_ENDPOINT}`