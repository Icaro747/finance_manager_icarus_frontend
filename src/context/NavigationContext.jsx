import { createContext, useContext, useState, useMemo } from "react";

import PropTypes from "prop-types";

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [ExpandirMenu, setExpandirMenu] = useState(false);

  const Values = useMemo(
    () => ({ ExpandirMenu, setExpandirMenu }),
    [ExpandirMenu]
  );

  return (
    <NavigationContext.Provider value={Values}>
      {children}
    </NavigationContext.Provider>
  );
};

NavigationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useNavegation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error(
      "useNavegation deve ser utilizado dentro de um NavigationProvider"
    );
  }
  return context;
};
