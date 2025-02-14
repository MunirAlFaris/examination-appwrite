import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import type { FormEvent } from 'react';
import type { IPost, IRecusivePost, IUser } from '../../../universal/model';
import { useState } from 'react';
import { Modal, Button, Form } from "react-bootstrap";
import { useTracker } from 'meteor/react-meteor-data';
import { UserRole } from '../../../universal/enums';
import { showToast } from '../../ui_helpers/utils';
import TextEditor from './TextEditor';
import ConfirmModal from '../components/ConfirmModal';

export default function AddEditPost(props: {
  isForEdit?: boolean,
  show?: boolean,
  onHide?: () => void,
  post?: IRecusivePost,
}) {
  const user = useTracker(() => Meteor.user()) as IUser;
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);
  const [text, setText] = useState<string>(props.post ? props.post.text : '');
  const [showModal, setShowModal] = useState<boolean>(false);
  if(!user || user.profile.role !== UserRole.isAdmin) return
  const handleShowModal = () => {
    setShowModal(!showModal)
  }
  const handleShowDeleteConfirmModal = () => {
    setShowDeleteConfirmModal(!showDeleteConfirmModal)
  }
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(props.isForEdit) {
      Meteor.call(
        'editPost',
        props.post?._id,
        props.post?.createdBy,
        text,
        (error: Meteor.Error) => {
          if(!error) {
            showToast('success', 'تم تعديل المنشور بنجاح');
            setText('')
            if(props.onHide) props.onHide()
          }
          else showToast('error', 'خطأ، لم نتمكن من تعديل المنشور');
        }
      )
    } else {
      const createdPost: IPost = {
        creatorName: user.username,
        createdBy: user._id,
        createdAt: new Date(),
        text: text,
        isPinned: false,
        likes: 0,
        likedBy: [],
        comments: [],
      }
      Meteor.call(
        'addPost',
        createdPost,
        (error: Meteor.Error) => {
          if(!error) {
            showToast('success', 'تمت إضافة المنشور بنجاح');
            setText('')
            setShowModal(false);
          }
          else showToast('error', 'خطأ، لم نتمكن من إضافة المنشور');
        }
      )
    }
  }
  const handleDeletePost = () => {
    Meteor.call(
      'removePost',
      props.post?._id,
      props.post?.createdBy,
      (error: Meteor.Error) => {
        if(!error) {
          showToast('success', 'تم حذف المنشور بنجاح');
          if(props.onHide) props.onHide()
        }
        else showToast('error', 'خطأ، لم نتمكن من حذف المنشور');
      }
    )
  }
  return (
    <>
      {!props.isForEdit && (
        <Button
          className='mx-3'
          variant='primary'
          onClick={handleShowModal}
        >
          أضف منشورا
        </Button>
      )}
      <Modal
        show={props.show ? props.show : showModal}
        fullscreen='md-down'
        onHide={props.onHide ? props.onHide : handleShowModal}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title style={{flex: '1'}}>
            {props.isForEdit ? 'تعديل المنشور' : 'إضافة منشور'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{paddingTop: '10px'}}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='post-text'>
              <Form.Label>نص المنشور:</Form.Label>
              <TextEditor
                text={text}
                onChange={({text}) => setText(text)}
                setText={(text: string) => setText(prevText => prevText + text)}
              />
            </Form.Group>
            <Button type='submit' className='mt-3' variant='primary'>
              {props.isForEdit ? 'تعديل' : 'نشر'}
            </Button>
            {props.isForEdit && (
              <Button
                type='button'
                variant='danger'
                className='mx-2 mt-3'
                onClick={handleShowDeleteConfirmModal}
              >
                حذف المنشور
                &nbsp;
                <span className='icon-trash-o'/>
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
      <ConfirmModal
        show={showDeleteConfirmModal}
        title='حذف منشور'
        description='هل أنت متأكد من حذف المنشور'
        onHide={handleShowDeleteConfirmModal}
        onConfirm={handleDeletePost}
        hasShadow
      />
    </>
  )
}