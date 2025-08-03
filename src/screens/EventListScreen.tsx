// src/screens/EventListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { fetchEvents } from '../api/eventsApi';
import { EventItem } from '../types/EventItem';
import EventCard from '../components/EventCard';

type Props = NativeStackScreenProps<RootStackParamList, 'EventList'>;

export default function EventListScreen({ navigation, route }: Props) {
  const { role } = route.params;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchEvents('Atlanta', 'GA');
      setEvents(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleEventPress = (event: EventItem) => {
    navigation.navigate('EventDetail', { event, role });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Events ({role})</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleEventPress(item)}>
              <EventCard event={item} role={role} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
});
