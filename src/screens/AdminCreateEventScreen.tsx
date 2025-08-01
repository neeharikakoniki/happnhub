import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function AdminCreateEventScreen() {
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleCreate = async () => {
    try {
      if (!name || !startDate || !startTime || !endTime || !latitude || !longitude) {
        Alert.alert('Please fill all required fields');
        return;
      }

      await firestore().collection('events').add({
        name,
        summary,
        address,
        category,
        startDate,
        startTime,
        endTime,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Event created successfully');

      setName('');
      setSummary('');
      setAddress('');
      setCategory('');
      setStartDate('');
      setStartTime('');
      setEndTime('');
      setLatitude('');
      setLongitude('');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not create event');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create New Event</Text>

      <TextInput style={styles.input} placeholder="Event Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Summary" value={summary} onChangeText={setSummary} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Category" value={category} onChangeText={setCategory} />
      <TextInput style={styles.input} placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} />
      <TextInput style={styles.input} placeholder="Start Time (HH:MM)" value={startTime} onChangeText={setStartTime} />
      <TextInput style={styles.input} placeholder="End Time (HH:MM)" value={endTime} onChangeText={setEndTime} />
      <TextInput style={styles.input} placeholder="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" />
      <TextInput style={styles.input} placeholder="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" />

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Create Event</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
