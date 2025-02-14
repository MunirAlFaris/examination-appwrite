import { FormEvent, KeyboardEvent, useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { showToast } from '../../ui_helpers/utils';
import { UserRole } from '../../../universal/enums';
import { IUserProfile } from '../../../universal/model';
import { createDocument, login, register } from '../../lib/methods';
import { PROFILE_COL_ID } from '../../ui_helpers/constants';
import { useUser } from '../../lib/contexts';

export default function SignInFrom() {
  const [user, setUser] = useUser()
  const [fullName, setFullName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verPassword, setVerPassword] = useState<string>('');
  const [gender, setGender] = useState<"male" | "female" | ''>('');
  const [className, setClassName] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');
  const navigate = useNavigate();
  const userNameRegx = /^[a-zA-Z0-9_-]{3,16}$/
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(!userNameRegx.test(userName)) {
      showToast('error', 'اسم المستخدم غير صالح')
      return
    }
    if(password !== verPassword) {
      showToast('error', 'كلمة المرور غير متطابقة')
      return
    }
    const email = `${userName}@gmail.com`
    const userReg = await register(
      email,
      password,
      fullName
    )
    if(userReg) {
      await login(email, password)
      const userData: IUserProfile = {
        userId: userReg.$id,
        isGuest: true,
        role: UserRole.isStudent,
        personalNumber: password,
        gender: gender || 'male',
        birthDay: birthDay,
        currentStudentClass: className,
        exams: ''
      }
      createDocument(
        PROFILE_COL_ID,
        userData,
        (res: string) => {
          showToast('success', 'تم إنشاء الحساب بنجاح!');
          console.log(res)
          navigate('/')
          setUser(userReg)
          setFullName('');
          setUserName('');
          setPassword('');
          setVerPassword('');
          setBirthDay('');
          setGender('');
          setClassName('');
        },
        () => showToast('error', 'خطأ، لم نتمكن من إنشاء الحساب'),
      )
    } else {
      showToast('error', 'خطأ، لم نتمكن من إنشاء الحساب')
    }
    return
  }
  const preventWhiteSpace = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === ' ') {
      e.preventDefault();
    }
  }
  useEffect(() => {
    if(user) navigate('/')
  })
  return (
    <div className='login-form-wrapper'>
      <div className='login-form-container'>
        <h1 className='mb-2'>إنشاء حساب جديد</h1>
        <Form className='login-form' onSubmit={handleSubmit}>
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
            <Form.Label>تاريخ الولادة:</Form.Label>
            <Form.Control
              value={birthDay}
              type='date'
              placeholder='ادخل تاريخ الولادة'
              onChange={(e) => setBirthDay(e.target.value)}
              required
            />
          </Form.Group>
          <div>
            <span className="d-block mb-1">أختر الجنس:</span>
            <div className='d-flex flex-center gap-10 flex-wrap'>
              <Form.Check
                type='radio'
                name='gender'
                id='male'
                checked={gender === 'male'}
                label='ذكر'
                onChange={() => setGender('male')}
                required
              />
              <Form.Check
                type='radio'
                name='gender'
                id='female'
                checked={gender === 'female'}
                label='انثى'
                onChange={() => setGender('female')}
                required
              />
            </div>
          </div>
          <Form.Group className='mb-2' controlId='class-name'>
            <Form.Label>الصف:</Form.Label>
            <Form.Select
              value={className}
              defaultValue={''}
              onChange={(e) => setClassName(e.target.value)}
              required
            >
              <option value="" style={{display: 'none'}}>اختر الصف الدراسي</option>
              <option value="12">12</option>
              <option value="9">9</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className='mb-2' controlId='user-name'>
            <Form.Label>اسم المستخدم(باللغة الإنكليزية):</Form.Label>
            <Form.Control
              value={userName}
              placeholder='ادخل اسم المستخدم'
              onChange={(e) => setUserName(e.target.value)}
              onKeyDown={preventWhiteSpace}
              required
            />
          </Form.Group>
          <Form.Group className='mb-2' controlId='password'>
            <Form.Label>كلمة المرور/الرقم الشخصي:</Form.Label>
            <Form.Control
              type='password'
              value={password}
              placeholder='ادخل كلمة المرور/الرقم الشخصي'
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={preventWhiteSpace}
              required
            />
          </Form.Group>
          <Form.Group className='mb-2' controlId='password-ver'>
            <Form.Label>تأكيد المرور/الرقم الشخصي:</Form.Label>
            <Form.Control
              type='password'
              value={verPassword}
              placeholder='تأكيد كلمة المرور/الرقم الشخصي'
              onChange={(e) => setVerPassword(e.target.value)}
              onKeyDown={preventWhiteSpace}
              required
            />
          </Form.Group>
          <div
            style={{
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              type='submit'
              variant='primary'
            >
              إنشاء الحساب
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}