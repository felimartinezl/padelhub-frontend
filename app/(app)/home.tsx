import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { usePartidos } from "../../context/PartidosContext";
import { C, S } from "../../theme";

const ACTIVIDAD_DEMO: Record<number, { rival: string; resultado: string; hace: string; mmr: number; win: boolean }[]> = {
  1: [
    { rival: "Pedro Rojas",  resultado: "6-3 / 6-4", hace: "Hace 3 días", mmr: +18, win: true  },
    { rival: "Luis Vera",    resultado: "7-5 / 6-2", hace: "Hace 5 días", mmr: +22, win: true  },
    { rival: "Andrés Silva", resultado: "3-6 / 4-6", hace: "Hace 7 días", mmr: -14, win: false },
  ],
};

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { partidos }     = usePartidos();
  const router           = useRouter();

  const initiales = user?.nombre
    ? user.nombre.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  const proximoPartido = partidos[0] ?? null;
  const actividad      = user?.id ? (ACTIVIDAD_DEMO[user.id] ?? []) : [];
  const esNuevo        = actividad.length === 0;

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={S.screen}>
      <ScrollView style={S.scroll} contentContainerStyle={{ padding: 20, paddingBottom: 16 }}>

        {/* Top bar */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "800", color: C.text }}>
              Hola, {user?.nombre?.split(" ")[0]} 👋
            </Text>
            <Text style={{ fontSize: 13, color: C.text2, marginTop: 2 }}>
              {user?.zona ? `${user.zona} · ` : ""}MMR {user?.mmr ?? 1000}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/(app)/perfil")}
            style={{ width: 44, height: 44, backgroundColor: C.accent, borderRadius: 14, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>{initiales}</Text>
          </TouchableOpacity>
        </View>

        {/* MMR card */}
        <View style={S.mmrBar}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: C.text2, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 }}>Tu MMR</Text>
            <Text style={S.mmrNum}>{user?.mmr ?? 1000}</Text>
            <Text style={{ fontSize: 12, color: C.text2, marginTop: 4 }}>
              {esNuevo ? "Juega partidos para obtener ranking" : `#14 en ${user?.zona ?? "tu zona"}`}
            </Text>
          </View>
          {!esNuevo && (
            <Text style={{ fontSize: 12, color: "#4ade80", fontWeight: "600" }}>▲ +127 este mes</Text>
          )}
        </View>

        {/* Próximo partido */}
        <Text style={[S.sectionLabel, { marginBottom: 8 }]}>Próximo partido</Text>

        {proximoPartido ? (
          <TouchableOpacity style={S.upcomingCard} onPress={() => router.push("/(app)/crear")}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View style={{ flexDirection: "row", gap: 6 }}>
                <View style={[S.pill, S.pillPurple]}>
                  <Text style={[S.pillText, S.pillPurpleText]}>{proximoPartido.formato === "dobles" ? "Dobles" : "Individual"}</Text>
                </View>
                <View style={[S.pill, S.pillGreen]}>
                  <Text style={[S.pillText, S.pillGreenText]}>{proximoPartido.estado}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: C.text2 }}>{proximoPartido.fechaStr}</Text>
            </View>
            <Text style={{ fontSize: 17, fontWeight: "700", color: C.text, marginBottom: 4 }}>{proximoPartido.club}</Text>
            <Text style={{ fontSize: 13, color: C.text2, marginBottom: 12 }}>
              {proximoPartido.hora}{proximoPartido.cancha ? ` · ${proximoPartido.cancha}` : ""}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {proximoPartido.jugadores.map((j, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  {proximoPartido.formato === "dobles" && i === 2 && (
                    <Text style={{ fontSize: 11, color: C.text2 }}>vs</Text>
                  )}
                  <View style={[S.avatar, { width: 32, height: 32, backgroundColor: j.color }]}>
                    <Text style={[S.avatarText, { fontSize: 12 }]}>{j.ini}</Text>
                  </View>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[S.card, { marginBottom: 20, alignItems: "center", borderStyle: "dashed" }]}
            onPress={() => router.push("/(app)/crear")}
          >
            <Text style={{ fontSize: 28, marginBottom: 8 }}>🎾</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 4 }}>Sin partido próximo</Text>
            <Text style={{ fontSize: 12, color: C.accent }}>+ Crear uno ahora</Text>
          </TouchableOpacity>
        )}

        {/* Acciones rápidas */}
        <Text style={S.sectionLabel}>Acciones rápidas</Text>
        <View style={S.quickGrid}>
          {[
            { icon: "🏓", title: "Crear partido", sub: "Organiza un juego",    path: "/(app)/crear"       },
            { icon: "🎯", title: "Buscar rival",  sub: "Matchmaking MMR",      path: "/(app)/matchmaking" },
            { icon: "🏆", title: "Ranking",       sub: `Top ${user?.zona ?? "tu zona"}`, path: "/(app)/ranking" },
            { icon: "📊", title: "Mi perfil",     sub: "Stats y historial",    path: "/(app)/perfil"      },
          ].map((a) => (
            <TouchableOpacity key={a.title} style={S.quickCard} onPress={() => router.push(a.path as any)}>
              <Text style={{ fontSize: 28, marginBottom: 8 }}>{a.icon}</Text>
              <Text style={{ fontSize: 14, fontWeight: "700", color: C.text, marginBottom: 2 }}>{a.title}</Text>
              <Text style={{ fontSize: 12, color: C.text2 }}>{a.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Actividad reciente */}
        <Text style={S.sectionLabel}>Actividad reciente</Text>
        {esNuevo ? (
          <View style={[S.card, { alignItems: "center", padding: 24, marginBottom: 24 }]}>
            <Text style={{ fontSize: 28, marginBottom: 8 }}>📋</Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: C.text, marginBottom: 4 }}>Sin actividad aún</Text>
            <Text style={{ fontSize: 12, color: C.text2 }}>Tus partidos jugados aparecerán aquí</Text>
          </View>
        ) : (
          <View style={[S.card, { marginBottom: 24 }]}>
            {actividad.map((a, i) => (
              <View key={i} style={{
                flexDirection: "row", alignItems: "center", justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: i < actividad.length - 1 ? 1 : 0,
                borderBottomColor: C.border,
              }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: a.win ? C.green : C.red }} />
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: C.text }}>
                      {a.win ? "Victoria" : "Derrota"} vs {a.rival}
                    </Text>
                    <Text style={{ fontSize: 12, color: C.text2 }}>{a.resultado} · {a.hace}</Text>
                  </View>
                </View>
                <View style={[S.pill, a.win ? S.pillGreen : S.pillRed]}>
                  <Text style={[S.pillText, a.win ? S.pillGreenText : S.pillRedText]}>
                    {a.mmr > 0 ? `+${a.mmr}` : a.mmr} MMR
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Cerrar sesión */}
        <TouchableOpacity onPress={handleLogout} style={{ alignItems: "center", marginBottom: 16 }}>
          <Text style={{ fontSize: 12, color: C.text2, textDecorationLine: "underline" }}>Cerrar sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
