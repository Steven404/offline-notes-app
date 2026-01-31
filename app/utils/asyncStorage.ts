import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDataFromStorage = async (
  key: string,
  // showToast?: (string: string) => void,
) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e: any) {
    // showToast && showToast(e.message);
  }
};

export const storeData = async (
  key: string,
  value: any,
  // showToast?: (string: string) => void,
) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e: any) {
    // showToast && showToast(e.message);
  }
};
