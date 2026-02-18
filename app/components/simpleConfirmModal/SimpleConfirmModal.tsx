import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity, ColorValue } from 'react-native';
import Modal from 'react-native-modal';
import TextLabel from '../textLabel/TextLabel.tsx';
import Fonts from '../../styles/Fonts.tsx';
import Icon from '../icon/Icon.tsx';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTheme } from '../../providers/ThemeContext.tsx';
import { Theme } from '../../styles/themes.ts';

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
  confirmButtonColor,
  title,
  iconName,
}: SimpleConfirmModalProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

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
            <Icon name={iconName} size={20} color={theme.black} />
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
              { backgroundColor: confirmButtonColor || theme.deleteRed },
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

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    modalView: {
      backgroundColor: theme.tabBarBackground,
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
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    title: {
      fontFamily: Fonts.MontserratSemiBold,
      fontSize: 20,
      textAlign: 'center',
      color: theme.textColor,
      marginBottom: 8,
    },
    modalText: {
      fontFamily: Fonts.MontserratMedium,
      fontSize: 16,
      textAlign: 'center',
      color: theme.placeholder,
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
      borderColor: theme.placeholder + '40',
    },
    confirmButton: {
      marginLeft: 8,
    },
    cancelButtonText: {
      fontFamily: Fonts.MontserratSemiBold,
      color: theme.placeholder,
    },
    confirmButtonText: {
      fontFamily: Fonts.MontserratSemiBold,
      color: theme.textColor,
    },
  });

export default SimpleConfirmModal;
