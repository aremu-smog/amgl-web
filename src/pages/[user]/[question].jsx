import { supabaseApp } from "@/api/supabase"
import { useRouter } from "next/router"
import { useState } from "react"

const QuestionPage = ({ questionData, userData }) => {
	const [question, setQuestion] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async e => {
		setIsLoading(true)
		e.preventDefault()

		try {
			await supabaseApp.from("responses").insert({
				user_id: userData?.user_id,
				question_id: questionData?.id,
				details: question,
			})
		} catch (e) {
			console.warn(e)
		} finally {
			setIsLoading(false)
		}
	}
	return (
		<div>
			<p>
				{userData?.name} | {questionData?.description}
			</p>
			<form onSubmit={handleSubmit}>
				<input
					value={question}
					onChange={e => {
						setQuestion(e.target.value)
					}}
				/>

				<button>{isLoading ? "Loading..." : "Send"}</button>
			</form>
		</div>
	)
}

export async function getServerSideProps(context) {
	const { params } = context
	const { user, question } = params

	const { data: questionData, error: questionDataError } = await supabaseApp
		.from("questions")
		.select("id, description")
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
