"use client"



import PracticeSidebarItem from "./PracticeSidebarItem";
import items from "./PracticeSidebarData";
import "@/css/navigation/practice-sidebar.css"
import {Sigma, BookOpenText} from "lucide-react"


// Handles data and layout
export default function PracticeSidebar() {

    // Declare the parameters 
    const readingTopics = items.filter(item => item.title === "Reading");
    const mathTopics = items.filter(item => item.title === "Math");

    return (
        <div className="sidebar p-4 flex flex-col " style={{ overflowY: 'auto' }}       >
            <div>
                <div className="flex flex-row items-center gap-x-2">
                    <BookOpenText className="w-6 h-6 text-primary"/>
                    <h1 className="sidebar-title">Reading</h1>
                </div>
                {readingTopics.map((item, index) => (
                    <PracticeSidebarItem
                        key={index}
                        item={item}
                    />
                ))}
            </div>
            <div>
                <div className="flex flex-row items-center gap-x-2">
                    <Sigma className="w-6 h-6 text-primary"/>
                    <h1 className="sidebar-title">Math</h1>
                </div>
                {mathTopics.map((item, index) => (
                    <PracticeSidebarItem
                        key={index}
                        item={item}
                    />
                ))}
            </div>

        </div>
    )
}