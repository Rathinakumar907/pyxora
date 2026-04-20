import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [credits, setCredits] = useState(120);
  const [teachTags, setTeachTags] = useState(['Python', 'Calculus']);
  const [learnTags, setLearnTags] = useState(['Organic Chemistry']);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'light' : 'dark');
  };

  const login = (username) => {
    setUser({ username, id: 'user_' + Math.random().toString(36).substr(2, 9) });
  };

  const logout = () => {
    setUser(null);
  };

  const addTeachTag = (tag) => {
    if (!teachTags.includes(tag)) setTeachTags([...teachTags, tag]);
  };

  const addLearnTag = (tag) => {
    if (!learnTags.includes(tag)) setLearnTags([...learnTags, tag]);
  };

  const spendCredits = (amount) => {
    if (credits >= amount) {
      setCredits(credits - amount);
      return true;
    }
    return false;
  };

  const earnCredits = (amount) => {
    setCredits(prev => prev + amount);
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      credits, spendCredits, earnCredits,
      teachTags, addTeachTag,
      learnTags, addLearnTag,
      theme, toggleTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
