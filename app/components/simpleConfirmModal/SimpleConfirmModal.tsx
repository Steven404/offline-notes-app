import React from 'react';
import { StyleSheet, View, TouchableOpacity, ColorValue } from 'react-native';
import Modal from 'react-native-modal';
import TextLabel from '../textLabel/TextLabel.tsx';
import Colors from '../../styles/colors.ts';
import Fonts from '../../styles/Fonts.tsx';
import Icon from '../icon/Icon.tsx';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface SimpleConfirmModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  text: string;
  confirmText: string;
  cancelText: string;
  confirmButtonColor?: ColorValue;
  title?: string;
  iconName?: IconProp;
}

const SimpleConfirmModal = ({
  isVisible,
  onClose,
  onConfirm,
  text,
  confirmText,
  cancelText,
  confirmButtonColor = Colors.deleteRed,
  title,
  iconName,
}: SimpleConfirmModalProps) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.6}
      useNativeDriverForBackdrop
    >
      <View style={styles.modalView}>
        {iconName ? (
          <View style={styles.iconCircle}>
            <Icon name={iconName} size={20} color={Colors.black} />
          </View>
        ) : null}
        {title ? <TextLabel text={title} style={styles.title} /> : null}
        <TextLabel text={text} style={styles.modalText} />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onClose}
          >
            <TextLabel text={cancelText} style={styles.cancelButtonText} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modalButton,
              styles.confirmButton,
              { backgroundColor: confirmButtonColor },
            ]}
            onPress={onConfirm}
          >
            <TextLabel text={confirmText} style={styles.confirmButtonText} />
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
    // subtle elevation/shadow to lift the card on dark bg
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 20,
    textAlign: 'center',
    color: Colors.textColor,
    marginBottom: 8,
  },
  modalText: {
    fontFamily: Fonts.MontserratMedium,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.placeholder,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.placeholder + '40',
  },
  confirmButton: {
    marginLeft: 8,
  },
  cancelButtonText: {
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.placeholder,
  },
  confirmButtonText: {
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.textColor,
  },
});

export default SimpleConfirmModal;
