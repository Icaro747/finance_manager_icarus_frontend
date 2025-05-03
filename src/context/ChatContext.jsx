import { createContext, useContext, useMemo, useState } from "react";

import { Dialog } from "primereact/dialog";

import Chat from "components/Chat";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [Messages, setMessages] = useState([]);
  const [Visible, setVisible] = useState(false);
  const [NewMessage, setNewMessage] = useState("");
  const [teste, setteste] = useState(false);

  const Show = () => {
    setVisible(true);
  };

  const SendMessage = (valor) => {
    const newlist = [...Messages, { message: valor, you: teste }];
    setteste((e) => !e);
    setMessages(newlist);
    setNewMessage("");
  };

  const Values = useMemo(() => Show, []);

  return (
    <ChatContext.Provider value={Values}>
      {children}
      <Dialog
        header="Chat"
        visible={Visible}
        modal={false}
        style={{ width: "25vw", minWidth: "300px" }}
        onHide={() => setVisible(false)}
      >
        <Chat
          Messages={Messages}
          NewMessage={NewMessage}
          setNewMessage={setNewMessage}
          SendMessage={SendMessage}
        />
      </Dialog>
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat deve ser utilizado dentro de um ChatProvider");
  }

  return context;
};
