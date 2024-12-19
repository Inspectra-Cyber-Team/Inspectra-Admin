import { toast } from "@/components/hooks/use-toast";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  minutes: number;
}

export default function CountdownTimer({ minutes }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(minutes * 60); // Convert minutes to seconds

  useEffect(() => {
    // Exit early if no time is remaining
    if (timeRemaining <= 0) return;

    // Set up the timer
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Clear the timer when it reaches 0
          onTimerEnd(); // Call the function when time is up
          return 0; // Ensure the state is set to 0
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clear the interval on component unmount or when timer ends
    return () => clearInterval(timer);
  }, [timeRemaining]);
  const onTimerEnd = () => {
    toast({
      description: "Time Limit Has Reach Please Resend",
      variant: "error",
    });
  };
  // Calculate minutes and seconds
  const minutesLeft = Math.floor(timeRemaining / 60);
  const secondsLeft = timeRemaining % 60;

  // Format the time as MM:SS
  const formattedTime = `${String(minutesLeft).padStart(2, "0")}:${String(
    secondsLeft
  ).padStart(2, "0")}`;

  return formattedTime;
}
