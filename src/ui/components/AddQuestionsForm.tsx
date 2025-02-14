import React, { useState } from "react";
import type { IQuestion, IAnswer, IUser } from "../../../universal/model";
import { extractId } from "../../../universal/utils";
import { Modal, Button, Form } from "react-bootstrap";
import Markdown from "./Markdown";
import { showToast } from "../../ui_helpers/utils";
import TextEditor from "./TextEditor";

export default function AddQuestionsForm(props: {
  examQuestionCount: number,
  examId: string,
  userIsOwner: boolean,
  isForEdit?: boolean,
  question?: IQuestion,
  onHide?: () => void,
}) {
  const [showQuestionsForm, setShowQuestionsForm] = useState<boolean>(props.isForEdit ? props.isForEdit : false);
  const [answerCount, setAnswersCount] = useState<number>(props.question ? props.question.answers.length : 2);
  const [titleImg, setTitleImg] = useState<string>(props.question && props.question.title.imgSrc ? props.question.title.imgSrc : '');
  const [questionTitle, setQuestionTitle] = useState<string>(props.question ? props.question.title.text : '');
  const [a1, setA1] = useState<string>(props.question && props.question.answers[0] ? props.question.answers[0].text : '');
  const [a2, setA2] = useState<string>(props.question && props.question.answers[1] ? props.question.answers[1].text : '');
  const [a3, setA3] = useState<string>(props.question && props.question.answers[2] ? props.question.answers[2].text : '');
  const [a4, setA4] = useState<string>(props.question && props.question.answers[3] ? props.question.answers[3].text : '');
  const [a5, setA5] = useState<string>(props.question && props.question.answers[4] ? props.question.answers[4].text : '');
  const [ca, setCa] = useState<string | false>(props.question && props.question.correctAnswer ? props.question.correctAnswer.text : false);
  const [prevText, setPrevText] = useState<string>('');
  const questionId = `q-${props.examQuestionCount + 1}`
  const handleShowQuestionsForm = () => {
    if(props.onHide) props.onHide();
    else setShowQuestionsForm(!showQuestionsForm);
  }
  const handleDecIncAnswerCount = (type: "DEC" | 'INC') => {
    if(type === 'INC') {
      if(!(answerCount >= 5)) {
        setAnswersCount(answerCount + 1);
      }
    } else {
      switch(answerCount) {
        case 2:
          break;
        case 3:
          setAnswersCount(answerCount - 1)
          setA3('');
          if(ca === a3) setCa(false);
          break;
        case 4:
          setAnswersCount(answerCount - 1)
          setA4('');
          if(ca === a4) setCa(false);
          break;
        case 5:
          setAnswersCount(answerCount - 1)
          setA5('');
          if(ca === a5) setCa(false);
          break;
      }
    }
  }
  const fillteredAnswers = () => {
    let answers: IAnswer[] = [];
    if(a1) 
      answers.push({text: a1, questionId: questionId, answerId: '-a-1'})
    if(a2) 
      answers.push({text: a2, questionId: questionId, answerId: '-a-2'})
    if(a3) 
      answers.push({text: a3, questionId: questionId, answerId: '-a-3'})
    if(a4) 
      answers.push({text: a4, questionId: questionId, answerId: '-a-4'})
    if(a5) 
      answers.push({text: a5, questionId: questionId, answerId: '-a-5'})
    return answers as IAnswer[];
  }
  const question: IQuestion = {
    title: {
      text: questionTitle,
      imgSrc: extractId(titleImg) || '',
    },
    id: `q-${props.examQuestionCount + 1}`,
    answers: fillteredAnswers(),
    correctAnswer: fillteredAnswers().filter(x => x.text === ca)[0],
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(props.isForEdit) {
      Meteor.call('updateQuestion', props.examId, questionId, question,
        (error: Meteor.Error) => {
          if(error) showToast('error', 'لم نتمكن من تعديل السؤال');
          else {
            showToast('success', 'تم تعديل السؤال بنجاح!');
            if(props.onHide) props.onHide();
          }
        }
      )
    } else {
      Meteor.call(
        'addQuestion',
        props.examId, question,
        (error: Meteor.Error) => {
          if(error) showToast('error', 'لم نتمكن من إضافة السؤال');
          else showToast('success', 'تمت إضافة السؤال بنجاح!');
        }
      );
      setTitleImg('');
      setQuestionTitle('');
      setA1('');
      setA2('');
      setA3('');
      setA4('');
      setA5('');
      setCa(false);
    }
  }
const addAnswers = () => {
  const answers = [
    { value: a1, setter: setA1, placeholder: "الإجابة 1", checkedValue: a1 },
    { value: a2, setter: setA2, placeholder: "الإجابة 2", checkedValue: a2 },
    { value: a3, setter: setA3, placeholder: "الإجابة 3", checkedValue: a3 },
    { value: a4, setter: setA4, placeholder: "الإجابة 4", checkedValue: a4 },
    { value: a5, setter: setA5, placeholder: "الإجابة 5", checkedValue: a5 },
  ];

  switch (answerCount) {
    case 2:
      return (
        <>
          {answers.slice(0, 2).map((answer, index) => (
            <div className="answer-input mb-3" key={index}>
              <input
                type="radio"
                checked={!!(ca && ca === answer.checkedValue)}
                name="correctAnswer"
                value={answer.checkedValue}
                onChange={(e) => setCa(e.target.value)}
                required
              />
              &nbsp;&nbsp;
              <Form.Control
                as="textarea"
                value={answer.value}
                onChange={(e) => answer.setter(e.target.value)}
                placeholder={answer.placeholder}
              />
            </div>
          ))}
        </>
      );
    case 3:
      return (
        <>
          {answers.slice(0, 3).map((answer, index) => (
            <div className="answer-input mb-3" key={index}>
              <input
                type="radio"
                checked={!!(ca && ca === answer.checkedValue)}
                name="correctAnswer"
                value={answer.checkedValue}
                onChange={(e) => setCa(e.target.value)}
                required
              />
              &nbsp;&nbsp;
              <Form.Control
                as="textarea"
                value={answer.value}
                onChange={(e) => answer.setter(e.target.value)}
                placeholder={answer.placeholder}
              />
            </div>
          ))}
        </>
      );
    case 4:
      return (
        <>
          {answers.slice(0, 4).map((answer, index) => (
            <div className="answer-input mb-3" key={index}>
              <input
                type="radio"
                checked={!!(ca && ca === answer.checkedValue)}
                name="correctAnswer"
                value={answer.checkedValue}
                onChange={(e) => setCa(e.target.value)}
                required
              />
              &nbsp;&nbsp;
              <Form.Control
                as="textarea"
                value={answer.value}
                onChange={(e) => answer.setter(e.target.value)}
                placeholder={answer.placeholder}
              />
            </div>
          ))}
        </>
      );
    case 5:
      return (
        <>
          {answers.slice(0, 5).map((answer, index) => (
            <div className="answer-input mb-3" key={index}>
              <input
                type="radio"
                checked={!!(ca && ca === answer.checkedValue)}
                name="correctAnswer"
                value={answer.checkedValue}
                onChange={(e) => setCa(e.target.value)}
                required
              />
              &nbsp;&nbsp;
              <Form.Control
                as="textarea"
                value={answer.value}
                onChange={(e) => answer.setter(e.target.value)}
                placeholder={answer.placeholder}
              />
            </div>
          ))}
        </>
      );
    default:
      return null;
  }
};

  return (
    <>
      { props.userIsOwner ?
      <>
      {!props.isForEdit &&(
        <button className="btn btn-primary mb-3" onClick={handleShowQuestionsForm}>
          إضافة سؤال
        </button>
      )}
      <Modal className="exam-modals" backdropClassName="exam-modals-backdrop" show={showQuestionsForm || props.isForEdit} fullscreen={'md-down'} onHide={handleShowQuestionsForm} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{flex: '1'}}>{!props.isForEdit ? 'إضافة سؤال' : 'تعديل سؤال'}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{paddingTop: '0'}}>
          <form className="row" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label 
                htmlFor="formGroupExampleInput1"
                className="form-label"
              >
                عنوان السؤال:
              </label>
              <TextEditor
                text={questionTitle}
                onChange={({text}) => setQuestionTitle(text)}
                setText={(text: string) => setQuestionTitle(prev => prev + text)}
              />
            </div>
            {addAnswers()}
            <div>
              {answerCount !== 5 && (
                <Button
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    padding: '0'
                  }}
                  variant="secondary"
                  onClick={() => handleDecIncAnswerCount('INC')}
                >
                  +
                </Button>
              )}
              &nbsp;
              &nbsp;
              {answerCount !== 2 && (
                <Button
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    padding: '0'
                  }}
                  variant="secondary"
                  onClick={() => handleDecIncAnswerCount('DEC')}
                >
                  &minus;
                </Button>
              )}
            </div>
            <div className="mb-3" style={{display: "flex", justifyContent: 'center'}}>
              <button type='submit' className='btn btn-primary'>
                {props.isForEdit ? 'تعديل' : 'أضف'}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      </>
      : null}
    </>
  )
}