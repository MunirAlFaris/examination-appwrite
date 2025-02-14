import type { IRecusiveExam, IRecusiveMessage, ISExam, IUser, IGroupedMessagesByDate, IRecusivePost, IRecusiveChat } from "./model";

export function extractId(url: string) {
  const regex = /\/d\/([^\/]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function checkStudentHasPassedEx (userExams: ISExam[] | undefined, examId: string) {
  return userExams?.find(x => x.examId === examId) 
    ? true
    : false
}

export function formatDate(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function sortByCreation() {
  return ((a: IUser | IRecusiveExam | IRecusiveMessage | IRecusivePost | IRecusiveChat, b: IUser | IRecusiveExam | IRecusiveMessage | IRecusivePost | IRecusiveChat) => {
    const dateA = a.createdAt ? a.createdAt : null;
    const dateB = b.createdAt ? b.createdAt : null;
    if (dateA === null && dateB === null) return 0; // Both dates are missing
    if (dateA === null) return 1; // `a` has no date, place it after `b`
    if (dateB === null) return -1; // `b` has no date, place it after `a`
    return dateA > dateB ?
      -1 : dateA < dateB ?
      1 : 0// Compare timestamps if both are present
  });
}

export function sortByCreationReversed() {
  return ((a: IUser | IRecusiveExam | IRecusiveMessage, b: IUser | IRecusiveExam | IRecusiveMessage) => {
    const dateA = a.createdAt ? a.createdAt : null;
    const dateB = b.createdAt ? b.createdAt : null;
    if (dateA === null && dateB === null) return 0; // Both dates are missing
    if (dateA === null) return 1; // `a` has no date, place it after `b`
    if (dateB === null) return -1; // `b` has no date, place it after `a`
    return dateA > dateB ?
      1 : dateA < dateB ?
      -1 : 0// Compare timestamps if both are present
  });
}

export const groupMessagesByDate = (
  messages: IRecusiveMessage[],
): IGroupedMessagesByDate => {
  return messages.reduce((groups, entry) => {
    const dateKey = entry.createdAt.toISOString().split('T')[0];
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry._id);
    return groups;
  }, {} as IGroupedMessagesByDate);
};

export function getMessageDateKey(messageDate: Date) {
  return messageDate.toISOString().split('T')[0];
}

export const formatDateByDay = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const arabicFormatter = new Intl.DateTimeFormat('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  if (date >= today) {
    return 'اليوم'; // 'Today' in Arabic
  } else if (date >= yesterday && date < today) {
    return 'أمس'; // 'Yesterday' in Arabic
  } else if (date >= sevenDaysAgo && date < yesterday) {
    // Return weekday in Arabic
    return new Intl.DateTimeFormat('ar-EG', { weekday: 'long' }).format(date);
  } else {
    // Format full date in Arabic
    return arabicFormatter.format(date);
  }
};

export function groupEntriesToPages(
  entries: any[],
  itemsPerPage: number,
) {
  if (itemsPerPage <= 0) {
    throw new Error('Items per page must be greater than 0');
  }
  const pages: any[] = [];
  for (let i = 0; i < entries.length; i += itemsPerPage) {
    pages.push(entries.slice(i, i + itemsPerPage));
  }
  return pages;
}