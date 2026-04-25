import { alpha } from "@mui/material/styles";

export const layoutStyles = (theme) => ({
  footer: {
  textAlign: "center",
  paddingTop: 10,
  paddingBottom: 10,
  marginTop: "auto",

  fontSize: "0.85rem",
  letterSpacing: "0.3px",

  color: theme.palette.text.secondary,

  borderTop: `1px solid ${
    theme.palette.mode === "dark"
      ? alpha("#fff", 0.25)
      : alpha("#000", 0.15)
  }`,

  backgroundColor: theme.palette.background.paper,

  transition: "all 0.3s ease",

  // 👇 toque elegante
  opacity: 0.85,
  "&:hover": {
    opacity: 1,
  },
}
});
