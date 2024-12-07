import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertToDayMonthYear(timestamp: string) {
  // Parse the timestamp into a Date object
  const date = new Date(timestamp);

  // Extract the day, month, and year
  const day = date.getDate().toString().padStart(2, '0'); // Ensure two digits
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  // Format as day-month-year
  return `${day}-${month}-${year}`;
}



// count down verify otp 
export function startCountdown(minutes: number) {
  let timeRemaining = minutes * 60; // Convert minutes to seconds
  const timerInterval = setInterval(() => {
      const minutesLeft = Math.floor(timeRemaining / 60);
      const secondsLeft = timeRemaining % 60;

      // Format the time as MM:SS
      const formattedTime = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
      console.log(formattedTime); // Display the countdown in the console

      if (timeRemaining <= 0) {
          clearInterval(timerInterval); // Stop the timer
          console.log("Countdown complete!");
      }

      timeRemaining--; // Decrease the time remaining by 1 second
  }, 1000);
}

