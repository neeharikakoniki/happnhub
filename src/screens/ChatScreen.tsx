import React, { useEffect, useState, useCallback } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';


type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: any;
};

export default function ChatScreen() {
  const route = useRoute<ChatScreenRouteProp>();
  const { eventId } = route.params;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const unsubscribe = firestore()
      .collection(`events/${eventId}/chat`)
      .orderBy('timestamp', 'asc')
      .onSnapshot(snapshot => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Message, 'id'>),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [eventId]);

  const sendMessage = useCallback(async () => {
    const user = auth().currentUser;
    if (!user || !input.trim()) return;

    await firestore().collection(`events/${eventId}/chat`).add({
      senderId: user.uid,
      senderName: user.displayName || 'Anonymous',
      message: input.trim(),
      timestamp: firestore.FieldValue.serverTimestamp(),
    });

    setInput('');
  }, [eventId, input]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={item.senderId === auth().currentUser?.uid ? styles.myMessage : styles.otherMessage}>
            <Text style={styles.sender}>{item.senderName}</Text>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1976D2',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1e7ff',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
    margin: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  sender: {
    fontWeight: '600',
    marginBottom: 2,
    fontSize: 12,
    color: '#333',
  },
  message: {
    fontSize: 14,
    color: '#000',
  },
});

