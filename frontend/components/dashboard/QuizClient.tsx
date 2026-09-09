import { QuestionTabProps } from "@/types/questions"
import QuizTabWindow from "../ui/tab-window/QuizTabWindow"
import { sampleQuestions } from "../ui/tab-window/sampleQuestionSet"

type TabWindowProps = {
    section: string
    activeTab: "Reading" | "Math"
}


export default function QuizClient({section, activeTab}: TabWindowProps) {

    // Sample Question
    const questionTabProps : QuestionTabProps = {
        currentQuestion: sampleQuestions[1],
        timeElapsed: 0
    }
    const progress = {
        completedQuestions: 1,
        numQuestions: 4
    }
    
    if (!section) return

    return (
        <>
            <div className="w-full h-full">
                <QuizTabWindow
                    section={section}
                    activeTab={activeTab}
                    progress= {progress}
                    questionTabProps={questionTabProps}
                    />
            </div>
        </>
    )
}