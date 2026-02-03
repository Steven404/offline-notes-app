import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import TextLabel from '../../../components/textLabel/TextLabel.tsx';
import Colors from '../../../styles/colors.ts';
import Fonts from '../../../styles/Fonts.tsx';

interface DeleteNoteModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteNoteModal = ({
  isVisible,
  onClose,
  onConfirm,
}: DeleteNoteModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={styles.modalView}>
        <TextLabel
          text={'Are you sure you want to delete this note?'}
          style={styles.modalText}
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <TextLabel text={'Cancel'} style={styles.cancelButtonText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={onConfirm}
          >
            <TextLabel text={'Delete'} style={styles.confirmButtonText} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: Colors.tabBarBackground,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalText: {
    fontFamily: Fonts.MontserratMedium,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  confirmButton: {
    marginLeft: 8,
    backgroundColor: Colors.deleteRed,
  },
  cancelButtonText: {
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.white,
  },
  confirmButtonText: {
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.white,
  },
});

export default DeleteNoteModal;
