import Image from "next/image"
import { useEffect, useState } from "react"

export const SuccessComponent = () => {
	const [countDown, setCountDown] = useState(10)

	useEffect(() => {
		const timeInterval = setInterval(() => {
			setCountDown(value => value - 1)
		}, 1_000)

		return () => clearInterval(timeInterval)
	}, [])

	return (
		<div
			style={{
				textAlign: "center",
				color: "white",
			}}>
			<Image src='/sent.png' alt='' width={110} height={110} />
			<h3>Sent!</h3>
			<p>
				Redirecting in <b>{countDown}</b>s
			</p>
		</div>
	)
}
