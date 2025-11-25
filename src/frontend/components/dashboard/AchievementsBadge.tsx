import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AchievementBadgesProps {
  userId?: string;
}

const AchievementBadges = ({ userId }: AchievementBadgesProps) => {
  const { data: userAchievements } = useQuery({
    queryKey: ["user-achievements-full", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievements (*)
        `)
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (!userAchievements || userAchievements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
        <CardDescription>Your earned rewards and milestones</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {userAchievements.map((ua: any) => (
            <Badge
              key={ua.id}
              variant="secondary"
              className="text-base px-4 py-2 bg-gradient-hero text-white hover:shadow-glow transition-all"
            >
              <span className="mr-2">{ua.achievements.icon}</span>
              {ua.achievements.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementBadges;
