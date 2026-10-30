import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  isBiometricSensorAvailable,
  promptBiometricAuth,
} from '../../../utils/biometrics';
import Button from '../../../components/button/Button';
import Icon from '../../../components/icon/Icon';
import TextLabel from '../../../components/textLabel/TextLabel';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';
import { useTheme } from '../../../providers/ThemeContext.tsx';
import { Theme } from '../../../styles/themes.ts';

const BiometricLogin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const handleBiometricAuth = async () => {
    const success = await promptBiometricAuth('Biometric Unlock');
    if (success) {
      navigation.replace('bottomTabsNavigator');
    } else {
      const isSensorAvailable = await isBiometricSensorAvailable();
      if (isSensorAvailable) {
        Alert.alert('Authentication Failed', 'Please try again.');
      } else {
        Alert.alert('Authentication Failed', 'Biometrics sensor not available');
      }
    }
  };

  useEffect(() => {
    handleBiometricAuth();
  }, [handleBiometricAuth]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon
          name={faFingerprint}
          size={80}
          color={theme.primary}
          style={styles.icon}
        />
        <TextLabel
          text="Biometric Unlock"
          variant="title"
          style={styles.title}
          accessibilityRole="header"
        />
        <TextLabel
          text="Use your fingerprint or face to unlock"
          tone="secondary"
          style={styles.subtitle}
        />

        <Button
          label="Unlock"
          onPress={handleBiometricAuth}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const makeStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    content: {
      alignItems: 'center',
      width: '100%',
    },
    icon: {
      marginBottom: 30,
    },
    title: {
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
      marginBottom: 48,
    },
    button: {
      alignSelf: 'stretch',
    },
  });

export default BiometricLogin;
