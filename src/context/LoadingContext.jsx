import React, {
  useEffect,
  createContext,
  useContext,
  useState,
  useMemo
} from "react";

import PropTypes from "prop-types";

import Logo from "components/Logo";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const [ShowComponete, setShowComponete] = useState(false);
  const [ShowLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // tempo de espera para mostrar o loading
    const espeta = 300;

    if (loading === true) {
      setShowComponete(true);
      setTimeout(() => {
        setShowLoading(true);
      }, espeta);
    } else {
      setShowLoading(false);
      setTimeout(() => {
        setShowComponete(false);
      }, espeta);
    }
  }, [loading]);

  const Values = useMemo(
    () => ({
      isloading: loading,
      setLoading
    }),
    [loading]
  );

  return (
    <LoadingContext.Provider value={Values}>
      {children}
      {ShowComponete && <Logo show={ShowLoading} />}
    </LoadingContext.Provider>
  );
};

LoadingProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error(
      "useLoading deve ser utilizado dentro de um LoadingProvider"
    );
  }
  return context;
};
