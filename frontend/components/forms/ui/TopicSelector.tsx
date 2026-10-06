type Props = {
    section: string
    topic: string
    fieldChangeAction: (value: string) => void
}

export default function TopicSelector(
    {section, topic, fieldChangeAction} : Props
) {

    return (

        <>
            {(section === "reading" || section === "") &&
                <select
                    value={topic}
                    onChange={(e) => fieldChangeAction(e.target.value)}
                >
                    <option value="">Please select</option>
                    <option value="information & ideas">Information and Ideas</option>
                    <option value="craft & structure">Craft and Structure</option>
                    <option value="expression of ideas">Expression of Ideas</option>
                    <option value="standard english conventions">Standard English Conventions</option>
                </select>
            }
            {section === "math" &&
                <select
                    value={topic}
                    onChange={(e) => fieldChangeAction(e.target.value)}
                >
                    <option value="">Please select</option>
                    <option value="algebra">Algebra</option>
                    <option value="advanced math">Advanced Math</option>
                    <option value="problem solving & data analysis">Problem Solving & Data Analysis</option>
                    <option value="geometry & trigonometry">Geometry & Trigonometry</option>
                </select>
            }
        </>
    )
}