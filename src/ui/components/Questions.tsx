import * as React from 'react';
import { useState } from 'react';
import Markdown from './Markdown';
import type { IQuestion, IUser } from '../../../universal/model';
import Answers from './Answers';
import QuestionImage from './QuestionsImage';
import AddQuestionsForm from './AddQuestionsForm'
import ConfirmModal from './ConfirmModal';
import { showToast } from '../../ui_helpers/utils';
import ToolsMenu from './ToolsMenu';

export default function Questions(props: {
  examId: string,
  questions: IQuestion[],
  user: IUser | undefined,
  userIsOwner: boolean,
  showResultState: boolean,
}) {
  return (
    <div style={{maxWidth: '700px',  margin: '0 auto'}}>
      { props.questions.map((question, questionIndex) => 
        <QuestionItem
          key={question.id}
          examId={props.examId}
          question={question}
          questionIndex={questionIndex}
          user={props.user}
          userIsOwner={props.userIsOwner}
          showResultState={props.showResultState}
        />
      )}
    </div>
  )
}

function QuestionItem(props: {
  examId: string,
  question: IQuestion,
  questionIndex: number,
  userIsOwner: boolean,
  user: IUser | undefined,
  showResultState: boolean,
}) {
  const [showEditQuestionModal, setShowEditQuestionModal] = useState<boolean>(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState<boolean>(false);
  const handleEditQuestion = () => {
    setShowEditQuestionModal(!showEditQuestionModal);
  }
  const handleShowDeleteQuestionModal = () => {
    setShowDeleteQuestionModal(!showDeleteQuestionModal);
  }
  const handleDeleteQuestion = () => {
    Meteor.call(
      'deleteQuestion',
      props.examId,
      props.question.id,
      (error: Meteor.Error) => {
        if(error) showToast('error', 'لم نتمكن من حذف السؤال');
        else {
          showToast('success', 'تم حذف السؤال بنجاح!');
          handleShowDeleteQuestionModal();
        }
      }
    )
  }
  return(
    <div className="question-box mb-3" key={props.examId + props.questionIndex}>
      <div className="title" style={{...(props.userIsOwner ? {paddingRight: '40px', position: 'relative'} : '')}}>
        <Markdown text={props.question.title.text}/>
        { props.question.title.imgSrc &&(<QuestionImage imgId={props.question.title.imgSrc}/>)}
        {props.userIsOwner && (
          <div style={{position: 'absolute', right: '8px', top: '0'}}>
            <ToolsMenu
              handleEditQuestion={handleEditQuestion}
              handleDeleteQuestion={handleShowDeleteQuestionModal}
            />
          </div>
        )}
      </div>
      <div>
        { props.question.answers.map (answer => 
          <Answers
            key={answer.questionId + answer.answerId}
            questionIndex={props.questionIndex}
            answer={answer}
            user={props.user}
            examId={props.examId}
            correctAnswer={props.question.correctAnswer.text}
            showResultState={props.showResultState}
          />
        )}
      </div>
      {showEditQuestionModal &&(
        <AddQuestionsForm 
          examId={props.examId}
          examQuestionCount={props.questionIndex}
          userIsOwner={props.userIsOwner}
          question={props.question}
          isForEdit
          onHide={handleEditQuestion}
        />
      )}
      {showDeleteQuestionModal &&(
        <ConfirmModal
          title='حذف سؤال'
          description='هل أنت متأكد من حذف السؤال'
          onHide={handleShowDeleteQuestionModal}
          onConfirm={handleDeleteQuestion}
          show={showDeleteQuestionModal}
        />
      )}
    </div>
  )
}