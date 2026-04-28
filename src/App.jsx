import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import ProductoDetalle from "./pages/ProductoDetalle";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";


function AppContent() {
  const { isReady } = useAuth();

  // 🚫 bloquea render hasta que auth esté listo
  if (!isReady) return null;

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <Pedidos />
            </ProtectedRoute>
          }
        />

        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="6793546722-ro4pd9ldsdrrl4l9k0jdm0pbl7f5ppu0.apps.googleusercontent.com">
      
      {/* 🔥 PAYPAL GLOBAL */}
      <PayPalScriptProvider
        options={{
          "client-id": "TU_CLIENT_ID_PAYPAL", // 👈 reemplaza
          currency: "USD",
          intent: "capture",
        }}
      >
        <BrowserRouter>
          <AuthProvider>
            <CarritoProvider>
              <AppContent />
            </CarritoProvider>
          </AuthProvider>
        </BrowserRouter>
      </PayPalScriptProvider>

    </GoogleOAuthProvider>
  );
}

export default App;
