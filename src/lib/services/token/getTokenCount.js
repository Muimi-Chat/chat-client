import { TOKEN_HTTP_API_ENDPOINT } from "$lib/const";

/**
 * @param {string} username
 * @param {string} sessionToken
 */
export async function getTokenCount(username, sessionToken) {
    try {
        const response = await fetch(`${TOKEN_HTTP_API_ENDPOINT}/api-token/current-count?username=${username}`, {
            method: 'GET',
            headers: {
                'Session-Token': sessionToken,
                'User-Agent': navigator.userAgent
            }
        });

        const data = await response.json();
        return data;
    } catch (error) {
        // @ts-ignore
        throw new Error('Error Fetchingt Token: ' + error.message);
    }
}
