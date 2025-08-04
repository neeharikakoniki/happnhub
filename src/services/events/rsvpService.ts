
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  getCachedRSVP,
  setCachedRSVP,
  removeCachedRSVP,
} from '../../storage/mmkv';

export const rsvpToEvent = async (eventId: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  await firestore()
    .collection('events')
    .doc(eventId)
    .collection('attendees')
    .doc(user.uid)
    .set({
      uid: user.uid,
      email: user.email,
      rsvpedAt: firestore.FieldValue.serverTimestamp(),
    });

  setCachedRSVP(eventId, true);
};

export const cancelRsvp = async (eventId: string) => {
  const user = auth().currentUser;
  if (!user) throw new Error('User not authenticated');

  await firestore()
    .collection('events')
    .doc(eventId)
    .collection('attendees')
    .doc(user.uid)
    .delete();

  setCachedRSVP(eventId, false);
};

export const isUserRsvped = async (eventId: string): Promise<boolean> => {
  const user = auth().currentUser;
  if (!user) return false;

 
  const cached = getCachedRSVP(eventId);
  if (cached) return true;


  const doc = await firestore()
    .collection('events')
    .doc(eventId)
    .collection('attendees')
    .doc(user.uid)
    .get();

  const isRSVP = doc.exists;
  if (isRSVP()) setCachedRSVP(eventId, true); 

  return isRSVP();
};
