import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import { useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import { IRecusiveExam } from '../../../universal/model';
import { Link } from 'react-router-dom';
import { formatDate } from '../../../universal/utils';
import { showToast } from '../../ui_helpers/utils';
import ConfirmModal from './ConfirmModal';

export default function DraftExamsModal(props: {
  show: boolean,
  onHide: () => void,
  exams: IRecusiveExam[],
}) {
  return(
    <Modal
      show={props.show}
      onHide={props.onHide}
      fullscreen='md-down'
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title style={{flex: '1'}}>
          الإختبارات المعلقة
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.exams.map(exam => 
          <DraftExamItem exam={exam} key={exam._id}/>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='primary' onClick={props.onHide}>أغلق</Button>
      </Modal.Footer>
    </Modal>
  )
}

function DraftExamItem(props: {
  exam: IRecusiveExam,
}) {
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
          showToast('success', 'تم حذف النقاش بنجاح');
          setShowDeleteModal(false);
        }
      }
    )
  }
  return (
    <div className='draft-exam'>
      <div className='draft-flex-container'>
        <h3>{props.exam.subject}</h3>
        <span>{props.exam.createdAt.toLocaleDateString()}</span>
      </div>
      <div className='draft-flex-container'>
        <span style={{fontSize: '20px'}}>{props.exam.title}</span>
        <div>
          <Link className='btn btn-primary' to={`/exams/${props.exam._id}`}>الإختبار</Link>
          &nbsp;
          &nbsp;
          <Button variant='danger' onClick={handleShowDeleteModal}>
            حذف
            &nbsp;
            <span className='icon-trash-o' />
          </Button>
        </div>
      </div>
      <ConfirmModal
        show={showDeleteModal}
        onHide={handleShowDeleteModal}
        onConfirm={handleDeleteExam}
        title={'حذف الأختبار'}
        description='هل أنت متأكد من حذف الإختبار'
        hasAlert
        alertVariant='warning'
        alertMassage='ستفقد جميع بيانات الإختبار ولن تتمكن من استراجها مطلقا!'
        hasShadow
        modalSize='sm'
      />
    </div>
  )
}