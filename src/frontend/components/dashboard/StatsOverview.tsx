import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, Trophy, Zap } from "lucide-react";

interface StatsOverviewProps {
  userId?: string;
}

const StatsOverview = ({ userId }: StatsOverviewProps) => {
  const { data: profile } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: habits } = useQuery({
    queryKey: ["habits", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: habitLogs } = useQuery({
    queryKey: ["habit-logs", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const { data: achievements } = useQuery({
    queryKey: ["user-achievements", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*")
        .eq("user_id", userId);
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const today = new Date().toISOString().split('T')[0];
  const completedToday = habitLogs?.filter(log => log.completed_at === today).length || 0;
  const totalCompletions = habitLogs?.length || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hero Level</CardTitle>
          <Zap className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.hero_level || 1}</div>
          <p className="text-xs text-muted-foreground">
            Keep building habits to level up!
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          <Target className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{habits?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            Active habits to track
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          <TrendingUp className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedToday}</div>
          <p className="text-xs text-muted-foreground">
            Total: {totalCompletions} completions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Achievements</CardTitle>
          <Trophy className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{achievements?.length || 0}</div>
          <p className="text-xs text-muted-foreground">
            Unlocked rewards
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsOverview;
