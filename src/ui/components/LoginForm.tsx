import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../ui_helpers/utils";
import { Form, Button } from "react-bootstrap";
import { getCurrentUser, login } from "../../lib/methods";
import { useUser } from "../../lib/contexts";


export default function LoginForm() {
  const navigate = useNavigate();
  const setUser = useUser()[1];
  const form = useRef<HTMLFormElement | null>(null);
  const handleLogIn = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(form.current!);
    const email = formData.get('username') as string;
    const password = formData.get('password') as string;
    try {
      await login(email, password);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      showToast('success', 'تم تسجيل الدخول بنجاح')
      navigate('/home')
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      showToast('success', 'كلمة المرور أو اسم المستخدم خطأ')
    }
  }
  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    init();
  }, [setUser]);
  const preventWhiteSpace = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === ' ') {
      e.preventDefault();
    }
  }
  return (
    <div className='login-form-wrapper'>
      <div className='login-form-container'>
        <h1 className='mb-2'>أهلا وسهلا بك في المدرسة الرقمية، من فضلك قم بتسجيل الدخول</h1>
        <Form className='login-form' onSubmit={handleLogIn} ref={form}>
          <Form.Group className='mb-2' controlId="username">
            <Form.Label>اسم المستخدم:</Form.Label>
            <Form.Control
              name="username"
              type="text"
              className="form-control"
              placeholder="ادخل اسم المستخدم"
              onKeyDown={preventWhiteSpace}
            />
          </Form.Group>
          <Form.Group className='mb-2' controlId="passowrd">
            <Form.Label>كلمة المرور/الرقم الشخصي:</Form.Label>
            <Form.Control
              name="password"
              type="text"
              className="form-control"
              placeholder="ادخل كلمة المرور أو الرقم الشخصي"
              onKeyDown={preventWhiteSpace}
            />
          </Form.Group>
          <Button
            type='submit'
            variant="primary"
          >
            تسجيل الدخول
          </Button>
        </Form>
      </div>
    </div>
  )
}