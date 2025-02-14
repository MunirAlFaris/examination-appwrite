import * as React from 'react';
import type { IRecusiveChat, IRecusiveMessage, IUser } from '../../../universal/model';
import { useNavigate } from 'react-router-dom';
import { formatDateToArabic } from '../../ui_helpers/utils';

export default function ChatListItem(props: {
  chat: IRecusiveChat;
  lastMessage?: IRecusiveMessage;
  messageCreatorName?: string;
  unreadMessagesCount?: number;
  user: IUser;
}) {
  const navigate = useNavigate();
  const handleSetChat = () => {
    navigate(`/chats/${props.chat._id}`)
  }
  const userIsOwner = props.lastMessage ? props.user._id === props.lastMessage.createdBy : false
  return (
    <div className='chat-item' onClick={handleSetChat}>
      <img className='chat-image' src={props.chat.imgSrc} alt="chat-image" />
      <div className='chat-item-container'>
        <div className='chat-item-header'>
          <div className='ellipsis' style={{fontSize: '18px'}}>{props.chat.name}</div>
          <div style={{fontSize: '10px', flexShrink: '0'}}>{formatDateToArabic(props.chat.createdAt)}</div>
        </div>
        <div className='chat-item-body'>
          {props.lastMessage ? (
            <div className='ellipsis'>
              {`${userIsOwner ? 'أنت' : props.messageCreatorName}: ${props.lastMessage.text}`}
            </div>
          ) : (
            <>
              انشأها: {props.chat.creatorName}
            </>
          )}
        </div>
      </div>
    </div>
  )
}