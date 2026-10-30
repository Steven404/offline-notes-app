import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import TextLabel from '../../../components/textLabel/TextLabel';
import Button from '../../../components/button/Button';
import { useTheme } from '../../../providers/ThemeContext';
import { Theme } from '../../../styles/themes';
import DeviceInfo from 'react-native-device-info';

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
        <TextLabel
          text="Offline Notes App"
          variant="heading"
          style={styles.title}
          accessibilityRole="header"
        />
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <TextLabel text="Version" tone="secondary" style={styles.label} />
            <TextLabel text={DeviceInfo.getVersion()} style={styles.value} />
          </View>
          <View style={styles.infoRow}>
            <TextLabel
              text="Created by"
              tone="secondary"
              style={styles.label}
            />
            <TextLabel text="S.Michelakis" style={styles.value} />
          </View>
          {/* Stacked: the address is too long to share a line with its label */}
          <View style={[styles.infoRow, styles.infoRowStacked]}>
            <TextLabel text="Contact email" tone="secondary" />
            <TextLabel
              numberOfLines={1}
              text="stefanosmichelakis@gmail.com"
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            />
          </View>
        </View>

        <Button label="Close" onPress={onClose} style={styles.closeButton} />
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
      marginBottom: 20,
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
      minHeight: 44,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.placeholder + '66',
      width: '100%',
      gap: 10,
    },
    infoRowStacked: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 2,
    },
    label: {
      flexShrink: 0,
    },
    value: {
      flex: 1,
      textAlign: 'right',
    },
    closeButton: {
      alignSelf: 'stretch',
    },
  });

export default AboutModal;
