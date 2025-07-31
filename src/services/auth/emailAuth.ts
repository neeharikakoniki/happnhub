import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const signUpWithEmail = async (
  email: string,
  password: string,
  role: 'user' | 'admin'
) => {
  const { user } = await auth().createUserWithEmailAndPassword(email, password);

  await firestore().collection('users').doc(user.uid).set({
    uid: user.uid,
    email: user.email,
    role,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return user;
};

export const loginWithEmail = async (
  email: string,
  password: string
) => {
  const { user } = await auth().signInWithEmailAndPassword(email, password);
  return user;
};

export const getUserRole = async (uid: string): Promise<'user' | 'admin'> => {
  const doc = await firestore().collection('users').doc(uid).get();
  const data = doc.data();
  return (data?.role as 'user' | 'admin') || 'user';
};
