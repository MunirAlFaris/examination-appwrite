import * as React from 'react';
import { useState, useEffect } from 'react';
import { showToast } from '../../ui_helpers/utils';

enum TimerStateEnum {
  Running = 'Running',
  Halftime = 'Halftime',
  Ended = 'Ended',
}

export default function CountdownTimer(props: {
  durationInMinutes: number,
  handleUpdateShowSubmitBtn: () => void,
  handleSubmitExam: () => void,
  sumbitExam: boolean,
  showSubmitBtn: boolean,
}) {
  const [timeLeft, setTimeLeft] = useState<number>(props.durationInMinutes * 60);
  const [timerState, setTimerState] = useState<TimerStateEnum>(TimerStateEnum.Running);
  useEffect(() => {
    const updateTimerState = () => {
      setTimeLeft((prev) => {
        const newTimeLeft = prev - 1;
        if (newTimeLeft <= 0) {
          setTimerState(TimerStateEnum.Ended);
          return 0;
        } else if (newTimeLeft <= (props.durationInMinutes * 60) / 2) {
          setTimerState(TimerStateEnum.Halftime);
        }
        return newTimeLeft;
      });
    };
    let timer: NodeJS.Timeout | undefined;
    if (timeLeft > 0 && !props.sumbitExam) {
      timer = setInterval(updateTimerState, 1000);
    }
    return () => clearInterval(timer);
  }, [timeLeft, props.durationInMinutes]);
  const timeFormatter = (): string => {
    const hrs = Math.floor(timeLeft / 3600);
    const min = Math.floor((timeLeft % 3600) / 60);
    const sec = timeLeft % 60;
    const formattedHrs = hrs < 10 ? `0${hrs}` : `${hrs}`;
    const formattedMin = min < 10 ? `0${min}` : `${min}`;
    const formattedSec = sec < 10 ? `0${sec}` : `${sec}`;  
    return `${formattedHrs}:${formattedMin}:${formattedSec}`;
  };
  useEffect(() => {
    if(timerState === TimerStateEnum.Halftime && !props.showSubmitBtn) {
      props.handleUpdateShowSubmitBtn();
      showToast('info', 'لقد مضى نصف الوقت بإمكانك الآن إرسال النتيجة')
    }
    if(timerState === TimerStateEnum.Ended) {
      showToast('info', 'عذرا، لقد انتهى الوقت')
      props.handleSubmitExam();
    }
  }, [props.showSubmitBtn, timerState])
  return (
    <p className='exam-header-p'>الوقت المتبقي: <span style={{display: 'inline-block'}}>{timeFormatter()}</span></p>
  );
};