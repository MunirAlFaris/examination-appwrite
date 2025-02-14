import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import type { IChat, IChatUser, IUser } from '../../../universal/model';
import type { FormEvent } from 'react';
import { useState, useMemo } from 'react';
import { Button, Modal, Form, Row } from 'react-bootstrap';
import { ChatTypeEnum, SubjectsEnum, UserRole } from '../../../universal/enums';
import { ChatTypeOptions } from '../../ui_helpers/constants';
import { getUserImgSrc, showToast } from '../../ui_helpers/utils';
import MultiSelect from './MultiSelect';
import ImagesLibrary from './ImagesLibrary';

export default function CreateChatModal(props: {
  show: boolean,
  onHide: () => void,
  users: IChatUser[],
  user: IUser,
}) {
  const [chatName, setChatName] = useState<string>('');
  const [chatType, setChatType] = useState<ChatTypeEnum | 'unset'>('unset');
  const [allowMessages, setAllowMessages] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [showSelectImgModal, setShowSelectImgModal] = useState<boolean>(false);
  const [className, setClassName] = useState<string>('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [chatImgSrc, setChatImgSrc] = useState<string>('');
  const handleShowSelectImgModal = () => {
    setShowSelectImgModal(!showSelectImgModal)
  }
  const handleSelectImgSrc = (src: string) => {
    setChatImgSrc(src);
    setShowSelectImgModal(false);
  }
  const usersSelectOptions = useMemo(() => {
    const fillteredUsers = props.users.filter(x => x._id !== props.user._id)
    return fillteredUsers.map(user => {
      return {
        label: user.username,
        value: user._id,
        role: user.profile.role,
        img: getUserImgSrc(user.profile.role, user.profile.gender),
      }
    })
  }, [props.users])
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const acclist = chatType === ChatTypeEnum.private ?
    [...selectedUsers.map(x => x.value), props.user._id]
    : chatType === ChatTypeEnum.specificClass
    && className ?
    [className, ...teachers.map(x => x.value)]
    : []
    const collectedData: IChat = {
      name: chatName,
      type: chatType,
      createdBy: props.user._id,
      creatorName: props.user.username,
      createdAt: new Date(),
      imgSrc: chatImgSrc ? chatImgSrc : '/images/global.jpeg',
      allowMessages: allowMessages,
      ...(chatType !== ChatTypeEnum.public ?
        {accessList: acclist} :{}
      )
    }
    Meteor.call(
      'addChat',
      collectedData,
      (error: Meteor.Error) => {
        if(!error) {
          showToast('success', 'تم إنشاء المحادثة بنجاح')
          setChatName('');
          setChatType('unset');
          setSelectedUsers([]);
          setChatImgSrc('');
          props.onHide();
        } else showToast('error', 'لم نتمكن من إنشاء المحادثة')
      }
    )
  }
  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        fullscreen='md-down'
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title style={{flex: '1'}}>إنشاء محادثة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='chat-name'>
              <Form.Label>اسم المحادثة:</Form.Label>
              <Form.Control
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder='ادخل اسم المحادثة'
                required
              />
            </Form.Group>
            <Form.Group className='my-3' controlId='chat-type'>
              <Form.Label>خصوصية المحادثة:</Form.Label>
              <Form.Select
                onChange={(e) => {
                  setChatType((e.target.value) as ChatTypeEnum)
                  setSelectedUsers([])
                  setTeachers([])
                }}
                defaultValue={chatType}
                required
              >
                <option value="unset" style={{display: 'none'}}>اختر خصوصية المحادثة</option>
                {ChatTypeOptions.map(option => 
                  <option key={option.value} value={option.value}>{option.label}</option>
                )}
              </Form.Select>
            </Form.Group>
            {chatType === ChatTypeEnum.private ? (
              <Form.Group className='mb-3'>
                <Form.Label>اضف أعضاء المحادثة:</Form.Label>
                <MultiSelect
                  value={selectedUsers}
                  options={usersSelectOptions}
                  onChange={(e) => setSelectedUsers([...e])}
                  isForUsers
                />
              </Form.Group>
            ) : (chatType !== 'unset' && chatType !== ChatTypeEnum.public) && (
              <Row>
                {(chatType === ChatTypeEnum.specificClass) && (
                  <Form.Group className='col' controlId='class-name'>
                    <Form.Label>اسم الصف:</Form.Label>
                    <Form.Select
                      onChange={e => setClassName(e.target.value)}
                      defaultValue={className}
                      required
                    >
                      <option value="" style={{display: 'none'}}>اختر اسم الصف</option>
                      <option value="12">12</option>
                      <option value="9">9</option>
                    </Form.Select>
                  </Form.Group>
                )}
                <Form.Group className='mb-3'>
                  <Form.Label>اضف أساتذة الى المحادثة</Form.Label>
                  <MultiSelect
                    value={teachers}
                    options={usersSelectOptions.filter(x => x.role === UserRole.isTeacher)}
                    onChange={(e) => setTeachers([...e])}
                    isForUsers
                  />
                </Form.Group>
              </Row>
            )}
            <Form.Check
              type='switch'
              className='mt-3'
              checked={allowMessages}
              onChange={() => setAllowMessages(!allowMessages)}
              label='السماح للمستخدمين بإرسال الرسائل'
            />
            <div style={{display: 'flex', alignItems: 'center', position: 'relative'}}>
              <Button
                type='button'
                variant='primary'
                onClick={handleShowSelectImgModal}
              >
                اختر صورة المحادثة
              </Button>
              <Form.Check
                style={{
                  position: 'absolute',
                  zIndex: '-1',
                  opacity: '0'
                }}
                type='radio'
                checked={chatImgSrc ? true : false}
                readOnly
                required
              />
              {chatImgSrc && (
                <img
                  src={chatImgSrc}
                  alt="chat-image"
                  style={{
                    width: '50px',
                    height: '50px',
                    margin: '0 10px',
                    borderRadius: '50%'
                  }}
                />
              )}
            </div>
            <Button
              className='mt-3'
              type='submit'
              variant='primary'
            >
              إنشاء
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ImagesLibrary
        show={showSelectImgModal}
        onHide={handleShowSelectImgModal}
        onSelectImage={handleSelectImgSrc}
      />
    </>
  )
}