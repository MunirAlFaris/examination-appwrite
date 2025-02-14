import * as React from 'react';
import type { IUser, IRecusiveChat } from '../../../../universal/model';
import { useState } from 'react';
import { Dropdown, Table } from "react-bootstrap";
import UserImg from '../../components/UserImg';
import { Link } from 'react-router-dom';
import { getChatPrivicyText, showToast } from '../../../ui_helpers/utils';
import ConfirmModal from '../../components/ConfirmModal';
import { ChatTypeEnum } from '../../../../universal/enums';

export default function ChatsTable (props: {
  chats: IRecusiveChat[];
  users: IUser[];
  userId: string;
}) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [chatId, setChatId] = useState<string>('');
  const handleShowModal = (chatId: string) => {
    setShowModal(!showModal);
    setChatId(chatId)
  }
  const handleHideModal = () => {
    setShowModal(false);
    setChatId('');
  }
  const handleRemoveChat = () => {
    if(chatId)
    Meteor.call(
      'removeChat',
      chatId,
      props.userId,
      (error: Meteor.Error) => {
        if(!error) {
          showToast('success', 'تم حذف المحادثة بنجاح!')
          handleHideModal();
        }
        else showToast('error', 'خطأ، لايمكن حذف المحادثة');
      }
    )
  }
  return (
    <div className="mt-3 table-container">
      <Table bordered striped hover>
        <thead>
          <tr>
            <th className="text-center">#</th>
            <th scope="col">اسم المحادثة</th>
            <th scope="col">وصف المحادثة</th>
            <th scope="col">الخصوصية</th>
            <th scope="col">المشرفون</th>
            <th scope="col">السماح بالرسائل</th>
            <th scope="col">تاريخ الإنشاء</th>
            <th scope="col">خيارات</th>
          </tr>
        </thead>
        <tbody>
          { props.chats && props.chats.map((chat, index) =>
            <tr key={chat._id}>
              <td className="text-center">{index + 1}</td>
              <td className="text-ell">{chat.name}</td>
              <td>{chat.description ? chat.description : 'There is not description'}</td>
              <td>{getChatPrivicyText(chat.type as ChatTypeEnum)}</td>
              <td>
                {chat.adminsList ? (
                  <AdminsList admins={props.users.filter(x => chat.adminsList?.includes(x._id))} />
                ) : (
                  'لايوجد مشرفين'
                )}
              </td>
              <td>{chat.allowMessages ? 'مسموح' : 'غير مسموح'}</td>
              <td>{chat.createdAt?.toLocaleDateString()}</td>
              <td style={{display: 'flex'}}>
                <Link className="btn btn-primary" to={`/chats/${chat._id}`}>
                  المحادثة
                </Link>
                &nbsp;
                &nbsp;
                <button
                  className='tool-button'
                  style={{color: 'tomato'}}
                  onClick={() => handleShowModal(chat._id)}
                >
                  <span className='icon-trash-o'/>
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <ConfirmModal
        show={showModal}
        onHide={handleHideModal}
        title="حذف المحادثة"
        description="هل أنت متأكد من حذف المحادثة ؟"
        onConfirm={handleRemoveChat}
      />
    </div>
  )
}

function AdminsList(props: {admins: IUser[]}) {
  return (
    <>
      {props.admins.length >= 1 ? (
        <Dropdown>
          <Dropdown.Toggle variant="secondary">
            المشرفون
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {props.admins.map(admin => 
              <Dropdown.Item key={admin._id} style={{color: 'white'}} disabled>
                <div className="user-item">
                  <div>
                    <UserImg
                      userRole={admin.profile.name}
                      userGender={admin.profile.gender}
                      style={{
                        width: 35,
                        height: 35,
                        marginLeft: 10,
                        borderRadius: "50%",
                      }}
                    />
                    {admin.username}
                  </div>
                </div>
              </Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      ) : ('There is no admins')}
    </>
  )
}