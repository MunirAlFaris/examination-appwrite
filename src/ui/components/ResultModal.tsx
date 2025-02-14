import * as React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { ExamTypeEnum } from '../../../universal/enums';

export default function ResultModal(props: {
  show: boolean,
  result: number,
  onHide: () => void,
  examType: ExamTypeEnum,
  studentResult?: number,
}) {
  const [showTime, setShowTime] = useState<number>(10);
  const history = useNavigate();
  const hideModal = (timerName: any) => {
    clearTimeout(timerName);
    props.onHide();
    if(props.examType === ExamTypeEnum.isExam) history('/exams/');
  }
  const timer = setTimeout(() => {
    setShowTime(showTime - 1);
    if(showTime <= 0) {
      hideModal(timer)
    }
  },1000)
  if(props.examType === ExamTypeEnum.isTest) clearTimeout(timer);
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton={props.examType === ExamTypeEnum.isTest}>
        <Modal.Title id="contained-modal-title-vcenter" style={{flex: '1'}}>
          {props.examType === ExamTypeEnum.isExam ?
            'لقد تم إرسال النتيجة بنجاح!'
          : 
            'رائع لقد انتهيت من حل المذاكرة بنجاح'
          }
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>النتيجة:</h4>
        <p>
          {props.studentResult ? props.studentResult : props.result}
          <br />
          {props.examType === ExamTypeEnum.isExam &&(
            <>
              سيتم إعادة توجيهك الى صغحة الإختبارات بعد
              &nbsp;
              {showTime} ثانية
            </>
          )}
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => hideModal(timer)}>
          {props.examType === ExamTypeEnum.isExam ?
          'العودة إلى صفحة الإختبارات' : 'أغلق'
          }
        </Button>
      </Modal.Footer>
    </Modal>
  );
}