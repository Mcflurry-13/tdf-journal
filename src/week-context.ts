import { createContext, useContext } from 'react';

/** Lets content blocks resolve "./images/…" relative to the week folder. */
export const WeekContext = createContext<{ dir: string }>({ dir: '' });

export const useWeekDir = () => useContext(WeekContext).dir;
