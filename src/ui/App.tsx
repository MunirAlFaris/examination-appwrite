import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginForm from './components/LoginForm';
import Header from './Header';
import Exams from './pages/exams/Exams';
import Exam from './pages/exam/Exam';
import Posts from './pages/Posts/Posts';
import type { IRecusiveSetting, IUser } from '../../universal/model';
import { useLocation } from 'react-router-dom';
import Profile from './pages/profile/Profile';
import ExamResults from './pages/exam/ExamResults';
import Dashboard from './pages/dashboard/Dashboard';
import Chats from './pages/Chats/Chats';
import Home from './pages/Home/Home';
import SignInFrom from './components/SignInForm';
// Toast styles
import "react-toastify/dist/ReactToastify.css";
import { updateTheme } from '../ui_helpers/utils';
import { Settings } from '../../universal/collections';
import { SettingsContext } from '../ui_helpers/contexts';
document.getElementsByTagName('html')[0].setAttribute('dir', "rtl");

// Detect initial theme
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
updateTheme(prefersDarkMode);
// Listen for changes to the OS theme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  updateTheme(e.matches);
});

interface IDataLoading {
  kind: 'loading';
}

interface IDataFound {
  kind: 'found';
  settings: IRecusiveSetting[];
}

export const App = () => {
  const data = useTracker(() => {
    const hundle = Meteor.subscribe('settings');
    if(!hundle.ready()) return {kind: 'loading'} as IDataLoading
    return {
      kind: 'found',
      settings: Settings.find({}).fetch()
    } as IDataFound
  })
  return (
    <SettingsContext.Provider
      value={data.kind !== 'loading' ? data.settings : []}
    >
      <div>
        <Header />
        <div className='container-fluid'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chats/:chatId?" element={<Chats />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/:examsType/" element={<Exams />} />
            <Route path="/exams/:examId/:showResult?" element={<Exam />} />
            <Route path="/exams/:examId/results" element={<ExamResults />}/>
            <Route path="/signin" element={<SignInFrom />}/>
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
    </SettingsContext.Provider>
  );
}
