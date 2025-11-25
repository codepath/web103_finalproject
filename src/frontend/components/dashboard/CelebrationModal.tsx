import { useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Flame, Trophy, Star } from "lucide-react";

interface CelebrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  milestone: number;
  habitName: string;
}

const getMilestoneData = (milestone: number) => {
  switch (milestone) {
    case 7:
      return {
        icon: Flame,
        title: "🔥 7 Day Streak!",
        message: "You're on fire! Keep the momentum going!",
        color: "text-orange-500",
      };
    case 30:
      return {
        icon: Trophy,
        title: "🏆 30 Day Streak!",
        message: "Incredible dedication! You're building lasting habits!",
        color: "text-yellow-500",
      };
    case 100:
      return {
        icon: Star,
        title: "⭐ 100 Day Streak!",
        message: "Legendary achievement! You're a habit master!",
        color: "text-purple-500",
      };
    default:
      return {
        icon: Flame,
        title: `🎉 ${milestone} Day Streak!`,
        message: "Amazing work! Keep going strong!",
        color: "text-primary",
      };
  }
};

const CelebrationModal = ({ open, onOpenChange, milestone, habitName }: CelebrationModalProps) => {
  const milestoneData = getMilestoneData(milestone);
  const Icon = milestoneData.icon;

  useEffect(() => {
    if (open) {
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className={`rounded-full bg-background p-4 ${milestoneData.color}`}>
              <Icon className="h-12 w-12" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">{milestoneData.title}</DialogTitle>
          <DialogDescription className="text-center text-lg pt-2">
            <span className="font-semibold text-foreground">{habitName}</span>
            <br />
            {milestoneData.message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center pt-4">
          <Button onClick={() => onOpenChange(false)} size="lg">
            Keep Going! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CelebrationModal;
