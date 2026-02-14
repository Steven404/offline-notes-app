import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {
  isBiometricSensorAvailable,
  promptBiometricAuth,
} from '../../../utils/biometrics';
import Colors from '../../../styles/colors';
import Fonts from '../../../styles/Fonts';
import Icon from '../../../components/icon/Icon';
import TextLabel from '../../../components/textLabel/TextLabel';
import { faFingerprint } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigation.tsx';

const BiometricLogin = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

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
          color={Colors.primary}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  },
  subtitle: {
    fontFamily: Fonts.MontserratRegular,
    fontSize: 16,
    color: Colors.placeholder,
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.MontserratSemiBold,
    fontSize: 18,
    color: Colors.black,
  },
});

export default BiometricLogin;
