
import PracticeSidebarItem from "./PracticeSidebarItem";
import items from "./PracticeSidebarData";
import "@/css/navigation/practice-sidebar.css"


// Handles data and layout
export default function PracticeSidebar() {

    const readingTopics = items.filter(item => item.title === "Reading");
    const mathTopics = items.filter(item => item.title === "Math");

    return (
        <div className="sidebar p-4 flex flex-col " style={{ overflowY: 'auto' }}       >
            <div>
                <h1 className="sidebar-title">Reading</h1>
                {readingTopics.map((item, index) => (
                    <PracticeSidebarItem
                        key={index}
                        item={item}
                    />
                ))}
            </div>
            <div>
                <h1 className="sidebar-title">Math</h1>
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