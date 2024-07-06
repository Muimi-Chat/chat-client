import { USER_HTTP_API_ENDPOINT } from "$lib/const";
import { getSessionCookie, removeSessionCookie } from "$lib/cookies/sessionCookie";
import { getUsernameCookie, removeUsernameCookie } from "$lib/cookies/usernameCookie";

/**
 * @param {any} code
 */
export async function confirmTotpToken(code) {
    try {
        const response = await fetch(`${USER_HTTP_API_ENDPOINT}/api-user/confirm-totp/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'session-token': getSessionCookie() ?? "",
            },
            redirect: 'follow',
            body: JSON.stringify({
                code: code,
                username: getUsernameCookie() ?? ""
            })
        });

        if (response.status == 401) {
            removeSessionCookie();
            removeUsernameCookie();
        }

        if (response.ok || (response.status >= 400 && response.status < 500)) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Confirm TOTP failed');
        }
    } catch (error) {
        // @ts-ignore
        throw new Error('Error confirm TOTP key : ' + error.message);
    }
}
