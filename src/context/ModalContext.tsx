import { createContext, useState } from "react";

type ModalState = {
  [modalId: string]: boolean;
};

type ModalContext = {
  modalStates: ModalState;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
};

// Create a context for the modal state
export const ModalContext = createContext<ModalContext>({
  modalStates: {},
  openModal: (modalId: string) => {},
  closeModal: (modalId: string) => {},
});

type ModalProviderProps = {
  children: React.ReactNode;
};

// Modal Provider component to manage the modal state
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalStates, setModalStates] = useState<ModalState>({});

  const openModal = (modalId: string) => {
    setModalStates((prev) => ({
      ...prev,
      [modalId]: true,
    }));
  };

  const closeModal = (modalId: string) => {
    setModalStates((prev) => ({
      ...prev,
      [modalId]: false,
    }));
  };

  const value = {
    modalStates,
    openModal,
    closeModal,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
