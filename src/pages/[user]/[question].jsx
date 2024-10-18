import { useState } from "react"
import { supabaseApp } from "@/api/supabase"
import styles from "@/styles/question.module.css"
import Head from "next/head"
import { SuccessComponent, QuestionComponent } from "@/components"

const QuestionPage = ({ questionData, userData, expoToken }) => {
	const [isSuccess, setIsSuccess] = useState(false)

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
						<QuestionComponent
							questionData={questionData}
							userData={userData}
							expoToken={expoToken}
							setIsSuccess={setIsSuccess}
						/>
					)}
				</section>
			</main>
		</>
	)
}

export async function getServerSideProps(context) {
	const { params } = context
	const { user, question } = params

	const { data: questionData, error: questionDataError } = await supabaseApp
		.from("questions")
		.select("id, description, primary_color, secondary_color, title")
		.eq("slug", question)
		.single()

	const { data: userData, error: userDataError } = await supabaseApp
		.from("user_alias")
		.select("user_id, name")
		.eq("name", user)
		.single()

	const { data: expoData = [], error: expoDataError } = await supabaseApp
		.from("push_notifications")
		.select("expo_token")
		.eq("user_id", userData?.user_id)

	const expoToken = expoData?.length > 0 ? expoData[0]["expo_token"] : ""

	if (questionDataError || userDataError) {
		throw new Error("Unable to get question")
	}

	return {
		props: {
			questionData: questionData,
			userData: userData,
			expoToken,
		}, // will be passed to the page component as props
	}
}
export default QuestionPage
