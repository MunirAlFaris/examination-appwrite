import * as React from 'react';
import type { RefObject } from 'react';
import type { IMessage } from '../../../universal/model';
import { useEffect, useState } from 'react';
import { PAGE_SIZE, MAX_VISIBLE_ENTRIES_COUNT } from '../../ui_helpers/constants';
import { hasPreviousOrNextEntries } from '../../ui_helpers/utils';
import { useLoadPrevNextContext, UpdateVisibileEntriesFnContext } from '../../ui_helpers/contexts';
import ScrollsButtons from './ScrollsButtons';

export default function PaginationContainer(props: {
  pageSize?: number;
  maxVisibleEntriesCount?: number;
  containerRef: RefObject<HTMLDivElement | null>;
  entriesRefs: RefObject<{ [key: string]: HTMLDivElement | null }>;
  isReachToBottom?: boolean;
  startSliceFromEntry?: boolean;
  handleStartSliceFromEntry?: (state: boolean) => void;
  handleIsReachToBottom?: (state: boolean) => void;
  onCallScroll?: () => void;
  onScroll?: () => void;
  contentClassName?: string;
  children: React.ReactNode;
  outsideContainerChildren?: React.ReactNode;
  hasPreviousEntries?: boolean;
  hasNextEntries?: boolean;
  unreadMessagesCount?: number;
  nextsEntriesMsg?: string;
  prevEntriesMsg?: string;
  hideScrollsBtns?: boolean;
  hideTopArrow?: boolean;
}) {
  const {
    sliceStartState,
    sliceEndState,
    sliceCountState,
    entries,
    currentEntriesState,
  } = useLoadPrevNextContext();
  const { entriesRefs, containerRef } = props;
  const pageSize = props.pageSize ? props.pageSize : PAGE_SIZE;
  const maxVisibleEntriesCount = props.maxVisibleEntriesCount
    ? props.maxVisibleEntriesCount
    : MAX_VISIBLE_ENTRIES_COUNT;
  const [sliceCount, setSliceCount] = sliceCountState;
  const [sliceStart, setSliceStart] = sliceStartState;
  const [sliceEnd, setSliceEnd] = sliceEndState;
  const [currentEntries, setCurrentEntries] = currentEntriesState;
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState<boolean>(true);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState<boolean>(true);
  const [hideScrollsButtons, setHideScrollsButtons] = useState<boolean>(true);
  const hasPreviousEntries =
    props.hasPreviousEntries !== undefined
      ? props.hasPreviousEntries
      : hasPreviousOrNextEntries(
          currentEntries.map((x) => x._id),
          entries.map((x) => x._id),
          'PREV',
        );
  const hasNextEntries =
    props.hasNextEntries !== undefined
      ? props.hasNextEntries
      : hasPreviousOrNextEntries(
          currentEntries.map((x) => x._id),
          entries.map((x) => x._id),
          'NEXT',
        );
  const loadPreviousPageHandler = () => {
    const newSliceCount =
      sliceCount >= maxVisibleEntriesCount
        ? maxVisibleEntriesCount
        : sliceCount + pageSize;
    let newSliceStart;
    let newCurrentEntries: IMessage[] = [];
    if (sliceStart === 0) {
      const newSliceEnd =
        sliceEnd &&
        (sliceCount === maxVisibleEntriesCount || props.startSliceFromEntry)
          ? sliceEnd - pageSize < 0
            ? 0
            : sliceEnd - pageSize
          : entries.length;
      newCurrentEntries = entries.slice(sliceStart, newSliceEnd);
      setSliceEnd(newSliceEnd);
      setCurrentEntries(newCurrentEntries.slice(-newSliceCount));
    } else {
      if (Math.abs(sliceStart) < maxVisibleEntriesCount) {
        newSliceStart = sliceStart - pageSize;
        newCurrentEntries = entries.slice(newSliceStart);
        setSliceStart(sliceStart - pageSize);
        setCurrentEntries(newCurrentEntries.slice(-newSliceCount));
      } else {
        setSliceStart(0);
        setSliceEnd(entries.length - pageSize);
        setCurrentEntries(
          entries.slice(0, entries.length - pageSize).slice(-sliceCount),
        );
      }
    }
    setSliceCount(newSliceCount);
    setTimeout(() => {
      const firstEntryId = currentEntries[0]._id;
      if (entriesRefs.current && entriesRefs.current[firstEntryId]) {
        entriesRefs.current[firstEntryId].scrollIntoView({ block: 'start' });
      }
    }, 0);
  };
  const loadNextPageHandler = () => {
    const newSliceEnd = sliceEnd ? sliceEnd + pageSize : pageSize;
    const newCurrentEntries = entries.slice(sliceStart, newSliceEnd);
    const newSliceCount =
      sliceCount >= maxVisibleEntriesCount
        ? maxVisibleEntriesCount
        : sliceCount + pageSize;
    if (
      newCurrentEntries[newCurrentEntries.length - 1]._id ===
      entries[entries.length - 1]._id
    ) {
      setSliceEnd(undefined);
      setSliceStart(-newSliceCount);
      setCurrentEntries(entries.slice(-newSliceCount));
    } else {
      setSliceEnd(newSliceEnd);
      setSliceCount(newSliceCount);
      setCurrentEntries(newCurrentEntries.slice(-newSliceCount));
    }
    if (props.handleStartSliceFromEntry)
      if (props.startSliceFromEntry) props.handleStartSliceFromEntry(false);
  };
  const handleUpdateVisibileEntriesLength = (entryId: string) => {
    const parentEntryIndex = entries.findIndex((x) => x._id === entryId);
    if (parentEntryIndex !== -1) {
      const newSliceEnd = parentEntryIndex + pageSize;
      if (containerRef.current)
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setSliceStart(0);
      setSliceEnd(newSliceEnd);
      setSliceCount(pageSize);
      setCurrentEntries(entries.slice(0, newSliceEnd).slice(-pageSize - 10));
      if (props.handleStartSliceFromEntry)
        props.handleStartSliceFromEntry(true);
    }
  };
  const scrollToTop = () => {
    const chatContainer = containerRef.current;
    if (hasPreviousEntries && chatContainer) {
      setTimeout(() => {
        if(chatContainer.scrollTop === chatContainer.scrollHeight) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
          return
        } else {
          const currentScrollHeight = chatContainer.scrollHeight;
          chatContainer.scrollTop =
          currentScrollHeight - chatContainer.clientHeight;
        }
      }, 0)
    }
    if (props.handleIsReachToBottom) props.handleIsReachToBottom(false);
    setTimeout(() => {
      if (chatContainer)
        chatContainer.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    }, 0);
    if (hasPreviousEntries) {
      setSliceStart(0);
      setSliceEnd(pageSize);
      setSliceCount(pageSize);
      setCurrentEntries(entries.slice(0, pageSize));
    }
  };
  const scrollToBottom = () => {
    if (props.handleIsReachToBottom) props.handleIsReachToBottom(false);
    const chatContainer = containerRef.current;
    if (hasNextEntries && chatContainer) {
      if (
        Math.abs(
          chatContainer.scrollTop +
            chatContainer.clientHeight -
            chatContainer.scrollHeight,
        ) <= 2
      ) {
        chatContainer.scrollTop = 0;
      }
    }
    setTimeout(() => {
      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 0);
    if (hasNextEntries) {
      setSliceEnd(undefined);
      setSliceStart(-pageSize);
      setSliceCount(pageSize);
      setCurrentEntries(entries.slice(-pageSize));
    }
  };
  useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const onReachBottom = () => {
        if (showScrollBottomBtn) setShowScrollBottomBtn(false);
        if (props.handleIsReachToBottom)
          if (!props.isReachToBottom) props.handleIsReachToBottom(true);
      };
      const onReachTop = () => {
        if (showScrollTopBtn) setShowScrollTopBtn(false);
      };
      const onScrollBetween = () => {
        if (props.handleIsReachToBottom)
          if (props.isReachToBottom) props.handleIsReachToBottom(false);
        if (!showScrollTopBtn) setShowScrollTopBtn(true);
        if (!showScrollBottomBtn) setShowScrollBottomBtn(true);
      };
      const onCallScroll = () => {
        const container = containerRef.current;
        if (!container) return;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        if (scrollHeight > clientHeight) {
          if (hideScrollsButtons) setHideScrollsButtons(false);
          if (scrollTop === 0 && !hasPreviousEntries)
            if (showScrollTopBtn) setShowScrollTopBtn(false);
        }
        if (props.onCallScroll) props.onCallScroll();
      };
      onCallScroll();
      const handleScroll = () => {
        if (props.onScroll) props.onScroll();
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;
        if (
          Math.abs(scrollTop + clientHeight - scrollHeight) <= 2 &&
          !hasNextEntries
        ) {
          onReachBottom();
        } else if (scrollTop === 0 && !hasPreviousEntries) {
          onReachTop();
        } else {
          onScrollBetween();
        }
      };
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }, [showScrollBottomBtn, showScrollTopBtn, props.isReachToBottom, containerRef, hasNextEntries, hasPreviousEntries, props, hideScrollsButtons]);
  return (
    <div className='messages'>
      {props.outsideContainerChildren && props.outsideContainerChildren}
      {!props.hideScrollsBtns && (
        <ScrollsButtons
          hide={hideScrollsButtons}
          showScrollBottomBtn={showScrollBottomBtn}
          showScrollTopBtn={showScrollTopBtn}
          onScrollBottom={scrollToBottom}
          onScrollTop={scrollToTop}
          {...(props.unreadMessagesCount ? {unreadMessagesCount: props.unreadMessagesCount} : {})}
          {...(props.hideTopArrow ? {hideTopArrow: props.hideTopArrow} : {})}
        />
      )}
      <div
        className={
          'messages-container ' +
          (props.contentClassName ? props.contentClassName : '')
        }
        ref={containerRef}
      >
        {hasPreviousEntries && (
          <div onClick={loadPreviousPageHandler} className="load-more-btn">
            {props.prevEntriesMsg ? (
              <span>{props.prevEntriesMsg}...</span>
            ) : (
              <span>{'الرسائل السابقة'}...</span>
            )}
          </div>
        )}
        <UpdateVisibileEntriesFnContext.Provider
          value={handleUpdateVisibileEntriesLength}
        >
          {props.children}
        </UpdateVisibileEntriesFnContext.Provider>
        {/* This div for fix entries floating */}
        <div style={{ flex: '1' }} ref={containerRef}></div>
        {hasNextEntries && (
          <div onClick={loadNextPageHandler} className="load-more-btn">
            {props.nextsEntriesMsg ? (
              <span>{props.nextsEntriesMsg}...</span>
            ) : (
              <span>{'الرسائل التالية'}...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
