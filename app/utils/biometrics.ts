import {
  isSensorAvailable,
  simplePrompt,
} from '@sbaiahmed1/react-native-biometrics';
import { getDataFromStorage, storeData } from './asyncStorage';

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

/**
 * Read stored biometrics enabled flag
 */
export const getBiometricsEnabled = async (): Promise<boolean> => {
  try {
    const storedValue = await getDataFromStorage(
      BIOMETRICS_ENABLED_STORAGE_KEY,
    );
    console.log('storedValue:', storedValue);
    return storedValue === 'true';
  } catch (error) {
    console.log('Error reading biometrics enabled flag:', error);
    return false;
  }
};

/**
 * Set biometrics enabled flag
 */
export const setBiometricsEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await storeData(BIOMETRICS_ENABLED_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.log('Error setting biometrics enabled flag:', error);
  }
};
