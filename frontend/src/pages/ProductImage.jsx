import React from 'react';

const ProductImage = ({ src, alt }) => {
  return (
    <div className="w-full h-auto max-h-[400px]">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain rounded"
      />
    </div>
  );
};

export default ProductImage;