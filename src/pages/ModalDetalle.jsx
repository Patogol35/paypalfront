
import {
  Box,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();
  const { isAuthenticated } = useAuth();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imagenActiva, setImagenActiva] = useState("");
  const [varianteSeleccionada, setVarianteSeleccionada] = useState(null);

  // 🔄 FETCH PRODUCTO
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/productos/${id}/`
        );

        if (!res.ok) throw new Error("Error al cargar producto");

        const data = await res.json();
        setProducto(data);
      } catch (e) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  // 🖼 IMÁGENES
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

  // 📦 STOCK TOTAL
  const stockTotal = useMemo(() => {
    if (!producto?.variantes?.length) return 1;
    return producto.variantes.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );
  }, [producto]);

  const tieneVariantes = producto?.variantes?.length > 0;
  const tieneStockVariantes = producto?.variantes?.some(
    (v) => v.stock > 0
  );

  // 💰 PRECIO
  const precioActual =
    varianteSeleccionada?.precio ?? producto?.precio;

  // 🖼 imagen inicial
  useEffect(() => {
    if (!producto) return;

    if (varianteSeleccionada?.imagenes?.length > 0) {
      setImagenActiva(varianteSeleccionada.imagenes[0].imagen);
    } else {
      setImagenActiva(imagenes[0] || "");
    }
  }, [producto, varianteSeleccionada, imagenes]);

  const imagenSegura =
    imagenActiva || imagenes[0] || "/placeholder.png";

  // 🛒 AGREGAR
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
    } catch (e) {
      toast.error(e.message || "Error al agregar");
    }
  };

  // ⏳ LOADING
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ❌ NO ENCONTRADO
  if (!producto) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography>No se encontró el producto</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 5 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={5}
      >
        {/* 🖼 IMÁGENES */}
        <Box flex={1}>
          <Box
            component="img"
            src={imagenSegura}
            alt={producto.nombre}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "contain",
              borderRadius: 2,
            }}
          />

          {/* MINIATURAS */}
          {imagenes.length > 1 && (
            <Stack direction="row" spacing={1} mt={2}>
              {imagenes.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={img}
                  onClick={() => setImagenActiva(img)}
                  sx={(theme) => ({
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 1,
                    cursor: "pointer",
                    border:
                      imagenSegura === img
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                  })}
                />
              ))}
            </Stack>
          )}
        </Box>

        {/* 📦 INFO */}
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            {producto.nombre}
          </Typography>

          <Typography mt={2}>
            {producto.descripcion}
          </Typography>

          {/* 💰 PRECIO */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            mt={3}
          >
            <AttachMoneyIcon color="success" />
            <Typography
              variant="h5"
              fontWeight="bold"
              color="success.main"
            >
              {precioActual}
            </Typography>
          </Stack>

          {/* 📦 STOCK */}
          <Box mt={2}>
            <Chip
              label={`Stock total: ${stockTotal}`}
              color={stockTotal > 0 ? "success" : "default"}
            />
          </Box>

          {/* 🎯 VARIANTES */}
          {tieneVariantes && (
            <Stack spacing={2} mt={4}>
              <Typography fontWeight="bold">
                Selecciona una opción:
              </Typography>

              {!tieneStockVariantes && (
                <Chip label="Sin stock" color="error" />
              )}

              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {producto.variantes.map((v) => {
                  const isSelected =
                    varianteSeleccionada?.id === v.id;

                  const label = [...new Set(
                    [v.talla, v.color, v.modelo, v.capacidad]
                      .filter(Boolean)
                      .map((x) => x.trim())
                  )].join(" - ");

                  return (
                    <Button
                      key={v.id}
                      onClick={() => setVarianteSeleccionada(v)}
                      disabled={v.stock === 0}
                      sx={{
                        px: 2.5,
                        py: 1,
                        borderRadius: "999px",
                        textTransform: "none",
                        fontWeight: 500,
                        border: "1px solid #ddd",
                        backgroundColor: isSelected ? "#111" : "#fff",
                        color: isSelected ? "#fff" : "#333",
                        opacity: v.stock === 0 ? 0.4 : 1,
                        "&:hover": {
                          backgroundColor: isSelected
                            ? "#000"
                            : "#f5f5f5",
                        },
                      }}
                    >
                      {label || "Única"}
                    </Button>
                  );
                })}
              </Stack>

              {/* STOCK VARIANTE */}
              {varianteSeleccionada && (
                <Chip
                  label={`Stock: ${varianteSeleccionada.stock}`}
                  color={
                    varianteSeleccionada.stock > 0
                      ? "success"
                      : "default"
                  }
                />
              )}
            </Stack>
          )}

          {/* 🛒 BOTÓN */}
          <Box mt={5}>
            <Button
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
              onClick={handleAgregar}
              fullWidth
              disabled={
                tieneVariantes
                  ? !varianteSeleccionada ||
                    varianteSeleccionada.stock === 0
                  : stockTotal === 0
              }
            >
              {tieneVariantes
                ? varianteSeleccionada
                  ? varianteSeleccionada.stock > 0
                    ? "Agregar al carrito"
                    : "Agotado"
                  : "Seleccionar opciones"
                : stockTotal > 0
                ? "Agregar al carrito"
                : "Agotado"}
            </Button>
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
