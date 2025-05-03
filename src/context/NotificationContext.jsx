import { createContext, useContext, useRef, useMemo } from "react";

import { Toast } from "primereact/toast";

const NotificationContext = createContext();

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const toastRef = useRef(null);

  const showNotification = ({ type, message, duration = 5000 }) => {
    try {
      let severity;
      switch (type) {
        case "success":
        case "sucesso":
        case "ok":
          severity = "success";
          break;
        case "error":
        case "erro":
          severity = "error";
          break;
        case "warning":
        case "aviso":
          severity = "warn";
          break;
        default:
          severity = "info";
      }

      toastRef.current.show({
        severity,
        summary: type.toUpperCase(),
        detail: message,
        life: duration
      });
    } catch (error) {
      console.error(error);
    }
  };

  const Values = useMemo(() => showNotification, []);

  return (
    <NotificationContext.Provider value={Values}>
      {children}
      <Toast ref={toastRef} />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification deve ser utilizado dentro de um NotificationProvider"
    );
  }
  return context;
};
