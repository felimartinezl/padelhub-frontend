import { StyleSheet } from "react-native";

// ── Design tokens ─────────────────────────────────────────────────────────────
export const C = {
  accent:   "#4f46e5",
  accent2:  "#7c3aed",
  bg:       "#0a0a12",
  bg2:      "#11111e",
  bg3:      "#191928",
  bg4:      "#21213a",
  border:   "rgba(255,255,255,0.08)",
  border2:  "rgba(79,70,229,0.4)",
  text:     "#f0f0ff",
  text2:    "#9090bb",
  green:    "#22c55e",
  red:      "#ef4444",
  gold:     "#f59e0b",
} as const;

// ── Estilos compartidos ───────────────────────────────────────────────────────
export const S = StyleSheet.create({
  // Contenedor raíz de cada pantalla
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Scroll area
  scroll: {
    flex: 1,
  },

  // Padding horizontal estándar
  px: {
    paddingHorizontal: 20,
  },

  // Cards
  card: {
    backgroundColor: C.bg3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
  },

  upcomingCard: {
    backgroundColor: "rgba(79,70,229,0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border2,
    padding: 16,
    marginBottom: 10,
  },

  // Botón primario
  btn: {
    backgroundColor: C.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600" as const,
  },
  btnDisabled: {
    opacity: 0.55,
  },

  // Botón ghost
  btnGhost: {
    backgroundColor: C.bg4,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: "row" as const,
    gap: 8,
  },
  btnGhostText: {
    color: C.text2,
    fontSize: 15,
    fontWeight: "600" as const,
  },

  // Botón volver
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: C.bg3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  backBtnText: {
    color: C.text,
    fontSize: 16,
  },

  // Input
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 11,
    color: C.text2,
    textTransform: "uppercase" as const,
    letterSpacing: 0.6,
    marginBottom: 6,
    fontWeight: "500" as const,
  },
  input: {
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: C.text,
  },
  inputFocused: {
    borderColor: C.accent,
  },

  // Error
  error: {
    backgroundColor: "rgba(239,68,68,0.1)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  errorText: {
    fontSize: 13,
    color: "#fca5a5",
  },

  // Avatar
  avatar: {
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700" as const,
  },

  // Pills
  pill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  pillPurple: { backgroundColor: "rgba(79,70,229,0.2)"  },
  pillPurpleText: { color: "#a5b4fc" },
  pillGreen:  { backgroundColor: "rgba(34,197,94,0.15)" },
  pillGreenText:  { color: "#86efac" },
  pillRed:    { backgroundColor: "rgba(239,68,68,0.15)" },
  pillRedText:    { color: "#fca5a5" },
  pillGray:   { backgroundColor: "rgba(255,255,255,0.07)" },
  pillGrayText:   { color: C.text2 },

  // Divider
  divider: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    fontSize: 12,
    color: C.text2,
  },

  // MMR bar
  mmrBar: {
    backgroundColor: "rgba(79,70,229,0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border2,
    padding: 16,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 16,
    marginBottom: 16,
  },
  mmrNum: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: C.accent,
    letterSpacing: -1,
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    color: C.text2,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    fontWeight: "600" as const,
    marginBottom: 10,
  },

  // Quick grid
  quickGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
    marginBottom: 20,
  },
  quickCard: {
    width: "48%",
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
  },

  // Player card
  playerCard: {
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 14,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginBottom: 8,
  },

  // Nav bar
  navBar: {
    height: 72,
    backgroundColor: C.bg2,
    borderTopWidth: 1,
    borderTopColor: C.border,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingVertical: 8,
    gap: 4,
  },
  navIcon: {
    fontSize: 18,
    lineHeight: 22,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: "400" as const,
  },

  // Format option (crear partido)
  formatOpt: {
    flex: 1,
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    alignItems: "center" as const,
  },
  formatOptSelected: {
    borderColor: C.accent,
    backgroundColor: "rgba(79,70,229,0.1)",
  },

  // Slot jugador
  slot: {
    width: 64,
    paddingVertical: 10,
    backgroundColor: C.bg3,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    borderStyle: "dashed" as const,
    alignItems: "center" as const,
    gap: 4,
  },
  slotFilled: {
    borderStyle: "solid" as const,
    borderColor: C.accent,
    backgroundColor: "rgba(79,70,229,0.08)",
  },
});
