import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import type { IChatUser, IRecusiveChat, IRecusiveMessage, IUser } from '../../../../universal/model';
import { useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Button, Modal } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Chats as ChatsColl, Messages } from '../../../../universal/collections';
import CreateChatModal from '../../components/CreateChatModal';
import Loader from '../../components/loader';
import ChatsListOffcanvas from '../../components/ChatsListOffcanvas';
import Chat from './Chat';
import ChatListItem from '../../components/ChatListItem';
import { UserRole } from '../../../../universal/enums';
import { sortByCreation } from '../../../../universal/utils';
import EmptyPageMessage from '../../components/EmptyPageMessage';

interface IDataLoading {
  loading: true,
  users: undefined,
  chats: undefined,
  messages: undefined,
}

interface IDataFound {
  loading: false,
  users: IChatUser[],
  chats: IRecusiveChat[],
  messages: IRecusiveMessage[],
}

export default function Chats() {
  const [showCreateChatModal, setShowCreateChatModal] = useState<boolean>(false);
  const [showChatsList, setShowChatsList] = useState<boolean>(false);
  const { chatId } = useParams();
  const handleShowChatsList = () => {
    setShowChatsList(!showChatsList);
  }
  const navigate = useNavigate();
  const user = useTracker(() => Meteor.user() as IUser)
  const data = useTracker(() => {
    const handle = Meteor.subscribe('chats');
    if(!handle.ready()) return {loading: true, users: undefined, chats: undefined, messages: undefined} as IDataLoading
    return {
      loading: false,
      users: Meteor.users.find({}).fetch(),
      chats: ChatsColl.find({}).fetch(),
      messages: Messages.find({}).fetch(),
    } as IDataFound
  })
  const {users, chats, messages, loading} = data;
  if(!user || user.profile.isGuest) return <EmptyPageMessage />
  if(loading) return <Loader />
  const handleShowCreateChatModal = () => {
    setShowCreateChatModal(!showCreateChatModal);
  }
  const getChatMessages = (chatId: string) => {
    const filteredMessages = messages.filter(x => x.chatId === chatId)
    if(filteredMessages) return filteredMessages.sort(sortByCreation())
    else return [] as IRecusiveMessage[]
  }
  const chat = chats.find(x => x._id === chatId);
  return (
    <>
      <Modal
        show
        fullscreen
        onHide={() => navigate('/')}
      >
        <Modal.Body style={{padding: '0', overflow: 'hidden'}} className='chat-modal-bg'>
          <div style={{height: '100%', display: 'flex', flexDirection: 'row-reverse'}}>
            <div className='col left-canvas left-canvas-chats'>
              <ChatsListOffcanvas
                show={showChatsList}
                onHide={handleShowChatsList}
                user={user}
                chats={chats}
                messages={messages}
                users={users}
                userIsAdmin={user.profile.role === UserRole.isAdmin}
                handleShowCreateChatModal={handleShowCreateChatModal}
              />
            </div>
            <div className="col chats-md-col" style={{padding: '0', maxHeight: '100%'}}>
              {chat ? (
                <Chat
                  chat={chat}
                  messages={getChatMessages(chat._id)}
                  users={users}
                  handleShowChatsList={handleShowChatsList}
                />
              ) : (
                <div style={{height: '100%', maxHeight: '100%'}}>
                  <div className='chat-header' style={{maxHeight: '9%'}}>
                    <div style={{display: 'flex',width: '100%', alignItems: 'center', flexDirection: 'row-reverse'}}>
                      <span
                        className='icon-arrow-left chat-header-icon-color'
                        style={{fontSize: '30px', cursor: 'pointer'}}
                        onClick={() => navigate('/')}
                      />
                      <h3 style={{margin: '0'}}>المحادثات</h3>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                      {user.profile.role === UserRole.isAdmin && (
                        <Button
                          type='button'
                          variant='primary'
                          className='mx-2'
                          style={{width: 'fit-content'}}
                          onClick={handleShowCreateChatModal}
                        >
                          إنشاء محادثة
                        </Button>
                      )}
                      
                    </div>
                  </div>
                  <div className='main-chats-container'>
                    {chats.map(chat => 
                      <ChatListItem
                        key={chat._id}
                        chat={chat}
                        user={user}
                        {...(getChatMessages(chat._id).length > 0 ? 
                          {
                            lastMessage: getChatMessages(chat._id)[0],
                            messageCreatorName: users.find(x => x._id === getChatMessages(chat._id)[0].createdBy)?.username,
                          }
                          : 
                          {}
                        )}
                      />
                    )}
                  </div>
                  <div className='no-chat-placeholder'>
                    <span className='icon-chat' />
                    <span>أدخل محادثة لتبدأ الدردشة</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <CreateChatModal
        show={showCreateChatModal}
        onHide={handleShowCreateChatModal}
        users={users}
        user={user}
      />
    </>
  )
}