import { createContext, useContext, useState } from 'react';
import StorageService from '../services/storageService';
import config from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(StorageService.get(config.hrmToken));

  const setToken = (newToken) => {
    StorageService.set(config.hrmToken, newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    StorageService.remove(config.hrmToken);
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
