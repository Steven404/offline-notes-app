import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import TextLabel from '../textLabel/TextLabel.tsx';
import Icon from '../icon/Icon.tsx';
import Button from '../button/Button.tsx';
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
  /** 'danger' (default) for destructive confirms, 'primary' for neutral ones */
  tone?: 'danger' | 'primary';
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
  tone = 'danger',
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
      useNativeDriver
    >
      <View style={styles.modalView}>
        {iconName ? (
          <View style={styles.iconCircle}>
            <Icon name={iconName} size={20} color={theme.onPrimary} />
          </View>
        ) : null}
        {title ? (
          <TextLabel
            text={title}
            variant="heading"
            style={styles.title}
            accessibilityRole="header"
          />
        ) : null}
        <TextLabel text={text} tone="secondary" style={styles.modalText} />
        <View style={styles.modalButtons}>
          <Button
            label={cancelText}
            variant="secondary"
            onPress={onClose}
            stretch
          />
          <Button
            label={confirmText}
            variant={tone}
            onPress={onConfirm}
            stretch
          />
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
      textAlign: 'center',
      marginBottom: 8,
    },
    modalText: {
      textAlign: 'center',
      marginBottom: 24,
    },
    modalButtons: {
      flexDirection: 'row',
      width: '100%',
      gap: 12,
    },
  });

export default SimpleConfirmModal;
