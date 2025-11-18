import { createContext, useContext, useState } from "react";

const LoginPopupContext = createContext();

export const useLoginPopup = () => useContext(LoginPopupContext);

export const LoginPopupProvider = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => setShowPopup(true);
  const closePopup = () => setShowPopup(false);

  return (
    <LoginPopupContext.Provider value={{ showPopup, openPopup, closePopup }}>
      {children}
    </LoginPopupContext.Provider>
  );
};
