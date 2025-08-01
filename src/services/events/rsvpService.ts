import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
};

export const isUserRsvped = async (eventId: string): Promise<boolean> => {
  const user = auth().currentUser;
  if (!user) return false;

  const doc = await firestore()
    .collection('events')
    .doc(eventId)
    .collection('attendees')
    .doc(user.uid)
    .get();

  return doc.exists();
};
