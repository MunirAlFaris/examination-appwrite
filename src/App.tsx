import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import { useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { UserContext } from './lib/contexts';
// Toast styles
import "react-toastify/dist/ReactToastify.css";
import { updateTheme } from './ui_helpers/utils';
import Header from './Header';
import { ToastContainer } from 'react-toastify';
import { Route, Routes } from 'react-router-dom';
import SignInFrom from './ui/components/SignInForm';
// import ExamResults from './ui/pages/exam/ExamResults';
import Exam from './ui/pages/exam/Exam';
import Exams from './ui/pages/exams/Exams';
// import Profile from './ui/pages/profile/Profile';
// import Chats from './ui/pages/Chats/Chats';
// import Dashboard from './ui/pages/dashboard/Dashboard';
import LoginForm from './ui/components/LoginForm';
// import Posts from './ui/pages/Posts/Posts';
import Home from './ui/pages/Home/Home';
import EmptyPageMessage from './ui/components/EmptyPageMessage';
import { getCurrentUser, getUserProfile } from './lib/methods';
import { IRecusiveUserProfile } from '../universal/model';
document.getElementsByTagName('html')[0].setAttribute('dir', "rtl");

// Detect initial theme
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
updateTheme(prefersDarkMode);
// Listen for changes to the OS theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  updateTheme(e.matches);
});

function App() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<IRecusiveUserProfile | null>(null);
  const initUser = async () => {
    const user = await getCurrentUser();
    if(user) {
      const profile = await getUserProfile(
        user.$id
      )
      setProfile(profile)
    }
    setUser(user);
  }
  useEffect(() => {
    initUser()
  }, [])
  console.log(user?.$id)
  console.log(profile?.userId)
  return (
    <UserContext.Provider
      value={[user, setUser]}
    >
      <div>
        <Header />
        <div className='container-fluid'>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* <Route path="/posts" element={<Posts />} /> */}
            <Route path="/login" element={<LoginForm />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* <Route path="/chats/:chatId?" element={<Chats />} /> */}
            {/* <Route path="/profile" element={<Profile />} /> */}
            <Route path="/:examsType/" element={<Exams />} />
            <Route path="/exams/:examId/:showResult?" element={<Exam />} />
            {/* <Route path="/exams/:examId/results" element={<ExamResults />}/> */}
            <Route path="/signin" element={<SignInFrom />}/>
            <Route Component={EmptyPageMessage}/>
          </Routes>
          <ToastContainer
            position="top-left"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={localStorage.getItem('theme') === 'dark' ? 'dark' : 'light'}
          />
        </div>
      </div>
    </UserContext.Provider>
  )
}

export default App
