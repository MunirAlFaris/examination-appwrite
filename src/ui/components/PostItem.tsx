import { Meteor } from 'meteor/meteor';
import type { RefObject } from 'react';
import * as React from 'react';
import { useState } from 'react';
import type { IRecusivePost, IPostOwnerUser, IUser } from '../../../universal/model';
import { formatLikes, setElementRef, showToast } from '../../ui_helpers/utils';
import FromNow from './FromNow';
import Markdown from './Markdown';
import UserImg from './UserImg';
import clsx from 'clsx';
import PostComments from './PostComments';
import AddEditPost from './AddEditPost';
import { UserRole } from '../../../universal/enums';

export default function PostItem(props: {
  user: IUser,
  post: IRecusivePost,
  ownerUser: IPostOwnerUser | undefined,
  users: IPostOwnerUser[],
  hideCommentBtn?: boolean,
  postsRefs?: RefObject<{[index: string]: HTMLDivElement | null}>
}) {
  const [showCommentsModal, setShowCommentsModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const handleShowEditModal = () => {
    setShowEditModal(!showEditModal);
  }
  const handleShowCommentsModal = () => {
    setShowCommentsModal(!showCommentsModal)
  }
  const handleToggleLike = () => {
    if(!props.post.likedBy.includes(props.user._id)) {
      Meteor.call(
        'addLikeOnPost',
        props.post._id,
        props.post.likes + 1,
        [...props.post.likedBy, props.user._id]
      )
    } else {
      const likedBy = props.post.likedBy;
      likedBy.splice(likedBy.indexOf(props.user._id), 1)
      Meteor.call(
        'addLikeOnPost',
        props.post._id,
        props.post.likes - 1,
        likedBy
      )
    }
  }
  const handleTogglePinPost = () => {
    if(props.user.profile.role !== UserRole.isAdmin || props.user._id !== props.post.createdBy) return
    Meteor.call(
      'pinPost',
      props.post._id,
      (error: Meteor.Error) => {
        if(error) showToast('info', 'لايمكنك تثبيت أكثر من ثلاث منشورات');
      }
    )
  }
  return (
    <div
      className='post'
      id={props.post._id}
      style={
        !props.hideCommentBtn ?
          {}
          :
          {backgroundColor: 'transparent'}
        }
      ref={(el) => {
        if(!props.postsRefs) return
        setElementRef(el, props.postsRefs, props.post._id)
      }}
    >
      <div className='post-header'>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          {props.ownerUser && (
            <UserImg
              userGender={props.ownerUser.profile.gender}
              userRole={props.ownerUser.profile.role}
            />
          )}
          <div>
            <span>{props.post.creatorName}</span>
            <br />
            <span style={{color: '#777', fontSize: '14px'}} title={props.post.createdAt.toISOString()}>
              {/* TODO: fix this for android apk */}
              <FromNow date={props.post.createdAt} lang='ar'/>
            </span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          {(props.user._id === props.post.createdBy
          || props.user._id === UserRole.isAdmin) && (
            <button
              type='button'
              className='tool-button'
              style={{position: 'static'}}
              onClick={handleShowEditModal}
            >
              <span className='icon-pencil'/>
            </button>
          )}
          {/* TODO: fix the pin error */}
          {/* {(props.user.profile.role === UserRole.isAdmin
          || props.post.isPinned) && !props.hideCommentBtn &&(
            <button
              type='button'
              className='tool-button'
              style={{
                position: 'static',
                pointerEvents: props.user.profile.role === UserRole.isAdmin || props.user._id === props.post.createdBy
                  ? 'all' : 'none'
              }}
              onClick={handleTogglePinPost}
            >
              <span
                style={{transition: '0.4s'}}
                className={clsx({
                  'icon-pin post-pin': true,
                  'pinned-post': props.post.isPinned,
                })}
              />
            </button>
          )} */}
        </div>
      </div>
      <div className='post-body'>
        <Markdown text={props.post.text}/>
      </div>
      <div className='post-foot'>
        <div>
          <span
            className={clsx({
              'icon-love like-btn post-btn': true,
              'liked': props.post.likedBy.includes(props.user._id)
            })}
            onClick={handleToggleLike}
          />
          &nbsp;
          {props.post.likes > 0 && (
            <span>{formatLikes(props.post.likes)}</span>
          )}
        </div>
        {!props.hideCommentBtn && (
          <div>
            <span
              className='icon-comment post-btn'
              onClick={handleShowCommentsModal}
            />
            &nbsp;
            {props.post.comments.length > 0 && (
              <span>{formatLikes(props.post.comments.length)}</span>
            )}
          </div>
        )}
      </div>
      <PostComments
        show={showCommentsModal}
        onHide={handleShowCommentsModal}
        post={props.post}
        user={props.user}
        ownerUser={props.ownerUser}
        users={props.users}
      />
      {showEditModal && (
        <AddEditPost
          isForEdit
          show={showEditModal}
          onHide={handleShowEditModal}
          post={props.post}
        />
      )}
    </div>
  )
}