import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import type { IRecusiveMessage, IRecusiveChat, IUser, IChatUser, IMessage } from '../../../../universal/model';
import { useState, useMemo, Fragment, useRef, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import ChatInput from '../../components/ChatInput';
import Message from '../../components/Message';
import { EditingOptionsEnum, UserRole } from '../../../../universal/enums';
import { formatDateByDay, getMessageDateKey, groupMessagesByDate, sortByCreationReversed } from '../../../../universal/utils';
import { PAGE_SIZE } from '../../../ui_helpers/constants';
import { LoadPrevNextContext } from '../../../ui_helpers/contexts';
import PaginationContainer from '../../components/PaginationContainer';
import { assignUniqueColor, hasPreviousOrNextEntries, updateLastVisitLocalStorageDate, userColors } from '../../../ui_helpers/utils';
import ChatHeader from '../../components/ChatHeader';
import ChatInfo from '../../components/ChatInfo';
import EmptyPageMessage from '../../components/EmptyPageMessage';

interface IUserLastVisitLocalStorageData {
  messageId: string;
}

export default function (props: {
  chat: IRecusiveChat;
  messages: IRecusiveMessage[];
  users: IChatUser[];
  handleShowChatsList: () => void;
}) {
  const messages = props.messages.sort(sortByCreationReversed())
  const lastVisitLocalStorageData: IUserLastVisitLocalStorageData | '' =
    JSON.parse(localStorage.getItem(props.chat._id) || '{}');
  const getLastVisitedEntryIndex = () => {
    let lastVisitedEntryIndex = -1;
    let newSliceEnd: number | undefined;
    let newSliceStart: number;
    if (lastVisitLocalStorageData)
      lastVisitedEntryIndex = messages.findIndex(
        (x) => x._id === lastVisitLocalStorageData.messageId,
      );
    if (lastVisitedEntryIndex + 1 >= messages.length - PAGE_SIZE) {
      newSliceStart = -PAGE_SIZE - 10;
      newSliceEnd = undefined;
    } else {
      newSliceStart = 0;
      newSliceEnd =
        lastVisitLocalStorageData && lastVisitedEntryIndex !== -1
          ? lastVisitedEntryIndex + PAGE_SIZE
          : PAGE_SIZE;
    }
    return {
      sliceStart: newSliceStart,
      sliceEnd: newSliceEnd,
    };
  };
  const [userColorMap, setUserColorMap] = useState<Record<string, string>>({});
  const [assignedColors] = useState<Set<string>>(new Set());
  const [messagesIds, setMessagesIds] = useState<string>(
    props.messages.map((x) => x.text).join(','),
  );
  const [sliceStart, setSliceStart] = useState<number>(getLastVisitedEntryIndex().sliceStart);
  const [showChatInfo, setShowChatInfo] = useState<boolean>(false);
  const [sliceEnd, setSliceEnd] = useState<number | undefined>(getLastVisitedEntryIndex().sliceEnd);
  const [startSliceFromEntry, setStartSliceFromEntry] = useState<boolean>(false);
  const [sliceCount, setSliceCount] = useState<number>(PAGE_SIZE);
  const [isReachToBottom, setIsReachToBottom] = useState<boolean>(false);
  const [currentMessagees, setCurrentMessages] = useState<IRecusiveMessage[]>(
    messages.slice(
      getLastVisitedEntryIndex().sliceStart,
      getLastVisitedEntryIndex().sliceEnd
    ).slice(-PAGE_SIZE)
  );
  const latestEntryIds = messages.map((x) => x.text).join(',');
  if (messagesIds !== latestEntryIds) {
    setCurrentMessages(props.messages.slice(sliceStart, sliceEnd).slice(-sliceCount));
    setMessagesIds(latestEntryIds);
  }
  const [isVisitedBefore, setIsVisitedBefore] = useState<boolean>(false);
  const [selectedMessage, setSelectedMessage] = useState<IRecusiveMessage | null>();
  const [inputAction, setInputAction] = useState<EditingOptionsEnum>(EditingOptionsEnum.Add);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<{id: string, count: number} | undefined>(undefined);
  const user = useTracker(() => Meteor.user()) as IUser;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const messagesRefs = useRef<{[index: string]: HTMLDivElement | null}>({});
  const dateStickyMsgRef = useRef<HTMLDivElement | null>(null);
  const lastMessage = messages[messages.length - 1];
  const userIsAdmin = props.chat.adminsList && props.chat.adminsList.includes(user._id)
  const allowMessages = user.profile.role === UserRole.isAdmin
  || user._id === props.chat.createdBy ||
  userIsAdmin || props.chat.allowMessages;
  const hasPreviousEntries = hasPreviousOrNextEntries(
    currentMessagees.map((x) => x._id),
    messages.map((x) => x._id),
    'PREV',
  );
  if(!user) return <EmptyPageMessage />
  const handleSetMessage = (message: IRecusiveMessage) => {
    setSelectedMessage(message);
  }
  const handleUpdateInputAction = (action: EditingOptionsEnum) => {
    setInputAction(action)
  }
  const getReplyedMessageData = (messageId: string) => {
    const parentMessage = props.messages.find(x => x._id === messageId)
    const ownerUser = props.users.find(x => x._id === parentMessage?.createdBy)
    return {
      text: parentMessage?.text || '',
      userName: ownerUser?.username || '',
      userIsOwner: parentMessage?.createdBy === user._id || false
    }
  }
  const getUnreadMessagesCount = () => {
    if (lastVisitLocalStorageData) {
      const lastVisitedEntryIndex = messages.findIndex(
        (x) => x._id === lastVisitLocalStorageData.messageId,
      );
      const nextMessage = messages[lastVisitedEntryIndex + 1]
      if(lastVisitedEntryIndex !== -1 && nextMessage && nextMessage.createdBy !== user._id)
      return messages.length - lastVisitedEntryIndex - 1;
    }
    return 0;
  };
  const groupedMessages = useMemo(() => {
    return groupMessagesByDate(props.messages)
  }, [props.messages])
  const getFirstMessageOfDateGroup = (messageId: string, messageCeateDate: Date) => {
    const messageDateKey = getMessageDateKey(messageCeateDate);
    const messageDateGroup = groupedMessages[messageDateKey];
    if (messageDateGroup) {
      if (messageDateGroup[0] === messageId)
        return formatDateByDay(new Date(messageDateKey));
    }
    return undefined;
  };
  const detectLastAndFirstVisibleEntry = () => {
    const chatContainer = containerRef.current;
    if (!chatContainer) return;
    const containerBounds = chatContainer.getBoundingClientRect();
    const children = Array.from(chatContainer.children);
    let firstVisibleEntryId: string | null = null;
    let lastVisibleEntryId: string | null = null;
    children.forEach((child) => {
      const childBounds = child.getBoundingClientRect();
      if (
        childBounds.top >= containerBounds.top &&
        childBounds.bottom <= containerBounds.bottom
      ) {
        if (!firstVisibleEntryId) {
          firstVisibleEntryId = child.id;
        }
        lastVisibleEntryId = child.id;
      }
    });
    if (firstVisibleEntryId) {
      const firstVisibleEntry = messages.find(
        (x) => x._id === firstVisibleEntryId,
      );
      if (firstVisibleEntry && dateStickyMsgRef.current) {
        const messageDateKey = getMessageDateKey(firstVisibleEntry.createdAt);
        const messageIsExistInDateGroup =
        groupedMessages[messageDateKey].includes(firstVisibleEntryId);
        dateStickyMsgRef.current.textContent = messageIsExistInDateGroup
          ? formatDateByDay(new Date(messageDateKey))
          : '';
      }
    }
  };
  const onCallScroll = () => {
    const chatContainer = containerRef.current;
    if (messages.length !== 0 && chatContainer) {
      if (isReachToBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
        if (lastVisitLocalStorageData) {
          lastVisitLocalStorageData.messageId = lastMessage._id;
          updateLastVisitLocalStorageDate(props.chat._id, lastVisitLocalStorageData);
        }
      }
    }
  };
  const onScroll = () => {
    const chatContainer = containerRef.current;
    if (!chatContainer) return;
    detectLastAndFirstVisibleEntry();
    if (dateStickyMsgRef.current) {
      if (chatContainer.scrollTop <= 35 && !hasPreviousEntries) {
        dateStickyMsgRef.current.parentElement?.classList.add('hide-fade-top');
      } else {
        dateStickyMsgRef.current.parentElement?.classList.remove(
          'hide-fade-top',
        );
      }
    }
  };
  const showUnreadMessage = (message: IRecusiveMessage) => {
    const nextMessageIndex = messages.findIndex(x => x._id === message._id)
    if(nextMessageIndex === -1) return false
    return (
      unreadMessagesCount
        && message._id === unreadMessagesCount.id
        && messages[nextMessageIndex + 1] && messages[nextMessageIndex + 1].createdBy !== user._id
    )
  }
  const getParentMessage = (parentId: string) => {
    const message = messages.find(x => x._id === parentId)
    if(message) {
      return message
    }
    return undefined
  }
  const handleShowChatInfo = () => {
    setShowChatInfo(!showChatInfo)
  }
  useEffect(() => {
    if (!lastVisitLocalStorageData && messages.length !== 0) {
      const visitingData: IUserLastVisitLocalStorageData = {
        messageId: lastMessage._id,
      };
      updateLastVisitLocalStorageDate(props.chat._id, visitingData);
    } else {
      if (lastVisitLocalStorageData && !isVisitedBefore) {
        const lastEntryInViewId = lastVisitLocalStorageData.messageId;
        setStartSliceFromEntry(true);
        setTimeout(() => {
          if (messagesRefs.current[lastEntryInViewId])
            messagesRefs.current[lastEntryInViewId].scrollIntoView({
              block: 'center',
            });
        }, 1);
      }
      if (!isVisitedBefore) setIsVisitedBefore(true);
    }
    if(isReachToBottom && messages.length !== 0) {
      updateLastVisitLocalStorageDate(props.chat._id, {messageId: lastMessage._id})
    }
  }, [isVisitedBefore, isReachToBottom, lastMessage]);
  useEffect(() => {
    if(props.messages.length === 0) return
    if(unreadMessagesCount?.count !== getUnreadMessagesCount() && getUnreadMessagesCount() !== 0) {
      if(lastVisitLocalStorageData)
      setUnreadMessagesCount({
        id: lastVisitLocalStorageData.messageId,
        count: getUnreadMessagesCount(),
      })
    }
    if(isReachToBottom) {
      setTimeout(() => {
        setUnreadMessagesCount(undefined)
      }, 3e4)
    }
  }, [currentMessagees, isReachToBottom, lastVisitLocalStorageData])
  useEffect(() => {
    const uniqueUsers = messages.reduce<Record<string, boolean>>((acc, message) => {
      if (!acc[message.createdBy]) {
        acc[message.createdBy] = true; // Mark user as encountered
      }
      return acc;
    }, {});
    const userIds = Object.keys(uniqueUsers);
    userIds.forEach(message => {
      if (!userColorMap[message]) {
        const color = assignUniqueColor(userColors, assignedColors); // Corrected call
        setUserColorMap(prev => ({ ...prev, [message]: color }));
      }
    });
  }, [props.messages])
  return (
    <div className='chat-container'>
      <div className='chat-container-wrapper'>
        {showChatInfo && (
          <ChatInfo
            chat={props.chat}
            users={props.users}
            user={user}
            handleShowChatInfo={handleShowChatInfo}
            userIsAdmin={userIsAdmin}
          />
        )}
        <div className='chat-bg-image' />
        <ChatHeader
          imgSrc={props.chat.imgSrc}
          name={props.chat.name}
          handleShowChatsList={props.handleShowChatsList}
          chatId={props.chat._id}
          createdBy={props.chat.createdBy}
          handleShowChatInfo={handleShowChatInfo}
          userIsAdmin={user.profile.role === UserRole.isAdmin}
        />
        <LoadPrevNextContext.Provider
          value={{
            sliceStartState: [sliceStart, setSliceStart],
            sliceEndState: [sliceEnd, setSliceEnd],
            sliceCountState: [sliceCount, setSliceCount],
            entries: messages,
            currentEntriesState: [currentMessagees, setCurrentMessages],
          }}
        >
          <PaginationContainer
            containerRef={containerRef}
            entriesRefs={messagesRefs}
            startSliceFromEntry={startSliceFromEntry}
            isReachToBottom={isReachToBottom}
            handleIsReachToBottom={(state: boolean) => setIsReachToBottom(state)}
            handleStartSliceFromEntry={(state: boolean) =>
              setStartSliceFromEntry(state)}
            onCallScroll={onCallScroll}
            onScroll={onScroll}
            hideTopArrow
            {...(getUnreadMessagesCount() !== 0 && !isReachToBottom ? {unreadMessagesCount: getUnreadMessagesCount()} : {})}
            {...(messages.length > 0
              ? {
                  outsideContainerChildren: (
                    <div className="middle-message-wrapper sticky hide-fade-top">
                      <span
                        className="middle-message"
                        ref={dateStickyMsgRef}
                      ></span>
                    </div>
                  ),
                }
              : {})}
          >
            {currentMessagees.map(message => 
              <Fragment key={message._id}>
                {getFirstMessageOfDateGroup(message._id, message.createdAt) && (
                  <div
                    className="middle-message-wrapper"
                    style={{ padding: '5px 0 10px' }}
                  >
                    <span className="middle-message">
                      {getFirstMessageOfDateGroup(message._id, message.createdAt)}
                    </span>
                  </div>
                )}
                <Message
                  message={message}
                  messagesRefs={messagesRefs}
                  ownerUser={props.users.find(x => x._id === message.createdBy)}
                  userId={user._id}
                  handleSelectMessage={() => handleSetMessage(message)}
                  handleUpdateInputAction={handleUpdateInputAction}
                  userRole={user.profile.role}
                  color={userColorMap[message.createdBy]}
                  messagesAllowed={allowMessages}
                  userIsAdmin={userIsAdmin}
                  parentColor={
                    message.parentId ?
                    getParentMessage(message.parentId)?.createdBy !== user._id ?
                    userColorMap[getParentMessage(message.parentId)?.createdBy || '']
                      : undefined
                    : undefined
                  }
                  showImageAndName={
                    user._id !== message.createdBy ?
                    props.messages.indexOf(message) === 0 ?
                      true :
                      !!getFirstMessageOfDateGroup(message._id, message.createdAt) ?
                      true :
                      (props.messages[props.messages.indexOf(message) - 1]?.createdBy
                      !== message.createdBy)
                      : false
                  }
                  {...(
                    message.parentId ?
                    {
                      replayedMessage: getReplyedMessageData(message.parentId),
                    } : {}
                  )}
                />
                {showUnreadMessage(message) && unreadMessagesCount && (
                  <div className="middle-message-wrapper">
                    <div className="middle-message-overlay"></div>
                    <span className="middle-message">{`رسائل غير مقروءة ${unreadMessagesCount.count}`}</span>
                  </div>
                )}
              </Fragment>
            )}
          </PaginationContainer>
        </LoadPrevNextContext.Provider>
        {allowMessages ? (
          <>
            {inputAction !== EditingOptionsEnum.Add && selectedMessage && (
              <ChatInput
                chatId={props.chat._id}
                user={user}
                selectedMessage={selectedMessage}
                replyText={selectedMessage.text}
                ownerUser={props.users.find(x => x._id === selectedMessage.createdBy)}
                action={inputAction}
                onHide={() => {
                  setSelectedMessage(null);
                  setInputAction(EditingOptionsEnum.Add);
                }}
                {...(user._id !== selectedMessage.createdBy ?
                  {replyColor: userColorMap[selectedMessage.createdBy]}
                  : {}
                )}
              />
            )}
            {inputAction === EditingOptionsEnum.Add && (
              <ChatInput
                chatId={props.chat._id}
                user={user}
                action={EditingOptionsEnum.Add}
                onHide={() => {
                  setSelectedMessage(null);
                  setInputAction(EditingOptionsEnum.Add);
                }}
              />
            )}
          </>
        ) : (
          <div className='chat-input'>
            <div style={{padding: '10px', textAlign: 'center'}}>
              فقط <span style={{color: '#00a884'}}>المشرفين</span> يمكنهم إرسال الرسائل
            </div>
          </div>
        )}
      </div>
    </div>
  )
}