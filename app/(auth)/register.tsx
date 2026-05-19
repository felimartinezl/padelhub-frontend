import { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { signUpUser } from "../../services/auth.mock";
import { C, S } from "../../theme";

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm]       = useState({ nombre: "", telefono: "", password: "" });
  const [submitting, setSub]  = useState(false);
  const [error, setError]     = useState("");

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.nombre.trim())      { setError("Ingresa tu nombre completo."); return; }
    if (!form.telefono.trim())    { setError("Ingresa tu número de teléfono."); return; }
    if (form.password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }

    setSub(true);
    try {
      await signUpUser({ nombre: form.nombre.trim(), telefono: form.telefono.trim(), password: form.password });
      // Vuelve al login — en RN no hay query params, pasamos el tel via state
      router.replace({ pathname: "/(auth)/login", params: { tel: form.telefono.trim() } });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSub(false);
    }
  };

  return (
    <KeyboardAvoidingView style={S.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 28 }} keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 36 }}>
          <View style={{ width: 72, height: 72, backgroundColor: C.accent, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
            <Text style={{ fontSize: 32, fontWeight: "800", color: "#fff" }}>H</Text>
          </View>
          <Text style={{ fontSize: 28, fontWeight: "800", color: C.text }}>PadelHub</Text>
          <Text style={{ fontSize: 13, color: C.text2, marginTop: 4 }}>Encuentra tu próximo partido</Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", backgroundColor: C.bg3, borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: C.border }}>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" }} onPress={() => router.push("/(auth)/login")}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: C.text2 }}>Iniciar sesión</Text>
          </TouchableOpacity>
          <View style={{ flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: C.accent, alignItems: "center" }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: "#fff" }}>Registrarse</Text>
          </View>
        </View>

        {/* Error */}
        {error ? <View style={S.error}><Text style={S.errorText}>⚠️ {error}</Text></View> : null}

        {/* Nombre */}
        <View style={S.inputGroup}>
          <Text style={S.label}>Nombre completo</Text>
          <TextInput style={S.input} placeholder="Tu nombre" placeholderTextColor={C.text2}
            value={form.nombre} onChangeText={(v) => set("nombre", v)} autoComplete="name" />
        </View>

        {/* Teléfono */}
        <View style={S.inputGroup}>
          <Text style={S.label}>Teléfono</Text>
          <TextInput style={S.input} placeholder="+56 9 1234 5678" placeholderTextColor={C.text2}
            value={form.telefono} onChangeText={(v) => set("telefono", v)} keyboardType="phone-pad" />
        </View>

        {/* Contraseña */}
        <View style={S.inputGroup}>
          <Text style={S.label}>Contraseña</Text>
          <TextInput style={S.input} placeholder="Mínimo 8 caracteres" placeholderTextColor={C.text2}
            value={form.password} onChangeText={(v) => set("password", v)} secureTextEntry />
        </View>

        <TouchableOpacity style={[S.btn, { marginTop: 4 }, submitting && S.btnDisabled]} onPress={handleSubmit} disabled={submitting}>
          {submitting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={S.btnText}>Crear cuenta</Text>}
        </TouchableOpacity>

        {/* Divider + WhatsApp */}
        <View style={S.divider}>
          <View style={S.dividerLine} />
          <Text style={S.dividerText}>o continúa con</Text>
          <View style={S.dividerLine} />
        </View>
        <TouchableOpacity style={S.btnGhost}>
          <View style={{ width: 16, height: 16, backgroundColor: "#25d366", borderRadius: 8 }} />
          <Text style={S.btnGhostText}>Continuar con WhatsApp</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
