import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Edit, Trash2, Flame, Target } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import EditHabitDialog from "./EditHabitDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface HabitCardProps {
  habit: any;
  isCompleted: boolean;
  onToggle: () => void;
  userId?: string;
}

const MILESTONES = [7, 30, 100];

const getMilestoneProgress = (currentStreak: number) => {
  const nextMilestone = MILESTONES.find(m => m > currentStreak);
  
  if (!nextMilestone) {
    // Already past all milestones
    return {
      nextMilestone: 100,
      progress: 100,
      previousMilestone: 100,
      label: "Milestone Master!"
    };
  }
  
  const previousMilestone = MILESTONES.filter(m => m < nextMilestone).pop() || 0;
  const range = nextMilestone - previousMilestone;
  const progressInRange = currentStreak - previousMilestone;
  const progress = (progressInRange / range) * 100;
  
  return {
    nextMilestone,
    progress: Math.max(0, Math.min(100, progress)),
    previousMilestone,
    label: `${currentStreak}/${nextMilestone} days to next milestone`
  };
};

const HabitCard = ({ habit, isCompleted, onToggle, userId }: HabitCardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const currentStreak = habit.current_streak || 0;
  const milestoneInfo = getMilestoneProgress(currentStreak);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("habits")
        .delete()
        .eq("id", habit.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
      toast({
        title: "Habit deleted",
        description: "The habit has been removed.",
      });
      setIsDeleteOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return (
    <>
      <Card className={cn(
        "relative overflow-hidden transition-all hover:shadow-card-hover",
        isCompleted && "border-success"
      )}>
        {isCompleted && (
          <div className="absolute inset-0 bg-gradient-success opacity-10" />
        )}
        
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">{habit.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{habit.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{habit.category}</p>
              </div>
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsEditOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {habit.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {habit.description}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Flame className="w-4 h-4 text-hero" />
              <span className="font-semibold text-hero">{habit.current_streak || 0}</span>
              <span className="text-muted-foreground">day streak</span>
            </div>
            {habit.best_streak > 0 && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <span>Best:</span>
                <span className="font-semibold">{habit.best_streak}</span>
              </div>
            )}
          </div>

          {currentStreak < 100 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="w-3 h-3" />
                  <span>{milestoneInfo.label}</span>
                </div>
                <span className="text-muted-foreground font-medium">
                  {Math.round(milestoneInfo.progress)}%
                </span>
              </div>
              <Progress value={milestoneInfo.progress} className="h-2" />
            </div>
          )}

          <Button
            onClick={onToggle}
            className={cn(
              "w-full",
              isCompleted && "bg-success hover:bg-success/90"
            )}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Completed Today
              </>
            ) : (
              "Mark Complete"
            )}
          </Button>
        </div>
      </Card>

      <EditHabitDialog
        habit={habit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        userId={userId}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{habit.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HabitCard;
