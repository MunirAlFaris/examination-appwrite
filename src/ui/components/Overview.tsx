import * as React from 'react';
import type { IRecusiveExam, IUser } from '../../../universal/model';
import UserGeneralInfoCard from './UserGeneralInfoCard';
import { ExamTypeEnum, UserRole } from '../../../universal/enums';

export default function Overview(props: {
  usersCount: number;
  teachersCount: number;
  studentsCount: number;
  totalExamsCount: number;
  examsCount: number;
  testsCount: number;
  latestUser: IUser;
  latestExam: IRecusiveExam;
}) {
  const studentsPer = `${Math.trunc((props.studentsCount / props.usersCount) * 100) || 0}%`;
  const teachersPer = `${Math.trunc((props.teachersCount / props.usersCount) * 100) || 0}%`;
  const examsPer = `${Math.trunc((props.examsCount / props.totalExamsCount) * 100) || 0}%`;
  const testsPer = `${Math.trunc((props.testsCount / props.totalExamsCount) * 100) || 0}%`;
  return (
    <div>
      <div className='overview-cards-container'>
        <OverviewCard
          footContent={`مجموع المستخدمين: ${props.usersCount}`}
        >
          <span className='icon-user-o'></span>
          <div className='overview-card-info'>
            <div>{props.studentsCount}</div>
            <span className='overview-card-percints'>
              {studentsPer}
            </span>
            <div>طلاب</div>
          </div>
        </OverviewCard>
        <OverviewCard
          footContent={`مجموع المستخدمين: ${props.usersCount}`}
        >
          <span className='icon-user-o'></span>
          <div className='overview-card-info'>
            <div>{props.teachersCount}</div>
            <span className='overview-card-percints'>
              {teachersPer}
            </span>
            <div>أساتذة</div>
          </div>
        </OverviewCard>
        <OverviewCard
          footContent={`مجموع الإختبارات: ${props.totalExamsCount}`}
        >
          <span className='icon-paper'></span>
          <div className='overview-card-info'>
            <div>{props.examsCount}</div>
            <span className='overview-card-percints'>
              {examsPer}
            </span>
            <div>إمتحان</div>
          </div>
        </OverviewCard>
        <OverviewCard
          footContent={`مجموع الإختبارات: ${props.totalExamsCount}`}
        >
          <span className='icon-paper'></span>
          <div className='overview-card-info'>
            <div>{props.testsCount}</div>
            <span className='overview-card-percints'>
              {testsPer}
            </span>
            <div>مذاكرة</div>
          </div>
        </OverviewCard>
      </div>
      <div className='overview-latest'>
        {props.latestUser && (
          <LatestUserCard user={props.latestUser} />
        )}
        {props.latestExam && (
          <LatestExam exam={props.latestExam}/>
        )}
      </div>
    </div>
  )
}

function OverviewCard(props: {
  footContent: string | JSX.Element | JSX.Element[];
  children: string | JSX.Element | JSX.Element[];
}) {
  return (
    <div className='overview-card'>
      <div className='side-col'></div>
      <div style={{flex: '1'}}>
        <div className='overview-card-body'>
          {props.children}
        </div>
        <span className='overview-card-foot'>
          {props.footContent}
        </span>
      </div>
    </div>
  )
}

function LatestUserCard(props: {user: IUser}) {
  const { user } = props;
  const name = user.profile.role === UserRole.isStudent ? 'الطالب'
  : user.profile.role === UserRole.isTeacher ? 'الأستاذ' : 'المدير'
  return (
    <div className="dashboard-card">
      <div>
        <div className="card-header">
          <img 
            src={`./images/${user.profile.gender}.png`} 
            alt="profile photo" 
            className="profile-photo" 
          />
          <div className="header-details" style={{marginTop: '10px'}}>
            <h3 className="name">{name}</h3>
            <p className="username">@{user.username}</p>
          </div>
        </div>
        <div className="s-card-body">
          <div className="info-row">
            <span className="info-label">الجنس:</span>
            <span className="info-value">{user.profile.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">أنشئ في:</span>
            <span className="info-value">{user.createdAt?.toLocaleDateString()}</span>
          </div>
          {user.profile.subjects && user.profile.subjects.length > 0 && (
            <div className="info-row">
              <span className="info-label">المواد:</span>
              <span className="info-value">{user.profile.subjects.join(', ')}</span>
            </div>
          )}
          {user.profile.classNames && user.profile.classNames.length > 0 && (
            <div className="info-row">
              <span className="info-label">الصفوف:</span>
              <span className="info-value">{user.profile.classNames.join(', ')}</span>
            </div>
          )}
          {user.profile.currentStudentClass && (
            <div className="info-row">
              <span className="info-label">الصف الحالي:</span>
              <span className="info-value">{user.profile.currentStudentClass}</span>
            </div>
          )}
          {user.profile.exams && (
            <div className="info-row">
              <span className="info-label">مجموع الإختبارات:</span>
              <span className="info-value">{user.profile.exams.length}</span>
            </div>
          )}
        </div>
      </div>
      <div className='side-col'></div>
    </div>
  )
}
function LatestExam(props: {exam: IRecusiveExam}) {
  const examType = props.exam.type === ExamTypeEnum.Unset ? 'غير محدد' :
  props.exam.type === ExamTypeEnum.isExam ? 'إمتحان' : 'مذاكرة'
  return (
    <div className="dashboard-card">
      <div>
        <div className="card-header" style={{justifyContent: 'space-between'}}>
          <h2 className='card-title'>{examType}</h2>
          <div className="header-details">
            <h3 className="name">{props.exam.title}</h3>
            <span className="username">{props.exam.academicYear}</span>
            &nbsp;
            -
            &nbsp;
            <span className="username">{props.exam.createdAt?.toLocaleDateString()}</span>
          </div>
        </div>
        <div className="s-card-body">
          <div className="info-row">
            <span className="info-label">اسم الأستاذ:</span>
            <span className="info-value">{props.exam.teacherName}</span>
          </div>
          <div className="info-row">
            <span className="info-label">الصف:</span>
            <span className="info-value">{props.exam.className}</span>
          </div>
          <div className="info-row">
            <span className="info-label">المادة:</span>
            <span className="info-value">{props.exam.subject}</span>
          </div>
          <div className="info-row">
            <span className="info-label">الحالة:</span>
            <span
              className="info-value"
              style={{color: props.exam.isPublic ? 'lightgreen' : 'tomato'}}
            >
              {props.exam.isPublic  ? 'منشور' : 'خاص'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">المؤقت:</span>
            <span className="info-value">{props.exam.hasTimer ? 'موجود' : 'لا يوجد'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">عدد الأسئلة:</span>
            <span className="info-value">{props.exam.questions.length}</span>
          </div>
        </div>
      </div>
      <div className='side-col'></div>
    </div>
  )
}