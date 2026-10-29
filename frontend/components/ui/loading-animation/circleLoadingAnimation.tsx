

type Props = {
    loading?:boolean
}


export default function CircleLoadingAnimation({loading}:Props ) {

    if (loading) return 

    return (
        <div className="flex-col gap-4 w-full flex items-center justify-center">
            <div
                className="w-20 h-20 border-4 border-transparent text-primaryOne text-4xl animate-spin flex items-center justify-center border-t-primaryOne rounded-full"
            >
                <div
                className="w-16 h-16 border-4 border-transparent text-secondary text-2xl animate-spin flex items-center justify-center border-t-secondary rounded-full"
                ></div>
            </div>
        </div>

    )
}