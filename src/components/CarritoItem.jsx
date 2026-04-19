import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { toast } from "react-toastify";
import carritoItemStyles from "./CarritoItem.styles";

export default function CarritoItem(props) {
  const {
    it,
    incrementar,
    decrementar,
    setCantidad,
    eliminarItem,
  } = props || {};

  // 🛑 SI NO HAY DATA → NO RENDERIZA
  if (!it || typeof it !== "object") {
    console.warn("Item inválido en carrito:", it);
    return null;
  }

  const producto = it.producto || {};
  const variante = it.variante || {};

  // 📦 STOCK SEGURO
  const stock =
    Number(variante.stock ?? producto.stock ?? 0) || 0;

  // 💰 PRECIO SEGURO
  const precioUnitario =
    Number(variante.precio ?? producto.precio ?? 0) || 0;

  const cantidad = Number(it.cantidad ?? 1) || 1;

  const subtotal = precioUnitario * cantidad;

  // 🖼 IMAGEN SEGURA
  const imagen =
    variante?.imagenes?.[0]?.imagen ||
    producto?.imagenes?.[0]?.imagen ||
    producto?.imagen ||
    "/placeholder.png";

  // 🧠 VARIANTE LABEL
  const varianteLabel = [
    variante.talla,
    variante.color,
    variante.modelo,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <Card sx={carritoItemStyles.card}>
      <CardMedia
        component="img"
        image={imagen}
        alt={producto?.nombre || "producto"}
        sx={(theme) => carritoItemStyles.media(theme)}
      />

      <CardContent sx={carritoItemStyles.content}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {producto?.nombre || "Producto"}
          </Typography>

          {varianteLabel && (
            <Typography variant="body2" color="text.secondary">
              {varianteLabel}
            </Typography>
          )}

          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <MonetizationOnIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="bold">
              ${precioUnitario.toFixed(2)} c/u
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`Subtotal: $${subtotal.toFixed(2)}`}
            color="success"
          />

          <Chip
            label={`Stock: ${stock}`}
            color={stock > 0 ? "info" : "default"}
          />
        </Stack>
      </CardContent>

      <Box sx={carritoItemStyles.controlesWrapper}>
        <Box sx={carritoItemStyles.cantidadWrapper}>
          <IconButton
            onClick={() => decrementar && decrementar(it)}
            disabled={cantidad <= 1}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            type="number"
            size="small"
            value={cantidad}
            inputProps={{ min: 1, max: stock || 1 }}
            onChange={(e) => {
              const val = Number(e.target.value);

              if (!val || val < 1) {
                setCantidad && setCantidad(it.id, 1);
                return;
              }

              if (val > stock) {
                toast.warning(`Solo hay ${stock}`);
                setCantidad && setCantidad(it.id, stock);
                return;
              }

              setCantidad && setCantidad(it.id, val);
            }}
            sx={carritoItemStyles.cantidadInput}
          />

          <IconButton
            onClick={() => incrementar && incrementar(it)}
            disabled={cantidad >= stock}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <IconButton
          onClick={() => eliminarItem && eliminarItem(it.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
