import * as React from 'react';
import type { IUser, IMessage, IRecusiveMessage, IChatUser } from '../../../universal/model';
import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { EditingOptionsEnum } from '../../../universal/enums';
import removeMd from 'remove-markdown';
import clsx from 'clsx';

export default function ChatInput(props: {
  user: IUser;
  chatId: string;
  ownerUser?: IChatUser | undefined;
  selectedMessage?: IRecusiveMessage;
  action: EditingOptionsEnum;
  replyText?: string;
  onHide: () => void;
  replyColor?: string;
}) {
  const { user, chatId } = props
  const [text, setText] = useState<string>(props.action === EditingOptionsEnum.Edit && props.selectedMessage ? props.selectedMessage.text : '');
  const userIsOwner = props.ownerUser ? props.ownerUser._id === props.user._id : false
  const handleAddMessage = () => {
    if(text.trim() !== '') {
      if(props.action !== EditingOptionsEnum.Edit) {
        const message: IMessage = {
          chatId: chatId,
          text: text,
          createdAt: new Date(),
          createdBy: user._id,
          ...(props.action === EditingOptionsEnum.Reply && props.selectedMessage ? {parentId: props.selectedMessage._id} : {})
        }
        Meteor.call(
          'addMessage',
          message,
          (error: Meteor.Error) => {
            if(!error) {
              setText('')
              props.onHide()
            }
            else console.log(error)
          }
        )
      }
    } else {
      setText('');
    }
    if(props.action === EditingOptionsEnum.Edit) {
      if(props.selectedMessage && text.trim() !== '')
      Meteor.call(
        'editMessage',
        props.selectedMessage._id,
        text,
        (error: Meteor.Error) => {
          if(!error) {
            setText('');
            props.onHide();
          }
        }
      )
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if(window.screen.width > 767) {
        event.preventDefault();
        handleAddMessage();
      }
    }
  }
  return (
    <div className='chat-input'>
      {props.action !== EditingOptionsEnum.Add && props.selectedMessage && props.ownerUser &&(
        <div className='input-wrapper'>
          <div className='reply-input-container'>
            <div
              className={clsx({'side-col': true, 'owner': userIsOwner})}
              style={props.replyColor ? {backgroundColor: props.replyColor} : {}}
            />
            <div className='reply-text-wrapper'>
              <div
                className={clsx({'reply-text-user-name': true, 'owner': userIsOwner})}
                style={props.replyColor ? {color: props.replyColor} : {}}
              >
                {userIsOwner ? 'أنت' : props.ownerUser.username}
              </div>
              <div className='reply-text-msg-text'>
                {removeMd(props.selectedMessage.text)}
              </div>
            </div>
          </div>
          <div className='input-close-btn' onClick={props.onHide}>
            <span className='icon-close' />
          </div>
        </div>
      )}
      <div className='input-wrapper'>
        <textarea
          value={text}
          className='chat-input-feild'
          onChange={e => setText(e.target.value)}
          placeholder='أضف رسالة!'
          onKeyDown={handleKeyUp}
        />
        <Button
          type='button'
          className='chat-send-button'
          onClick={handleAddMessage}
        >
          <span className='icon-send' />
        </Button>
      </div>
    </div>
  )
}