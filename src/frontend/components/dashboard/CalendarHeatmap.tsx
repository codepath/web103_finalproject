import { useMemo } from "react";
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay, subMonths } from "date-fns";

interface HabitLog {
  completed_at: string;
  habit_id: string;
}

interface CalendarHeatmapProps {
  habitLogs: HabitLog[];
}

const CalendarHeatmap = ({ habitLogs }: CalendarHeatmapProps) => {
  const heatmapData = useMemo(() => {
    const today = new Date();
    const startDate = subMonths(today, 12);
    const days = eachDayOfInterval({ start: startDate, end: today });

    return days.map(day => {
      const completions = habitLogs.filter(log => 
        isSameDay(new Date(log.completed_at), day)
      ).length;

      return {
        date: day,
        completions,
      };
    });
  }, [habitLogs]);

  const getIntensity = (completions: number) => {
    if (completions === 0) return "bg-muted";
    if (completions === 1) return "bg-success/20";
    if (completions === 2) return "bg-success/40";
    if (completions === 3) return "bg-success/60";
    if (completions === 4) return "bg-success/80";
    return "bg-success";
  };

  const weeks: typeof heatmapData[] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const maxCompletions = Math.max(...heatmapData.map(d => d.completions));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{format(heatmapData[0].date, "MMM yyyy")}</span>
        <span>{format(heatmapData[heatmapData.length - 1].date, "MMM yyyy")}</span>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`w-3 h-3 rounded-sm ${getIntensity(day.completions)} transition-colors`}
                  title={`${format(day.date, "MMM dd, yyyy")}: ${day.completions} completion${day.completions !== 1 ? 's' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Less</span>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-muted" />
          <div className="w-3 h-3 rounded-sm bg-success/20" />
          <div className="w-3 h-3 rounded-sm bg-success/40" />
          <div className="w-3 h-3 rounded-sm bg-success/60" />
          <div className="w-3 h-3 rounded-sm bg-success/80" />
          <div className="w-3 h-3 rounded-sm bg-success" />
        </div>
        <span className="text-muted-foreground">More</span>
      </div>

      {maxCompletions > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          Most productive day: {maxCompletions} completion{maxCompletions !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default CalendarHeatmap;
