import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddHabitDialog from "./AddHabitDialog";
import HabitCard from "./HabitCard";
import CelebrationModal from "./CelebrationModal";
import { StreakRecoveryModal } from "./StreakRecoveryModal";

interface HabitListProps {
  userId?: string;
}

const HabitList = ({ userId }: HabitListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [celebrationModal, setCelebrationModal] = useState<{
    open: boolean;
    milestone: number;
    habitName: string;
  }>({ open: false, milestone: 0, habitName: "" });
  const [recoveryModal, setRecoveryModal] = useState<{
    open: boolean;
    habitName: string;
    recoveryPlan: string;
    isLoading: boolean;
  }>({ open: false, habitName: "", recoveryPlan: "", isLoading: false });

  const { data: habits, isLoading } = useQuery({
    queryKey: ["habits", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
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

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, isCompleted }: { habitId: string; isCompleted: boolean }) => {
      if (!userId) throw new Error("User not authenticated");
      
      const today = new Date().toISOString().split('T')[0];
      
      // Get habit data before making changes
      const { data: habitBeforeUpdate } = await supabase
        .from("habits")
        .select("current_streak, name, category")
        .eq("id", habitId)
        .single();
      
      const previousStreak = habitBeforeUpdate?.current_streak || 0;
      
      if (isCompleted) {
        // Delete the log entry (unchecking)
        const { error } = await supabase
          .from("habit_logs")
          .delete()
          .eq("habit_id", habitId)
          .eq("completed_at", today);
        
        if (error) throw error;
      } else {
        // Create a log entry (checking)
        const { error } = await supabase
          .from("habit_logs")
          .insert({
            habit_id: habitId,
            user_id: userId,
            completed_at: today,
          });
        
        if (error) throw error;
      }

      // Update habit streaks
      const { error: streakError } = await supabase.rpc('update_habit_streaks', {
        p_habit_id: habitId,
        p_user_id: userId
      });
      
      if (streakError) throw streakError;

      // Get updated habit to check for milestones
      const { data: updatedHabit } = await supabase
        .from("habits")
        .select("*")
        .eq("id", habitId)
        .single();

      const newStreak = updatedHabit?.current_streak || 0;

      // Detect streak break (was positive, now 0, and user unchecked)
      if (isCompleted && previousStreak > 0 && newStreak === 0 && habitBeforeUpdate) {
        setRecoveryModal({
          open: true,
          habitName: habitBeforeUpdate.name,
          recoveryPlan: "",
          isLoading: true,
        });

        // Generate recovery plan asynchronously
        supabase.functions.invoke('generate-recovery-plan', {
          body: {
            habitName: habitBeforeUpdate.name,
            habitCategory: habitBeforeUpdate.category,
            previousStreak: previousStreak,
          }
        }).then(({ data, error }) => {
          if (error) {
            console.error('Error generating recovery plan:', error);
            setRecoveryModal(prev => ({
              ...prev,
              recoveryPlan: "1. Start fresh today - don't wait until tomorrow\n2. Set a reminder to help you remember\n3. Focus on just doing it once, then build from there",
              isLoading: false,
            }));
          } else {
            setRecoveryModal(prev => ({
              ...prev,
              recoveryPlan: data.recoveryPlan,
              isLoading: false,
            }));
          }
        });
      }

      return { updatedHabit, isCompleted };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["habit-logs", userId] });
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
      
      // Check for milestone achievements (only when completing, not uncompleting)
      if (data && !data.isCompleted && data.updatedHabit) {
        const currentStreak = data.updatedHabit.current_streak || 0;
        const milestones = [7, 30, 100];
        
        if (milestones.includes(currentStreak)) {
          setCelebrationModal({
            open: true,
            milestone: currentStreak,
            habitName: data.updatedHabit.name,
          });
        }
      }
      
      toast({
        title: "Success! 🎉",
        description: "Habit updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const isHabitCompletedToday = (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return habitLogs?.some(
      (log) => log.habit_id === habitId && log.completed_at === today
    ) || false;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Loading habits...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Habits</CardTitle>
              <CardDescription>Track your daily habits and build streaks</CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {habits && habits.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  isCompleted={isHabitCompletedToday(habit.id)}
                  onToggle={() => toggleHabitMutation.mutate({
                    habitId: habit.id,
                    isCompleted: isHabitCompletedToday(habit.id),
                  })}
                  userId={userId}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No habits yet. Start building your hero!</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Habit
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddHabitDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        userId={userId}
      />

      <CelebrationModal
        open={celebrationModal.open}
        onOpenChange={(open) => setCelebrationModal({ ...celebrationModal, open })}
        milestone={celebrationModal.milestone}
        habitName={celebrationModal.habitName}
      />

      <StreakRecoveryModal
        open={recoveryModal.open}
        onOpenChange={(open) => setRecoveryModal({ ...recoveryModal, open })}
        habitName={recoveryModal.habitName}
        recoveryPlan={recoveryModal.recoveryPlan}
        isLoading={recoveryModal.isLoading}
      />
    </div>
  );
};

export default HabitList;
