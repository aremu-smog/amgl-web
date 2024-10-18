import { useState, useRef } from "react"
import { supabaseApp } from "@/api/supabase"
import { sendPushNotification } from "@/helpers"
import styles from "@/styles/question.module.css"

export const QuestionComponent = ({
	questionData,
	userData,
	expoToken,
	setIsSuccess,
}) => {
	const [question, setQuestion] = useState("")
	const [isLoading, setIsLoading] = useState(false)

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
				alert("Error submitting question")
				console.error({ error })
			}
		} catch (e) {
			console.warn(e)
		} finally {
			setIsLoading(false)
		}
	}
	return (
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
	)
}
