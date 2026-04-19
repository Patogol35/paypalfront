import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Chip,
  Divider,
  Dialog,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useCarrito } from "../context/CarritoContext";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "react-slick";

export default function ProductoDetalle() {
  const { state } = useLocation();
  const producto = state?.producto;
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();

  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState("");

  // 🔥 NUEVO: selección de variantes
  const [talla, setTalla] = useState(null);
  const [color, setColor] = useState(null);

  if (!producto) return <Typography>Producto no encontrado</Typography>;

  const variantes = producto.variantes || [];

  // 🔥 opciones únicas
  const tallas = [...new Set(variantes.map(v => v.talla).filter(Boolean))];
  const colores = [...new Set(variantes.map(v => v.color).filter(Boolean))];

  // 🔥 variante seleccionada
  const varianteSeleccionada = variantes.find(
    v => v.talla === talla && v.color === color
  );

  const handleAdd = async () => {
    if (variantes.length > 0 && !varianteSeleccionada) {
      toast.warning("Selecciona talla y color");
      return;
    }

    try {
      await agregarAlCarrito(
        producto.id,
        varianteSeleccionada?.id,
        1
      );

      toast.success(`"${producto.nombre}" agregado al carrito ✅`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const imagenes = [
    producto.imagen,
    ...(producto.imagenes?.map(i => i.imagen) || []),
  ].filter(Boolean);

  const handleZoom = (img) => {
    setZoomImage(img);
    setZoomOpen(true);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      {/* Volver */}
      <Button
        startIcon={<ArrowBackIcon />}
        variant="outlined"
        sx={{ mb: 3, borderRadius: 2 }}
        onClick={() => navigate(-1)}
      >
        Regresar a productos
      </Button>

      <Grid container spacing={5}>
        {/* IMÁGENES */}
        <Grid item xs={12} md={6}>
          <Box sx={{
            bgcolor: "#fafafa",
            borderRadius: 3,
            p: 2,
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}>
            <Slider {...settings}>
              {imagenes.map((img, i) => (
                <Box
                  key={i}
                  onClick={() => handleZoom(img)}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: { xs: 300, md: 500 },
                    cursor: "pointer",
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt=""
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: 2,
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        </Grid>

        {/* DETALLE */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Typography variant="h4" fontWeight="bold">
              {producto.nombre}
            </Typography>

            <Typography variant="h5" color="primary">
              ${producto.precio}
            </Typography>

            {/* 🔥 TALLAS */}
            {tallas.length > 0 && (
              <>
                <Typography fontWeight="bold">Talla</Typography>
                <ToggleButtonGroup
                  value={talla}
                  exclusive
                  onChange={(e, val) => setTalla(val)}
                >
                  {tallas.map((t) => (
                    <ToggleButton key={t} value={t}>
                      {t}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            )}

            {/* 🔥 COLORES */}
            {colores.length > 0 && (
              <>
                <Typography fontWeight="bold">Color</Typography>
                <ToggleButtonGroup
                  value={color}
                  exclusive
                  onChange={(e, val) => setColor(val)}
                >
                  {colores.map((c) => (
                    <ToggleButton key={c} value={c}>
                      {c}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </>
            )}

            {/* 🔥 STOCK REAL */}
            {varianteSeleccionada && (
              <Chip
                label={`Stock: ${varianteSeleccionada.stock}`}
                color={varianteSeleccionada.stock > 0 ? "success" : "default"}
              />
            )}

            <Divider />

            <Typography sx={{ color: "text.secondary" }}>
              {producto.descripcion}
            </Typography>

            {/* BOTÓN */}
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAdd}
              disabled={
                variantes.length > 0 &&
                (!varianteSeleccionada ||
                  varianteSeleccionada.stock === 0)
              }
              sx={{
                borderRadius: 3,
                py: 1.5,
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              }}
            >
              Agregar al carrito
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* ZOOM */}
      <Dialog open={zoomOpen} onClose={() => setZoomOpen(false)}>
        <Box sx={{ position: "relative" }}>
          <IconButton
            onClick={() => setZoomOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10, color: "white" }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            component="img"
            src={zoomImage}
            sx={{ maxHeight: "80vh", maxWidth: "100%" }}
          />
        </Box>
      </Dialog>
    </Box>
  );
}
