import type { ExamTypeEnum, SettingsEnum } from './enums';
import { Models } from 'appwrite';

export interface IUser extends Models.User<Models.Preferences> {
  $id: string;
}

export interface IUserProfile {
  userId: string;
  isGuest: boolean;
  role: string;
  gender: 'male' | 'female';
  personalNumber: string;
  birthDay?: string;
  subjects?: string;
  classNames?: string;
  currentStudentClass?: string;
  exams?: string
}

export interface IRecusiveUserProfile extends Models.Document {
  $id: string;
}

export interface ISExam {
  examTitle: string,
  examSubject: string,
  teacherName: string,
  teacherId: string,
  examId: string,
  result: number,
  passedAt: Date,
  passedIn?: number,
  type: ExamTypeEnum,
  inputsIDs: {
    truesAnswersInputs: string[],
    falseAnswersInputs: string[],
  }
  timers: IExamTimers
}

export interface IExamTimers {
  examTime: number,
  startDate: string,
  endDate: string,
  showResultDate: string,
}

export interface IExam {
  title: string,
  createdAt: Date,
  subject: string,
  teacherId: string,
  className: string,
  type: ExamTypeEnum,
  hasTimer: boolean,
  isPublic: boolean,
  showResult: boolean,
  academicYear: string,
  examTime: number,
  startDate: string,
  endDate: string,
  showResultDate: string,
}

export interface IQuestion {
  id: string,
  title: string,
  examId: string,
  answers: IAnswer[],
  correctAnswerId: string,
}

export interface IAnswer {
  text: string,
  questionId: string,
  answerId: string
}

export interface IQTitle {
  text: string,
  imgSrc?: string,
}

export interface IRecusiveExam extends IExam {
  $id: string,
  $createdAt: Date,
}

export interface ExamStudentResult {
  studentName: string,
  result: number
}

export interface IMultiSelectOption {
  label: string,
  value: string,
}

export interface IPost {
  creatorName: string,
  createdBy: string,
  createdAt: Date,
  text: string,
  isPinned: boolean,
  likes: number,
  likedBy: string[],
  comments: IComment[]
}

export interface IComment {
  _id: string,
  creatorName: string,
  createdBy: string,
  createdAt: Date,
  text: string,
  likes: number,
  likedBy: string[],
}

export interface IRecusivePost extends IPost {
  _id: string,
}

export interface IPostOwnerUser {
  _id: string,
  profile: {
    gender: string,
    role: string,
  }
}

export interface IChat {
  name: string,
  description?: string,
  type: string,
  createdBy: string,
  creatorName: string,
  accessList?: string[],
  adminsList?: string[],
  allowMessages: boolean,
  imgSrc: string,
  createdAt: Date,
}

export interface IRecusiveChat extends IChat{
  _id: string,
}

export interface IMessage {
  chatId: string,
  text: string,
  createdBy: string,
  parentId?: string,
  createdAt: Date,
  isEdited?: boolean,
}

export interface IRecusiveMessage extends IMessage {
  _id: string
}

export interface IChatUser {
  _id: string,
  username: string,
  profile: {
    role: string,
    gender: string
  }
}

export interface IGroupedMessagesByDate {
  [date: string]: string[];
}

export interface ISetting {
  type: SettingsEnum;
  name: string;
  createdBy: string;
  creatorName: string;
}

export interface IRecusiveSetting extends ISetting {
  _id: string,
}