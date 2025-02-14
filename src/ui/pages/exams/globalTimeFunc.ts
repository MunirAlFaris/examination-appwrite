import { useState, useEffect } from "react";
import { ExamStateEnum } from "../../../../universal/enums";

export function useExamTimer(
  examPublicationDate: string,
  examStartDate: string,
  examEndDate: string
) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [examState, setExamState] = useState<ExamStateEnum>(ExamStateEnum.ExamIsWaiting);
  const [play, setPlay] = useState<boolean>(true);

  // Helper function to calculate time difference in seconds
  const calculateTimeLeft = (now: Date, targetDate: string): number => {
    const target = new Date(targetDate).getTime();
    return Math.floor((target - now.getTime()) / 1000);
  };

  useEffect(() => {
    const updateExamStateAndTimeLeft = () => {
      const localNow = new Date();

      if (localNow < new Date(examPublicationDate)) {
        setExamState(ExamStateEnum.ExamIsWaiting);
        setTimeLeft(calculateTimeLeft(localNow, examPublicationDate));
      } else if (localNow >= new Date(examPublicationDate) && localNow < new Date(examStartDate)) {
        setExamState(ExamStateEnum.ExamIsStarted);
        setTimeLeft(calculateTimeLeft(localNow, examStartDate));
      } else if (localNow >= new Date(examStartDate) && localNow < new Date(examEndDate)) {
        setExamState(ExamStateEnum.ExamIsWaitingForResult);
        setTimeLeft(calculateTimeLeft(localNow, examEndDate));
      } else if (localNow >= new Date(examEndDate)) {
        setExamState(ExamStateEnum.ExamIsEnded);
        setTimeLeft(0);
      }
    };

    updateExamStateAndTimeLeft();

    let timer: NodeJS.Timeout | undefined;
    if (play) {
      timer = setInterval(updateExamStateAndTimeLeft, 1000);
    }

    return () => clearInterval(timer);
  }, [examPublicationDate, examStartDate, examEndDate, play]);

  const timeFormatter = (): string => {
    if (timeLeft === null) return '00:00:00';

    let hrs = Math.floor(timeLeft / 3600);
    let min = Math.floor((timeLeft % 3600) / 60);
    let sec = timeLeft % 60;

    const formattedHrs = hrs < 10 ? `0${hrs}` : hrs;
    const formattedMin = min < 10 ? `0${min}` : min;
    const formattedSec = sec < 10 ? `0${sec}` : sec;

    return `${formattedHrs}:${formattedMin}:${formattedSec}`;
  };

  const togglePlay = () => {
    setPlay(!play);
  };

  return { timeLeft, examState, timeFormatter, togglePlay };
}




// const fetchIstanbulTime = async () => {
//   const API_KEY = 'cd07c6298b03421eba2efa2407ba7c0f&tz';
//   try {
//     const response = await fetch(`https://api.ipgeolocation.io/timezone?apiKey=${API_KEY}=Europe/Istanbul`);
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     const data = await response.json();
//     return new Date(data.date_time); // Return Date object for Istanbul time
//   } catch (error) {
//     console.error("Error fetching Istanbul time:", error);
//     return null; // Return null to indicate failure
//   }
// };

// export function useExamTimer(
//   examPublicationDate: string,
//   examStartDate: string,
//   examEndDate: string
// ) {
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [examState, setExamState] = useState<ExamStateEnum>(ExamStateEnum.ExamIsWaiting);
//   const [play, setPlay] = useState<boolean>(true);

//   // Helper function to calculate time difference in seconds
//   const calculateTimeLeft = (now: Date, targetDate: string): number => {
//     const target = new Date(targetDate).getTime();
//     return Math.floor((target - now.getTime()) / 1000);
//   };

//   // Fetch the current Istanbul time using the previously defined function
//   const fetchIstanbulTime = async () => {
//     try {
//       const response = await fetch('https://api.ipgeolocation.io/timezone?apiKey=cd07c6298b03421eba2efa2407ba7c0f&tz=Europe/Istanbul');
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       return new Date(data.date_time); // Return Date object for Istanbul time
//     } catch (error) {
//       console.error("Error fetching Istanbul time:", error);
//       return null; // Return null to indicate failure
//     }
//   };

//   // Fetch and update the exam state and timer every second
//   useEffect(() => {
//     const updateExamStateAndTimeLeft = async () => {
//       const localNow = await fetchIstanbulTime();
//       if (!localNow) return; // If the time couldn't be fetched, do nothing

//       // Update the exam state and time left based on the current time
//       if (localNow < new Date(examPublicationDate)) {
//         setExamState(ExamStateEnum.ExamIsWaiting);
//         setTimeLeft(calculateTimeLeft(localNow, examPublicationDate));
//       } else if (localNow >= new Date(examPublicationDate) && localNow < new Date(examStartDate)) {
//         setExamState(ExamStateEnum.ExamIsStarted);
//         setTimeLeft(calculateTimeLeft(localNow, examStartDate));
//       } else if (localNow >= new Date(examStartDate) && localNow < new Date(examEndDate)) {
//         setExamState(ExamStateEnum.ExamIsWaitingForResult);
//         setTimeLeft(calculateTimeLeft(localNow, examEndDate));
//       } else if (localNow >= new Date(examEndDate)) {
//         setExamState(ExamStateEnum.ExamIsEnded);
//         setTimeLeft(0);
//       }
//     };

//     updateExamStateAndTimeLeft();

//     // Start updating the timer every second
//     const timer = setInterval(updateExamStateAndTimeLeft, 1000);

//     return () => clearInterval(timer); // Cleanup interval on component unmount
//   }, [examPublicationDate, examStartDate, examEndDate, play]);

//   const timeFormatter = (): string => {
//     if (timeLeft === null) return '00:00:00';

//     let hrs = Math.floor(timeLeft / 3600);
//     let min = Math.floor((timeLeft % 3600) / 60);
//     let sec = timeLeft % 60;

//     const formattedHrs = hrs < 10 ? `0${hrs}` : hrs;
//     const formattedMin = min < 10 ? `0${min}` : min;
//     const formattedSec = sec < 10 ? `0${sec}` : sec;

//     return `${formattedHrs}:${formattedMin}:${formattedSec}`;
//   };

//   const togglePlay = () => {
//     setPlay(!play);
//   };

//   return { timeLeft, examState, timeFormatter, togglePlay };
// }
