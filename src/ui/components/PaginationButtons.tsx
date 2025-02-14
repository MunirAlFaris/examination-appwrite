import * as React from 'react';
import type { MouseEvent } from 'react';
import Pagination from 'react-bootstrap/Pagination';

export default function PaginationButtons(props: {
  activePage: number;
  arrayLength: number;
  pageSize: number;
  onItemClick: (pageNum: number) => void;
}) {
  const currentPage = props.activePage ? props.activePage : 1;
  const pageSize = props.pageSize;
  const totalPages = Math.ceil(props.arrayLength / pageSize);
  const maxVisibleButtons = 5;
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let start = Math.max(1, currentPage - halfVisible);
    let end = Math.min(totalPages, currentPage + halfVisible);
    if (currentPage <= halfVisible) {
      start = 1;
      end = Math.min(totalPages, maxVisibleButtons);
    } else if (currentPage > totalPages - halfVisible) {
      start = Math.max(1, totalPages - maxVisibleButtons + 1);
      end = totalPages;
    }
    if (start > 1) pages.push('...');
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages) pages.push('...');
    return pages;
  };
  const handleSwitchPage = (
    e: MouseEvent<HTMLElement>,
    page: number | string,
  ) => {
    e.preventDefault();
    props.onItemClick(Number(page));
  };
  return (
    <Pagination className="pagination-buttons-container">
      {currentPage !== 1 && (
        <>
          {currentPage !== 2 && (
            <Pagination.First
              as={'div'}
              onClick={(e) => handleSwitchPage(e, 1)}
            />
          )}
          <Pagination.Prev
            as={'div'}
            onClick={(e) => handleSwitchPage(e, currentPage - 1)}
            disabled={currentPage === 1}
          />
        </>
      )}
      {getVisiblePages().map((page, index) =>
        page === '...' ? (
          <Pagination.Ellipsis key={`ellipsis-${index}`} disabled as={'div'} />
        ) : (
          <Pagination.Item
            key={page}
            as={'div'}
            active={page === currentPage}
            onClick={(e) => handleSwitchPage(e, page)}
          >
            {page}
          </Pagination.Item>
        ),
      )}
      {currentPage !== totalPages && (
        <>
          <Pagination.Next
            as={'div'}
            disabled={currentPage === totalPages}
            onClick={(e) => handleSwitchPage(e, currentPage + 1)}
          />
          {currentPage !== totalPages - 1 && (
            <Pagination.Last
              as={'div'}
              onClick={(e) => handleSwitchPage(e, totalPages)}
            />
          )}
        </>
      )}
    </Pagination>
  );
}
