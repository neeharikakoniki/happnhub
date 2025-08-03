import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EventItem } from '../../types/EventItem';

interface EventsState {
  events: EventItem[];
}

const initialState: EventsState = {
  events: [],
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<EventItem[]>) {
      state.events = action.payload;
    },
  },
});

export const { setEvents } = eventsSlice.actions;
export default eventsSlice.reducer;
