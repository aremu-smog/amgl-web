// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const emojis = ["🔥", "🚀", "🎉", "🥳"]
export default async function handler(req, res) {
	if (req.method !== "POST") {
		console.log("Bombastic side eye")
		res.status(200).json({ name: "Bombastic Side eye" })
	} else {
		const expoPushToken = "ExponentPushToken[1CM0m2LLKpnixMMhFiGufZ]"
		const noOfEmojis = emojis.length
		const randomIndex = Math.floor(Math.random() * noOfEmojis)
		const selectedEmoji = emojis[randomIndex]
		const { title, description } = req.body
		const message = {
			to: expoPushToken,
			sound: "default",
			title: `New ${title} ${selectedEmoji}`,
			body: description,
		}

		await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Accept-encoding": "gzip, deflate",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		})
			.then(res => {
				return res.json()
			})
			.then(data => {
				res.status(200).json({ title: "Successful" })
			})
			.catch(e => {
				console.error(e.message)
			})
	}
}
