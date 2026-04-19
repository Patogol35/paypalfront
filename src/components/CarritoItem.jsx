import {
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  Chip,
  TextField,
  IconButton,
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
  const stock = it.variante?.stock ?? 0;

  const imagen =
    it.variante?.imagenes?.[0]?.imagen ||
    it.producto?.imagenes?.[0]?.imagen ||
    it.producto?.imagen ||
    "/placeholder.png";

  const altTexto = it.variante
    ? `${it.producto?.nombre} ${it.variante.color || ""}`
    : it.producto?.nombre;

  const handleEliminar = () => {
    eliminarItem(it.id);
    toast.info("🗑 Producto eliminado del carrito");
  };

  return (
    <Card sx={carritoItemStyles.card}>
      {/* Imagen */}
      <CardMedia
        component="img"
        image={imagen}
        alt={altTexto}
        sx={(theme) => carritoItemStyles.media(theme)}
      />

      {/* INFO */}
      <CardContent sx={carritoItemStyles.content}>
        <Box>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {it.producto?.nombre}
          </Typography>

          {/* VARIANTE */}
          {it.variante && (
            <Typography variant="body2" color="text.secondary">
              {it.variante.talla && `Talla: ${it.variante.talla}`}{" "}
              {it.variante.color && `Color: ${it.variante.color}`}
            </Typography>
          )}

          <Typography
            variant="body2"
            color="text.secondary"
            sx={carritoItemStyles.descripcion}
          >
            {it.producto?.descripcion}
          </Typography>
        </Box>

        {/* PRECIO + STOCK */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Chip
            icon={<MonetizationOnIcon />}
            label={`$${calcularSubtotal(it).toFixed(2)}`}
            color="success"
          />

          <Chip
            label={stock > 0 ? `Stock: ${stock}` : "Agotado"}
            color={stock > 0 ? "info" : "error"}
          />
        </Box>
      </CardContent>

      {/* CONTROLES */}
      <Box sx={carritoItemStyles.controlesWrapper}>
        <Box sx={carritoItemStyles.cantidadWrapper}>
          {/* RESTAR */}
          <IconButton
            onClick={() => decrementar(it)}
            disabled={it.cantidad <= 1 || stock === 0}
          >
            <RemoveIcon />
          </IconButton>

          {/* INPUT */}
          <TextField
            type="number"
            size="small"
            value={it.cantidad}
            disabled={stock === 0}
            inputProps={{ min: 1, max: stock }}
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setCantidad(it.id, 1);
                return;
              }

              const nuevaCantidad = Number(value);

              if (nuevaCantidad >= 1 && nuevaCantidad <= stock) {
                setCantidad(it.id, nuevaCantidad);
              } else if (nuevaCantidad > stock) {
                toast.warning(`Solo hay ${stock} unidades`);
                setCantidad(it.id, stock);
              } else {
                setCantidad(it.id, 1);
              }
            }}
          />

          {/* SUMAR */}
          <IconButton
            onClick={() => incrementar(it)}
            disabled={it.cantidad >= stock || stock === 0}
          >
            <AddIcon />
          </IconButton>
        </Box>

        {/* ELIMINAR */}
        <IconButton onClick={handleEliminar}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
                         }
