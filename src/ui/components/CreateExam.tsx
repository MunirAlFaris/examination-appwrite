import { FormEvent, useState } from "react";
// import { useTracker } from "meteor/react-meteor-data";
// import { useNavigate } from 'react-router-dom';
import { IExam, IRecusiveExam } from "../../../universal/model";
import { Modal, Button, Form, Row } from "react-bootstrap";
import { useUser } from "../../lib/contexts";
import { ExamTypeEnum } from "../../../universal/enums";
import { createDocument } from "../../lib/methods";
import { EXAMS_COL_ID } from "../../ui_helpers/constants";
import { showToast } from "../../ui_helpers/utils";
import { useNavigate } from "react-router-dom";
// import { ExamTypeEnum, UserRole } from "../../../universal/enums";
// import { showToast } from "../../ui_helpers/utils";
// import ExamPublishSettings from "./ExamPublishSettings";

export default function CreateExam(props: {
  showModal: boolean,
  onHideModal: () => void,
  isForEdit?: boolean,
  exam?: IRecusiveExam,
  modalClassName?: string,
  backdropClassName?: string,
}) {
  const user = useUser()[0];
  const {exam, isForEdit} = props;
  const [title, setTitle] = useState<string>(exam ? exam.title : '');
  // const [className, setClassName] = useState<string>(exam ? exam.className : '');
  // const [subject, setSubject] = useState<string>(exam ? exam.subject : '');
  const [academicYear, setAcademicYear] = useState<string>(exam ? exam.academicYear : '');
  const history = useNavigate();
  // const user = useTracker(() => Meteor.user() as IUser);
  // if(!user || user.profile.role !== UserRole.isTeacher) {
  //   return
  // }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(!user) return
    if(!isForEdit) {
      const collectedData: IExam = {
        title: title,
        createdAt: new Date(),
        // subject: subject ? subject : user.profile.subjects ? user.profile.subjects[0] : '',
        subject: 'arabic',
        teacherId: user.$id,
        // className: className ? className : user.profile.classNames ? user.profile.classNames[0] : '',
        className: '12',
        type: ExamTypeEnum.Unset,
        academicYear: academicYear,
        hasTimer: false,
        showResult: false,
        examTime: 0,
        startDate: '',
        endDate: '',
        showResultDate: '',
        isPublic: false,
      }
      createDocument(
        EXAMS_COL_ID,
        collectedData,
        (res: string) => {
          showToast('success', 'تم إنشاء الإختبار بنجاح!')
          history(`/exams/${res}`);
        },
        () => showToast('error', 'لم نتمكن من إنشاء الإختبار')
      )
      // Meteor.call(
      //   'exams.create',
      //   collectedData,
      //   (error: Meteor.Error, result: string) => {
      //     if(error) {
            
      //     } else {
      //       showToast('success', 'تم إنشاء الإختبار بنجاح!')
      //       history(`/exams/${result}`);
      //     }
      //   }
      // );
    } else {
      return
      // if(exam)
      // Meteor.call(
      //   'exams.updateInfo',
      //   exam._id,
      //   title,
      //   subject,
      //   className,
      //   academicYear,
      //   (error: Meteor.Error) => {
      //     if(error)
      //       showToast('error', 'لم نتمكن من تعديل الإختبار')
      //     else {
      //       showToast('success', 'تم تعديل الإختبار بنجاح!')
      //       props.onHideModal()
      //     }
      //   }
      // )
    }
  }
  return (
    <Modal
      show={props.showModal}
      onHide={props.onHideModal}
      fullscreen='md-down'
      size="lg"
      centered
      {...(props.modalClassName ? {className: props.modalClassName} : {})}
      {...(props.backdropClassName ? {backdropClassName: props.backdropClassName} : {})}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>{!isForEdit ? 'إنشاء إختبار' : 'تعديل الإختبار'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="exam-title">
            <Form.Label>عنوان الإختبار:</Form.Label>
            <Form.Control placeholder="ادخل عنوان الإختبار" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="exam-academic-year">
            <Form.Label>العام الدراسي:</Form.Label>
            <Form.Control placeholder="ادخل العام الدراسي" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}/>
          </Form.Group>
          <Row>
          {/* { user &&  user.profile.classNames && user.profile.classNames.length > 1 ?
            <Form.Group as={Col} style={{minWidth: '137px'}} controlId="class-name" className="mb-3">
              <Form.Label>الصف:</Form.Label>
              <Form.Select defaultValue={className ? className : "unset"} onChange={(e) => setClassName(e.target.value)}>
                <option value="unset" hidden>اختر الصف</option>
                { user.profile.classNames.map(className => 
                  <option key={className} value={className}>{className}</option>
                )}
              </Form.Select>
            </Form.Group>
          : null} */}
          {/* { user &&  user.profile.subjects && user.profile.subjects.length > 1 ?
            <Form.Group as={Col} style={{minWidth: '137px'}} controlId="subject" className="mb-3">
              <Form.Label>المادة:</Form.Label>
              <Form.Select defaultValue={subject ? subject : "unset"} onChange={(e) => setSubject(e.target.value)}>
                <option value="unset" hidden>اختر المادة</option>
                { user.profile.subjects.map(subject => 
                  <option key={subject} value={subject}>{subject}</option>
                )}
              </Form.Select>
            </Form.Group>
          : null} */}
          </Row>
          <Button variant="primary" type="submit">
            {!isForEdit ? 'إنشاء' : 'تعديل'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}