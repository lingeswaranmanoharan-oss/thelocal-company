import { Navigate } from 'react-router-dom';
import { Container } from '../layouts/container/Container';
import { useAuth } from '../context/AuthContext';
export const ProtectedRoute = () => {
  const { token } = useAuth();
  return token ? <Container /> : <Navigate to="/login" replace />;
};
