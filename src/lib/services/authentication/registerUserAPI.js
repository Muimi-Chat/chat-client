import { REST_API_ENDPOINT } from "$lib/const";
import Cookies from "js-cookie";

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} message
 * @param {string} csrfToken
 */
export async function registerUserAPI(username, email, password, message, csrfToken) {
    try {
        const response = await fetch(`${REST_API_ENDPOINT}/user-api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                userAgent: navigator.userAgent,
                username: username,
                email: email,
                password: password,
                message: message
            })
        });

        // CSRF Token might have expired
        if (response.status == 403) {
            Cookies.remove("registration_csrf_token")
        }

        if (response.ok || response.status == 409 || response.status == 406) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        // @ts-ignore
        throw new Error('Error registering: ' + error.message);
    }
}
