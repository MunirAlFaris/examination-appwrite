import { Meteor } from "meteor/meteor";
import React, { useState, useMemo } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Accounts } from "meteor/accounts-base";
import { SubjectsEnum, UserRole } from "../../../../universal/enums";
import { useTracker } from "meteor/react-meteor-data";
import type { IUser, IMultiSelectOption } from "../../../../universal/model";
import Loader from "../../components/loader";
import { showToast } from "../../../ui_helpers/utils";
import MultiSelect from "../../components/MultiSelect";
import EmptyPageMessage from "../../components/EmptyPageMessage";
import { Form } from "react-bootstrap";

export default function UserForm(props: {
  isForEidt?: boolean,
  userData?: IUser,
  onUpdate?: () => void,
}) {
  const {userData, isForEidt} = props;
  const [username, setUsername] = useState<string>(userData ? userData.username : '');
  const [password, setPassword] = useState<string>(userData && userData.profile.personalNumber ? userData.profile.personalNumber : '');
  const [selectedSubjects, setSelectedSubjects] =useState<IMultiSelectOption[]>(
    userData && userData.profile.subjects ?
    userData.profile.subjects
    .map((x) => {return {value: x, label: x}})
    : []
  );
  const [fullName, setFullName] = useState<string>(userData?.profile.name || '');
  const [birthDay, setBirthDay] = useState<string>(userData?.profile.birthDay || '');
  const [className, setClassName] = useState<string>(userData && userData.profile.currentStudentClass ? userData.profile.currentStudentClass : '');
  const [selectedClassName, setSelectedClassName] = useState<IMultiSelectOption[]>(
    userData && userData.profile.classNames ?
    userData.profile.classNames
    .map((x) => {return {value: x, label: x}})
    : []
  );
  const [gender, setGender] = useState<"male" | "female" | ''>(userData ? userData.profile.gender : '');
  const [role, setRole] = useState<UserRole | ''>(userData && userData.profile.role ? (userData.profile.role as UserRole) : '');
  const subjectsOtions = useMemo(() => {
    const subjectsArray: IMultiSelectOption[] = [];
    Object.keys(SubjectsEnum).forEach((key) => {
      subjectsArray.push({
        label: key,
        value: key,
      })
    })
    return subjectsArray
  }, [SubjectsEnum])
  const classNameOptions: IMultiSelectOption[] = [
    {label: 'الثالث الثانوي', value: '12'},
    {label: 'التاسع', value: '9'}
  ]
  const user = useTracker(() => Meteor.user() as IUser);
  if(!user) {
    return <Loader />
  }
  if(user.profile.role !== UserRole.isAdmin) {
    return <EmptyPageMessage />
  }
  const userNameRegx = /^[a-zA-Z0-9_-]{3,16}$/
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(!userNameRegx.test(username)) {
      showToast('error', 'اسم المستخدم غير صالح')
      return
    }
    const teacher = {
      username: username,
      password: password,
      profile: {
        name: fullName,
        role: role,
        personalNumber: password,
        gender: gender,
        subjects: selectedSubjects.map(x => x.value),
        classNames: selectedClassName.map(x => x.value),
        ...(birthDay ? {birthDay: birthDay} : {}),
      }
    }
    const student = {
      username: username,
      password: password,
      profile: {
        isGuest: false,
        name: fullName,
        role: role,
        personalNumber: password,
        gender: gender,
        currentStudentClass: className,
        exams: [],
        ...(birthDay ? {birthDay: birthDay} : {}),
      }
    }
    const admin = {
      username: username,
      password: password,
      profile: {
        name: fullName,
        role: role,
        personalNumber: password,
        gender: gender,
        ...(birthDay ? {birthDay: birthDay} : {}),
      }
    }
    if(!isForEidt) {
      Meteor.call('checkIfUserExists', username, (error: any, result: any) => {
        if(result) {
          showToast('error', 'اسم المستخدم موجود فعليا')
          return
        }
        else {
          showToast('success', 'تمت إضافة المستخدم بنجاح')
          if(role === UserRole.isTeacher) {
            Accounts.createUser(teacher);
          } else if(role === UserRole.isStudent) {
            Accounts.createUser(student);
          } else {
            Accounts.createUser(admin);
          }
          setUsername('')
          setPassword('')
          setRole('')
          setGender('')
          setClassName('')
          setBirthDay('');
          setFullName('');
        }
      });
    } else {
      Meteor.call(
        'updateUser',
        userData?._id,
        role === UserRole.isTeacher ? teacher : role === UserRole.isStudent ? student : admin,
        (error: Meteor.Error) => {
          if(error) {
            showToast('error', 'لم نتمكن من تعديل المستخدم');
            console.log(error)
          }
          else {
            showToast('success', 'تم تعديل المستخدم بنجاح');
            if(props.onUpdate) props.onUpdate();
          }
        }
      )
    }
  }
  const preventWhiteSpace = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === ' ') {
      e.preventDefault();
    }
  }
  return(
    <div style={{display: 'flex', justifyContent: 'center'}}>
      <form onSubmit={handleSubmit} style={{maxWidth: '700px'}}>
        <Form.Group className='mb-2' controlId='full-name'>
          <Form.Label>الاسم الكامل:</Form.Label>
          <Form.Control
            value={fullName}
            placeholder='ادخل الاسم الكامل'
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className='mb-2' controlId='birth-day'>
          <Form.Label>تاريخ الولادة(اختياري):</Form.Label>
          <Form.Control
            value={birthDay}
            type='date'
            placeholder='ادخل تاريخ الولادة'
            onChange={(e) => setBirthDay(e.target.value)}
          />
        </Form.Group>
        <div className="row">
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput2" className="form-label">اسم المستخدم(باللغة الإنكليزية):</label>
            <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="ادخل اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={preventWhiteSpace} required/>
          </div>
          <div className="mb-3">
            <label htmlFor="formGroupExampleInput" className="form-label">كلمة المررور/الرقم الشخصي:</label>
            <input type="text" className="form-control" id="formGroupExampleInput" placeholder="ادخل كلمة المرور أو الرقم الشخصي" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={preventWhiteSpace} required/>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <span className="d-block mb-1">اختر رتبة المستخدم:</span>
            <label className="form-label">
              <input type="radio" name="role" checked={role === UserRole.isStudent} onChange={() => {
                setSelectedClassName([])
                setSelectedSubjects([])
                setRole(UserRole.isStudent)
                }}
                required
              />
              &nbsp;
              طالب
            </label>
            &nbsp;
            &nbsp;
            &nbsp;
            <label className="form-label">
              <input type="radio" name="role" checked={role === UserRole.isTeacher} onChange={() => {
                setClassName('');
                setSelectedClassName([])
                setSelectedSubjects([])
                setRole(UserRole.isTeacher)}}
                required
              />
              &nbsp;
              أستاذ
            </label>
            &nbsp;
            &nbsp;
            &nbsp;
            <label className="form-label">
              <input type="radio" name="role" checked={role === UserRole.isAdmin} onChange={() => {
                setClassName('');
                setSelectedClassName([])
                setSelectedSubjects([])
                setRole(UserRole.isAdmin)}}
                required
              />
              &nbsp;
              مدير
            </label>
          </div>
          <div className="col">
            <span className="d-block mb-1">أختر الجنس:</span>
            <label className="form-label">
              <input type="radio" name="gender" checked={gender === 'male'} onChange={(e) => setGender('male')} required/>
              &nbsp;
              ذكر
            </label>
            &nbsp;
            &nbsp;
            &nbsp;
            <label className="form-label">
              <input type="radio" name="gender" checked={gender === 'female'} onChange={(e) => setGender('female')} required/>
              &nbsp;
              أنثى
            </label>
          </div>
        </div>
        { role && role !== UserRole.isAdmin ?
          <div className="col">
            <label htmlFor="inputClass" className="form-label">اختر الصفوف:</label>
            { role === UserRole.isTeacher ? (
              <MultiSelect
                value={selectedClassName}
                onChange={(e) => setSelectedClassName([...e])}
                options={classNameOptions}
              />
            ) : (
              <>
                <select id="inputClass" className="form-select" defaultValue={className} onChange={(e) => setClassName(e.target.value)} required>
                  <option value="" style={{display: 'none'}}>اختر الصف</option>
                  <option value="12">12</option>
                  <option value="9">9</option>
                </select>
              </>
            )}
          </div>
        : null}
        { role === UserRole.isTeacher && (
          <div className="col mt-3">
            <label htmlFor="inputSubject" className="form-label">اختر المواد:</label>
            <MultiSelect
              value={selectedSubjects}
              onChange={(e) => setSelectedSubjects([...e])}
              options={subjectsOtions}
            />
          </div>
        )}
        <div className="col-12 mt-3">
          <button type='submit' className='btn btn-primary'>
            {isForEidt ? 'تعديل' : 'أضف'}
          </button>
        </div>
      </form>
    </div>
  )
}