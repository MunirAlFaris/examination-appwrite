import * as React from 'react';
import type { ISExam } from '../../../universal/model';
import { Link } from 'react-router-dom';
import { useExamTimer } from '../pages/exams/globalTimeFunc';
import { formatDate } from '../../../universal/utils';
import { ExamTypeEnum, ExamStateEnum } from '../../../universal/enums';

export default function StudentExamItem(props: {exam: ISExam}) {
  const { examState } = useExamTimer(
    props.exam.timers.startDate,
    props.exam.timers.endDate,
    props.exam.timers.showResultDate
  );
  return(
    <li>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h4 className='ellipsis'>{props.exam.examTitle}</h4>
        <span style={{fontSize: 'small', flexShrink: '0'}}>{formatDate(props.exam.passedAt)}</span>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap'}}>
        <span>الأستاذ: {props.exam.teacherName}</span>
        <span className="labeled">{props.exam.examSubject}</span>
      </div>
      <div className="mt-3" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap'}}>
        { props.exam.type === ExamTypeEnum.isExam && (
          examState === ExamStateEnum.ExamIsEnded ? (
            <Link to={`/exams/${props.exam.examId}/showResult`} className="btn btn-primary">النتيجة</Link>
          ) : (
            <span>يمكنك عرض النتيجة بعد إنتهاء وقت الإمتحان</span>
          )
        )}
        {props.exam.type === ExamTypeEnum.isTest && (
          <Link to={`/exams/${props.exam.examId}/showResult`} className="btn btn-primary">النتيجة</Link>
        )}
        العلامة: {props.exam.result}
      </div>
    </li>
  )
}