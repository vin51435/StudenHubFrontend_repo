import { ModalContainer } from '@src/components/Modals/index';
import { ModalProps } from 'antd';
import React, { createContext, useCallback, useContext, useState } from 'react';

export type ModalType = 'createCommunity' | 'editProfile' | null;

type ModalContextType = {
  openModal: (modal: ModalType, props?: any) => void;
  closeModal: () => void;
  modalType: ModalType;
  modalProps: any;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModal must be used inside ModalProvider');
  return ctx;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const openModal = useCallback((type: ModalType, props?: ModalProps) => {
    console.log('this hit', type, props);
    setModalType(type);
    setModalProps(props || {});
  }, []);

  const closeModal = useCallback(() => {
    setModalProps((prev) => ({ ...prev, open: false }));

    // Delay cleanup to allow animation to complete
    setTimeout(() => {
      setModalType(null);
      setModalProps(null);
    }, 300); // AntD animation duration
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType, modalProps }}>
      {children}
      <ModalContainer modalType={modalType} modalProps={modalProps!} closeModal={closeModal} />
    </ModalContext.Provider>
  );
};
