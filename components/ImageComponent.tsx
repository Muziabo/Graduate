import React, { useState } from 'react';

interface ImageComponentProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/images/default-gown.jpg' 
}) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    setImageSrc(fallbackSrc);
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageComponent;
