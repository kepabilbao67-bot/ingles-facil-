import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = '@linguafox/';

/** Elimina únicamente los datos creados por LinguaFox en este dispositivo. */
export async function clearLinguaFoxLocalData(): Promise<number> {
  const keys = await AsyncStorage.getAllKeys();
  const appKeys = keys.filter((key) => key.startsWith(STORAGE_PREFIX));
  if (appKeys.length > 0) await AsyncStorage.multiRemove(appKeys);
  return appKeys.length;
}
