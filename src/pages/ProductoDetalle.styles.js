// ================================
// CONTENEDOR PRINCIPAL
// ================================
export const containerSx = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "24px",
};


// ================================
// BOTÓN VOLVER
// ================================
export const botonVolverSx = (theme) => ({
  marginBottom: 20,
  borderRadius: 10,
  textTransform: "none",
  fontWeight: 500,

  border: "1px solid",
  borderColor:
    theme.palette.mode === "dark" ? "#fff" : "#000",

  color:
    theme.palette.mode === "dark" ? "#fff" : "#000",

  "&:hover": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,0.08)"
        : "rgba(0,0,0,0.05)",
  },
});


// ================================
// CONTENEDOR IMAGEN
// ================================
export const imagenContainerSx = (theme) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? "#2c2c2c" : "#f5f5f5",

  borderRadius: 16,
  padding: 16,

  boxShadow:
    theme.palette.mode === "dark"
      ? "0 8px 25px rgba(0,0,0,0.5)"
      : "0 8px 20px rgba(0,0,0,0.1)",
});


// ================================
// SLIDE IMAGEN
// ================================
export const imagenSlideSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 420,
  cursor: "pointer",
};


// ================================
// IMAGEN
// ================================
export const imagenSx = {
  maxWidth: "100%",
  maxHeight: "100%",
  objectFit: "contain",
  borderRadius: 12,
  transition: "transform 0.3s ease",

  "&:hover": {
    transform: "scale(1.05)",
  },
};


// ================================
// TÍTULO
// ================================
export const tituloSx = {
  fontWeight: 700,
  lineHeight: 1.3,
};


// ================================
// PRECIO
// ================================
export const precioSx = (theme) => ({
  fontWeight: 700,
  fontSize: "1.6rem",
  color:
    theme.palette.mode === "dark"
      ? "#4dabf5"
      : "#1976d2",
});


// ================================
// BOTÓN VARIANTE
// ================================
export const varianteBtnSx = (isSelected, stock, theme) => ({
  borderRadius: "999px",
  textTransform: "none",
  fontWeight: 500,
  fontSize: "0.85rem",
  padding: "6px 14px",

  border: "1px solid",

  borderColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.mode === "dark"
    ? "#555"
    : "#ddd",

  backgroundColor: isSelected
    ? theme.palette.primary.main
    : theme.palette.mode === "dark"
    ? "#1f1f1f"
    : "#fff",

  color: isSelected ? "#fff" : theme.palette.text.primary,

  opacity: stock === 0 ? 0.4 : 1,

  "&:hover": {
    transform: stock > 0 ? "scale(1.05)" : "none",
    backgroundColor: isSelected
      ? theme.palette.primary.dark
      : theme.palette.mode === "dark"
      ? "#2a2a2a"
      : "#f5f5f5",
  },
});


// ================================
// DESCRIPCIÓN
// ================================
export const descripcionSx = {
  color: "text.secondary",
  lineHeight: 1.6,
  fontSize: "0.95rem",
};


// ================================
// CHIP STOCK
// ================================
export const stockChipSx = {
  alignSelf: "flex-start",
  fontWeight: 600,
  borderRadius: 8,
};


// ================================
// BOTÓN AGREGAR
// ================================
export const botonAgregarSx = (stock) => ({
  borderRadius: 12,
  padding: "10px 20px",

  maxWidth: 280,   // 🔥 controla tamaño
  width: "100%",
  alignSelf: "flex-start",

  fontWeight: 600,
  fontSize: "0.95rem",
  textTransform: "none",

  background:
    stock > 0
      ? "linear-gradient(135deg, #1976d2, #42a5f5)"
      : "#bdbdbd",

  color: "#fff",

  transition: "all 0.25s ease",

  "&:hover": {
    transform: stock > 0 ? "scale(1.04)" : "none",
    background:
      stock > 0
        ? "linear-gradient(135deg, #1565c0, #1e88e5)"
        : "#bdbdbd",
  },
});
