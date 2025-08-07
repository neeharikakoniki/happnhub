
import React from 'react';
import { EventItem } from '../api/eventsApi';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return {
    month: MONTHS[date.getMonth()],
    day: date.getDate(),
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
  };
}

type Props = {
  event: EventItem;
  role: 'admin' | 'user';
};

export default function EventCard({ event, role }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('EventDetail', { event, role });
  };

  const { month, day, weekday } = formatDate(event.startDate);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateDay}>{day}</Text>
          <Text style={styles.dateWeekday}>{weekday}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.time}>{event.startTime} - {event.endTime}</Text>
          <Text style={styles.location}>{event.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    backgroundColor: '#fff1f1',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    marginRight: 12,
    width: 55,
  },
  dateMonth: {
    color: '#999',
    fontSize: 12,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4c4c',
  },
  dateWeekday: {
    color: '#999',
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#999',
  },
});