import { useEffect, useRef, useState } from "react"
import { supabaseApp } from "@/api/supabase"
import { useRouter } from "next/router"
import styles from "@/styles/question.module.css"
import Head from "next/head"
import Image from "next/image"
/**
 *
 * @param {string} expoPushToken
 * @param {string} title
 * @param {string} body
 */

async function sendPushNotification(expoToken, title, body) {
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

const QuestionPage = ({ questionData, userData, expoToken }) => {
	const [question, setQuestion] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isSuccess, setIsSuccess] = useState(false)

	const formRef = useRef(null)

	const handleSubmit = async e => {
		setIsLoading(true)
		e.preventDefault()

		try {
			const { data, error } = await supabaseApp
				.from("responses")
				.insert({
					user_id: userData?.user_id,
					question_id: questionData?.id,
					details: question,
				})
				.select()

			if (data) {
				setQuestion("")
				setIsSuccess(true)

				if (expoToken) {
					await sendPushNotification(expoToken, questionData?.title, question)
				}

				setTimeout(() => {
					setIsSuccess(false)
				}, 10000)
			}
			if (error) {
				console.error(error)
			}
		} catch (e) {
			console.warn(e)
		} finally {
			setIsLoading(false)
		}
	}
	const pageTitle = `${userData?.name} - ${questionData?.description}`
	return (
		<>
			<Head>
				<title>{pageTitle}</title>
				<meta name='description' content='Lie to questions annonymously🤭' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.png' />
			</Head>
			<main
				className={styles.main}
				style={{
					background: `linear-gradient(150deg, ${questionData?.primary_color}, ${questionData?.secondary_color})`,
				}}>
				<section className={styles.wrapper}>
					{isSuccess ? (
						<SuccessComponent />
					) : (
						<>
							<header className={styles.userContainer}>
								<div
									className={styles.emojiContainer}
									style={{
										background: questionData?.primary_color,
									}}>
									<p>🤪</p>
								</div>
								<div>
									<p>{userData?.name}</p>
									<h4>{questionData?.description}</h4>
								</div>
							</header>

							<form onSubmit={handleSubmit} ref={formRef}>
								<textarea
									className={styles.questionTextArea}
									value={question}
									onChange={e => {
										setQuestion(e.target.value)
									}}
									placeholder='send me anonymous messages i will lie to...'
									rows={5}
									cols={200}
								/>
								<p className={styles.qA}>🔒 anonymous q&a</p>

								{question && (
									<button className={styles.button} disabled={isLoading}>
										{isLoading ? "Loading..." : "Send"}
									</button>
								)}
							</form>
						</>
					)}
				</section>
			</main>
		</>
	)
}

const SuccessComponent = () => {
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

export async function getServerSideProps(context) {
	const { params } = context
	const { user, question } = params

	const { data: questionData, error: questionDataError } = await supabaseApp
		.from("questions")
		.select("id, description, primary_color, secondary_color, title")
		.eq("slug", question)

	const { data: userData, error: userDataError } = await supabaseApp
		.from("user_alias")
		.select("user_id, name")
		.eq("name", user)

	const { data: expoData, error: expoDataError } = await supabaseApp
		.from("push_notifications")
		.select("expo_token")
		.eq("user_id", userData[0]?.user_id)

	const expoToken = expoData.length > 0 ? expoData[0]["expo_token"] : ""

	return {
		props: {
			questionData: questionData[0],
			userData: userData[0],
			expoToken,
		}, // will be passed to the page component as props
	}
}
export default QuestionPage
