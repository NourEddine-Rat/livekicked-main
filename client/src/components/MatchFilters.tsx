import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Play } from "lucide-react";
import { format, addDays, subDays } from "date-fns";

interface MatchFiltersProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  showLiveOnly: boolean;
  onToggleLiveOnly: (showLive: boolean) => void;
  liveMatchCount?: number;
}

export default function MatchFilters({
  selectedDate,
  onDateChange,
  showLiveOnly,
  onToggleLiveOnly,
  liveMatchCount = 0
}: MatchFiltersProps) {
  const today = new Date();
  const yesterday = subDays(today, 1);
  const tomorrow = addDays(today, 1);

  const isToday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  };

  const isYesterday = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd');
  };

  const isTomorrow = (date: Date) => {
    return format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd');
  };

  const getDateDisplayText = () => {
    if (isToday(selectedDate)) return "Today";
    if (isYesterday(selectedDate)) return "Yesterday";
    if (isTomorrow(selectedDate)) return "Tomorrow";
    return format(selectedDate, "MMM dd");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Football Matches</h1>
        <div className="flex items-center gap-2">
          <Button
            variant={showLiveOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => onToggleLiveOnly(!showLiveOnly)}
            className="gap-2"
            data-testid="button-live-filter"
          >
            <Play className="w-4 h-4" />
            Live
            {liveMatchCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {liveMatchCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(subDays(selectedDate, 1))}
            data-testid="button-previous-day"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1 px-4 py-2 rounded-md bg-card border">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-semibold text-sm min-w-0">
              {getDateDisplayText()}
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {format(selectedDate, "yyyy")}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onDateChange(addDays(selectedDate, 1))}
            data-testid="button-next-day"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={isYesterday(selectedDate) ? "default" : "ghost"}
            size="sm"
            onClick={() => onDateChange(yesterday)}
            data-testid="button-yesterday"
          >
            Yesterday
          </Button>
          <Button
            variant={isToday(selectedDate) ? "default" : "ghost"}
            size="sm"
            onClick={() => onDateChange(today)}
            data-testid="button-today"
          >
            Today
          </Button>
          <Button
            variant={isTomorrow(selectedDate) ? "default" : "ghost"}
            size="sm"
            onClick={() => onDateChange(tomorrow)}
            data-testid="button-tomorrow"
          >
            Tomorrow
          </Button>
        </div>
      </div>
    </div>
  );
}