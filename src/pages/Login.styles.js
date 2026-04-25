const loginStyles = {
  container: (theme) => ({
    minHeight: "75vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 2,

    // 🔥 fondo adaptado correctamente
    background: theme.palette.background.default,
  }),

  paper: (theme) => ({
  p: 4,
  borderRadius: 4,
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: 3,

  // 🔥 MÁS CONTRASTE
  backgroundColor:
    theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",

  // 🔥 BORDE MÁS VISIBLE
  border: "1px solid",
  borderColor:
    theme.palette.mode === "dark" ? "#333" : "#ddd",

  // 🔥 SOMBRA MÁS FUERTE
  boxShadow:
    theme.palette.mode === "dark"
      ? "0 20px 50px rgba(0,0,0,0.8)"
      : "0 20px 50px rgba(0,0,0,0.25)",

  // 🔥 EFECTO ELEVADO
  transform: "translateY(0)",
}),

  titulo: (theme) => ({
    color: theme.palette.primary.main,
  }),

  subtitulo: (theme) => ({
    mb: 2,
    color: theme.palette.text.secondary,
  }),

  // 🔥 BOTÓN LOGIN PRO
  botonLogin: (theme) => ({
    py: 1.4,
    fontWeight: 600,
    borderRadius: 2,

    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,

    color: theme.palette.primary.contrastText,

    boxShadow:
      theme.palette.mode === "dark"
        ? "0 6px 18px rgba(0,0,0,0.5)"
        : "0 6px 18px rgba(0,0,0,0.2)",

    transition: "all 0.25s ease",

    "&:hover": {
      transform: "translateY(-2px)",
      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
    },
  }),

  // 🔥 BOTÓN REGISTER PRO
  botonRegister: (theme) => ({
    py: 1.3,
    fontWeight: 500,
    borderRadius: 2,

    border: "1px solid",
    borderColor: theme.palette.primary.main,

    color: theme.palette.primary.main,

    backgroundColor: "transparent",

    transition: "all 0.25s ease",

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      transform: "translateY(-2px)",
    },
  }),

  acciones: {
    display: "flex",
    flexDirection: "column",
    gap: 1.2,
    mt: 1,
  },
};

export default loginStyles;
