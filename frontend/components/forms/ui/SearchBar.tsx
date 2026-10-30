import {Search} from 'lucide-react'
import "@/css/forms/form.css"
import { SUBTOPICS } from '@/utils/admin/subtopics';
import { SearchFilters } from '@/types/question-processing';


type SearchBarProps = {
    search: SearchFilters
    searchChangeAction: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    handleSearchAction: () => void
}

const TOPICS = [
    "information and ideas", "craft and structure", "expression of ideas", "standard english conventions", 
    "algebra", "advanced math", "problem solving and data analysis", "geometry and trigonometry"
]

const searchParameters: { name: keyof SearchFilters; type: "select" | "input"; options: string[] }[] = [
    {name:"section", type:"select", options:["reading","math"]}, 
    {name:"topic", type:"select", options: TOPICS},  
    {name:"subtopic", type:"input", options:SUBTOPICS}, 
    {name:"source", type:"select", options:["preppros", "other", "myself", "pinesat"]}, 
]



export default function SearchBar({search, searchChangeAction, handleSearchAction}: SearchBarProps) {
    return (
        <>
            <div className="bg-primaryOne/70 border-2 border-primaryOne rounded-md p-1">
                <div className="flex flex-row gap-2">

                    <div className='flex flex-row gap-2 flex-1'>
                        {searchParameters.map(({ name, type, options }) => {                        
                            return type === "select" ? (
                                <select
                                    key={name}
                                    name={name}
                                    value={search[name] ?? ""}
                                    onChange={searchChangeAction}
                                    className="flex w-full flex-1 bg-white rounded-md p-1 text-gray-500 italic h-7"
                                >
                                    <option value="">{name}</option>
                                    {options.map((o) => (
                                        <option key={o} value={o}>{o}</option>
                                    ))}
                                </select>
                            ) : (
                                <div key={name} className='flex w-full flex-1'>
                                    <input
                                        name={name}
                                        list={`${name}-options`}
                                        placeholder={name}
                                        value={search[name] ?? ""}
                                        onChange={searchChangeAction}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearchAction()}
                                        className="w-full bg-white rounded-md p-1 text-gray-500 italic h-7"
                                    />
                                    <datalist id={`${name}-options`}>
                                        {options.map((o) => <option key={o} value={o} />)}
                                    </datalist>
                                </div>
                            )
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={handleSearchAction}
                        aria-label="Search"
                        className="flex justify-self-start rounded-lg bg-primaryOne/60 border border-primaryOne p-1 text-white hover:scale-110 transition-transform"
                    >
                        <Search className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>
                </div>
            </>
    )
}
