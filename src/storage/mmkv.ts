
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const getCachedRSVP = (eventId: string): boolean => {
  return storage.getBoolean(`rsvp:${eventId}`) ?? false;
};

export const setCachedRSVP = (eventId: string, value: boolean) => {
  storage.set(`rsvp:${eventId}`, value);
};

export const removeCachedRSVP = (eventId: string) => {
  storage.delete(`rsvp:${eventId}`);
};
