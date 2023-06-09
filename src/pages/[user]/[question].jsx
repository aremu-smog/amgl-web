import { useRef, useState } from "react"
import { supabaseApp } from "@/api/supabase"
import { useRouter } from "next/router"
import styles from "@/styles/question.module.css"
import Head from "next/head"
import Image from "next/image"

const QuestionPage = ({ questionData, userData }) => {
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
					background: `linear-gradient(150deg, ${questionData?.primary_color}, ${questionData?.secondary_color});`,
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
	return (
		<div
			style={{
				textAlign: "center",
				color: "white",
			}}>
			<Image src='/sent.png' width={110} height={110} />
			<h3>Sent!</h3>
		</div>
	)
}

export async function getServerSideProps(context) {
	const { params } = context
	const { user, question } = params

	const { data: questionData, error: questionDataError } = await supabaseApp
		.from("questions")
		.select("id, description, primary_color, secondary_color")
		.eq("slug", question)

	const { data: userData, error: userDataError } = await supabaseApp
		.from("user_alias")
		.select("user_id, name")
		.eq("name", user)

	return {
		props: {
			questionData: questionData[0],
			userData: userData[0],
		}, // will be passed to the page component as props
	}
}
export default QuestionPage
