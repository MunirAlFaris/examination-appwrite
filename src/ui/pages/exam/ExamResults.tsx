import { useParams, useNavigate } from 'react-router-dom';
import type { IUser } from '../../../../universal/model';
import { Table, Modal } from "react-bootstrap";
import Loader from '../../components/loader';
import { UserRole } from '../../../../universal/enums';
import EmptyPageMessage from '../../components/EmptyPageMessage';

interface IDataLoading {
  isLoading: true,
  studentsResults: [],
}

interface IDataFound {
  isLoading: false,
  studentsResults: {username: string, result: number}[],
}

export default function ExamResults() {
  const {examId} = useParams();
  const navigate = useNavigate()
  const user = Meteor.user() as IUser;
  const data = useTracker(() => {
    const handle = Meteor.subscribe('examResults', examId);
    if (!handle.ready()) {
      return {
        isLoading: true,
        studentsResults: [],
      } as IDataLoading;
    }
    const allUsers = Meteor.users.find(
      { 'profile.exams.examId': examId },
    ).fetch() as IUser[];
    const users = allUsers
      .map(user => {
        const exam = user.profile.exams?.find(exam => exam.examId === examId);
        return exam ? { username: user.username, result: exam.result} : null;
      })
      .filter(user => user !== null);
    return {
      isLoading: false,
      studentsResults: users,
    } as IDataFound;
  }, []);
  const {studentsResults, isLoading} = data
  if(!user || user.profile.role === UserRole.isStudent) {
    return <EmptyPageMessage />
  }
  if(isLoading) {
    return <Loader />
  }
  console.log(studentsResults)
  return (
    <Modal
      show
      fullscreen
      onHide={() => navigate('/exams')}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>النتائج</Modal.Title>
      </Modal.Header>
      <Modal.Body className='exams-modal-body'>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{width: '100%', maxWidth: '700px'}} className='mt-3'>
            <Table bordered striped hover responsive='lg'>
              <thead>
                <tr>
                  <th scope="col">اسم الطالب</th>
                  <th scope="col">النتيجة</th>
                </tr>
              </thead>
              <tbody>
                { studentsResults.map(student =>
                  <tr key={student.username}>
                    <th>{student.username}</th>
                    <th>{student.result}</th>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}