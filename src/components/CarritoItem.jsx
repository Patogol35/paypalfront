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

export default function CarritoItem({
  it,
  incrementar,
  decrementar,
  setCantidad,
  eliminarItem,
}) {
  if (!it || !it.producto) return null;

  const producto = it.producto || {};
  const variante = it.variante || {};

  const stock = Number(variante.stock ?? producto.stock ?? 0);
  const precioUnitario = Number(variante.precio ?? producto.precio ?? 0);
  const cantidad = Number(it.cantidad ?? 1);

  const subtotal = precioUnitario * cantidad;

  const imagen =
    variante?.imagenes?.[0]?.imagen ||
    producto?.imagenes?.[0]?.imagen ||
    producto?.imagen ||
    "/placeholder.png";

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
      <CardMedia
        component="img"
        image={imagen}
        alt={producto.nombre}
        sx={(theme) => carritoItemStyles.media(theme)}
      />

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

          {/* 💰 PRECIO */}
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <MonetizationOnIcon fontSize="small" color="primary" />
            <Typography variant="body2" fontWeight="bold">
              ${precioUnitario.toFixed(2)} c/u
            </Typography>
          </Stack>
        </Box>

        {/* SUBTOTAL */}
        <Stack direction="row" spacing={1}>
          <Chip
            label={`Subtotal: $${subtotal.toFixed(2)}`}
            color="success"
          />
        </Stack>
      </CardContent>

      {/* CONTROLES */}
      <Box sx={carritoItemStyles.controlesWrapper}>
        <Box sx={carritoItemStyles.cantidadWrapper}>
          <IconButton
            onClick={() => decrementar(it)}
            disabled={cantidad <= 1}
          >
            <RemoveIcon />
          </IconButton>

          <TextField
            type="number"
            size="small"
            value={cantidad}
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
            disabled={cantidad >= stock}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* 🟥 BOTÓN ELIMINAR PRO */}
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
