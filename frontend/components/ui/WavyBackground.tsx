

export default function WavyBackground() {

    return (
        <div className="absolute inset-0 z-0 overflow-hidden flex flex-col">

            {/* Decorative waves */}
            <svg
                className="absolute top-0 left-0 w-full h-50
                "
                viewBox="0 0 1440 250"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                {/* Back wave */}
                <path
                d="M0 100
                    C180 10 350 40 520 105
                    C700 170 850 15 1050 55
                    C1200 85 1320 25 1440 90
                    L1440 250
                    L0 250 Z"
                fill="#E8E6FF"
                />

                {/* Middle wave */}
                <path
                d="M0 140
                    C200 50 400 60 600 120
                    C800 180 900 20 1100 65
                    C1250 100 1350 55 1440 110
                    L1440 250
                    L0 250 Z"
                fill="#BDB8F7"
                />

                {/* Front wave */}
                <path
                d="M0 165
                    C250 105 400 90 650 125
                    C850 155 950 60 1150 75
                    C1300 85 1370 90 1440 125
                    L1440 250
                    L0 250 Z"
                fill="#8a7de8"
                />
            </svg>

            <div className="absolute top-48 left-0 right-0 bottom-18 bg-[#8a7de8]"/>

        </div>
    )
}