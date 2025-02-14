import type { IRecusiveExam } from "../../universal/model";
import type { RefObject } from "react";
import { ChatTypeEnum, ExamStateEnum, ExamTypeEnum, UserRole } from "../../universal/enums";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function processOnExamStudentAnswers(
  selector: string,
  exam: IRecusiveExam,
  handleSetResult: (result: number) => void,
) {
  const inputs = Array.from(document.querySelectorAll(selector)) as HTMLInputElement[];
  const truesArr: string[] = [];
  const falseArr: string[] = [];
  const allTrues: string[] = [];
  inputs.filter(x => x.checked).forEach((ele) => {
    const trueAnswer = exam.questions.find(
      question => 
        question.correctAnswer.text === ele.value 
        && question.id === ele.name
      );
    if(trueAnswer)
      truesArr.push(ele.id)
    else
      falseArr.push(ele.id)
  });
  inputs.forEach(ele => {
    const trueAnwser = exam.questions.find(
      question => 
        question.correctAnswer.text === ele.value 
        && question.id === ele.name
      );
    if(trueAnwser) allTrues.push(ele.id);
  })
  const result = Math.floor((100 / exam.questions.length) * truesArr.length)
  if(exam.type === ExamTypeEnum.isExam) {
    // const collectedData: ISExam = {
    //   examTitle: exam.title,
    //   examSubject: exam.subject,
    //   teacherName: exam.teacherName,
    //   teacherId: exam.teacherId,
    //   examId: exam._id,
    //   result: result ? result : 0,
    //   type: exam.type,
    //   passedAt: new Date(),
    //   timers: {
    //     examTime: exam.timers.examTime,
    //     startDate: exam.timers.startDate,
    //     endDate: exam.timers.endDate,
    //     showResultDate: exam.timers.showResultDate,
    //   },
    //   inputsIDs: {
    //     truesAnswersInputs: truesArr,
    //     falseAnswersInputs: falseArr,
    //   }
    // }
    // Meteor.call(
    //   'addExamToUser',
    //   collectedData,
    //   (error: any) => 
    //     error ?
    //       console.log('faild to add exam')
    //       : console.log('exam added')
    // );
  } else if(exam.type === ExamTypeEnum.isTest) {
    handleSetResult(result)
    handleSetResult(result)
    allTrues.forEach((el) => {
      document.getElementById(el)?.parentElement?.parentElement?.classList.add('right');
    });
    truesArr.forEach((el) => {
      document.getElementById(el)?.parentElement?.parentElement?.classList.remove('right');
      document.getElementById(el)?.parentElement?.parentElement?.classList.add('true');
    });
    falseArr.forEach((el) => {
      document.getElementById(el)?.parentElement?.parentElement?.classList.add('false');
    });
  }
}

type ToastTypes = 'success' | 'info' | 'error'
export function showToast(toastType: ToastTypes, toastMassage: string) {
  toast[toastType](toastMassage, {
    position: "top-left",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'
  });
}

export function formatLikes(count: number) {
  if (count < 1000) {
      return count.toString();
  } else if (count < 1000000) {
      return (count / 1000).toFixed(count % 1000 === 0 ? 0 : 1) + "k";
  } else if (count < 1000000000) {
      return (count / 1000000).toFixed(count % 1000000 === 0 ? 0 : 1) + "M";
  } else {
      return (count / 1000000000).toFixed(count % 1000000000 === 0 ? 0 : 1) + "B";
  }
}

export function getUserImgSrc(userRole: string, userGender: string) {
  return userRole === UserRole.isAdmin ?
  '/images/admin.png'
  : userRole === UserRole.isTeacher ?
    userGender === 'male' ?
      '/images/male-teacher.png' : '/images/female-teacher.png'
  : userGender === 'male' ?
  '/images/male.png' : '/images/female.png'
}

export function formatDateByHourAndPeriod(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const isPM = hours >= 12;
  const period = isPM ? 'م' : 'ص';
  const formattedHours = isPM
    ? hours === 12
      ? 12
      : hours - 12
    : hours === 0
      ? 12
      : hours;
  const formattedMinutes = minutes.toString().padStart(2, '0');
  return {
    time: `${formattedHours}:${formattedMinutes}`,
    period: period,
  };
}

export function useOutsideClick(
  ref: RefObject<HTMLElement>,
  callback: () => void,
) {
  const handleClick = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}

