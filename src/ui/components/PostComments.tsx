import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import type { FormEvent } from 'react';
import type { IUser, IRecusivePost, IPostOwnerUser, IComment } from '../../../universal/model';
import { useState, useEffect } from 'react';
import { Modal, Form, InputGroup } from 'react-bootstrap';
import PostItem from './PostItem';
import UserImg from './UserImg';
import CommentItem from './CommentItem';

export default function PostComments(props: {
  show: boolean,
  onHide: () => void,
  user: IUser,
  post: IRecusivePost,
  ownerUser: IPostOwnerUser | undefined,
  users: IPostOwnerUser[]
}) {
  const [selectedComment, setSelectedComment] = useState<{_id: String, text: string, createdBy: string} | null>(null);
  const [text, setText] = useState<string>('');
  const handleSelectComment = (comment: {_id: string, text: string, createdBy: string}) => {
    setSelectedComment(comment);
  }
  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if(text.length > 0) {
      console.log('hello')
      if(!selectedComment) {
        console.log('workd')
        const comment: IComment = {
          _id: props.post._id + props.post.comments.length,
          createdAt: new Date(),
          createdBy: props.user._id,
          creatorName: props.user.username,
          text: text,
          likes: 0,
          likedBy: [],
        }
        Meteor.call(
          'addComment',
          props.post._id,
          comment,
          (error: Meteor.Error) => {
            if(!error) setText('')
          }
        )
      } else {
        Meteor.call(
          'editComment',
          props.post._id,
          selectedComment._id,
          selectedComment.text,
          selectedComment.createdBy,
          text,
          (error: Meteor.Error) => {
            if(!error) {
              setText('');
              setSelectedComment(null);
            }
          }
        )
      }
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if(window.screen.width > 767) {
        event.preventDefault();
        handleSubmitComment(event);
      }
    }
  }
  useEffect(() => {
    if(selectedComment)
      setText(selectedComment.text)
  }, [selectedComment])
  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      fullscreen='md-down'
      size='lg'
      contentClassName='popup-post'
    >
      <Modal.Header
        closeButton
        className='post-comments-bg'
        style={{padding: '5px 10px'}}
      >
        <Modal.Title style={{flex: '1'}}>
          {`منشور ${props.post.creatorName}`}
        </Modal.Title>
      </Modal.Header>
        <Modal.Body className='popup-post-body post-comments-bg'>
          <PostItem
            user={props.user}
            post={props.post}
            ownerUser={props.ownerUser}
            users={props.users}
            hideCommentBtn
          />
          <div
            className='comments-container'
            style={{
              ...(props.post.comments.length ===  0 ? {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              } : {})
            }}
          >
            {props.post.comments.length ===  0 ? (
              <span
                style={{
                  color: '#777',
                  display: 'block',
                  padding: '50px 0'
                }}
              >
                لا توجد أي تعليقات على هذا المنشور
              </span>
            ): (
              props.post.comments.map(comment => 
                <CommentItem
                  key={comment.createdBy + comment.createdAt.toISOString()}
                  user={props.user}
                  comment={comment}
                  postId={props.post._id}
                  ownerUser={props.users.find(x => x._id === comment.createdBy)}
                  handleSelectComment={handleSelectComment}
                />
              )
            )}
          </div>
        </Modal.Body>
        <Modal.Footer style={{padding: '0 5px', direction: 'ltr'}} className='post-comments-bg'>
          <div className='send-comment'>
            <UserImg
              userGender={props.user.profile.gender}
              userRole={props.user.profile.role}
            />
            <InputGroup className='comment-input'>
              <Form.Control
                as='textarea'
                style={{direction: 'rtl'}}
                value={text}
                className='comment-input'
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyUp}
                placeholder='أضف تعليقا!'
              />
              {selectedComment && (
                <InputGroup.Text
                  className='comment-submit-btn'
                  onClick={() => setSelectedComment(null)}
                >
                  أغلق
                </InputGroup.Text>
              )}
              <InputGroup.Text
                className='comment-submit-btn'
                onClick={handleSubmitComment}
              >
                {selectedComment ? (
                  'تعديل'
                ) : (
                  <span className='icon-send-o' />
                )}
              </InputGroup.Text>
            </InputGroup>
          </div>
        </Modal.Footer>
    </Modal>
  )
}