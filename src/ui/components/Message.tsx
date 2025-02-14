import * as React from 'react';
import type { IChatUser, IRecusiveMessage } from '../../../universal/model';
import type { RefObject } from 'react';
import { useState } from 'react';
import Markdown from './Markdown';
import { formatDateByHourAndPeriod, getUserImgSrc } from '../../ui_helpers/utils';
import { Dropdown } from 'react-bootstrap';
import { useRef } from 'react';
import { useOutsideClick, setElementRef } from '../../ui_helpers/utils';
import clsx from 'clsx';
import { EditingOptionsEnum, UserRole } from '../../../universal/enums';
import removeMd from 'remove-markdown';
import { useUpdateVisibileEntriesFnContext } from '../../ui_helpers/contexts';

export default function Message(props: {
  message: IRecusiveMessage;
  ownerUser: IChatUser | undefined;
  userId: string;
  messagesAllowed: boolean;
  replayedMessage?: {text: string, userName: string, userIsOwner: boolean};
  showImageAndName: boolean;
  messagesRefs: RefObject<{[index: string]: HTMLDivElement | null}>;
  handleSelectMessage: () => void;
  handleUpdateInputAction: (action: EditingOptionsEnum) => void;
  userRole: string;
  color: string;
  parentColor?: string;
  userIsAdmin?: boolean;
}) {
  const { time, period } = formatDateByHourAndPeriod(props.message.createdAt);
  const userIsOwner = props.userId === props.ownerUser?._id
  const onReply = () => {
    props.handleSelectMessage();
    props.handleUpdateInputAction(EditingOptionsEnum.Reply)
  }
  const handleUpdateVisibileEntriesLength = useUpdateVisibileEntriesFnContext();
  const scrollToEntry = () => {
    const parentEntryId = props.message.parentId ? props.message.parentId : '';
    const scrollHandler = () => {
      let timer = 0;
      if (!props.messagesRefs) return;
      if (
        props.messagesRefs.current &&
        props.messagesRefs.current[parentEntryId]
      ) {
        props.messagesRefs.current[parentEntryId].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        props.messagesRefs.current[parentEntryId].classList.add('scrolled-to');
        const animationClassTimer = setInterval(() => {
          timer++;
          if (timer >= 6) {
            if (
              props.messagesRefs &&
              props.messagesRefs.current &&
              props.messagesRefs.current[parentEntryId]
            )
              props.messagesRefs.current[parentEntryId].classList.remove(
                'scrolled-to',
              );
            clearInterval(animationClassTimer);
          }
        }, 500);
      }
    };
    if (props.messagesRefs && props.messagesRefs.current) {
      if (!props.messagesRefs.current[parentEntryId]) {
        handleUpdateVisibileEntriesLength(parentEntryId);
        setTimeout(() => {
          scrollHandler();
        }, 0);
      } else {
        scrollHandler();
      }
    }
  };
  const handleRemoveMessgae = () => {
    Meteor.call('removeMessage', props.message._id)
  }
  const onEdit = () => {
    props.handleSelectMessage();
    props.handleUpdateInputAction(EditingOptionsEnum.Edit)
  }
  return (
    <div
      id={props.message._id}
      className={
      clsx({
        'message': true,
        'left': !userIsOwner,
        'right': userIsOwner,
      })
      }
      ref={(el) => {
        if(!props.messagesRefs) return
        setElementRef(el, props.messagesRefs, props.message._id)
      }}
    >
      {props.ownerUser ? (
        <div className='message-container'>
          {props.showImageAndName ? (
            <img
              className='chat-image user-image'
              src={getUserImgSrc(props.ownerUser.profile.role, props.ownerUser.profile.gender)}
              alt="user-image"
            />
          ) : (
            <div
              className='chat-image user-image'
              style={{
                border: 'none',
                ...(userIsOwner ? {
                  width: '0',
                  height: '0',
                  margin: '0 5px',
                } : {})
              }}
            />
          )}
          <div className={
            clsx({
              'message-wrapper': true,
              'owner': userIsOwner,
            })
          }>
            {props.userId !== props.message.createdBy && props.showImageAndName && (
              <div className='message-username' style={{color: props.color}}>{props.ownerUser.username}</div>
            )}
            {props.replayedMessage && props.replayedMessage.text && (
              <div
                className={clsx({'reply-input-container meesage-reply': true, 'owner': userIsOwner})}
                style={{cursor: 'pointer'}}
                onClick={scrollToEntry}
              >
                <div
                  className={
                    clsx({
                      'side-col': true,
                      'owner': props.replayedMessage.userIsOwner
                    })
                  }
                  style={props.parentColor ? {backgroundColor: props.parentColor} : {}}
                />
                <div className='reply-text-wrapper'>
                  <div
                    className={clsx({'reply-text-user-name': true, 'owner': props.replayedMessage.userIsOwner})}
                    style={props.parentColor ? {color: props.parentColor} : {}}
                  >
                    {props.replayedMessage.userIsOwner ? 'أنت' : props.replayedMessage.userName}
                  </div>
                  <div className='reply-text-msg-text'>
                    {removeMd(props.replayedMessage.text)}
                  </div>
                </div>
              </div>
            )}
            <div className='message-text'>
              <div style={{paddingBottom: '5px'}}>
                <Markdown text={props.message.text} />
              </div>
              <span className='message-time'>
                {props.message.isEdited && ('تم تعديلها')}
                &nbsp;
                {`${time} ${period}`}
              </span>
            </div>
            <MessageTools
              userIsOwner={userIsOwner}
              userRole={props.userRole}
              userId={props.userId}
              userIsAdmin={props.userIsAdmin}
              messageUserId={props.message.createdBy}
              onDelete={handleRemoveMessgae}
              onReply={onReply}
              onEdit={onEdit}
              messagesAllowed={props.messagesAllowed}
            />
          </div>
          </div>
      ) : (
        <b>تم حذف هذا المستخدم بواسطة المدير</b>
      )}
    </div>
  )
}

