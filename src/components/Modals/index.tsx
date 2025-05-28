import React from 'react';
import { Modal, ModalProps as AntdModalProps } from 'antd';
import CreateCommunityModal from '@src/components/Modals/CreateCommunity.modal';
import { ModalType } from '@src/contexts/Model.context';

export type BasicModalProps<Schema = any> = {
  modalType: ModalType;
  modalProps: AntdModalProps;
  closeModal: () => void;
  onSubmit?: (data: Schema) => void;
};

export const ModalContainer: React.FC<BasicModalProps> = (BasicModalProps) => {
  switch (BasicModalProps.modalType) {
    case 'createCommunity':
      return <CreateCommunityModal {...BasicModalProps} />;
    case 'editProfile':
      return (
        <Modal open>
          <p>Edit profile content goes here.</p>
        </Modal>
      );
    default:
      return null;
  }
};
