const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.notifyOnFavorite = functions.https.onCall(async (data: { eventName: any; fcmToken: any; }, context: any) => {
  const { eventName, fcmToken } = data;

  if (!eventName || !fcmToken) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing event name or token');
  }

  const message = {
    notification: {
      title: 'Event Favorited !!',
      body: `You added "${eventName}" to your favorites!`,
    },
    token: fcmToken,
  };

  try {
    await admin.messaging().send(message);
    console.log('Push sent to user for favorite');
    return { success: true };
  } catch (error) {
    console.error('Error sending push:', error);
    throw new functions.https.HttpsError('internal', 'Push failed');
  }
});
