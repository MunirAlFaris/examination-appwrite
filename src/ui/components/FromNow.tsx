import React, { useEffect, useState } from 'react';

interface IProps {
    lang: string;
    date: Date;
    intervalSeconds?: number;
}

/**
 * Component to display the time distance from a given date to the current time.
 * @param props lang: 'en' or 'ar', date: Date object, intervalSeconds (optional): interval in seconds for updating.
 * @returns JSX Element displaying time difference.
 */
export default function FromNow(props: IProps) {
    const [nowTime, setNowTime] = useState(Date.now());

    const getTimeDifference = (targetDate: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) {
            return `${diffInDays} ${props.lang === 'ar' ? 'يوم' : 'day'}${diffInDays > 1 && props.lang !== 'ar' ? 's' : ''}`;
        } else if (diffInHours > 0) {
            return `${diffInHours} ${props.lang === 'ar' ? 'ساعة' : 'hour'}${diffInHours > 1 && props.lang !== 'ar' ? 's' : ''}`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} ${props.lang === 'ar' ? 'دقيقة' : 'minute'}${diffInMinutes > 1 && props.lang !== 'ar' ? 's' : ''}`;
        } else {
            return `${diffInSeconds} ${props.lang === 'ar' ? 'ثانية' : 'second'}${diffInSeconds > 1 && props.lang !== 'ar' ? 's' : ''}`;
        }
    };

    useEffect(() => {
        const interval = setInterval(() => setNowTime(Date.now()), (props.intervalSeconds || 60) * 1000);
        return () => clearInterval(interval);
    }, [props.intervalSeconds]);

    return <span>{getTimeDifference(props.date)}</span>;
}
