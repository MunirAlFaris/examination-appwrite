import * as React from 'react';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { showToast } from './../../ui_helpers/utils';
import ConfirmModal from './ConfirmModal'

export default function ChatHeader(props: {
  imgSrc: string;
  name: string;
  chatId: string;
  createdBy: string;
  userIsAdmin?: boolean;
  handleShowChatsList: () => void;
  handleShowChatInfo: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className='chat-header'>
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row-reverse'}}>
        <span
          className='icon-arrow-left chat-header-icon-color'
          style={{fontSize: '30px', cursor: 'pointer'}}
          onClick={() => navigate('/chats')}
        />
        <img className='chat-image single-chat' src={props.imgSrc} alt="chat-image" />
        <div>{props.name}</div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row-reverse'}}>
        <span
          className='icon-chat mx-2 canvas-button-chat hidden-sm chat-header-icon-color'
          style={{fontSize: '30px', cursor: 'pointer', marginTop: '-2px'}}
          onClick={props.handleShowChatsList}
        />
        <ChatMenu
          chatId={props.chatId}
          createdBy={props.createdBy}
          handleShowChatInfo={props.handleShowChatInfo}
          userIsAdmin={props.userIsAdmin}
        />
      </div>
    </div>
  )
}

function ChatMenu(props: {
  chatId: string,
  createdBy: string,
  handleShowChatInfo: () => void;
  userIsAdmin?: boolean;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const handleShowDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  }
  const handleDeleteChat = () => {
    Meteor.call(
      'removeChat',
      props.chatId,
      props.createdBy,
      (error: Meteor.Error) => {
        if(!error) showToast('success', 'تم حذف المحادثة بنجاح')
        else showToast('error', 'خطأ، لا يمكن حذف المحادثة')
      }
    )
  }
  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          className='menu-btn'
        >
          <span
            className='icon-dots-three-vertical chat-header-icon-color'
            style={{fontSize: '20px', cursor: 'pointer', marginTop: '-2px'}}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {props.userIsAdmin && (
            <Dropdown.Item onClick={handleShowDeleteModal}>
              حذف المحادثة
            </Dropdown.Item>
          )}
          <Dropdown.Item onClick={props.handleShowChatInfo}>
            معلومات المحادثة
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <ConfirmModal
        title='حذف المحادثة'
        description='هل انت متأكد من حذف المحادثة'
        show={showDeleteModal}
        onHide={handleShowDeleteModal}
        onConfirm={handleDeleteChat}
        hasShadow
        modalSize='md'
        hasAlert
        alertMassage='سيتم فقدان كل معلومات المحادثة ولن يمكن استراجاعها مطلقا!'
        alertVariant='danger'
      />
    </>
  )
}