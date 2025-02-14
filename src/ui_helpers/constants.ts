import { DashboardTabNameEnum, ChatTypeEnum, UsersFilterEnum } from "../../universal/enums";
import type { IMultiSelectOption } from "../../universal/model";

export const EXAMS_COL_ID = '67aa410a0030bf1318f6'
export const QUES_COL_ID = '67aa42f9003a5730f39b'
export const ANS_COL_ID = '67aa443c00182d4c5698'
export const PROFILE_COL_ID = '67af609b00282816d18e'

export const examRoutePath = '/exams/:_id([0-9a-zA-Z]{10,25})';

export const PAGE_SIZE_FOR_DASH = 30;

export const PAGE_SIZE = 30
export const MAX_VISIBLE_ENTRIES_COUNT = 100

export const DashboardTabNames: {
  title: string,
  key: DashboardTabNameEnum,
}[] = [
  {
    title: 'نظرة عامة',
    key: DashboardTabNameEnum.Overview
  },
  {
    title: 'المستخدمين',
    key: DashboardTabNameEnum.UsersTable
  },
  {
    title: 'الطلاب',
    key: DashboardTabNameEnum.Students
  },
  {
    title: 'الأساتذة',
    key: DashboardTabNameEnum.Teachers
  },
  {
    title: 'الإختبارات',
    key: DashboardTabNameEnum.Exams
  },
  {
    title: 'المنشورات',
    key: DashboardTabNameEnum.Posts
  },
  {
    title: 'المحادثات',
    key: DashboardTabNameEnum.Chats
  },
]

export const ChatTypeOptions: IMultiSelectOption[] = [
  {
    label: 'عامة',
    value: ChatTypeEnum.public
  },
  {
    label: 'صف معين',
    value: ChatTypeEnum.specificClass
  },
  {
    label: 'خاصة',
    value: ChatTypeEnum.private
  },
]

export const usersFilterOptions: IMultiSelectOption[] = [
  {
    label: 'الكل',
    value: UsersFilterEnum.All
  },
  {
    label: 'الطلاب الرسميون',
    value: UsersFilterEnum.NotGusts
  },
  {
    label: 'الطلاب الضيوف',
    value: UsersFilterEnum.Gusts
  },
  {
    label: 'الأساتذة',
    value: UsersFilterEnum.Teachers
  },
  {
    label: 'الطلاب',
    value: UsersFilterEnum.Students
  },
  {
    label: 'المدراء',
    value: UsersFilterEnum.Admins
  },
  {
    label: 'الذكور',
    value: UsersFilterEnum.Male
  },
  {
    label: 'الإناث',
    value: UsersFilterEnum.Female
  },
]