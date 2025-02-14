import * as React from 'react';
import { UserRole } from '../../../universal/enums';

export default function UserImg(props: {
  userRole: string,
  userGender: string,
  style?: React.CSSProperties
}) {
  return (
    <img
      src={
        props.userRole === UserRole.isAdmin ?
        '/images/admin.png'
        : props.userRole === UserRole.isTeacher ?
          props.userGender === 'male' ?
            '/images/male-teacher.png' : '/images/female-teacher.png'
        : props.userGender === 'male' ?
        '/images/male.png' : '/images/female.png'
      }
      alt="user image"
      style={props.style ? props.style : {}}
    />
  )
}