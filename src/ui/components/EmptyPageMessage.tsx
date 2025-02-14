import * as React from 'react';
import { Link } from 'react-router-dom';

export default function EmptyPageMessage(props: {
  children?: React.ReactNode;
}) {
  return (
    <div className="empty-page-msg">
      <div>
        {props.children ? (
          props.children
        ) : (
          <>
            <h1 style={{ fontSize: '30px' }}>
              <span className="icon-search" /> لم يتم العثور على الصفحة
            </h1>
            <p style={{ fontSize: '20px', color: '#777' }}>
              المعذرة، لم يتم العثور على الصفحة التي تبحث عنها
              <br />
              بإمكانك العودة إلى.{' '}
              <Link to="/" style={{ textDecoration: 'none' }}>
                الصفحة الرئيسية
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
