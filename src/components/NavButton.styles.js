const navButtonStyles = (theme, isActive, item, alwaysColoredPaths) => {
  const isColored =
    isActive || alwaysColoredPaths.includes(item.path);

  return {
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "#fff",
    borderRadius: "12px",
    textTransform: "none",
    width: "100%",
    py: 1.2,
    transition: "all 0.25s ease",

    "& .MuiButton-startIcon": {
      color: "#fff",
      filter:
        !isColored
          ? "drop-shadow(0 0 2px rgba(0,0,0,0.6))"
          : "none",
    },

    // 🎨 Fondo dinámico (más estable sin objeto responsive)
    background: isColored ? item.color : "transparent",

    // ✨ Estado activo
    boxShadow: isActive
      ? "0 0 20px rgba(255,255,255,0.5)"
      : "none",
    transform: isActive ? "scale(1.04)" : "scale(1)",

    // 🚀 Hover (UNIFICADO para light + dark)
    "&:hover": {
      background: item.color,
      boxShadow: isActive
        ? "0 0 20px rgba(0,0,0,0.4)"
        : "0 0 12px rgba(0,0,0,0.25)",
      filter:
        theme.palette.mode === "dark"
          ? "brightness(1.2)"
          : "brightness(1.1)",
    },

    // 🌙 Dark mode (sin romper hover)
    ...(theme.palette.mode === "dark" && {
      color: "#fff",
    }),
  };
};

export default navButtonStyles;
