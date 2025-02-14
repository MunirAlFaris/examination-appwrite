import { ChangeEvent, useState } from "react";
import { useLocation, matchPath, useNavigate } from "react-router-dom";
// import { Exams as ExamsCollec } from "../../../../universal/collections";
// import type { IRecusiveExam, IUser } from "../../../../universal/model";
import { ExamTypeEnum } from "../../../../universal/enums";
import { Button, Modal } from "react-bootstrap";
// import Loader from "../../components/loader";
import CreateExam from "../../components/CreateExam";
// import ExamItem from "../../components/ExamItem";
// import DraftExamsModal from "../../components/DraftExamsModal";
// import EmptyPageMessage from "../../components/EmptyPageMessage";
import SearchInput from "../../components/SearchInput";
import { IRecusiveExam } from "../../../../universal/model";

export default function Exams() {
  const location = useLocation();
  const navigate = useNavigate();
  const pageExamsType = matchPath(location.pathname, '/exams') ? ExamTypeEnum.isExam : ExamTypeEnum.isTest;
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showDraftExamsModal, setShowDraftExamsModal] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  // const user = useTracker(() => Meteor.user()) as IUser;
  // const userIsTeacher = user && user.profile.role === UserRole.isTeacher;
  const userIsTeacher = true;
  const draftExams: IRecusiveExam[] = [];
  // const data = useTracker(() => {
  //   const handler = Meteor.subscribe('exams', pageExamsType);
  //   if(userIsTeacher) Meteor.subscribe('draftExams');
  //   if(!handler.ready()) 
  //     return {isLoading: true, exams: undefined} as IDataLoading;
  //   return {
  //     isLoading: false,
  //     exams: ExamsCollec.find({type: pageExamsType}).fetch(),
  //     ...(userIsTeacher ? {draftExams: ExamsCollec.find({ teacherId: user._id, type: ExamTypeEnum.Unset}).fetch()} : {})
  //   } as IDataFound
  // })
  // const {isLoading, draftExams} = data;
  // let {exams} = data
  // if(isLoading) {
  //   return <Loader />
  // }
  // if(!user || !exams) {
  //   return <EmptyPageMessage />
  // }
  const handleShowDraftExamsModal = () => {
    setShowDraftExamsModal(!showDraftExamsModal)
  }
  // if(user.profile.role === UserRole.isStudent && pageExamsType === ExamTypeEnum.isExam) {
  //   exams = exams.filter(exam => {
  //     const nowDate = new Date();
  //     const examShowResultDate = new Date(exam.timers.showResultDate);
  //     const differenceInMilliseconds = nowDate.getTime() - examShowResultDate.getTime();
  //     const differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  //     return !(differenceInMinutes > 60)
  //   })
  // }
  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }
  // const filteredExams = searchText ?
  // exams.filter(x => x.subject.includes(searchText) || x.teacherName.includes(searchText) || x.title.includes(searchText))
  // : exams
  return (
    <Modal
      show
      onHide={() => navigate('/')}
      fullscreen
    >
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>{pageExamsType === ExamTypeEnum.isExam ? 'الإمتحانات' : 'المذاكرات'}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="exams-modal-body">
        <div style={{maxWidth: '700px', margin: '0 auto', width: '100%'}}>
          <div className="d-flex flex-center flex-wrap gap-3 mb-3">
            { userIsTeacher &&(
              <>
                <Button
                  variant="primary"
                  onClick={() => setShowCreateModal(!showCreateModal)}
                >
                  إنشاء إختبار
                </Button>
                {draftExams && draftExams.length !== 0 &&(
                  <Button
                    variant="primary"
                    onClick={handleShowDraftExamsModal}
                  >
                    الأختبارات المعلقة
                    &nbsp;
                    {draftExams.length}
                  </Button>
                )}
              </>
            )}
              <SearchInput
                value={searchText}
                placeHolder="ابحث باستخدام: اسم المادة، المدرس، عنوان الإختبار"
                onChange={onChangeSearchInput}
              />
          </div>
          <div className="flex-container" style={{margin: '0 2px'}}>
            {/* {filteredExams.length > 0 ? (
              filteredExams.map(exam => 
                <ExamItem exam={exam} key={exam._id} user={user}/>
              )
            ) : (
              <div className="empty-page-wrapper">
                <h1>
                  {!searchText ? 
                    `لاتوجد أي ${pageExamsType === ExamTypeEnum.isExam ? 'إمتحانات جارية' : 'مذاكرات'}`
                    : <>
                      <span className="icon-search mx-2" />
                      لم يتم العثور على مطابقة
                    </>
                  }
                </h1>
              </div>
            )} */}
          </div>
        </div>
        <CreateExam 
          showModal={showCreateModal}
          onHideModal={() => setShowCreateModal(!showCreateModal)}
        />
        {/* {draftExams &&(
          <DraftExamsModal
            show={showDraftExamsModal}
            onHide={handleShowDraftExamsModal}
            exams={draftExams}
          />
        )} */}
      </Modal.Body>
    </Modal>
  )
}
