import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, Heart } from "lucide-react";

interface DailyReflectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DailyReflectionDialog = ({ open, onOpenChange }: DailyReflectionDialogProps) => {
  const [feeling, setFeeling] = useState("");
  const [challenges, setChallenges] = useState("");
  const [wins, setWins] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const { toast } = useToast();

  const loadInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-mood-trends');
      
      if (error) throw error;
      
      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    if (open) {
      loadInsights();
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!feeling.trim()) {
      toast({
        title: "Required field",
        description: "Please share how you're feeling today",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('reflections')
        .upsert({
          user_id: user.id,
          feeling: feeling.trim(),
          challenges: challenges.trim() || null,
          wins: wins.trim() || null,
          reflection_date: new Date().toISOString().split('T')[0],
        }, {
          onConflict: 'user_id,reflection_date'
        });

      if (error) throw error;

      toast({
        title: "Reflection saved",
        description: "Your daily reflection has been recorded",
      });

      // Mark as completed for today
      localStorage.setItem('lastReflectionDate', new Date().toISOString().split('T')[0]);
      
      onOpenChange(false);
      setFeeling("");
      setChallenges("");
      setWins("");
    } catch (error) {
      console.error('Error saving reflection:', error);
      toast({
        title: "Error",
        description: "Failed to save reflection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="w-6 h-6 text-primary" />
            Daily Reflection
          </DialogTitle>
          <DialogDescription>
            Take a moment to reflect on your day. Your thoughts help build self-awareness and track your journey.
          </DialogDescription>
        </DialogHeader>

        {insights && (
          <div className="bg-gradient-card rounded-lg p-4 mb-4 border border-primary/20">
            <div className="flex items-start gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm mb-1">Your Mood Insights</h3>
                <p className="text-sm text-muted-foreground">{insights}</p>
              </div>
            </div>
          </div>
        )}

        {isLoadingInsights && !insights && (
          <div className="bg-muted/50 rounded-lg p-4 mb-4 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Analyzing your patterns...</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="feeling" className="text-base">
              How are you feeling today? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="feeling"
              placeholder="Describe your mood and emotional state..."
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="challenges" className="text-base">
              What was challenging today?
            </Label>
            <Textarea
              id="challenges"
              placeholder="What obstacles or difficulties did you face?"
              value={challenges}
              onChange={(e) => setChallenges(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="wins" className="text-base">
              What went well today?
            </Label>
            <Textarea
              id="wins"
              placeholder="Celebrate your wins, big or small..."
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !feeling.trim()}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Reflection'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Skip Today
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
