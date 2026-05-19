import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { C } from "../../theme";

const NAV_ITEMS = [
  { name: "home",        label: "Inicio",  icon: "⌂" },
  { name: "matchmaking", label: "Match",   icon: "◎" },
  { name: "crear",       label: "Partido", icon: "+" },
  { name: "ranking",     label: "Ranking", icon: "◈" },
  { name: "perfil",      label: "Perfil",  icon: "○" },
];

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.bg2,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarActiveTintColor:   C.accent,
        tabBarInactiveTintColor: C.text2,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            tabBarLabel: ({ color }) => (
              <Text style={{ fontSize: 10, color, fontWeight: "500" }}>
                {item.label}
              </Text>
            ),
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: item.name === "crear" ? 22 : 18, color, lineHeight: 24 }}>
                {item.icon}
              </Text>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
