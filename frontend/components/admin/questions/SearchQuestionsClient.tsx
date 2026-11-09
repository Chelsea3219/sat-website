"use client"
import SearchBar from "@/components/admin/questions/ui/SearchBar"
import useEditorNavigation from "@/hooks/admin/question-processing/useEditorNavigation"
import useQuestionEditor from "@/hooks/admin/question-processing/useQuestionEditor"
import {AnyQuestion} from "@/types/question-processing"
import { useState, Fragment } from "react"
import QuestionEditorPreview from "./ui/QuestionEditorPreview"
import CircleLoadingAnimation from "../../ui/loading-animation/circleLoadingAnimation"
import useFileUploader from "@/hooks/admin/question-processing/useFileUploader"
import {ChevronsLeft, ChevronsRight} from 'lucide-react'
import { getPageWindow } from "@/utils/admin/pagination"
import useQuestionSearch from "@/hooks/admin/question-processing/useQuestionSearch"
import ErrorMessage from "@/components/ui/ErrorMessage"


export default function SearchQuestionsClient() {
    const {search, hasSearched, questions, setQuestions, searchError, setSearchError, loading,  handleSearchChange, handleSearch} = useQuestionSearch({reviewed:true, loadOnMount:false})
    const { saveQuestion } = useEditorNavigation({questions, setQuestions})

    const isLanding = !hasSearched && !loading

    const diagramUploader = useFileUploader()
    
    // Organize question in sets of 20
    const PAGE_SIZE=20
    const [page, setPage] = useState(0)
    const numPages = Math.max(1, Math.ceil(questions.length/PAGE_SIZE))
    const currentPage = Math.min(page, numPages-1)
    const visibleQuestions = questions.slice(currentPage*PAGE_SIZE, (currentPage+1)*PAGE_SIZE)

    // Previous and Next Page
    const previousPage = () => setPage(Math.max(0, currentPage - 1))
    const nextPage = () => setPage(Math.min(numPages - 1, currentPage + 1)) 

    const [currentQuestion, setCurrentQuestion] = useState<AnyQuestion| null>(null)
    const {form, fieldChange, mcFieldChange, mcChangeAll, handleImageUpload, handleDeleteQuestion} = useQuestionEditor(currentQuestion)

    const [deleting, setDeleting] = useState(false)

    const linkClass = `cursor-pointer hover:text-accent hover:font-semibold text-lg text-left font-semibold`
    const navStyle = 'flex flex-row items-center uppercase gap-2 bg-primaryOne rounded-2xl w-25 py-1 px-2 disabled:opacity-50 hover:bg-accent transition-all'                


    // Controls the previewEditor
    const openEditor = (q: AnyQuestion) => setCurrentQuestion(q)
    const closeEditor = () => setCurrentQuestion(null)


    return (
        <div className={isLanding ? "flex flex-col items-center justify-center w-full pt-40" : ""}>

            {isLanding && <h1 className="text-5xl text-primaryOne tracking-wide font-semibold pb-2">Search Questions</h1>}

            {searchError && <ErrorMessage error={searchError} onDismiss={()=> setSearchError("")} fillsPage={true}/> }

            {/* Pop Editor Window ------------------------------------------------------------------------------------------------ */}
            {currentQuestion && 
                <QuestionEditorPreview 
                    question={form} 
                    fieldChangeAction={fieldChange} 
                    mcFieldChangeAction={mcFieldChange}
                    mcChangeAll={mcChangeAll} 
                    handleImageAction={handleImageUpload}
                    diagramUploader={diagramUploader}
                    saveQuestion={saveQuestion}
                    handleDelete={handleDeleteQuestion}
                    deleting={deleting}
                    onClose={closeEditor}
                />
            }

            {/* SearchBar ------------------------------------------------------------------------------------------------ */}
            <SearchBar search={search} searchChangeAction={handleSearchChange} handleSearchAction={handleSearch} selectedParameters={['question_id', 'topic', 'subtopic', 'text', 'source']}/>


            {/* Search Results ------------------------------------------------------------------------------------------------ */}
            {loading ? (
                <div className="pt-10">
                    <CircleLoadingAnimation/>
                </div>
            ) : (hasSearched && questions.length === 0) ? (
                <p className="text-center text-slate-500 pt-10">No questions found. Try different filter.</p>
            ) : questions.length > 0 ? (
                <>
                    <div className="bg-coolwhite border border-primaryOne rounded-lg p-2 mt-2">
                        <div className="flex flex-col w-full gap-2">
                            {visibleQuestions.map((q) => {
                                const normalizedSubtopic = Array.isArray(q.subtopic) ? q.subtopic.join(", ") : q.subtopic
                                const meta = [q.section, q.topic, normalizedSubtopic].filter(Boolean)
                                return (
                                    <div key={q.question_id} className="flex flex-col rounded-lg p-2 bg-coolwhite border border-primaryOne">
                                        <div className="flex flex-col">
                                            <button
                                                type="button"
                                                onClick={() => openEditor(q)}
                                                className={linkClass}
                                            >
                                                {q.question_id}
                                            </button>

                                            <ul className="flex flex-row flex-wrap items-center list-none gap-1 p-0 text-xs text-gray-500 leading-tight">
                                                {meta.map((field,index) =>(
                                                    <Fragment key={field}>
                                                        {index > 0 && <li aria-hidden>○</li>}
                                                        <li >{field}</li>
                                                    </Fragment>
                                                ))}
                                            </ul>
                                        </div>                                       
                                        <p className="text-sm line-clamp-2">{q.text}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Next and Previous Navigation */}
                    <div className="flex items-center flex-row justify-between gap-4 pt-4 max-w-4xl mx-auto">
                        <button 
                            type="button"
                            onClick={previousPage}
                            disabled={currentPage === 0}
                            className={navStyle}                        
                        >
                            <ChevronsLeft strokeWidth={2.5} className="bg-white rounded-full text-primaryOne"/>
                            <p className="hidden md:block text-xl font-semibold text-white">Prev</p>
                        </button>

                        <div className="flex items-center gap-1">
                            {getPageWindow(currentPage, numPages).map((page) => (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => setPage(page)}
                                    aria-current={page === currentPage ? "page" : undefined}
                                    className={`h-8 w-8 rounded-full text-sm font-semibold ${
                                        page === currentPage ? "bg-accent text-white" : "text-primaryOne hover:bg-primaryOne/10"
                                    }`}
                                >
                                    {page + 1}
                                </button>
                            ))}
                        </div>

                        <button 
                            type="button"
                            onClick={nextPage}
                            disabled={currentPage === numPages-1}
                            className={navStyle}                        
                        >
                            <ChevronsRight strokeWidth={2.5} className="bg-white rounded-full text-primaryOne"/>
                            <p className="hidden md:block text-xl font-semibold text-white">next</p>
                        </button>
                    </div>

                    {/* Number of results */}
                    <p className="text-center text-xs text-gray-400 italic pt-1">{questions.length} results</p>
                </>
            ) : null }
        </div>
    )
}