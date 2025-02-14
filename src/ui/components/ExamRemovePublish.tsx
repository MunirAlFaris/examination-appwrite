import * as React from 'react';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { showToast } from '../../ui_helpers/utils';

export default function ExamRemovePublish(props: {
  examId: string,
  examIsPublic: boolean,
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = () => {
    setShowModal(!showModal);
  }
  const handleSetExamAsPrivate = () => {
    Meteor.call('exams.updateExamTypeAndTimers', props.examId, {
      isPublic: false,
      timers: {
        ExamTime: '',
        startDate: '',
        endDate: '',
        showResultDate: '',
      },
    }, (error: Meteor.Error) => {
      if (error) {
        showToast('error', 'نتمكن من إخفاء الإختبار')
      } else {
        showToast('success', 'الإختبار أصبح خاصاً الآن')
        setShowModal(false);
      }
    });
  }
  return (
    <>
      { props.examIsPublic &&(
        <>
        <button className='btn btn-danger mx-3' type='button' onClick={handleShowModal}>
          إخفاء الإختبار
        </button>
        <Modal
          show={showModal}
          onHide={handleShowModal}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          contentClassName='modal-shadow'
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter" style={{flex: '1'}}>
              إخفاء الإختبار
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            سيؤدي إخفاء الإختبار إلى إيقاف كل المؤقتات ولن يتمكن أي طالب من رؤية الإختبار
            <br />
            لن يتمكن أي طالب من رؤية الإختبار أو استعراض النتيجة!
          </Modal.Body>
          <Modal.Footer>
            <Button variant='danger' onClick={handleSetExamAsPrivate}>
              إخفاء
            </Button>
          </Modal.Footer>
        </Modal>
        </>
      )}
    </>
  )
}