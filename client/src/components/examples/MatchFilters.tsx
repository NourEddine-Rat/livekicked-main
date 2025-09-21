import { useState } from 'react';
import MatchFilters from '../MatchFilters';

export default function MatchFiltersExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLiveOnly, setShowLiveOnly] = useState(false);

  return (
    <div className="p-4 bg-background">
      <MatchFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        showLiveOnly={showLiveOnly}
        onToggleLiveOnly={setShowLiveOnly}
        liveMatchCount={3}
      />
    </div>
  );
}