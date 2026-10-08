import { createContext, useContext } from 'react';

/** Lets content blocks resolve "./images/…" relative to the week folder. */
export const WeekContext = createContext<{ dir: string; week?: number }>({ dir: '' });

export const useWeekDir = () => useContext(WeekContext).dir;

export const useWeekNumber = () => useContext(WeekContext).week;
