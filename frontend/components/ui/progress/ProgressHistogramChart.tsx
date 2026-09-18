import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

type Props = {
    trendData: {
        readingScore: number 
        mathScore: number
        date: string
    }[]
}
export default function ProgressHistogramChart({ trendData }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart | null>(null)  // store chart instance

    useEffect(() => {
        if (!canvasRef.current) return

        // Destroy previous instance before creating a new one
        if (chartRef.current) {
            chartRef.current.destroy()
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: "line",
            data: {
                labels: trendData.map(d => d.date),
                datasets: [
                    {
                        label: "Reading",
                        data: trendData.map(d => d.readingScore),
                        borderColor: "#F7C76A",
                        backgroundColor: "#F7C76A",
                        pointBackgroundColor: "#F7C76A",
                        pointHoverBackgroundColor: "#F59E0B",
                        tension: 0.3,       // smooths the line curve; use 0 for straight segments
                        fill: false,        // set true if you want a filled area under the line
                        pointRadius: 8,
                        borderWidth: 10,
                    },
                    {
                        label: "Math",
                        data: trendData.map(d => d.mathScore),
                        borderColor: "#A5ABFA",
                        backgroundColor: "#A5ABFA",
                        pointBackgroundColor: "#A5ABFA",
                        pointHoverBackgroundColor: "#6366F1",
                        tension: 0.3,
                        fill: false,
                        pointRadius: 8,
                        borderWidth: 10,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true, 
                            text: "Date", 
                            color: "#1B1F38",
                            font: {
                                size: 14,
                                weight: "bold"
                            }
                        }, 
                        ticks: {
                            color: "#374151",
                            maxRotation: 45,
                            minRotation:45
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            color: "#374151",
                            callback: (value) => `${value}%`
                        }, 
                        title: {
                            display: true, 
                            text: "Mastery (%)", 
                            color: "#1B1F38",
                            font: {
                                size: 14,
                                weight: "bold"
                            }
                        }
                    }
                }
            },
        })

        // Cleanup — destroy chart when component unmounts or effect re-runs
        return () => {
            chartRef.current?.destroy()
            chartRef.current = null
        }
    }, [trendData])

    return (
        <div className="relative h-full w-full">
            <canvas ref={canvasRef} />

            <div className="absolute top-2 right-4 flex gap-3">
                <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded-full bg-[#F7C76A]" />
                    <span className="text-lg text-slate-600">Reading</span>
                </div>

                <div className="flex items-center gap-1">
                    <div className="h-4 w-4 rounded-full bg-[#A5ABFA]" />
                    <span className="text-lg text-slate-600">Math</span>
                </div>
            </div>
        </div>
    )
}