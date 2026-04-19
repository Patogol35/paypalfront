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
import { calcularSubtotal } from "../utils/carritoUtils";
import carritoItemStyles from "./CarritoItem.styles";

export default function CarritoItem({
  it,
  incrementar,
  decrementar,
  setCantidad,
  eliminarItem,
}) {
  if (!it || !it.producto) return null;

  const producto = it.producto;
  const variante = it.variante || {};

  // 📦 STOCK
  const stock = variante?.stock ?? producto?.stock ?? 0;

  // 💰 PRECIO UNITARIO
  const precioUnitario =
    variante?.precio ?? producto?.precio ?? 0;

  // 🖼 IMAGEN
  const imagen =
    variante?.imagenes?.[0]?.imagen ||
    producto?.imagenes?.[0]?.imagen ||
    producto?.imagen ||
    "/placeholder.png";

  // 🧠 VARIANTE LABEL
  const varianteLabel = [variante.talla, variante.color, variante.modelo]
    .filter(Boolean)
    .join(" - ");

  // 🗑 ELIMINAR CON TOAST
  const handleEliminar = () => {
    eliminarItem(it.id);
    toast.info("Producto eliminado 🗑️");
  };

  return (
    <Card sx={carritoItemStyles.card}>
      {/* IMAGEN */}
      <CardMedia
        component="img"
        image={imagen}
        alt={producto.nombre}
        sx={(theme) => carritoItemStyles.media(theme)}
      />

      {/* INFO */}
      <CardContent sx={carritoItemStyles.content}>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {producto.nombre}
          </Typography>

          {varianteLabel && (
            <Typography variant="body2" color="text.secondary">
              {varianteLabel}
            </Typography>
          )}

          {/* 💰 PRECIO UNITARIO */}
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <MonetizationOnIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="bold">
              ${precioUnitario.toFixed(2)} c/u
            </Typography>
          </Stack>
        </Box>

        {/* 🔥 SUBTOTAL (VOLVIMOS A LA FUNCIÓN ORIGINAL) */}
        <Stack direction="row" spacing={1}>
          <Chip
            label={`Subtotal: $${calcularSubtotal(it).toFixed(2)}`}
            color="success"
            sx={carritoItemStyles.chipSubtotal}
          />

          <Chip
            label={`Stock: ${stock}`}
            color={stock > 0 ? "info" : "default"}
          />
        </Stack>
      </CardContent>

      {/* CONTROLES */}
      <Box sx={carritoItemStyles.controlesWrapper}>
        <Box sx={carritoItemStyles.cantidadWrapper}>
          <IconButton
            onClick={() => decrementar(it)}
            disabled={it.cantidad <= 1}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            type="number"
            size="small"
            value={it.cantidad}
            inputProps={{ min: 1, max: stock }}
            onChange={(e) => {
              const val = Number(e.target.value);

              if (!val || val < 1) {
                setCantidad(it.id, 1);
                return;
              }

              if (val > stock) {
                toast.warning(`Solo hay ${stock}`);
                setCantidad(it.id, stock);
                return;
              }

              setCantidad(it.id, val);
            }}
            sx={carritoItemStyles.cantidadInput}
          />

          <IconButton
            onClick={() => incrementar(it)}
            disabled={it.cantidad >= stock}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* 🟥 ELIMINAR PRO */}
        <IconButton
          onClick={handleEliminar}
          sx={{
            color: "#d32f2f",
            "&:hover": {
              backgroundColor: "rgba(211,47,47,0.1)",
              transform: "scale(1.1)",
            },
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
