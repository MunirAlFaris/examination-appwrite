import * as React from 'react';
import type { IChatUser, IRecusiveChat, IRecusiveMessage, IUser } from '../../../universal/model';
import { Offcanvas, Button } from 'react-bootstrap';
import ChatListItem from './ChatListItem';
import { sortByCreation } from '../../../universal/utils';

export default function ChatsListOffcanvas(props: {
  show: boolean;
  onHide: () => void;
  user: IUser;
  chats: IRecusiveChat[];
  messages: IRecusiveMessage[];
  users: IChatUser[];
  userIsAdmin: boolean;
  handleShowCreateChatModal: () => void;
}) {
  const getChatMessages = (chatId: string) => {
    const filteredMessages = props.messages.filter(x => x.chatId === chatId)
    if(filteredMessages) return filteredMessages.sort(sortByCreation())
    else return [] as IRecusiveMessage[]
  }
  return (
    <Offcanvas
      show={props.show}
      onHide={props.onHide}
      responsive='lg'
      scroll
    >
      <Offcanvas.Header
        closeButton
        className='chat-offcanvas-bg'
        style={{paddingBottom: '0'}}
      >
        <Offcanvas.Title style={{flex: '1'}}>
          المحادثات
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{flexDirection: 'column', paddingTop: '0'}}>
        {props.userIsAdmin && (
          <Button
            type='button'
            variant='primary'
            className='mx-2 mt-3'
            style={{width: 'fit-content'}}
            onClick={props.handleShowCreateChatModal}
          >
            إنشاء محادثة
          </Button>
        )}
        {props.chats.map(chat => 
          <ChatListItem
            key={chat._id}
            chat={chat}
            user={props.user}
            {...(getChatMessages(chat._id).length > 0 ? 
              {
                lastMessage: getChatMessages(chat._id)[0],
                messageCreatorName: props.users.find(x => x._id === getChatMessages(chat._id)[0].createdBy)?.username,
              }
              : 
              {}
            )}
          />
        )}
      </Offcanvas.Body>
    </Offcanvas>
  )
}
