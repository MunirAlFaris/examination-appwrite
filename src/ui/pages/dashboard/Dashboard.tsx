import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Form, Nav } from 'react-bootstrap';
import { DashboardTabNameEnum, ExamTypeEnum, UserRole } from '../../../../universal/enums';
import { DashboardTabNames } from '../../../ui_helpers/constants';
import Users from '../users/Users';
import Overview from '../../components/Overview';
import { IRecusiveChat, IRecusiveExam, IRecusivePost, IUser } from '../../../../universal/model';
import { Chats, Exams, Posts } from '../../../../universal/collections';
import Loader from '../../components/loader';
import { sortByCreation } from '../../../../universal/utils';
import ExamsTable from './ExamsTable';
import PostsTable from './PostsTable';
import ChatsTable from './ChatsTable';
import EmptyPageMessage from '../../components/EmptyPageMessage';
import SubjectsPostsTable from './SubjectsClassesTable';
interface IDataLoading {
  loading: boolean,
  exams: undefined,
  users: undefined,
  user: undefined,
  posts: undefined,
  chats: undefined,
}

interface IDataFound {
  loading: boolean,
  exams: IRecusiveExam[],
  users: IUser[],
  user: IUser,
  posts: IRecusivePost[],
  chats: IRecusiveChat[],
}

export default function Dashboard() {
  const [tabKey, setTypeKey] = useState<DashboardTabNameEnum>(DashboardTabNameEnum.Overview);
  const data = useTracker(() => {
    const user = Meteor.user() as IUser;
    const hundler = Meteor.subscribe('dashboard');
    if(!user) return {loading: false, exams: undefined, users: undefined, user: undefined, posts: undefined} as IDataLoading
    if(!hundler.ready()) return {loading: true, exams: undefined, users: undefined, user: undefined, posts: undefined} as IDataLoading
    return {
      loading: false,
      exams: Exams.find({}).fetch(),
      users: Meteor.users.find({_id: {$nin: [user._id]}}).fetch(),
      user: user,
      posts: Posts.find({}).fetch(),
      chats: Chats.find({}).fetch()
    } as IDataFound
  })
  const {loading, exams, user} = data;
  if(loading) {
    return <Loader />;
  }
  if(!user || user.profile.role !== UserRole.isAdmin) {
    return <EmptyPageMessage />
  }
  const chats = data.chats.sort(sortByCreation());
  const posts = data.posts.sort(sortByCreation());
  const users = data.users.sort(sortByCreation());
  const examsArr: IRecusiveExam[] = exams.filter(x => x.type === ExamTypeEnum.isExam).sort(sortByCreation());
  const testArr: IRecusiveExam[] = exams.filter(x => x.type === ExamTypeEnum.isTest).sort(sortByCreation());
  const teachers: IUser[] = users.filter(x => x.profile.role === UserRole.isTeacher).sort(sortByCreation());
  const students: IUser[] = users.filter(x => x.profile.role === UserRole.isStudent).sort(sortByCreation());
  return (
    <div className='mt-3'>
      <Nav variant="tabs" defaultActiveKey={tabKey}>
        {DashboardTabNames.map(tab => 
          <Nav.Item key={tab.key}>
            <Nav.Link
              eventKey={tab.key}
              onClick={() => setTypeKey(tab.key)}
            >
              {tab.title}
            </Nav.Link>
          </Nav.Item>
        )}
        <Nav.Item key={DashboardTabNameEnum.SubjectClasses}>
          <Nav.Link
            eventKey={DashboardTabNameEnum.SubjectClasses}
            onClick={() => setTypeKey(DashboardTabNameEnum.SubjectClasses)}
          >
            الصفوف والمواد
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div>
        { tabKey === DashboardTabNameEnum.UsersTable ? (
          <Users users={users}/>
        ) : tabKey === DashboardTabNameEnum.Students ? (
          <Users users={students} onlyStudents/>
        ) : tabKey === DashboardTabNameEnum.Teachers ? (
          <Users users={teachers} onlyTeachers/>
        ) : tabKey === DashboardTabNameEnum.Exams ? (
          <ExamsTable exams={exams}/>
        ) : tabKey === DashboardTabNameEnum.Posts ? (
          <PostsTable posts={posts}/>
        ) : tabKey === DashboardTabNameEnum.Chats ? (
          <ChatsTable chats={chats} userId={user._id} users={users}/>
        ) : tabKey === DashboardTabNameEnum.SubjectClasses ? (
          <SubjectsPostsTable />
        ) : (
          <Overview
            usersCount={users.length}
            teachersCount={teachers.length}
            studentsCount={students.length}
            totalExamsCount={exams.length}
            examsCount={examsArr.length}
            testsCount={testArr.length}
            latestUser={users.sort(sortByCreation())[0]}
            latestExam={exams.sort(sortByCreation())[0]}
          />
        )}
      </div>
    </div>
  )
}

