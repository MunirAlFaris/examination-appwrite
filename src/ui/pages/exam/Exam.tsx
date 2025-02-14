import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Exams } from "../../../../universal/collections";
// import type { IRecusiveExam, IUser } from "../../../../universal/model";
// import { checkStudentHasPassedEx } from "../../../../universal/utils";
// import { processOnExamStudentAnswers } from "../../../ui_helpers/utils";
// import { ExamTypeEnum, UserRole } from "../../../../universal/enums";
// import Loader from "../../components/loader";
// import ResultModal from "../../components/ResultModal";
// import ExamOffSideCanvas from "../../components/ExamOffSideCanvas";
// import Questions from "../../components/Questions";
// import CountdownTimer from "../../components/CountDownTimer";
import { Modal } from "react-bootstrap";
// import EmptyPageMessage from "../../components/EmptyPageMessage";
import ConfirmModal from "../../components/ConfirmModal";

export default function Exam() {
  // const {examId, showResult} = useParams();
  const navigate = useNavigate();
  const [submitExam, setSubmitExam] = useState<boolean>(false);
  // const [showResultModal, setShowResultModal] = useState<boolean>(false);
  // const [showSubmitBtn, setShowSubmitBtn] = useState<boolean>(false);
  // const [studentResult, setStudentResult] = useState<number | null>(null);
  const [showCloseModal, setShowCloseModal] = useState<boolean>(false);
  const handleSubmitExam = () => {
    setSubmitExam(!submitExam)
    // setShowResultModal(true);
  }
  // const handleUpdateShowSubmitBtn = () => {
  //   setShowSubmitBtn(true);
  // }
  // useEffect(() => {
  //   if(user && exam) {
  //     if(submitExam) {
  //       processOnExamStudentAnswers(
  //         '.form-check-input',
  //         exam,
  //         (result) => setStudentResult(result),
  //       )
  //       if(exam.type === ExamTypeEnum.isTest) {
  //         window.scrollTo({
  //           top: 0,
  //           behavior: 'smooth'
  //         })
  //         setShowSubmitBtn(false);
  //       }
  //     }
  //   }
  // }, [submitExam, exam, user])
  // if (isLoading) {
  //   return (
  //     <Loader />
  //   )
  // }
  // if (!exam || !user) {
  //   return <EmptyPageMessage />;
  // }
  // if (
  //   user.profile.role === UserRole.isStudent
  //   && checkStudentHasPassedEx(user.profile.exams, exam._id)
  //   && !exam.showResult
  //   && !submitExam
  // ) {
  //   return (
  //     <Modal onHide={() => navigate('/exams')} show centered>
  //       <Modal.Header closeButton>
  //         <Modal.Title style={{flex: '1'}}>
  //           النتائج
  //         </Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         لم ينته توقيت عرض النتائج بعد!
  //         <br />
  //         أنتظر حتى يتم السماح بعرض النتائج من قبل الأستاذ
  //       </Modal.Body>
  //       <Modal.Footer>
  //         <Button variant='danger' onClick={() => navigate('/exams')}>
  //           العودة
  //         </Button>
  //       </Modal.Footer>
  //     </Modal>
  //   )
  // }
  // const showTimer = user.profile.role === UserRole.isStudent && !checkStudentHasPassedEx(user.profile.exams, exam._id) && exam.hasTimer
  const handleShowSubmitButton = () => {
    return true
    // return (
    //   user.profile.role === UserRole.isStudent 
    //   && !checkStudentHasPassedEx(user.profile.exams, exam._id) ?
    //     exam.type === ExamTypeEnum.isExam && !submitExam ?
    //     exam.hasTimer ?
    //       showSubmitBtn
    //       : true
    //     : exam.type === ExamTypeEnum.isTest && !submitExam ?
    //       exam.hasTimer ?
    //         showSubmitBtn
    //       : true
    //     : false
    //   : false
    // )
  }
  // const handleShowStudentResult = () => {
  //   return (
  //     exam.type === ExamTypeEnum.isTest ?
  //       studentResult
  //     : user.profile.exams?.find(x => x.examId === exam._id)?.result
  //   )
  // }
  // const handleShowResultText = () => {
  //   return (
  //     user.profile.role === UserRole.isStudent ?
  //       !exam.hasTimer ?
  //         true
  //         : (submitExam || showResult === 'results')
  //       : true
  //   )
  // }
  const navigateTo = () => {
    navigate('/')
    // navigate(exam.type === ExamTypeEnum.isExam ? '/exams' : '/tests')
  }
  const handleShowCloseConfirmModal = () => {
    setShowCloseModal(!showCloseModal)
  }
  // const handleCloseWindow = () => {
  //   if(user.profile.role !== UserRole.isStudent) {
  //     navigateTo()
  //   } else {
  //     handleShowCloseConfirmModal()
  //   }
  // }
  return (
    <Modal
      show
      fullscreen
      onHide={navigateTo}
    >
      <div className="row" style={{margin: '5px 0'}}>
        <div className="col exam-header-col">
          <p className="exam-header-p">
            الصف &nbsp;
            {/* <span style={{display: 'inline-block'}}>{exam.className}</span> */}
          </p>
          <p className="exam-header-p">
            اسم الطالب: &nbsp;
            {/* <span style={{display: 'inline-block'}}>{user.profile.role === UserRole.isStudent ? user.username : ''}</span> */}
          </p>
          {/* {handleShowResultText() && (
            <p className="exam-header-p">العلامة: <span style={{display: 'inline-block'}}>{handleShowStudentResult()}</span></p>
          )} */}
          {/* {showTimer && !submitExam &&(
            <CountdownTimer
              durationInMinutes={Number(exam.timers.examTime)}
              handleUpdateShowSubmitBtn={handleUpdateShowSubmitBtn}
              handleSubmitExam={handleSubmitExam}
              sumbitExam={submitExam}
              showSubmitBtn={showSubmitBtn}
            />
          )} */}
        </div>
        <div className="col text-center exam-header-col">
          <span style={{fontSize: '60px'}} className="icon-mail-dot-ru"/>
          <p className="exam-header-p">
            هذا شعار المؤسسة
          </p>
        </div>
        <div className="col text-end exam-header-col" style={{alignItems: 'flex-end'}}>
          <div className="exam-header-col" style={{flex: '1'}}>
            {/* <p className="exam-header-p">المادة: <span style={{display: 'inline-block'}}>{exam.subject}</span></p> */}
            {/* <p className="exam-header-p">المدرس: <span style={{display: 'inline-block'}}>{exam.teacherName}</span></p> */}
            {/* <p className="exam-header-p">العام الدراسي: <span style={{display: 'inline-block'}}>{exam.academicYear}</span></p> */}
          </div>
        </div>
      </div>
      <Modal.Body className="exams-modal-body">
        <div className="exam-body">
          {/* {user.profile.role !== UserRole.isStudent
            && (user._id === exam.teacherId 
                || user.profile.role === UserRole.isAdmin
                ) 
            && (
              <ExamOffSideCanvas exam={exam} userIsOwner={user && user._id === exam.teacherId}/>
          )} */}
          {/* { exam.questions ?
            <Questions
              examId={exam._id}
              questions={exam.questions}
              user={user}
              userIsOwner={exam.teacherId === user._id}
              showResultState={exam.showResult}
            />
          : null} */}
          { handleShowSubmitButton() &&(
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <button className="mb-3 mt-3 btn btn-primary"
                onClick={handleSubmitExam}
              >
                أرسل النتيجة
              </button>
            </div>
          )}
          {/* { showResultModal ?
            <ResultModal 
              result={user.profile.exams?.find(x => x.examId === examId)?.result || 0}
              show={showResultModal}
              onHide={() => setShowResultModal(false)}
              examType={exam.type}
              {...(studentResult ? {studentResult: studentResult} : {})}
            />
          : null} */}
        </div>
        <span className="exam-close-btn">
          <span
            className="icon-exit"
            // onClick={handleCloseWindow}
          />
        </span>
        <ConfirmModal
          // title={'مغادرة ' + exam.type === ExamTypeEnum.isExam ? 'الإمتحان' : 'المذاكرة'}
          // description={"هل أنت متأكد من مغادرة " + (exam.type === ExamTypeEnum.isExam ? 'الإمتحان؟' : 'المذاكرة؟')}
          title="dfdgd"
          description="erwerw"
          show={showCloseModal}
          onConfirm={navigateTo}
          onHide={handleShowCloseConfirmModal}
        />
      </Modal.Body>
    </Modal>
  )
}
