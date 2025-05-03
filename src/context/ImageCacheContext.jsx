import { createContext, useContext, useState, useMemo } from "react";

import PropTypes from "prop-types";

const ImageCacheContext = createContext();

export const ImageCacheProvider = ({ children }) => {
  const [imageCache, setImageCache] = useState(new Map());

  const getCachedImage = (id) => imageCache.get(id);

  const setCachedImage = (id, url) => {
    setImageCache((prevCache) => new Map(prevCache).set(id, url));
  };

  const Values = useMemo(
    () => ({
      getCachedImage,
      setCachedImage
    }),
    [imageCache]
  );

  return (
    <ImageCacheContext.Provider value={Values}>
      {children}
    </ImageCacheContext.Provider>
  );
};

ImageCacheProvider.propTypes = {
  children: PropTypes.element.isRequired
};

export const useImageCache = () => {
  const context = useContext(ImageCacheContext);
  if (!context) {
    throw new Error(
      "useImageCache deve ser utilizado dentro de um ImageCacheProvider"
    );
  }
  return context;
};
