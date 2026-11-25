import { Navigate, Route, Routes } from 'react-router-dom';
import HotelListPage from './pages/HotelListPage';
import HotelFormPage from './pages/HotelFormPage';
import HotelDetailPage from './pages/HotelDetailPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HotelListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotels/new"
        element={
          <ProtectedRoute>
            <HotelFormPage mode="add" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotels/:id"
        element={
          <ProtectedRoute>
            <HotelDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotels/:id/edit"
        element={
          <ProtectedRoute>
            <HotelFormPage mode="edit" />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
