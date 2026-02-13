import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../../styles/colors';
import SettingsSection from '../components/SettingsSection';
import SettingsItem from '../components/SettingsItem';
import SimpleBackHeader from '../../../components/simpleBackHeader/SimpleBackHeader.tsx';
import SimpleConfirmModal from '../../../components/simpleConfirmModal/SimpleConfirmModal.tsx';
import {
  enableBiometricsWithPrompt,
  getBiometricsEnabled,
  isBiometricSensorAvailable,
  promptBiometricAuth,
  setBiometricsEnabled,
} from '../../../utils/biometrics';

const Settings = () => {
  const [hasBiometricSensor, setHasBiometricSensor] = useState(false);
  const [isBiometricModalVisible, setIsBiometricModalVisible] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabledState] = useState(false);

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
        Alert.alert('Biometrics check on app launch is now disabled.');
        return;
      }
      Alert.alert('Biometrics check fail.');

      return;
    }

    const didEnable = await enableBiometricsWithPrompt();
    if (didEnable) {
      Alert.alert('Biometric check on app launch is now enabled.');

      setIsBiometricsEnabledState(true);
    }
  };

  const handleBiometricCancel = () => {
    setIsBiometricModalVisible(false);
  };

  const handleAppearancePress = () => {
    // TODO: Implement appearance logic
  };

  const handleAboutPress = () => {
    // TODO: Implement about logic
  };

  const handleFeedbackPress = () => {
    // TODO: Implement feedback/feature request logic
  };
  console.log('isBiometricsEnabled', isBiometricsEnabled);
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
            label="Appearance"
            onPress={handleAppearancePress}
            isLast
          />
        </SettingsSection>

        <SettingsSection title="Others">
          <SettingsItem
            icon="info-circle"
            label="About"
            onPress={handleAboutPress}
          />
          <SettingsItem
            icon="comment-dots"
            label="Feedback / Feature Request"
            onPress={handleFeedbackPress}
            isLast
          />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
