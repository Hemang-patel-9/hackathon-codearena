import ExamComponent from "@/components/start/examComponent"
import { useEffect, useState } from "react"
import { getQuizById } from "@/api/quiz";
import { useAuth } from "@/contexts/authContext";
import type { Result } from "@/types/response";
import { toast } from "@/hooks/use-toast";
// Replace the mock data section with:
interface ApiExamData {
	_id: string
	creator: {
		_id: string
		username: string
		email: string
	}
	title: string
	description: string
	questions: Array<{
		multimedia: {
			type: string
			url: string
		}
		_id: string
		questionText: string
		questionType: "multiple-choice" | "multiple-select" | "true-false" | "open-ended"
		options: Array<{
			text: string
			isCorrect: boolean
			_id: string
		}>
	}>
	NoOfQuestion: number
	timePerQuestion: number
	passingCriteria: number
	questionOrder: string
	visibility: string
	status: string
	duration: number
	participants: string[]
	thumbnail: string
	tags: string[]
	schedule: string
}

// API Response data
const MockapiData: ApiExamData = {
	_id: "6879f0e0051ff0499f829e1e",
	creator: {
		_id: "6875362e726c85ca455fa4c3",
		username: "hemang9705",
		email: "hemang9705@gmail.com",
	},
	title: "Grisa Tanpi",
	description: "this is buri chudail.",
	questions: [
		{
			multimedia: {
				type: "image",
				url: "",
			},
			_id: "6879f0e0051ff0499f829e0f",
			questionText: "What is 7+7?",
			questionType: "multiple-choice",
			options: [
				{
					text: "14",
					isCorrect: true,
					_id: "6879f0e0051ff0499f829e10",
				},
				{
					text: "4",
					isCorrect: false,
					_id: "6879f0e0051ff0499f829e11",
				},
				{
					text: "16",
					isCorrect: false,
					_id: "6879f0e0051ff0499f829e12",
				},
				{
					text: "20",
					isCorrect: false,
					_id: "6879f0e0051ff0499f829e13",
				},
			],
		},
		{
			multimedia: {
				type: "image",
				url: "",
			},
			_id: "6879f0e0051ff0499f829e14",
			questionText: "color names?",
			questionType: "multiple-select",
			options: [
				{
					text: "red",
					isCorrect: true,
					_id: "6879f0e0051ff0499f829e15",
				},
				{
					text: "blue",
					isCorrect: true,
					_id: "6879f0e0051ff0499f829e16",
				},
				{
					text: "zadi",
					isCorrect: false,
					_id: "6879f0e0051ff0499f829e17",
				},
				{
					text: "green",
					isCorrect: true,
					_id: "6879f0e0051ff0499f829e18",
				},
			],
		},
		{
			multimedia: {
				type: "image",
				url: "",
			},
			_id: "6879f0e0051ff0499f829e19",
			questionText: "Are you not human?",
			questionType: "true-false",
			options: [
				{
					text: "True",
					isCorrect: false,
					_id: "6879f0e0051ff0499f829e1a",
				},
				{
					text: "False",
					isCorrect: true,
					_id: "6879f0e0051ff0499f829e1b",
				},
			],
		},
		{
			multimedia: {
				type: "image",
				url: "media\\file-1752821758803-317758599.jpg",
			},
			_id: "6879f0e0051ff0499f829e1c",
			questionText: "Tell me about this image?",
			questionType: "open-ended",
			options: [],
		},
	],
	NoOfQuestion: 8,
	timePerQuestion: 30,
	passingCriteria: 70,
	questionOrder: "random",
	visibility: "private",
	status: "upcoming",
	duration: 60,
	participants: ["6877d4903dcf3fe1c3823374"],
	thumbnail: "media\\file-1752821464299-873515225.jpg",
	tags: ["grisa", "tanpi"],
	schedule: "2025-07-18T06:50:46.918Z",
}

export default function StartExam() {
	const { token } = useAuth();
	const [apiData, setApiData] = useState<ApiExamData>(MockapiData)
	const transformQuestionType = (apiType: string): "single" | "multiple" | "open" => {
		switch (apiType) {
			case "multiple-choice":
			case "true-false":
				return "single"
			case "multiple-select":
				return "multiple"
			case "open-ended":
				return "open"
			default:
				return "single"
		}
	}

	const examData = {
		_id: apiData._id,
		title: apiData.title,
		description: apiData.description,
		questions: apiData.questions.map((q) => ({
			_id: q._id,
			questionText: q.questionText,
			type: transformQuestionType(q.questionType),
			options: q.options,
			multimedia: q.multimedia,
		})),
		timePerQuestion: apiData.timePerQuestion,
		passingCriteria: apiData.passingCriteria,
		thumbnail: apiData.thumbnail,
		creator: apiData.creator,
	}

	useEffect(() => {
		const fetchExamData = async () => {
			try {
				const response: Result = await getQuizById("6879f0e0051ff0499f829e1e", token as string);
				if (response.error == null) {
					const data = response.data as ApiExamData;
					setApiData(data);
				}
				else {
					toast({
						title: "Error",
						description: response.message || "Failed to fetch exam data",
						variant: "destructive",
					})
				}
			}
			catch (error) {
				toast({
					title: "Error",
					description: "Failed to fetch exam data",
					variant: "destructive",
				});
				console.error("Failed to fetch exam data:", error);
			}
		}
		fetchExamData();
	}, []);

	return (
		<>
			{apiData && <ExamComponent examData={examData} />}
		</>
	)
}
