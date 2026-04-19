import {
  Box,
  Typography,
  Stack,
  IconButton,
  Dialog,
  Button,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useState, useEffect, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import detalleModalStyles from "./DetalleModal.styles";
import { botonAgregarSx } from "../components/ProductoCard.styles";

export default function DetalleModal({
  producto,
  open,
  onClose,
  setLightbox,
}) {
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();

  const variantes = producto?.variantes || [];

  const [imagenActiva, setImagenActiva] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

  // 🔥 DEBUG (puedes borrar luego)
  useEffect(() => {
    if (open) {
      console.log("VARIANTES:", variantes);
    }
  }, [open, variantes]);

  // =========================
  // 🖼 IMÁGENES
  // =========================
  const imagenes = useMemo(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      return varianteSeleccionada.imagenes.map((img) => img.imagen);
    }

    const imgs = [
      producto?.imagen,
      ...(producto?.imagenes?.map((img) => img.imagen) || []),
    ].filter(Boolean);

    return [...new Set(imgs)];
  }, [producto, varianteSeleccionada]);

  // =========================
  // 🔥 STOCK TOTAL
  // =========================
  const stockTotal = useMemo(() => {
    if (variantes.length === 0) return 1;

    return variantes.reduce((acc, v) => acc + (v.stock || 0), 0);
  }, [variantes]);

  // =========================
  // 🔥 AUTO-SELECCIÓN SEGURA
  // =========================
  useEffect(() => {
    if (open && variantes.length > 0) {
      const disponible = variantes.find((v) => v.stock > 0);
      setVarianteSeleccionada(disponible || variantes[0]);
    } else {
      setVarianteSeleccionada(null);
    }
  }, [open, variantes]);

  // =========================
  // IMAGEN ACTIVA
  // =========================
  useEffect(() => {
    if (varianteSeleccionada?.imagenes?.length > 0) {
      setImagenActiva(varianteSeleccionada.imagenes[0].imagen);
    } else {
      setImagenActiva(imagenes[0] || "");
    }
  }, [varianteSeleccionada, imagenes]);

  if (!producto) return null;

  const imagenSegura = imagenActiva || imagenes[0] || "/placeholder.png";

  const tieneVariantes = variantes.length > 0;

  const tieneStockVariantes = variantes.some((v) => v.stock > 0);

  // =========================
  // 🛒 AGREGAR
  // =========================
  const handleAgregar = async () => {
    if (!isAuthenticated) {
      toast.warn("Debes iniciar sesión");
      return;
    }

    if (tieneVariantes && !varianteSeleccionada) {
      toast.error("Selecciona una variante");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        varianteSeleccionada?.id || null,
        1
      );

      toast.success("Producto agregado ✅");
      onClose();
    } catch (e) {
      toast.error(e.message || "Error al agregar");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={detalleModalStyles.dialog}
      PaperProps={{ sx: detalleModalStyles.dialogPaper }}
    >
      <IconButton onClick={onClose} sx={detalleModalStyles.botonCerrar}>
        <CloseIcon />
      </IconButton>

      <Stack spacing={3} alignItems="center">
        {/* IMAGEN */}
        <Box
          sx={detalleModalStyles.sliderBox}
          onClick={() => setLightbox && setLightbox(imagenSegura)}
        >
          <Box
            component="img"
            src={imagenSegura}
            alt={producto.nombre}
            sx={detalleModalStyles.imagen}
          />
        </Box>

        {/* MINIATURAS */}
        {imagenes.length > 1 && (
          <Stack direction="row" spacing={1}>
            {imagenes.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                onClick={() => setImagenActiva(img)}
                sx={{
                  width: 55,
                  height: 55,
                  objectFit: "cover",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
              />
            ))}
          </Stack>
        )}

        {/* INFO */}
        <Box textAlign="center">
          <Typography variant="h5" fontWeight="bold">
            {producto.nombre}
          </Typography>

          <Typography variant="h6" color="primary" fontWeight="bold">
            ${varianteSeleccionada?.precio ?? producto.precio}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            {producto.descripcion}
          </Typography>
        </Box>

        {/* VARIANTES */}
        {tieneVariantes && (
          <Stack spacing={2} alignItems="center">
            <Typography fontWeight="bold">
              Selecciona una opción:
            </Typography>

            {!tieneStockVariantes && (
              <Chip label="Sin stock" color="error" />
            )}

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {variantes.map((v) => {
                const label = [
                  v.talla,
                  v.color,
                  v.material,
                  v.edicion,
                  v.capacidad,
                  v.marca,
                ]
                  .filter(Boolean)
                  .join(" / ");

                return (
                  <Button
                    key={v.id}
                    variant={
                      varianteSeleccionada?.id === v.id
                        ? "contained"
                        : "outlined"
                    }
                    onClick={() => setVarianteSeleccionada(v)}
                    disabled={v.stock === 0}
                  >
                    {label || "Única"}  
                    <br />
                    <small>
                      ${v.precio ?? producto.precio} • {v.stock}
                    </small>
                  </Button>
                );
              })}
            </Stack>
          </Stack>
        )}

        {/* BOTÓN */}
        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={handleAgregar}
          sx={{ ...botonAgregarSx(stockTotal), width: "100%" }}
        >
          Agregar al carrito
        </Button>
      </Stack>
    </Dialog>
  );
}
