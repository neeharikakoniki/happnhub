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
  category?: string; 
}
