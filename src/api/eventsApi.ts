
import axios from 'axios';

const API_HOST = 'eventbrite-api4.p.rapidapi.com';
const API_KEY = '441e1e9c5dmshbb6263053ba0b0cp12461ajsn726b4afd3160';

export interface RawEvent {
  eid: string;
  event_name: string;
  summary: string;
  start_date: string;
  start_time: string;
  end_time: string;
  event_url: string;            
  tickets_url: string;          
  primary_venue: {
    latitude: string;
    longitude: string;
    localized_address_display: string;
  };
}

export interface EventItem {
  id: string;
  name: string;
  summary: string;
  startDate: string;
  startTime: string;
  endTime: string;
  latitude: number;
  longitude: number;
  address: string;
  event_url?: string;           
  tickets_url?: string;         
}

const mapEventbriteToEvent = (raw: RawEvent): EventItem => ({
  id: raw.eid,
  name: raw.event_name,
  summary: raw.summary,
  startDate: raw.start_date,
  startTime: raw.start_time,
  endTime: raw.end_time,
  latitude: parseFloat(raw.primary_venue.latitude),
  longitude: parseFloat(raw.primary_venue.longitude),
  address: raw.primary_venue.localized_address_display,
  event_url: raw.event_url,        
  tickets_url: raw.tickets_url,    
});

export const fetchEvents = async (city: string, state: string): Promise<EventItem[]> => {
  try {
    const options = {
      method: 'GET',
      url: `https://${API_HOST}/all_event`,
      params: {
        city,
        state,
        page: '1',
      },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
      },
    };

    const response = await axios.request(options);
    const data = response.data;

    if (data && data.events && Array.isArray(data.events)) {
      const mapped = data.events.map(mapEventbriteToEvent);
      console.log('Mapped events:', mapped[0]); 
      return mapped;
    }

    return [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};
