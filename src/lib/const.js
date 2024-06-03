const sslEnabled = import.meta.env.VITE_API_SSL_ENABLED === 'true';

const baseHttp = `http${sslEnabled ? "s" : ""}`
const baseWebsocket = `ws${sslEnabled ? "s" : ""}`

const userApiEndpoint = import.meta.env.VITE_USER_API_ENDPOINT;
export const USER_HTTP_API_ENDPOINT = `${baseHttp}://${userApiEndpoint}`

const chatApiEndpoint = import.meta.env.VITE_CHAT_API_PORT;
export const CHAT_HTTP_API_ENDPOINT = `${baseHttp}://${chatApiEndpoint}`