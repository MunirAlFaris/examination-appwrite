import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IRecusivePost, IUser, IPostOwnerUser } from "../../../../universal/model";
import { Modal } from "react-bootstrap";
import PostItem from "../../components/PostItem";
import AddEditPost from "../../components/AddEditPost";
import EmptyPageMessage from "../../components/EmptyPageMessage";
import { MAX_VISIBLE_ENTRIES_COUNT, PAGE_SIZE_FOR_DASH } from "../../../ui_helpers/constants";
import { LoadPrevNextContext } from "../../../ui_helpers/contexts";
import PaginationContainer from "../../components/PaginationContainer";
import { useUser } from "../../../lib/contexts";

export default function Posts() {
  const user = useUser()[0];
  if(!user) {
    return <EmptyPageMessage />
  }
  return(
    <PostsPage
      posts={[]}
      user={user}
      users={[]}
    />
  )
}

function PostsPage(props: {
  posts: IRecusivePost[];
  user: IUser;
  users: IPostOwnerUser[];
}) {
  const {posts, user, users} = props;
  const [allPosts, setAllPosts] = useState<IRecusivePost[]>(
    posts
  );
  const [sliceStart, setSliceStart] = useState<number>(0);
  const [sliceEnd, setSliceEnd] = useState<number | undefined>(PAGE_SIZE_FOR_DASH);
  const [sliceCount, setSliceCount] = useState<number>(PAGE_SIZE_FOR_DASH);
  const [currentPosts, setCurrentPosts] = useState<IRecusivePost[]>(
    posts.slice(
        sliceStart,
        sliceEnd
      ).slice(-PAGE_SIZE_FOR_DASH)
    );
  if (allPosts !== posts) {
    setCurrentPosts(posts.slice(sliceStart, sliceEnd).slice(-sliceCount));
    setAllPosts(posts)
  }
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const postsRefs = useRef<{[index: string]: HTMLDivElement | null}>({});
  return (
    <Modal
      show
      fullscreen
      onHide={() => navigate('/')}
    >
      <Modal.Header
        closeButton
        className="posts-page-header"
        style={{padding: '5px 10px'}}
      >
        <div style={{
            flex: '1',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <h3 style={{margin: '0'}}>المنشورات</h3>
          <AddEditPost />
        </div>
      </Modal.Header>
      <Modal.Body className="posts-page" style={{padding: '0'}}>
        <div className="posts-container">
          <LoadPrevNextContext.Provider
            value={{
              sliceStartState: [sliceStart, setSliceStart],
              sliceEndState: [sliceEnd, setSliceEnd],
              sliceCountState: [sliceCount, setSliceCount],
              entries: posts,
              currentEntriesState: [currentPosts, setCurrentPosts],
            }}
          >
            <PaginationContainer
              containerRef={containerRef}
              entriesRefs={postsRefs}
              pageSize={PAGE_SIZE_FOR_DASH}
              maxVisibleEntriesCount={MAX_VISIBLE_ENTRIES_COUNT}
              nextsEntriesMsg="المنشورات التالية"
              prevEntriesMsg="المنشورات السابقة"
              hideScrollsBtns
            >
              {currentPosts.length > 0 ? (
                currentPosts.map(post =>
                  <PostItem
                    key={post._id}
                    user={user}
                    post={post}
                    ownerUser={users.find(x => x._id === post.createdBy)}
                    users={users}
                    postsRefs={postsRefs}
                  />
                )
              ) : (
                <div className="empty-page-wrapper">
                  <h1>لاتوجد أي منشورات</h1>
                </div>
              )}
            </PaginationContainer>
          </LoadPrevNextContext.Provider>
        </div>
      </Modal.Body>
    </Modal>
  )
}