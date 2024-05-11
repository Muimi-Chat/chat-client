import { REST_API_ENDPOINT } from "$lib/const";

/**
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} message
 */
export async function registerUserAPI(username, email, password, message) {
    try {
        const response = await fetch(`${REST_API_ENDPOINT}/user-api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: password,
                message: message
            })
        });

        if (response.ok || response.status == 409 || response.status == 406) {
            const data = await response.json();
            return data; // You can return response data if needed
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        // @ts-ignore
        throw new Error('Error registering: ' + error.message);
    }
}
