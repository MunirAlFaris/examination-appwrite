import { Meteor } from 'meteor/meteor';
import * as React from 'react';
import type { IComment, IPostOwnerUser, IUser } from '../../../universal/model';
import { formatLikes } from '../../ui_helpers/utils';
import { UserRole } from '../../../universal/enums';
import clsx from 'clsx';
import UserImg from './UserImg';
import Markdown from './Markdown';
import ToolsMenu from './ToolsMenu';
import FromNow from './FromNow';

export default function CommentItem(props: {
  user: IUser,
  postId: string,
  comment: IComment,
  ownerUser: IPostOwnerUser | undefined,
  handleSelectComment: (comment: {_id: string, text: string, createdBy: string}) => void,
}) {
  const handleSelectComment = () => {
    props.handleSelectComment({
      _id: props.comment._id,
      text: props.comment.text,
      createdBy: props.comment.createdBy,
    })
  }
  const handleToggleLike = () => {
    if(!props.comment.likedBy.includes(props.user._id)) {
      Meteor.call(
        'addLikeOnComment',
        props.postId,
        props.comment._id,
        props.comment.likes + 1,
        [...props.comment.likedBy, props.user._id]
      )
    } else {
      const likedBy = props.comment.likedBy;
      likedBy.splice(likedBy.indexOf(props.user._id), 1)
      Meteor.call(
        'addLikeOnComment',
        props.postId,
        props.comment._id,
        props.comment.likes - 1,
        likedBy
      )
    }
  }
  const handleDeleteComment = () => {
    Meteor.call(
      'removeComment',
      props.postId,
      props.comment._id,
      props.comment.createdBy,
    )
  }
  return(
    <div className='comment'>
      {props.ownerUser && (
        <UserImg
          userGender={props.ownerUser.profile.gender}
          userRole={props.ownerUser.profile.role}
        />
      )}
      <div>
        <div className='comment-text'>
          <b>{props.comment.creatorName}</b>
          &nbsp;
          <span style={{
            marginLeft: '10px',
            fontSize: '12px',
            display: 'inline-block'
          }}
          >
          <FromNow
            date={props.comment.createdAt}
            lang='ar'
          />
          </span>
          <br />
          <Markdown text={props.comment.text}/>
        </div>
        <div style={{display: 'flex'}}>
          <button
            type='button'
            className='tool-button'
            style={{color: 'unset'}}
            onClick={handleToggleLike}
          >
            <span
              className={clsx({
                'icon-love like-btn': true,
                'liked': props.comment.likedBy.includes(props.user._id)
              })}
            />
            &nbsp;
            {props.comment.likes > 0 && (
              <span>{formatLikes(props.comment.likes)}</span>
            )}
          </button>
          {(props.user._id === props.comment.createdBy
          || props.user.profile.role === UserRole.isAdmin) && (
            <ToolsMenu
              handleDeleteQuestion={handleDeleteComment}
              handleEditQuestion={handleSelectComment}
              removeFloating
            />
          )}
        </div>
      </div>
    </div>
  )
}