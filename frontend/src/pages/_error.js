import React from 'react';

function Error({ statusCode }) {
  return (
    <div dir="rtl" className="text-center p-4">
      <h1>{statusCode ? `خطا ${statusCode}` : 'خطای غیرمنتظره'}</h1>
      <p>صفحه موردنظر پیدا نشد.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;