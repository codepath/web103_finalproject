import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";

const MOTIVATIONAL_QUOTES = [
  {
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown"
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery"
  },
  {
    text: "Little things make big days.",
    author: "Unknown"
  },
  {
    text: "It's going to be hard, but hard does not mean impossible.",
    author: "Unknown"
  },
  {
    text: "Don't wait for opportunity. Create it.",
    author: "Unknown"
  }
];

const MotivationalQuote = () => {
  const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set random quote on mount
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    setQuote(MOTIVATIONAL_QUOTES[randomIndex]);

    // Change quote every 30 seconds with fade animation
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        const newRandomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
        setQuote(MOTIVATIONAL_QUOTES[newRandomIndex]);
        setIsVisible(true);
      }, 300);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className={`p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 transition-opacity duration-300 ${
      isVisible ? "opacity-100" : "opacity-0"
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Quote className="w-8 h-8 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-lg font-medium text-foreground leading-relaxed">
            "{quote.text}"
          </p>
          <p className="text-sm text-muted-foreground">
            — {quote.author}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default MotivationalQuote;
