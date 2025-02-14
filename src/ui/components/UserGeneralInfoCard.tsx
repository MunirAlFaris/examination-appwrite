import * as React from 'react';
import type { IUser } from '../../../universal/model';
import StudentExamItem from './StudentExamItem';

export default function UserGeneralInfoCard(props: {user: IUser, isInCanvas?: boolean}) {
  const {user} = props
  return (
    <div
      className='profile-aside'
      style={
        !props.isInCanvas ?
        {width: "18rem", margin: '0 20px', height: 'fit-content'}
        : {width: '100%', paddingRight: '20px'}
      }
    >
      <div style={{display: 'flex', gap: '5px'}}>
        <img
          src={`./images/${user.profile.gender}.png`}
          alt="profile photo"
          className="card-img-top"
          style={{
            maxWidth: '150px',
            maxHeight: '150px'
          }}
        />
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly'}}>
          <div>الاسم الكامل: {user.profile.name}</div>
          <div>تاريخ الولادة: {user.profile.birthDay}</div>
          <div>اسم المستخدم: {user.username}</div>
          <div>الصف: {user.profile.currentStudentClass}</div>
          <div>الجنس: {user.profile.gender === 'male' ? 'ذكر' : "أنثى"}</div>
        </div>
      </div>
      <hr />
      { user.profile.exams && user.profile.exams.length > 0 && (
        <>
          <div>
            <h5>مجموع الإمتحانات: {user.profile.exams.length}</h5>
          </div>
          <hr />
          <div className="mt-3">
            <h5>آخر إمتحان تم تقديمه</h5>
            <ul className="exams-list">
              <StudentExamItem 
                exam={user.profile.exams[user.profile.exams.length - 1]}
              />
            </ul>
          </div>
        </>
      )}
    </div>
  )
}