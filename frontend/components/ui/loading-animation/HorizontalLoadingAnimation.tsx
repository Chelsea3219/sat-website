type Props = {
    text: string
}

export default function HorizontalLoadingAnimation({ text }: Props) {

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4 text-xl text-primary font-semibold">
            <p>{text}</p>
            <div className="flex flex-row gap-2">
                <div className="w-8 h-8 rounded-full bg-accent animate-bounce"></div>
                <div className="w-8 h-8 rounded-full bg-accent animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-8 h-8 rounded-full bg-accent  animate-bounce [animation-delay:-.5s]"></div>
                <div className="w-8 h-8 rounded-full bg-accent animate-bounce"></div>
                <div className="w-8 h-8 rounded-full bg-accent animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-8 h-8 rounded-full bg-accent animate-bounce [animation-delay:-.5s]"></div>
            </div>
        </div>
    )
}