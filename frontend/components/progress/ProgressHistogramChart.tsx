import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"

type Props = {
    trendData: {
        readingScore: number 
        mathScore: number
        date: string
    }[] | undefined
}



export default function ProgressHistogramChart({ trendData }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<Chart | null>(null)  // store chart instance

    useEffect(() => {
        if (!trendData) return 
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
                        pointRadius: 2,
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
                        pointRadius: 2,
                        borderWidth: 10,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: {
                        display: true,
                        position: "top",       // renders right below the title, above the chart area
                        labels: {
                            boxWidth: 12,        // smaller color swatch
                            font: { size: 12, weight:"bold" }   // smaller label text
                        }
                    },
                    title: {
                        display: true,
                        text: "PERFORMANCE TRENDS", 
                        color: "#8C59C0",
                        font: {
                            size:30, 
                            weight: "bold"
                        }, 
                        padding: {
                            bottom:4
                        }
                    },
                },
                scales: {
                    x: {
                        offset: true,
                        ticks: {
                            color: "#374151",
                            labelOffset: 0,
                            font: {
                                size: 14,
                                weight: "bold"
                            }
                        }
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            color: "#374151",
                            callback: (value) => `${value}%`,
                            font: {
                                size: 15,
                                weight: "bold"
                            }
                        }, 
                        title: {
                            display: true, 
                            text: "MASTERY SCORE (%)", 
                            color: "#1B1F38",
                            font: {
                                size: 20,
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
    </div>
)}