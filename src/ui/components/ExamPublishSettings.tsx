import * as React from 'react';
import type { ChangeEvent } from 'react';
import { Meteor } from 'meteor/meteor';
import { useState } from 'react';
import { Modal, FormGroup, Form, Row, Col, Button } from 'react-bootstrap';
import { ExamTypeEnum } from '../../../universal/enums';
import { getExamTypeText, showToast } from '../../ui_helpers/utils';
import { IExamTimers } from '../../../universal/model';
import ExamRemovePublish from './ExamRemovePublish';


export default function ExamPublishSettings(props:{
  examId: string,
  examIsPublic: boolean,
  examType: ExamTypeEnum,
  examHasTimer: boolean,
  examTimers:IExamTimers,
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [examType, setExamType] = useState<ExamTypeEnum>(props.examType);
  const [hasTimer, setHasTimer] = useState<boolean>(props.examHasTimer);
  const [startDate, setStartDate] = useState<string>(props.examTimers.startDate);
  const [endDate, setEndDate] = useState<string>(props.examTimers.endDate);
  const [showResultDate, setShowResultDate] = useState<string>(props.examTimers.showResultDate);
  const [examTimer, setExamTimer] = useState<number>(props.examTimers.examTime);
  const handleShowModal = () => {
    setShowModal(!showModal);
  }
  const handleChangeExamType = (event: ChangeEvent<HTMLSelectElement>) => {
    setExamType((event.target.value) as ExamTypeEnum)
    setStartDate('');
    setEndDate('');
    setShowResultDate('');
    setHasTimer(false);
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    Meteor.call('exams.updateExamTypeAndTimers', props.examId, {
      type: examType,
      hasTimer: hasTimer,
      isPublic: true,
      timers: {
        examTime: examTimer,
        startDate: startDate,
        endDate: endDate,
        showResultDate: showResultDate,
      },
    }, (error: Meteor.Error) => {
      if (error) {
        showToast('error', !props.examIsPublic ? "لم نتمكن من نشر الإختبار" : "لم نتمكن من تعديل بيانات النشر")
      } else {
        showToast('success', !props.examIsPublic ? 'تم نشر الإختبار بنجاح' : 'تم تعديل بيانات نشر الإختبار بنجاح')
        setShowModal(false);
      }
    });
  }
  return (
    <>
      <button className='btn btn-primary mb-3 ml-3' onClick={handleShowModal}>
        إعدادات النشر
      </button>
      <Modal
        show={showModal}
        onHide={handleShowModal}
        fullscreen={'md-down'}
        size='lg'
        className="exam-modals"
        backdropClassName="exam-modals-backdrop"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{flex: '1'}}>
            إعدادات النشر 
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <FormGroup className='mb-3' controlId='exam-type'>
              <Form.Label>
                نوع الأختبار:
              </Form.Label>
              <Form.Select value={examType} onChange={handleChangeExamType}>
                {Object.keys(ExamTypeEnum).map(type => 
                  <option key={type} value={ExamTypeEnum[type]}>{getExamTypeText(ExamTypeEnum[type])}</option>
                )}
              </Form.Select>
            </FormGroup>
            {examType === ExamTypeEnum.isExam &&(
              <ExamTimers 
                startDate={startDate}
                endDate={endDate}
                showResultDate={showResultDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                setShowResultDate={setShowResultDate}
              />
            )}
            {examType !== ExamTypeEnum.Unset &&(
              <FormGroup className='mb-3'>
                <Form.Switch
                  id="exam-timer-switch"
                  checked={hasTimer}
                  label="تمكي مؤقت الإختبار"
                  onChange={() => setHasTimer(!hasTimer)}
                />
              </FormGroup>
            )}
            {hasTimer &&(
              <FormGroup className='mb-3' controlId='exam-timer'>
                <Form.Label>
                  مؤقت الإختبار (بالدقائق):
                </Form.Label>
                <Form.Control
                  type='number'
                  value={examTimer}
                  onChange={(e) => setExamTimer(Number(e.target.value))}
                  required
                />
              </FormGroup>
            )}
            {examType !== ExamTypeEnum.Unset &&(
              <FormGroup>
                <Button variant='primary' type='submit'>
                  {!props.examIsPublic ? 'نشر' : 'تعديل'}
                </Button>
                <ExamRemovePublish
                  examId={props.examId}
                  examIsPublic={props.examIsPublic}
                />
              </FormGroup>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

function ExamTimers(props: {
  startDate: string,
  endDate: string,
  showResultDate: string,
  setStartDate: React.Dispatch<React.SetStateAction<string>>,
  setEndDate: React.Dispatch<React.SetStateAction<string>>,
  setShowResultDate: React.Dispatch<React.SetStateAction<string>>,
}) {
  return (
    <Row className='mb-3'>
      <Form.Group className='mb-2' as={Col} controlId="startDate">
        <Form.Label>تاريخ البدء:</Form.Label>
        <Form.Control
          type="datetime-local"
          value={props.startDate}
          onChange={(e) => props.setStartDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-2' as={Col} controlId="endDate">
        <Form.Label>تاريخ الإنتهاء:</Form.Label>
        <Form.Control
          type="datetime-local"
          value={props.endDate}
          onChange={(e) => props.setEndDate(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group className='mb-2' as={Col} controlId="resultDate">
        <Form.Label>تاريخ عرض النتائج:</Form.Label>
        <Form.Control
          type="datetime-local"
          value={props.showResultDate}
          onChange={(e) => props.setShowResultDate(e.target.value)}
          required
        />
      </Form.Group>
    </Row>
  )
}