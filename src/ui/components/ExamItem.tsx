import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import type { IUser, IRecusiveExam } from '../../../universal/model';
import { Link } from 'react-router-dom';
import { checkStudentHasPassedEx } from '../../../universal/utils';
import { useExamTimer } from '../pages/exams/globalTimeFunc';
import { ExamTypeEnum, ExamStateEnum, UserRole } from '../../../universal/enums';
import ConfirmModal from './ConfirmModal';
import { formatDateToArabic, getExamStateText, showToast } from '../../ui_helpers/utils';

export default function ExamItem(props: {
  user?: IUser,
  exam: IRecusiveExam
}) {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const {user,exam} = props;
  const userIsStudentHasPassedExam = checkStudentHasPassedEx(props.user?.profile.exams, props.exam._id);
  const examRef = useRef<HTMLDivElement>(null);
  const { examState, timeFormatter } = useExamTimer(
    props.exam.timers.startDate,
    props.exam.timers.endDate,
    props.exam.timers.showResultDate
  );
  const handleDeleteExam = () => {
    Meteor.call(
      'removeExam',
      props.exam._id,
      (error: Meteor.Error) => {
        if(error) {
          showToast('error', `غير مصرح لك بحذف الإختبار`);
        } else {
          showToast('success', `تم حذف الإختبار بنجاح!`);
          setShowConfirmModal(false);
        }
      }
    )
  }
  const handleShowConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal)
  }
  return (
  <div ref={examRef}>
    <div className='exam-item-container'>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h3 className='ellipsis'>{props.exam.title}</h3>
        <span className="labeled" style={{height: 'fit-content', flexShrink: '0'}}>{props.exam.subject}</span>
      </div>
      <div className='flex-wrap' style={{display: 'flex', justifyContent: 'space-between'}}>
        <span>الأستاذ: {props.exam.teacherName}</span>
        {props.exam.academicYear && (
          <span>العام الدراسي: {props.exam.academicYear}</span>
        )}
      </div>
      <div>
        { exam.type === ExamTypeEnum.isExam &&(
          <span>الحالة: {getExamStateText(examState)}</span>
        )}
      </div>
      <div className='mt-2 flex-wrap gap-1' style={{display: 'flex', justifyContent: 'space-between'}}>
        <div className='d-flex flex-center gap-3 flex-wrap'>
          { user?.profile.name !== UserRole.isStudent ?
            <>
              <Link
                className="btn btn-primary"
                to={`/exams/${props.exam._id}`}
                style={{padding: '3px 6px'}}
              >
                الإختبار
              </Link>
              {exam.type === ExamTypeEnum.isExam && (
                <Link
                  className="btn btn-primary"
                  to={`/exams/${props.exam._id}/results`}
                  style={{padding: '3px 6px'}}
                >
                  النتائج
                </Link>
              )}
            </>
          : exam.type === ExamTypeEnum.isExam ?
            examState === ExamStateEnum.ExamIsStarted ?
              !userIsStudentHasPassedExam ?
                <Link
                  className="btn btn-primary"
                  to={`/exams/${props.exam._id}`}
                  style={{padding: '3px 6px'}}
                >
                  الإخبتار
                </Link>
              :
              <span style={{color: 'lightgreen'}}>انتظار توقيت عرض النتائج</span>
            : examState === ExamStateEnum.ExamIsEnded ?
              userIsStudentHasPassedExam ?
                <Link
                  className="btn btn-primary"
                  to={`/exams/${props.exam._id}/showResult`}
                  style={{padding: '3px 6px'}}
                >
                  النتيجة
                </Link>
              :
                <span style={{color: 'tomato'}}>لقد انتهىى الإختبار</span>
            : null
            :
              <Link
                className="btn btn-primary"
                to={userIsStudentHasPassedExam ? `/exams/${props.exam._id}/results` : `/exams/${props.exam._id}`}
                style={{padding: '3px 6px'}}
              >
                {userIsStudentHasPassedExam ? 'النتيجة' : 'الإختبار'}
              </Link>
          }
          { exam.type === ExamTypeEnum.isExam && examState !== ExamStateEnum.ExamIsEnded &&(
            <span>{timeFormatter()}</span>
          )}
        </div>
        {props.exam.createdAt && (
          <span style={{fontSize: 'small', alignSelf: 'flex-end'}}>{formatDateToArabic(props.exam.createdAt)}</span>
        )}
      </div>
    </div>
    <ConfirmModal
      show={showConfirmModal}
      onHide={handleShowConfirmModal}
      onConfirm={handleDeleteExam}
      title={`حذف إختبار`}
      description='هل أنت متأكد من حذف الإختبار ؟'
      hasAlert
      alertVariant='warning'
      alertMassage='سيتم فقدان جميع بينانات الإختبار ولن تتمكن من الحصول عليها ثانية!'
    />
  </div>
  )
}