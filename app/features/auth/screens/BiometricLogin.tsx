import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  isBiometricSensorAvailable,
  promptBiometricAuth,
} from '../../../utils/biometrics';
import Fonts from '../../../styles/Fonts';
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
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Icon
          name={faFingerprint}
          size={80}
          color={theme.primary}
          style={styles.icon}
        />
        <TextLabel text="Biometric Login" style={styles.title} />
        <TextLabel
          text="Use your fingerprint or face to unlock"
          style={styles.subtitle}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleBiometricAuth}
          activeOpacity={0.7}
        >
          <TextLabel text="Unlock" style={styles.buttonText} />
        </TouchableOpacity>
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
      fontFamily: Fonts.MontserratBold,
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
      color: theme.textColor,
    },
    subtitle: {
      fontFamily: Fonts.MontserratRegular,
      fontSize: 16,
      color: theme.placeholder,
      textAlign: 'center',
      marginBottom: 50,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      fontFamily: Fonts.MontserratSemiBold,
      fontSize: 18,
      color: theme.black,
    },
  });

export default BiometricLogin;
