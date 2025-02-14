import * as React from 'react';
import clsx from 'clsx';

export default function ScrollsButtons(props: {
  hide: boolean;
  showScrollTopBtn: boolean;
  showScrollBottomBtn: boolean;
  onScrollTop: () => void;
  onScrollBottom: () => void;
  unreadMessagesCount?: number;
  hideTopArrow?: boolean;
}) {
  return (
    <div
      className={clsx({
        'scrolls-btns': true,
        hidden: props.hide,
      })}
    >
      {!props.hideTopArrow && (
        <button
          className={clsx({
            'icon-chevron-up': true,
            hidden: !props.showScrollTopBtn,
          })}
          onClick={props.onScrollTop}
        />
      )}
      <button
        className={clsx({
          'icon-chevron-down': true,
          hidden: !props.showScrollBottomBtn,
        })}
        onClick={props.onScrollBottom}
      >
        {props.unreadMessagesCount && (
          <span className='unread-messages-count'>{props.unreadMessagesCount}</span>
        )}
      </button>
    </div>
  );
}
