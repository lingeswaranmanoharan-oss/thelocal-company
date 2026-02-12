import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken, setTokenUpdateCallback } from '../services/httpService';
import axios from 'axios';
import { config } from '../config/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    try {
      const refreshResponse = await axios.post(
        config.apiBaseUrl + '/auth/refresh',
        {},
        { withCredentials: true }
      );
      if(refreshResponse.data){
        const {accessToken} = refreshResponse.data.data;
        setAccessToken(accessToken); 
        setToken(accessToken);
      }
    } catch {
      setToken(null);
      setAccessToken(null); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  useEffect(() => {
    setTokenUpdateCallback(setToken);
    return () => setTokenUpdateCallback(null);
  }, []);

  const logout = () => {
    setToken(null);
    setAccessToken(null); 
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
       {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
