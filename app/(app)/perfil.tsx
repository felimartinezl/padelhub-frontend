import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { C, S } from "../../theme";

const MMR_EVOLUCION = [980, 1020, 1005, 1080, 1120, 1190, 1248];
const SEMANAS       = ["S1","S2","S3","S4","S5","S6","S7"];

const PARTIDOS_MOCK: Record<number, { rival: string; resultado: string; mmr: number; win: boolean }[]> = {
  1: [
    { rival: "Pedro Rojas",  resultado: "6-3 / 6-4", mmr: +18, win: true  },
    { rival: "Luis Vera",    resultado: "7-5 / 6-2", mmr: +22, win: true  },
    { rival: "Andrés Silva", resultado: "3-6 / 4-6", mmr: -14, win: false },
  ],
};

export default function PerfilScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const initiales = user?.nombre
    ? user.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const partidos     = user?.id ? (PARTIDOS_MOCK[user.id] ?? []) : [];
  const numPartidos  = partidos.length;
  const victorias    = partidos.filter((p) => p.win).length;
  const pctVictorias = numPartidos > 0 ? Math.round((victorias / numPartidos) * 100) : 0;
  const esNuevo      = numPartidos === 0;
  const maxMMR       = Math.max(...MMR_EVOLUCION);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={S.screen}>
      <ScrollView style={S.scroll} contentContainerStyle={{ paddingBottom: 16 }}>

        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingBottom: 16 }}>
          <TouchableOpacity style={S.backBtn} onPress={() => router.back()}>
            <Text style={S.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "700", color: C.text }}>Mi perfil</Text>
          <TouchableOpacity
            onPress={handleLogout}
            style={{ backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "rgba(239,68,68,0.25)", borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12 }}
          >
            <Text style={{ fontSize: 12, color: "#fca5a5", fontWeight: "600" }}>Salir</Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 20 }}>

          {/* Cabecera usuario */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <View style={[S.avatar, { width: 64, height: 64, backgroundColor: C.accent, borderRadius: 20 }]}>
              <Text style={[S.avatarText, { fontSize: 22 }]}>{initiales}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: C.text, textTransform: "uppercase", lineHeight: 22, marginBottom: 6 }}>
                {user?.nombre ?? "Usuario"}
              </Text>
              <Text style={{ fontSize: 13, color: C.text2, marginBottom: 8 }}>
                {user?.zona && user?.edad ? `${user.zona} · ${user.edad} años` : user?.zona ?? "—"}
              </Text>
              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                {user?.nivel
                  ? <View style={[S.pill, S.pillPurple]}><Text style={[S.pillText, S.pillPurpleText]}>{user.nivel}{user.categoria ? ` · ${user.categoria}` : ""}</Text></View>
                  : <View style={[S.pill, S.pillGray]}><Text style={[S.pillText, S.pillGrayText]}>Sin categoría aún</Text></View>
                }
                {!esNuevo && (
                  <View style={[S.pill, S.pillGreen]}><Text style={[S.pillText, S.pillGreenText]}>{victorias} victorias</Text></View>
                )}
              </View>
            </View>
          </View>

          {/* Datos adicionales */}
          <TouchableOpacity onPress={() => router.push("/(app)/perfil-editar")} style={{ alignSelf: "flex-end", marginBottom: 14 }}>
            <Text style={{ fontSize: 13, color: C.accent, textDecorationLine: "underline" }}>Datos adicionales →</Text>
          </TouchableOpacity>

          {/* MMR card */}
          <View style={S.mmrBar}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: C.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>MMR</Text>
              <Text style={S.mmrNum}>{user?.mmr ?? 1000}</Text>
              <Text style={{ fontSize: 12, color: C.text2, marginTop: 4 }}>
                {esNuevo ? "Juega partidos para obtener ranking" : `#14 en ${user?.zona ?? "tu zona"}`}
              </Text>
            </View>
            {!esNuevo && (
              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ fontSize: 13, color: "#4ade80", fontWeight: "600" }}>▲ +127</Text>
                <Text style={{ fontSize: 11, color: C.text2 }}>último mes</Text>
              </View>
            )}
          </View>

          {/* Stats */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 14 }}>
            {[
              { val: esNuevo ? "0" : String(numPartidos), label: "Partidos"  },
              { val: esNuevo ? "—" : `${pctVictorias}%`, label: "Victorias" },
              { val: esNuevo ? "—" : "4.8",              label: "Fair Play" },
            ].map((st) => (
              <View key={st.label} style={[S.card, { flex: 1, alignItems: "center", padding: 14 }]}>
                <Text style={{ fontSize: 20, fontWeight: "800", color: st.val === "—" ? C.text2 : C.text, marginBottom: 4 }}>{st.val}</Text>
                <Text style={{ fontSize: 11, color: C.text2, textTransform: "uppercase", letterSpacing: 0.6 }}>{st.label}</Text>
              </View>
            ))}
          </View>

          {/* Evolución MMR */}
          <View style={[S.card, { marginBottom: 14 }]}>
            <Text style={{ fontSize: 11, color: C.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
              Evolución MMR — Últimas 7 semanas
            </Text>
            {esNuevo ? (
              <View style={{ height: 80, alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Text style={{ fontSize: 24 }}>📈</Text>
                <Text style={{ fontSize: 12, color: C.text2, textAlign: "center" }}>Tu evolución aparecerá aquí cuando juegues partidos</Text>
              </View>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6, height: 80 }}>
                {MMR_EVOLUCION.map((v, i) => (
                  <View key={i} style={{ flex: 1, alignItems: "center", gap: 4 }}>
                    <View style={{
                      width: "100%",
                      height: (v / maxMMR) * 72,
                      backgroundColor: i === MMR_EVOLUCION.length - 1 ? C.accent : "rgba(79,70,229,0.35)",
                      borderRadius: 4,
                    }} />
                    <Text style={{ fontSize: 10, color: C.text2 }}>{SEMANAS[i]}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Últimos partidos */}
          <Text style={[S.sectionLabel, { marginBottom: 10 }]}>Últimos partidos</Text>
          {esNuevo ? (
            <View style={[S.card, { alignItems: "center", padding: 28, marginBottom: 8 }]}>
              <Text style={{ fontSize: 32, marginBottom: 10 }}>🎾</Text>
              <Text style={{ fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 6 }}>Sin partidos aún</Text>
              <Text style={{ fontSize: 13, color: C.text2, textAlign: "center", marginBottom: 16 }}>
                Crea o únete a un partido para empezar a construir tu historial
              </Text>
              <TouchableOpacity style={[S.btn, { paddingHorizontal: 24 }]} onPress={() => router.push("/(app)/crear")}>
                <Text style={S.btnText}>Crear partido</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[S.card, { marginBottom: 8 }]}>
              {partidos.map((p, i) => (
                <View key={i} style={{
                  flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                  paddingVertical: 12,
                  borderBottomWidth: i < partidos.length - 1 ? 1 : 0,
                  borderBottomColor: C.border,
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: p.win ? C.green : C.red }} />
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: C.text }}>vs. {p.rival}</Text>
                      <Text style={{ fontSize: 12, color: C.text2 }}>{p.resultado}</Text>
                    </View>
                  </View>
                  <View style={[S.pill, p.win ? S.pillGreen : S.pillRed]}>
                    <Text style={[S.pillText, p.win ? S.pillGreenText : S.pillRedText]}>
                      {p.mmr > 0 ? `+${p.mmr}` : p.mmr}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
    </View>
  );
}
