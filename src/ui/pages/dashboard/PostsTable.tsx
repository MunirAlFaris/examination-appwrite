import { Meteor } from "meteor/meteor";
import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { IRecusivePost } from "../../../../universal/model";
import { Table } from "react-bootstrap";
import { showToast } from "../../../ui_helpers/utils";
import removeMd from "remove-markdown";
import ConfirmModal from "../../components/ConfirmModal";
import PaginationButtons from "../../components/PaginationButtons";
import { PAGE_SIZE_FOR_DASH } from "../../../ui_helpers/constants";
import { groupEntriesToPages } from "../../../../universal/utils";

export default function PostsTable(props: {
  posts: IRecusivePost[];
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [postData, setPostData] = useState<{postId: string, createdBy: string} | null>(null);
  const { posts } = props;
    const headRef = useRef<HTMLDivElement | null>(null);
    const currentPosts = useMemo(() => {
      return groupEntriesToPages(posts, PAGE_SIZE_FOR_DASH)
    }, [posts])
  const handleHideModal = () => {
    setShowModal(!showModal);
    setPostData(null);
  }
  const handleShowModal = (postData: {postId: string, createdBy: string}) => {
    setShowModal(!showModal);
    setPostData(postData)
  }
  const handleDeletePost = () => {
    if(postData)
    Meteor.call(
      'removePost',
      postData.postId,
      postData.createdBy,
      (error: Meteor.Error) => {
        if(!error) {
          showToast('success', 'تم حذف المنشور بنجاح!');
          handleHideModal()
        }
        else showToast('error', 'خطأ، لايمكن حذف المنشور');
      }
    )
  }
  const handleSwitchPage = (pageNum: number) => {
    setCurrentPage(pageNum)
    const el = headRef.current
    if(!el) return
    el.scrollIntoView({behavior: 'smooth', block: 'end'})
  }
  return (
    <div>
      <div className="mt-3 table-container" ref={headRef}>
        <Table bordered striped hover>
          <thead>
            <tr>
              <th className="text-center">#</th>
              <th scope="col">النص</th>
              <th scope="col">المالك</th>
              <th scope="col">مثبت</th>
              <th scope="col">الإعجابات</th>
              <th scope="col">التعليقات</th>
              <th scope="col">تاريخ الإنشاء</th>
              <th scope="col">خيارات</th>
            </tr>
          </thead>
          <tbody>
            { currentPosts[currentPage - 1] && currentPosts[currentPage - 1].map((post, index) =>
              <tr key={post._id}>
                <td className="text-center">{index + 1}</td>
                <td className="text-ell">{removeMd(post.text)}</td>
                <td>{post.creatorName}</td>
                <td>{post.isPinned ? 'نعم' : 'لا'}</td>
                <td>{post.likes}</td>
                <td>{post.comments.length}</td>
                <td>{post.createdAt?.toLocaleDateString()}</td>
                <td style={{display: 'flex'}}>
                  <Link className="btn btn-primary" to={`/#${post._id}`}>
                    المنشور
                  </Link>
                  &nbsp;
                  &nbsp;
                  <button
                    className='tool-button'
                    style={{color: 'tomato'}}
                    onClick={() => handleShowModal({postId: post._id, createdBy: post.createdBy})}
                  >
                    <span className='icon-trash-o'/>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
      <div>
        {props.posts && props.posts.length > 0 && (
          <PaginationButtons
            activePage={currentPage}
            arrayLength={posts.length}
            pageSize={PAGE_SIZE_FOR_DASH}
            onItemClick={handleSwitchPage}
          />
        )}
      </div>
      <ConfirmModal
        show={showModal}
        onHide={handleHideModal}
        title="حذف المنشور"
        description="هل أنت متأكد من حذف المنشور ؟"
        onConfirm={handleDeletePost}
      />
    </div>
  )
}
