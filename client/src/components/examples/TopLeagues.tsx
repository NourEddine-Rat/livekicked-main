import TopLeagues from '../TopLeagues';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function TopLeaguesExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-80 p-4 bg-background">
        <TopLeagues />
      </div>
    </QueryClientProvider>
  );
}