import { Meteor } from "meteor/meteor";
import React, { useState, useMemo, useRef } from "react";
import type { IUser } from "../../../../universal/model";
import { Button, Table, Dropdown } from "react-bootstrap";
import { EditingOptionsEnum, UsersFilterEnum } from "../../../../universal/enums";
import { getUserRoleText, showToast, usersFilter } from "../../../ui_helpers/utils";
import ConfirmModal from "../../components/ConfirmModal";
import AddEditUserModal from "../../components/AddEditUserModal";
import FilterButton from "../../components/FilterButton";
import { PAGE_SIZE_FOR_DASH, usersFilterOptions } from "../../../ui_helpers/constants";
import PaginationButtons from "../../components/PaginationButtons";
import { groupEntriesToPages } from "../../../../universal/utils";

export default function Users(props: {
  users: IUser[];
  onlyStudents?: boolean;
  onlyTeachers?: boolean;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<EditingOptionsEnum | false>();
  const [filterOption, setFilterOption] = useState<UsersFilterEnum>(UsersFilterEnum.All);
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const { users } = props;
  const headRef = useRef<HTMLDivElement | null>(null);
  const currentUsers = useMemo(() => {
    return groupEntriesToPages(users, PAGE_SIZE_FOR_DASH)
  }, [users])
  const handleHideModal = () => {
    setShowModal(!showModal);
    setModalType(false);
  }
  const handleShowModal = (type: EditingOptionsEnum, selectedUser?: IUser) => {
    setShowModal(!showModal);
    setModalType(type)
    setSelectedUser(selectedUser);
  }
  const handleDeleteUser = () => {
    Meteor.call(
      'removeUser',
      selectedUser?._id,
      (error: Meteor.Error) => {
        if(error) showToast('error', 'خطأ، لم نتمكن من حذف المستخدم')
        else {
          showToast('success', 'تم حذف المستخدم بنجاح!')
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
  const handleFilterUsers = () => {
    if(!props.onlyStudents && !props.onlyTeachers) {
      return usersFilter(currentUsers[currentPage - 1], filterOption)
    } else {
      return currentUsers[currentPage - 1]
    }
  }
  return (
    <div>
      <div
        className="d-flex gap-2 flex-wrap my-3"
        style={{alignItems: 'center'}}
        ref={headRef}
      >
        <Button
          variant="primary"
          onClick={() => handleShowModal(EditingOptionsEnum.Add)}
        >
          أضف مستخدما
        </Button>
        {!props.onlyStudents && !props.onlyTeachers && (
          <FilterButton
            value={filterOption}
            options={usersFilterOptions}
            onSelect={(e) => setFilterOption(e.target.value as UsersFilterEnum)}
          />
        )}
      </div>
      <div className="table-container">
        <Table bordered striped hover>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th scope="col">الاسم الكامل</th>
              <th scope="col">تاريخ الولادة</th>
              <th scope="col">اسم المستخدم</th>
              <th scope="col">الرقم الشخصي/كلمة المرور</th>
              { props.onlyStudents ? (
                <>
                  <th scope="col">الصف</th>
                  <th scope="col">ضيف</th>
                </>
              ) : props.onlyTeachers ? (
                <>
                  <th scope="col">الصفوف</th>
                  <th scope="col">المواد</th>
                </>
              ) : (
                <>
                  <th scope="col">الرتبة</th>
                </>
              )}
              <th scope="col">الجنس</th>
              <th scope="col">تاريخ الدخول</th>
              <th scope="col">خيارات</th>
            </tr>
          </thead>
          <tbody>
            { handleFilterUsers() && handleFilterUsers().map((user: IUser, index: number) =>
              <tr key={user._id}>
                <td className="text-center">{index + 1}</td>
                <td>{user.profile.name || 'غير موجود'}</td>
                <td>{user.profile.birthDay || 'غير موجود'}</td>
                <td>{user.username}</td>
                <td>{user.profile.personalNumber || 'غير موجود'}</td>
                {props.onlyStudents ? (
                  <>
                    <td>{user.profile.currentStudentClass}</td>
                    <td>{user.profile.isGuest ? 'ضيف' : 'طالب رسمي'}</td>
                  </>
                ) : props.onlyTeachers ? (
                  <>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary">
                          الصفوف
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {user.profile.classNames?.map(className => 
                            <Dropdown.Item key={className} style={{color: 'white'}} disabled>
                              {className}
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary">
                          المواد
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {user.profile.subjects?.map(subject => 
                            <Dropdown.Item key={subject} style={{color: 'white'}} disabled>
                              {subject}
                            </Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </>
                ) : (
                  <td>{getUserRoleText(user.profile.role || '')}</td>
                )}
                <td>{user.profile.gender === 'male' ? 'ذكر' : "أنثى"}</td>
                <td>{user.createdAt?.toLocaleDateString()}</td>
                <td style={{display: 'flex'}}>
                  <button
                    className='tool-button'
                    onClick={() => handleShowModal(EditingOptionsEnum.Edit, user)}
                  >
                    <span className='icon-pencil'/>
                  </button>
                  <button
                    className='tool-button'
                    style={{color: 'tomato'}}
                    onClick={() => handleShowModal(EditingOptionsEnum.Remove, user)}
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
        {props.users && props.users.length > 0 && (
          <PaginationButtons
            activePage={currentPage}
            arrayLength={props.users.length}
            pageSize={PAGE_SIZE_FOR_DASH}
            onItemClick={handleSwitchPage}
          />
        )}
      </div>
      <ConfirmModal
        show={showModal && modalType === EditingOptionsEnum.Remove}
        onHide={handleHideModal}
        title="حذف مستخدم"
        description="هل أنت متأكد من حذف المستخدم ؟"
        onConfirm={handleDeleteUser}
      />
      <AddEditUserModal
        show={showModal && modalType !== EditingOptionsEnum.Remove}
        onHide={handleHideModal}
        {...(
          showModal && modalType !== EditingOptionsEnum.Remove
          && selectedUser ?
          {user: selectedUser} : {}
        )}
        type={modalType}
      />
    </div>
  )
}
