import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EventItem } from '../types/EventItem';
import { COLORS } from '../constants/colors'; 

interface Props {
  event: EventItem;
  onPress: () => void;
}

export default function EventListItem({ event, onPress }: Props) {
  const dateObj = new Date(`${event.startDate}T${event.startTime}`);
  const day = dateObj.getDate();
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.dateColumn}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.weekday}>{weekday}</Text>
      </View>

      
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>{event.name}</Text>
        <View style={styles.row}>
          <Icon name="clock-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>
            {event.startTime} - {event.endTime}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="map-marker-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.infoText}>{event.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
    marginHorizontal: 12,
    alignItems: 'center',
    elevation: 1,
  },
  dateColumn: {
    alignItems: 'center',
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: COLORS.highlight,
    borderRadius: 8,
  },
  month: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  day: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '800',
  },
  weekday: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  infoText: {
    marginLeft: 4,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});
