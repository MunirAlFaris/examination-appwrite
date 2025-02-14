export enum UserRole {
  isAdmin = 'admin',
  isTeacher = 'teacher',
  isStudent = 'student'
}

export enum SubjectsEnum {
  Arabic = 'Arabic',
  English  = 'English',
  Mathematics = 'Mathematics',
  Physics = 'Physics',
  Chemistry = 'Chemistry',
  Turkish = 'Turkish',
  Biology = 'Biology',
  SocialStudies = 'SocialStudies',
}

export enum ExamTypeEnum {
  isExam = 'Exam',
  isTest = 'Test',
  Unset = 'Unset'
}

export enum ExamStateEnum {
  ExamIsWaiting = 'Waiting',
  ExamIsStarted = 'Started',
  ExamIsWaitingForResult = 'ResultWaiting',
  ExamIsEnded = 'Ended',
}

export enum DashboardTabNameEnum {
  SubjectClasses = 'SubjectClasses',
  UsersTable = 'UsersTable',
  Overview = 'Overview',
  Students = 'Students',
  Teachers = 'Teachers',
  Exams = 'Exams',
  Posts = 'Posts',
  Chats = 'Chats',
}

export enum EditingOptionsEnum {
  Edit = 'EDIT',
  Remove = 'REMOVE',
  Add = 'ADD',
  Reply = 'REPLY'
}

export enum PostAccessStateEnum {
  teachers = UserRole.isTeacher,
  students = UserRole.isStudent,
  notForGuests = 'NOT_FOR_GUESTS',
  public = 'PUBLIC',
  private = 'PRIVATE'
}

export enum ChatTypeEnum {
  public = 'public',
  specificClass = 'specificClass',
  private = 'private'
}

export enum UsersFilterEnum {
  All = 'All',
  NotGusts = 'NotGusts',
  Gusts = 'Gusts',
  Teachers = 'Teachers',
  Students = 'Students',
  Admins = 'Admins',
  Male = 'Male',
  Female = 'Female'
}

export enum SettingsEnum {
  Subject = 'Subject',
  Class = 'Class',
}