function MessageTools(props: {
  userIsOwner: boolean;
  userRole: string;
  userId: string;
  userIsAdmin?: boolean;
  messageUserId: string;
  messagesAllowed: boolean;
  onDelete: () => void;
  onReply: () => void;
  onEdit: () => void;
}) {
  const [showToolsBtn, setShowToolsBtn] = useState<boolean>(false);
  const handleHideToolBtn = () => {
    setShowToolsBtn(false);
  }
  const menuRef = useRef<HTMLDivElement | null>(null);
  useOutsideClick(menuRef, handleHideToolBtn);
  return (
    <>
      {(props.messagesAllowed || props.userIsOwner || props.userIsAdmin) && (
        <div
          ref={menuRef}
          className={
            clsx({
              'message-tool-btn-wrapper': true,
              'owner': props.userIsOwner,
              'visible': showToolsBtn
            })
          }
          onClick={() => setShowToolsBtn(true)}
        >
          <Dropdown>
            <Dropdown.Toggle className='message-tool-btn'>
              <span className='icon-chevron-down'/>
            </Dropdown.Toggle>
            <Dropdown.Menu as='ul'>
              {props.messagesAllowed && (
                <Dropdown.Item
                  as='li'
                  className='tool-list-item'
                  onClick={props.onReply}
                >
                  رد
                </Dropdown.Item>
              )}
              {(props.userRole === UserRole.isAdmin
              || props.userId === props.messageUserId
              || props.userIsAdmin
              )
              && (
                <>
                  <Dropdown.Item
                    as='li'
                    className='tool-list-item'
                    onClick={props.onDelete}
                  >
                    حذف
                  </Dropdown.Item>
                  {props.messagesAllowed && (
                    <Dropdown.Item
                      as='li'
                      className='tool-list-item'
                      onClick={props.onEdit}
                    >
                      تعديل
                    </Dropdown.Item>
                  )}
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}
    </>
  )
}