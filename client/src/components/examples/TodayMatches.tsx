import TodayMatches from '../TodayMatches';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function TodayMatchesExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="p-4 bg-background">
        <TodayMatches />
      </div>
    </QueryClientProvider>
  );
}