import * as React from 'react'
import { useState } from 'react';
import { IRecusiveExam } from '../../../universal/model';
import { getExamTypeText, showToast } from '../../ui_helpers/utils';
import { useNavigate } from 'react-router-dom';
import { ExamTypeEnum } from '../../../universal/enums';
import { Button } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import AddQuestionsForm from './AddQuestionsForm';
import ExamPublishSettings from './ExamPublishSettings';
import ConfirmModal from './ConfirmModal';
import CreateExam from './CreateExam';

export default function ExamOffSideCanvas(props: {
  exam: IRecusiveExam;
  userIsOwner: boolean;
}) {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const handleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  }
  const handleDeleteExam = () => {
    Meteor.call(
      'removeExam',
      props.exam._id,
      (error: Meteor.Error) => {
        if(error) {
          showToast('error', 'غير مصرح لك بحذف الإختبار');
        } else {
          showToast('success', 'تم حذف الإختبار بنجاخ!');
          setShowDeleteModal(false);
          navigate(
            props.exam.type === ExamTypeEnum.isTest ?
            '/tests' : '/exams'
          )
        }
      }
    )
  }
  const handleShowCanvas = () => {
    setShow(!show)
  }
  const handleShowEditModal = () => {
    setShowEditModal(!showEditModal)
  }
  return (
    <>
      <Button
        variant="primary"
        onClick={handleShowCanvas}
        className="me-2 mb-3"
        style={{position: 'sticky', top: '10px'}}
      >
        <span style={{fontSize: '25px'}} className='icon-cog' />
      </Button>
      <Offcanvas show={show} onHide={handleShowCanvas} scroll >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{flex: '1'}}>أدوات التعديل</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='row'>
            <h2>{props.exam.title}</h2>
            <hr />
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <h3>معلومات عامة</h3>
              {props.userIsOwner && (
                <button className='tool-button' onClick={handleShowEditModal}>
                  <span className='icon-pencil'/>
                </button>
              )}
            </div>
            <p className='col-sm-6'>اسم المدرس: &nbsp; {props.exam.teacherName}</p>
            <p className='col-sm-6'>الصف: &nbsp; {props.exam.className}</p>
            <p className='col-sm-6'>المادة: &nbsp; {props.exam.subject}</p>
            <p className='col-sm-6'>عدد الأسئلة: &nbsp; {props.exam.questions.length}</p>
            <p className='col-sm-6'>نوع الإختبار: &nbsp; {getExamTypeText(props.exam.type)}</p>
            <p className='col-sm-6'>
              الخصوصية: &nbsp;
              <span style={{color: props.exam.isPublic ? 'lightgreen' : 'red'}}>
                {props.exam.isPublic ? 'عام' : 'خاص'}
              </span>
            </p>
          </div>
          <hr />
          <div className='row px-3'>
            <AddQuestionsForm 
              examId={props.exam._id}
              userIsOwner={props.userIsOwner}
              examQuestionCount={props.exam.questions.length}
            />
            <ExamPublishSettings
              examId={props.exam._id}
              examIsPublic={props.exam.isPublic}
              examHasTimer={props.exam.hasTimer}
              examTimers={props.exam.timers}
              examType={props.exam.type}
            />
            {props.userIsOwner && (
              <>
                {props.exam.type === ExamTypeEnum.isExam && (
                  <AllowResultsButton
                    examId={props.exam._id}
                    examResultsState={props.exam.showResult}
                    examShowResultDate={props.exam.timers.showResultDate}
                  />
                )}
                <Button variant='danger' onClick={handleShowDeleteModal}>
                  حذف
                  &nbsp;
                  <span className='icon-trash-o'/>
                </Button>
              </>
            )}
            <ConfirmModal
              modalClassName='exam-modals'
              backdropClassName='exam-modals-backdrop'
              show={showDeleteModal}
              onHide={handleShowDeleteModal}
              onConfirm={handleDeleteExam}
              title={'حذف إختبار'}
              description='هل أنت متأكد من حذف الإختبار'
              hasAlert
              alertVariant='warning'
              alertMassage='سيتم فقدان جميع بيانات الإختبار ولن تتمكن من إسترجاعها ثانية'
              hasShadow
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <CreateExam
        modalClassName='exam-modals'
        backdropClassName='exam-modals-backdrop'
        showModal={showEditModal}
        onHideModal={handleShowEditModal}
        isForEdit
        exam={props.exam}
      />
    </>
  );
}

function AllowResultsButton(props: {
  examShowResultDate: string,
  examId: string,
  examResultsState: boolean,
}) {
  const [showConfirmMoadl, setShowConfirmModal] = useState<boolean>(false);
  const nowDate = new Date();
  const examShowResultDate = new Date(props.examShowResultDate);
  const differenceInMilliseconds = examShowResultDate.getTime() - nowDate.getTime();
  const differenceInMinutes = parseInt((differenceInMilliseconds / (1000 * 60)).toFixed(0));
  const handleShowConfirmModal = () => {
    setShowConfirmModal(!showConfirmMoadl)
  }
  const handlePublishResults = () => {
    Meteor.call(
      'exams.allowResults',
      props.examId,
      !props.examResultsState,
      (error: Meteor.Error) => {
        if(!error) {
          handleShowConfirmModal();
          showToast('success',
            !props.examResultsState ? 'تم السماح بعرض النتائج' : 'تم منع عرض النتائج')
        } else showToast('error', `لا يمكن القيام ${!props.examResultsState ? 'بعرض النائج' : 'بإخفاء النتائج'}`)
      }
    )
  }
  const buttonText = props.examResultsState ? 'إخفاء النتائج' : 'السماح بعرض النتائج';
  return (
    <>
      <Button className='mb-3' variant='primary' onClick={handleShowConfirmModal}>
        {buttonText}
      </Button>
      <ConfirmModal
        modalClassName='exam-modals'
        backdropClassName='exam-modals-backdrop'
        title={buttonText}
        description={ !props.examResultsState ?
          differenceInMinutes > 0 ?
          'لم ينته بعد توقيت عرض النتائج، هل أنت متاكد من السماح بعرض النتائج !'
          : 'هل أنت متأكد من عرض النتائج ?'
          : 'هل أنت متأكد من إخفاء النتائج ?'
        }
        onHide={handleShowConfirmModal}
        onConfirm={handlePublishResults}
        show={showConfirmMoadl}
        {...(differenceInMinutes > 0 && !props.examResultsState ?
          {
            hasAlert: true,
            alertMassage: `لا زال هناك ${differenceInMinutes} دقيقة لعرض النتائج`,
            alertVariant: 'warning'
          }
        : {}
        )}
      />
    </>
  )
}