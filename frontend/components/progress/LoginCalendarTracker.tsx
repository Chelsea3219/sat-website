import styles from '@/css/calendar.module.css';

type CalendarProps = {
    loggedDays?: string[] // Expected format: ['YYYY-MM-DD', ...]
}

export default function LoginCalendarTracker({loggedDays}: CalendarProps) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); 

    // Retrieves information about the current date and month
    // const monthName = now.toLocaleString('default', { month: 'long' });
    const totalDays = new Date(year, month+1, 0).getDate();
    const startDayOfWeek = new Date (year, month, 1).getDay(); 
    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

      // Helper to check if a day was a logged-in day
    const isLogged = (dayNum: number) => {
        // Format to YYYY-MM-DD matching backend format strings
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
        return (loggedDays ?? []).includes(dateString);
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className='flex h-full w-full flex-col justify-center'>
            <div className='w-full'>
                {/* Calendar Header 
                    <h2 className="text-xl font-bold text-gray-800 mb-4">{monthName} {year}</h2>
                */}

                {/* Days of the Week Headers */}
                <div className="grid grid-cols-7 gap-1 w-full text-center text-xs font-semibold text-gray-400 uppercase ">
                    {weekDays.map(day => <div key={day}>{day}</div>)}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-px gap-x-0.5 w-full justify-items-center">
                    {/* Empty cells for padding before the 1st of the month */}
                    {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                    ))}

                    {/* Dynamic Days */}
                    {daysArray.map(day => {
                    const logged = isLogged(day);
                    return (
                        <div
                        key={day}
                        className={`${styles.calendarDay} ${logged ? styles.loggedDay : styles.emptyDay}`}
                        >
                        {day}
                        </div>
                    );
                    })}
                </div>
            </div>
        </div>
    )
}

