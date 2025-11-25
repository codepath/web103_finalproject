import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Loader2 } from "lucide-react";

interface StreakRecoveryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habitName: string;
  recoveryPlan: string;
  isLoading: boolean;
}

export const StreakRecoveryModal = ({
  open,
  onOpenChange,
  habitName,
  recoveryPlan,
  isLoading,
}: StreakRecoveryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <HeartHandshake className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Don't worry — here's how to get back on track
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground text-center">
            You broke your streak for <span className="font-semibold text-foreground">{habitName}</span>, 
            but that's okay! Here's your personalized recovery plan:
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground">
                {recoveryPlan}
              </div>
            </div>
          )}
          
          <Button 
            onClick={() => onOpenChange(false)} 
            className="w-full"
            disabled={isLoading}
          >
            Let's Do This!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
