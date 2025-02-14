import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { IAnswer, IUser } from '../../../universal/model';
import clsx from 'clsx';
import { checkStudentHasPassedEx } from '../../../universal/utils';
import Markdown from './Markdown';
import { UserRole } from '../../../universal/enums';

export default function Answers(props: {
  examId: string,
  questionIndex: number,
  answer: IAnswer,
  user: IUser | undefined,
  correctAnswer: string,
  showResultState: boolean,
}) {
  const [checked, setChecked] = useState<boolean>(false);
  const {showResult} = useParams();
  const answerId = props.answer.questionId + props.answer.answerId;
  const handleUserAnwsers = (answerType: 'truesAnswersInputs' | 'falseAnswersInputs'): boolean | undefined => {
    return showResult && props.showResultState ? (
      checkStudentHasPassedEx(props.user?.profile.exams, props.examId)
        && props.user?.profile.exams?.find(
          x => x.examId === props.examId
        )?.inputsIDs[answerType].includes(answerId)
      )
    : false
  }
  const inputIsChecked =
    props.user ?
      props.user.profile.role === UserRole.isStudent ?
        (handleUserAnwsers('truesAnswersInputs') || handleUserAnwsers('falseAnswersInputs') || checked)
      : props.correctAnswer === props.answer.text
    : false
    const inputIsDisabled =
      props.user ?
        props.user.profile.role === UserRole.isStudent ?
          checkStudentHasPassedEx(props.user?.profile.exams, props.examId)
        : true
      : true
  return (
    <div 
      className={clsx({
        answerId: true,
        "answer mt-2": true,
        "true" : handleUserAnwsers('truesAnswersInputs'),
        "false": handleUserAnwsers('falseAnswersInputs'),
        'right': !handleUserAnwsers('truesAnswersInputs') && !handleUserAnwsers('falseAnswersInputs') && props.correctAnswer === props.answer.text && showResult
      })}>
      <label>
        <input
          className="form-check-input"
          checked={inputIsChecked}
          value={props.answer.text}
          type="radio"
          name={props.answer.questionId}
          onChange={() => setChecked(!checked)}
          disabled={inputIsDisabled}
          id={answerId}
        />
        &nbsp;
        &nbsp;
        <Markdown text={props.answer.text}/>
      </label>
    </div>
  )
}