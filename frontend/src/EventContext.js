import React, { createContext, useContext, useState } from 'react';

export const EventContext = createContext(); // Export it!

export const useEventContext = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [city, setCity] = useState("Waterloo");
  const [category, setCategory] = useState("");

  return (
    <EventContext.Provider value={{ events, setEvents, city, setCity, category, setCategory }}>
      {children}
    </EventContext.Provider>
  );
};
