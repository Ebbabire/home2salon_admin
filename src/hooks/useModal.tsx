import { useContext } from "react";

import { ModalContext } from "@/context/ModalContext";

const useModal = (modalId: string) => {
  const { modalStates, openModal, closeModal } = useContext(ModalContext);
  const isOpen: boolean = modalStates[modalId] || false;

  const open = () => {
    openModal(modalId);
  };

  const close = () => {
    closeModal(modalId);
  };

  return {
    isOpen,
    open,
    close,
  };
};

export default useModal;
