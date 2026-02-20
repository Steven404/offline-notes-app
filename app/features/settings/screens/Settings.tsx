import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../styles/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsItem from '../components/SettingsItem';
import AboutModal from '../components/AboutModal';
import SimpleBackHeader from '../../../components/simpleBackHeader/SimpleBackHeader.tsx';
import SimpleConfirmModal from '../../../components/simpleConfirmModal/SimpleConfirmModal.tsx';
import {
  enableBiometricsWithPrompt,
  getBiometricsEnabled,
  isBiometricSensorAvailable,
  promptBiometricAuth,
  setBiometricsEnabled,
} from '../../../utils/biometrics';
import { Theme } from '../../../styles/themes.ts';
import { useTheme } from '../../../providers/ThemeContext.tsx';

const Settings = () => {
  const { theme, setTheme, themeName } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [hasBiometricSensor, setHasBiometricSensor] = useState(false);
  const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabledState] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);

  useEffect(() => {
    const checkBiometricAvailability = async () => {
      const isAvailable = await isBiometricSensorAvailable();
      setHasBiometricSensor(isAvailable);
      if (isAvailable) {
        const isEnabled = await getBiometricsEnabled();
        setIsBiometricsEnabledState(isEnabled);
      }
    };

    checkBiometricAvailability();
  }, []);

  const handleBiometricsPress = () => {
    setIsBiometricModalVisible(true);
  };

  const handleBiometricConfirm = async () => {
    setIsBiometricModalVisible(false);
    if (isBiometricsEnabled) {
      const isAuthenticated = await promptBiometricAuth(
        'Disable biometrics check?',
      );

      if (isAuthenticated) {
        await setBiometricsEnabled(false);
        setIsBiometricsEnabledState(false);
        Alert.alert(
          'Success',
          'Biometrics check on app launch is now disabled.',
        );
        return;
      }
      Alert.alert('Error', 'Biometrics check fail.');

      return;
    }

    const didEnable = await enableBiometricsWithPrompt();
    if (didEnable) {
      Alert.alert('Success', 'Biometric check on app launch is now enabled.');

      setIsBiometricsEnabledState(true);
    }
  };

  const handleBiometricCancel = () => {
    setIsBiometricModalVisible(false);
  };

  const handleAppearancePress = () => {
    setTheme(themeName === 'light' ? 'dark' : 'light');
  };

  const handleAboutPress = () => {
    setIsAboutModalVisible(true);
  };

  const handleAboutClose = () => {
    setIsAboutModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <SimpleBackHeader title={'Settings'} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="General">
          {hasBiometricSensor && (
            <SettingsItem
              icon="fingerprint"
              label="Biometrics"
              onPress={handleBiometricsPress}
            />
          )}
          <SettingsItem
            icon="palette"
            label={`Toggle ${themeName === 'light' ? 'dark' : 'light'} mode`}
            onPress={handleAppearancePress}
            rightIcon={themeName === 'light' ? 'moon' : 'sun'}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Others">
          <SettingsItem
            icon="info-circle"
            label="About"
            onPress={handleAboutPress}
          />
          {/*Implement this in the future*/}
          {/*<SettingsItem*/}
          {/*  icon="comment-dots"*/}
          {/*  label="Feedback / Feature Request"*/}
          {/*  onPress={handleFeedbackPress}*/}
          {/*  isLast*/}
          {/*/>*/}
        </SettingsSection>
      </ScrollView>
      <SimpleConfirmModal
        isVisible={isBiometricModalVisible}
        onClose={handleBiometricCancel}
        onConfirm={handleBiometricConfirm}
        text={
          isBiometricsEnabled
            ? 'Disable biometrics?'
            : 'Enable biometrics check on app launch?'
        }
        iconName={'fingerprint'}
        confirmText="Yes"
        cancelText="No"
        confirmButtonColor={Colors.primary}
      />
      <AboutModal isVisible={isAboutModalVisible} onClose={handleAboutClose} />
    </SafeAreaView>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
    },
  });

export default Settings;
