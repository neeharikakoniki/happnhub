// src/screens/AdminAttendeesScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import firestore from '@react-native-firebase/firestore';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'AdminAttendees'>;

interface Attendee {
  uid: string;
  email: string;
  rsvpedAt: any;
}

export default function AdminAttendeesScreen({ route }: Props) {
  const { eventId } = route.params;
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const snapshot = await firestore()
          .collection('events')
          .doc(eventId)
          .collection('attendees')
          .orderBy('rsvpedAt', 'desc')
          .get();

        const list: Attendee[] = snapshot.docs.map(doc => ({
          uid: doc.id,
          email: doc.data().email,
          rsvpedAt: doc.data().rsvpedAt?.toDate(),
        }));

        setAttendees(list);
      } catch (error) {
        console.error('Error fetching attendees:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (attendees.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No attendees yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RSVP Attendees</Text>
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.date}>
              RSVP’d at {item.rsvpedAt?.toLocaleString() || 'N/A'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontStyle: 'italic',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
});