export function hasPreviousOrNextEntries(
  currentEntriesIds: string[],
  entriesIds: string[],
  state: 'PREV' | 'NEXT',
) {
  const isThereEntries =
    entriesIds.length !== 0 && currentEntriesIds.length !== 0;
  const hasPreviousEntries = isThereEntries
    ? currentEntriesIds[0] !== entriesIds[0]
    : false;
  const hasNextEntries = isThereEntries
    ? currentEntriesIds[currentEntriesIds.length - 1] !==
      entriesIds[entriesIds.length - 1]
    : false;
  return state === 'PREV' ? hasPreviousEntries : hasNextEntries;
}

export function setElementRef(
  el: HTMLElement | null,
  refs: RefObject<{ [key: string]: HTMLElement | null }>,
  id: string,
) {
  if (refs && refs.current) refs.current[id] = el;
}

export function updateLastVisitLocalStorageDate(key: string, data: object) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const userColors: string[] = Array.from({ length: 1000 }, (_, index) => {
  const hue = (index * 137.508) % 360; // Use golden angle approximation for color spacing
  return `hsl(${hue}, 70%, 50%)`;
});

type UserColorMap = { [userId: string]: string };

export const assignUniqueColor = (
  colors: string[],
  assignedColors: Set<string>
): string => {
  for (const color of colors) {
    if (!assignedColors.has(color)) {
      assignedColors.add(color);
      return color;
    }
  }
  throw new Error('Not enough colors for all users!');
};


export const releaseColor = (
  userId: string, 
  userColorMap: UserColorMap, 
  assignedColors: Set<string>
): void => {
  const color = userColorMap[userId];
  if (color) {
    assignedColors.delete(color);
    delete userColorMap[userId];
  }
};

export function formatDateToArabic(date: Date): string {
  try {
      const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
      };

      // Format the date to Arabic locale
      return new Intl.DateTimeFormat('ar-EG', options).format(date);
  } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
  }
}

export function getExamType(examType: ExamTypeEnum) {
  return (
    examType === ExamTypeEnum.Unset ?
    'غير محدد' : examType === ExamTypeEnum.isExam ? 
    'إمتحان' : "مذاكرة"
  )
}

export function getChatPrivicyText(chatType: ChatTypeEnum) {
  return (
    chatType === ChatTypeEnum.private ?
    'خاصة' : chatType === ChatTypeEnum.public ?
    'عامة' : 'صف معين'
  )
}

export function getUserRoleText(role: string) {
  return (
    role === UserRole.isAdmin ? 'مدير' : 
    role === UserRole.isStudent ? 'طالب' :
    'أستاذ'
  )
}

export function getExamTypeText(examType: ExamTypeEnum) {
  return (
    examType === ExamTypeEnum.Unset ?
    'غير محدد' : examType === ExamTypeEnum.isExam ?
    'إمتحان' : 'مذاكرة'
  )
}

export function getExamStateText(state: ExamStateEnum) {
  return (
    state === ExamStateEnum.ExamIsEnded ?
    'انتهى' : state === ExamStateEnum.ExamIsStarted ?
    'بدأ' : state === ExamStateEnum.ExamIsWaiting ?
    'لم يبدأ بعد' : 'بانتظار توقيت عرض النتيجة'
  )
}

export const updateTheme = (isDarkMode: boolean) => {
  const htmlElement = document.getElementsByTagName('html')[0];
  const existingLink = document.getElementById('theme-style') as HTMLLinkElement;
  if (existingLink) {
    // Remove the existing theme stylesheet
    existingLink.parentNode?.removeChild(existingLink);
  }
  // Create a new link tag for the current theme
  const link = document.createElement('link');
  link.id = 'theme-style';
  link.rel = 'stylesheet';
  link.href = isDarkMode
    ? '/styles/github-markdown-dark.css'
    : '/styles/github-markdown-light.css';
  document.head.appendChild(link);
  // Update the Bootstrap theme attribute
  htmlElement.setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
  // Save theme preference to localStorage
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};

// export function usersFilter(users: IUser[], filter: UsersFilterEnum) {
//   if(users) {
//     switch(filter) {
//       case UsersFilterEnum.Admins:
//         return users.filter(x => x.profile.role === UserRole.isAdmin)
//       case UsersFilterEnum.Teachers:
//         return users.filter(x => x.profile.role === UserRole.isTeacher)
//       case UsersFilterEnum.Students:
//         return users.filter(x => x.profile.role === UserRole.isStudent)
//       case UsersFilterEnum.Gusts:
//         return users.filter(x => x.profile.isGuest)
//       case UsersFilterEnum.NotGusts:
//         return users.filter(x => !x.profile.isGuest)
//       case UsersFilterEnum.Male:
//         return users.filter(x => x.profile.gender === 'male')
//       case UsersFilterEnum.Female:
//         return users.filter(x => x.profile.gender === 'female')
//       default:
//         return users
//     }
//   } else {
//     return []
//   }
// }