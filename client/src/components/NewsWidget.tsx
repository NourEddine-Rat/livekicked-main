import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

interface NewsItem {
  id: string;
  imageUrl: string;
  title: string;
  gmtTime: string;
  sourceStr: string;
  sourceIconUrl: string;
  page: {
    url: string;
  };
  lead?: string;
}

export default function NewsWidget() {
  const { data: newsData, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['/api/news']
  });

  if (isLoading) {
    return (
      <Card className="p-3">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Latest News</h3>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-20 bg-muted rounded" />
              <div className="space-y-1">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-3">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-foreground">Latest News</h3>
          <p className="text-xs text-muted-foreground">Failed to load news: {error.message}</p>
        </div>
      </Card>
    );
  }

  const news = newsData?.slice(0, 4) || [];

  if (!news || news.length === 0) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Latest News</h3>
          <p className="text-sm text-muted-foreground">No news available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Latest News</h3>
        <div className="space-y-4">
          {news.map((item, index) => (
            <div key={item.id} className="space-y-2">
              <div className="relative group cursor-pointer">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                  {item.title}
                </h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-4 h-4 rounded-none">
                      <AvatarImage src={item.sourceIconUrl} alt={item.sourceStr} />
                      <AvatarFallback className="text-[8px]">
                        {item.sourceStr.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{item.sourceStr}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {formatDistanceToNow(new Date(item.gmtTime), { addSuffix: true })}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
