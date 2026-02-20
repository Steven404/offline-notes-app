import React, { useMemo } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import TextLabel from '../../../components/textLabel/TextLabel';
import Fonts from '../../../styles/Fonts';
import { useTheme } from '../../../providers/ThemeContext';
import { Theme } from '../../../styles/themes';
import packageJson from '../../../../package.json';

interface AboutModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const AboutModal = ({ isVisible, onClose }: AboutModalProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.6}
      useNativeDriverForBackdrop
      animationIn="fadeInUp"
      animationOut="fadeOutDown"
    >
      <View style={styles.modalView}>
        <TextLabel text="Offline Notes App" style={styles.title} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <TextLabel text="Version:" style={styles.label} />
            <TextLabel text={packageJson.version} style={styles.value} />
          </View>
          <View style={styles.infoRow}>
            <TextLabel text="Created by:" style={styles.label} />
            <TextLabel text="S.Michelakis" style={styles.value} />
          </View>
          <View style={styles.infoRow}>
            <TextLabel text="Contact email:" style={styles.label} />
            <TextLabel
              text="stefanosmichelakis@gmail.com"
              style={[styles.value, styles.email]}
            />
          </View>
          s
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <TextLabel text="Close" style={styles.closeButtonText} />
        </TouchableOpacity>
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
      shadowColor: '#000',
      shadowOpacity: 0.35,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },
    title: {
      fontFamily: Fonts.MontserratBold,
      fontSize: 20,
      color: theme.textColor,
      marginBottom: 24,
      textAlign: 'center',
    },
    infoContainer: {
      width: '100%',
      marginBottom: 24,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.placeholder,
    },
    label: {
      fontFamily: Fonts.MontserratMedium,
      fontSize: 14,
      color: theme.placeholder,
    },
    value: {
      fontFamily: Fonts.MontserratSemiBold,
      fontSize: 14,
      color: theme.textColor,
    },
    email: {
      fontSize: 12,
    },
    closeButton: {
      backgroundColor: theme.primary,
      paddingVertical: 12,
      paddingHorizontal: 32,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
    },
    closeButtonText: {
      fontFamily: Fonts.MontserratSemiBold,
      fontSize: 16,
      color: theme.black,
    },
  });

export default AboutModal;
