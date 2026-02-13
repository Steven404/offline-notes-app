import {
  isSensorAvailable,
  simplePrompt,
} from '@sbaiahmed1/react-native-biometrics';
import { storeData } from './asyncStorage';

export const BIOMETRICS_ENABLED_STORAGE_KEY = 'biometrics_enabled';

/**
 * Check if the device has a biometric sensor available
 * @returns Promise<boolean> - true if biometric sensor is available, false otherwise
 */
export const isBiometricSensorAvailable = async (): Promise<boolean> => {
  try {
    const { available } = await isSensorAvailable();
    return available;
  } catch (e) {
    console.log(e);
    return false;
  }
};

/**
 * Prompt the user for biometric authentication
 * @returns Promise<boolean> - true if authentication succeeds
 */
export const promptBiometricAuth = async (
  promptMessage = 'Confirm biometrics',
): Promise<boolean> => {
  try {
    const { success } = await simplePrompt(promptMessage);
    return success;
  } catch (error) {
    console.log('Error during biometric prompt:', error);
    return false;
  }
};

/**
 * Prompts for biometrics and stores enabled flag if successful
 */
export const enableBiometricsWithPrompt = async (): Promise<boolean> => {
  const isAuthenticated = await promptBiometricAuth(
    'Enable biometrics check on app launch?',
  );

  if (!isAuthenticated) {
    return false;
  }

  await storeData(BIOMETRICS_ENABLED_STORAGE_KEY, 'true');
  return true;
};
