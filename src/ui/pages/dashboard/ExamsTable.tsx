import { Meteor } from "meteor/meteor";
import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { IRecusiveExam } from "../../../../universal/model";
import { Table } from "react-bootstrap";
import { getExamType, showToast } from "../../../ui_helpers/utils";
import ConfirmModal from "../../components/ConfirmModal";
import { ExamTypeEnum } from "../../../../universal/enums";
import { groupEntriesToPages } from "../../../../universal/utils";
import { PAGE_SIZE_FOR_DASH } from "../../../ui_helpers/constants";
import PaginationButtons from "../../components/PaginationButtons";

export default function ExamsTable(props: {
  exams: IRecusiveExam[];
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [examId, setExamId] = useState<string>('');
  const { exams } = props;
  const headRef = useRef<HTMLDivElement | null>(null);
    const currentExams = useMemo(() => {
      return groupEntriesToPages(exams, PAGE_SIZE_FOR_DASH)
    }, [exams])
  const handleHideModal = () => {
    setShowModal(!showModal);
    setExamId('');
  }
  const handleShowModal = (examId: string) => {
    setShowModal(!showModal);
    setExamId(examId)
  }
  const handleDeleteExam = () => {
    Meteor.call(
      'removeExam',
      examId,
      (error: Meteor.Error) => {
        if(error) showToast('error', 'خطأ، لا يمكن حذف الأختبار')
        else {
          showToast('success', 'تم حذف الإختبار بنجاح!')
          handleHideModal();
        }
      }
    )
  }
  const handleSwitchPage = (pageNum: number) => {
    setCurrentPage(pageNum)
    const el = headRef.current
    if(!el) return
    el.scrollIntoView({behavior: 'smooth', block: 'end'})
  }
  return (
    <div>
      <div className="mt-3 table-container" ref={headRef}>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th scope="col">العنوان</th>
              <th scope="col">اسم الأستاذ</th>
              <th scope="col">المادة</th>
              <th scope="col">الصف</th>
              <th scope="col">العام الدراسي</th>
              <th scope="col">نوع الإختبار</th>
              <th scope="col">الخصوصية</th>
              <th scope="col">عدد الأسئلة</th>
              <th scope="col">ناريخ الإنشاء</th>
              <th scope="col">خيارات</th>
            </tr>
          </thead>
          <tbody>
            { currentExams[currentPage - 1] && currentExams[currentPage - 1].map((exam, index) =>
              <tr key={exam._id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-ell">{exam.title}</td>
                <td>{exam.teacherName}</td>
                <td>{exam.subject}</td>
                <td>{exam.className}</td>
                <td>{exam.academicYear ? exam.academicYear : 'لايوجد'}</td>
                <td>{getExamType(exam.type)}</td>
                <td>{exam.isPublic ? 'عام' : 'خاص'}</td>
                <td>{exam.questions.length}</td>
                <td>{exam.createdAt?.toLocaleDateString()}</td>
                <td style={{display: 'flex'}}>
                  <Link className="btn btn-primary" to={`/exams/${exam._id}`}>
                    الأختبار
                  </Link>
                  &nbsp;
                  {exam.type === ExamTypeEnum.isExam && (
                    <Link className="btn btn-primary" to={`/exams/${exam._id}/results`}>
                      النتائج
                    </Link>
                  )}
                  &nbsp;
                  <button
                    className='tool-button'
                    style={{color: 'tomato'}}
                    onClick={() => handleShowModal(exam._id)}
                  >
                    <span className='icon-trash-o'/>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div>
        {props.exams && props.exams.length > 0 && (
          <PaginationButtons
            activePage={currentPage}
            arrayLength={exams.length}
            pageSize={PAGE_SIZE_FOR_DASH}
            onItemClick={handleSwitchPage}
          />
        )}
      </div>
      <ConfirmModal
        show={showModal}
        onHide={handleHideModal}
        title="حذف إختبار"
        description="هل أنت متأكد من حذف الإختبار ؟"
        onConfirm={handleDeleteExam}
      />
    </div>
  )
}
