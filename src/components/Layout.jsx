import { Box, Container, IconButton, Badge } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCarrito } from "../context/CarritoContext";
import { layoutStyles } from "./Layout.styles"; // 👈 estilos externos

export default function Layout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const styles = layoutStyles(theme); // 👈 instanciar estilos

  // 🛒 carrito
  const { items } = useCarrito();

  // 🔢 total productos
  const totalItems =
    items?.reduce(
      (acc, item) => acc + (item.cantidad || item.quantity || 0),
      0
    ) || 0;

  return (
    <Box sx={styles.root}>
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO */}
      <Container maxWidth="lg" sx={styles.container}>
        <Outlet />
      </Container>

      {/* 🛒 BOTÓN FLOTANTE */}
      <IconButton
        onClick={() => navigate("/carrito")}
        sx={styles.floatingButton}
      >
        <Badge badgeContent={totalItems} color="error">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      {/* FOOTER */}
      <Box component="footer" sx={styles.footer}>
        © 2026 · E-commerce Jorge Patricio
      </Box>
    </Box>
  );
}
