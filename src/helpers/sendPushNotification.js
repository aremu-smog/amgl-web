/**
 *
 * @param {string} expoPushToken
 * @param {string} title
 * @param {string} body
 */

export async function sendPushNotification(expoToken, title, body) {
	fetch("/api/push-notification", {
		method: "POST",
		// This needs to be improved as this token is now 'exposed'
		body: JSON.stringify({ expoToken, title, description: body }),
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
		},
	})
		.then(res => res.json())
		.then(data => console.log(data))
}
