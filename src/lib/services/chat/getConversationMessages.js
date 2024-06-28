import { CHAT_HTTP_API_ENDPOINT } from '$lib/const';

/**
 * @param {string} username
 * @param {string} sessionToken
 * @param {number} conversationID
 */
export async function getConversationMessages(username, sessionToken, conversationID) {
	try {
		const response = await fetch(
			`${CHAT_HTTP_API_ENDPOINT}/api-chat/conversation/messages?username=${username}&conversation_id=${conversationID}`,
			{
				method: 'GET',
				headers: {
					'session-token': sessionToken
				}
			}
		);

		const data = await response.json();
		return data;
	} catch (error) {
		// @ts-ignore
		throw new Error('Error Fetching Messages: ' + error.message);
	}
}
