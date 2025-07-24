import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { EventItem } from '../api/eventsApi';

type Props = {
  event: EventItem;
};

export default function EventCard({ event }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.date}>
        {event.startDate} | {event.startTime} - {event.endTime}
      </Text>
      <Text style={styles.summary} numberOfLines={2}>
        {event.summary}
      </Text>
      <Text style={styles.address}>{event.address}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  summary: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  address: {
    fontSize: 12,
    color: '#999',
  },
});
