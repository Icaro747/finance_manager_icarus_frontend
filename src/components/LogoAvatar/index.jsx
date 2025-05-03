/* eslint-disable no-nested-ternary */
import { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { Avatar } from "primereact/avatar";
import { Skeleton } from "primereact/skeleton";

import { useAuth } from "context/AuthContext";
import { useImageCache } from "context/ImageCacheContext";

const LogoAvatar = ({
  empresaId = null,
  usuarioId = null,
  name = "",
  useCache = true
}) => {
  const auth = useAuth();
  const { getCachedImage, setCachedImage } = useImageCache();

  // Definir qual ID usar
  const id = empresaId ?? usuarioId;
  const type =
    !empresaId && !usuarioId ? "n/d" : empresaId ? "empresa" : "usuario";

  // Verifica se o cache deve ser usado
  const cachedImage = useCache ? getCachedImage(`${type}_${id}`) : null;

  const [imgSrc, setImgSrc] = useState(cachedImage || null);
  const [loading, setLoading] = useState(!cachedImage);

  useEffect(() => {
    if (empresaId == null && usuarioId == null) {
      setLoading(false);
      setImgSrc(null);
      return;
    }

    if (id == null || id <= 0 || (useCache && cachedImage)) return;

    const fetchImage = async () => {
      try {
        setLoading(true);

        if (!empresaId && !usuarioId) {
          const url = empresaId
            ? `${process.env.REACT_APP_API_URL}/Empresa/Logo?empresa_id=${empresaId}`
            : `${process.env.REACT_APP_API_URL}/Usuarios/ImagemPerfil?usuario_id=${usuarioId}`;

          const response = await fetch(url, auth.GetHeaders());

          if (response.status === 200) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            if (useCache) {
              setCachedImage(`${type}_${id}`, imageUrl);
            }

            setImgSrc(imageUrl);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar a imagem:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth.isAuthenticated()) fetchImage();
  }, [auth, useCache]);

  if (!name) {
    return <Avatar label="Avatar" size="large" shape="circle" />;
  }

  if (loading) return <Skeleton shape="circle" size="3rem" className="mr-2" />;

  if (!imgSrc) return <Avatar label={name[0]} size="large" shape="circle" />;

  return <Avatar image={imgSrc} size="large" shape="circle" />;
};

LogoAvatar.propTypes = {
  empresaId: PropTypes.number,
  usuarioId: PropTypes.number,
  name: PropTypes.string,
  useCache: PropTypes.bool
};

export default LogoAvatar;
