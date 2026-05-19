import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  Modal, ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { usePartidos, type Jugador } from "../../context/PartidosContext";
import { C, S } from "../../theme";

const CLUBS = [
  { nombre: "Viña Pádel Club",        abre: "09:00", cierra: "22:30" },
  { nombre: "Campo Deportivo La Liga", abre: "07:00", cierra: "23:00" },
  { nombre: "BluePadel",              abre: "08:00", cierra: "23:00" },
];

const DIAS_ES  = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MESES_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const MESES_FULL = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function formatDateStr(d: Date) {
  return `${DIAS_ES[d.getDay()]} ${d.getDate()} ${MESES_ES[d.getMonth()]}`;
}

function getTimeSlots(abre: string, cierra: string): string[] {
  const slots: string[] = [];
  const [ah, am] = abre.split(":").map(Number);
  const [ch, cm] = cierra.split(":").map(Number);
  let h = ah, m = am;
  while (h < ch || (h === ch && m <= cm)) {
    slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`);
    m += 30; if (m >= 60) { m -= 60; h++; }
  }
  return slots;
}

const JUGADORES_MOCK = [
  { id: 2, ini: "MR", nombre: "Miguel R.",  color: "#059669" },
  { id: 3, ini: "AP", nombre: "Ana P.",     color: "#d97706" },
  { id: 4, ini: "JV", nombre: "Javier V.",  color: "#7c3aed" },
  { id: 5, ini: "RP", nombre: "Roberto P.", color: "#db2777" },
];

export default function CrearScreen() {
  const { user }           = useAuth();
  const { agregarPartido } = usePartidos();
  const router              = useRouter();

  const today = new Date(); today.setHours(0,0,0,0);

  const [selectedDate,  setSelectedDate]  = useState<Date>(today);
  const [showCal,       setShowCal]       = useState(false);
  const [calMonth,      setCalMonth]      = useState(today.getMonth());
  const [calYear,       setCalYear]       = useState(today.getFullYear());

  const [selectedClub,  setSelectedClub]  = useState<typeof CLUBS[0] | null>(null);
  const [showClubs,     setShowClubs]     = useState(false);

  const [timeSlots,     setTimeSlots]     = useState<string[]>([]);
  const [selectedTime,  setSelectedTime]  = useState("");
  const [showTime,      setShowTime]      = useState(false);

  const [formato,       setFormato]       = useState<"dobles"|"individual">("dobles");
  const [jugadores,     setJugadores]     = useState<(typeof JUGADORES_MOCK[0]|null)[]>([null,null,null]);
  const [showPickerIdx, setShowPickerIdx] = useState<number|null>(null);
  const [notif,         setNotif]         = useState<"whatsapp"|"push">("whatsapp");
  const [toast,         setToast]         = useState("");

  const initiales = user?.nombre
    ? user.nombre.split(" ").map((n) => n[0]).slice(0,2).join("").toUpperCase()
    : "?";

  useEffect(() => {
    if (!selectedClub) return;
    const slots = getTimeSlots(selectedClub.abre, selectedClub.cierra);
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const filtered = isToday
      ? slots.filter((s) => { const [h,m] = s.split(":").map(Number); return h > now.getHours() || (h === now.getHours() && m > now.getMinutes()); })
      : slots;
    setTimeSlots(filtered);
    setSelectedTime(filtered[0] ?? "");
  }, [selectedClub, selectedDate]);

  const numSlots = formato === "dobles" ? 3 : 1;
  const slots    = jugadores.slice(0, numSlots);

  const toggleJugador = (idx: number, j: typeof JUGADORES_MOCK[0]|null) => {
    const next = [...jugadores];
    next[idx] = next[idx]?.id === j?.id ? null : j;
    setJugadores(next);
    setShowPickerIdx(null);
  };

  function getDaysInMonth(year: number, month: number) {
    return { firstDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month+1, 0).getDate() };
  }

  const showToastMsg = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleCrear = () => {
    if (!selectedClub) { showToastMsg("Selecciona un club"); return; }
    if (!selectedTime) { showToastMsg("Selecciona una hora"); return; }

    const jugadoresPartido: Jugador[] = [
      { ini: initiales, nombre: user?.nombre?.split(" ")[0] ?? "Tú", color: C.accent },
      ...slots.filter(Boolean).map((j) => ({ ini: j!.ini, nombre: j!.nombre, color: j!.color })),
    ];

    agregarPartido({
      fecha: selectedDate, fechaStr: formatDateStr(selectedDate),
      hora: selectedTime, club: selectedClub.nombre, cancha: "",
      formato, jugadores: jugadoresPartido, notif, estado: "Confirmado",
    });

    const medio = notif === "whatsapp" ? "WhatsApp" : "Push";
    showToastMsg(`¡Partido creado! Notificación enviada por ${medio}`);
    setTimeout(() => router.replace("/(app)/home"), 1500);
  };

  const { firstDay, daysInMonth } = getDaysInMonth(calYear, calMonth);

  return (
    <View style={S.screen}>
      <ScrollView style={S.scroll} contentContainerStyle={{ paddingBottom: 16 }}>

        {/* Header */}
        <View style={{ flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:20, paddingBottom:16 }}>
          <TouchableOpacity style={S.backBtn} onPress={() => router.back()}>
            <Text style={S.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize:18, fontWeight:"700", color:C.text }}>Crear partido</Text>
          <View style={{ width:36 }} />
        </View>

        <View style={{ paddingHorizontal:20 }}>

          {/* Fecha + Hora */}
          <Text style={S.sectionLabel}>Detalles</Text>
          <View style={{ flexDirection:"row", gap:10, marginBottom:14 }}>
            <View style={{ flex:1 }}>
              <Text style={S.label}>Fecha</Text>
              <TouchableOpacity
                style={[S.input, showCal && { borderColor: C.accent }]}
                onPress={() => { setShowCal(!showCal); setShowTime(false); setShowClubs(false); }}
              >
                <Text style={{ color:C.text, fontSize:14 }}>{formatDateStr(selectedDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex:1 }}>
              <Text style={S.label}>Hora</Text>
              <TouchableOpacity
                style={[S.input, showTime && { borderColor:C.accent }, !selectedClub && { opacity:0.5 }]}
                onPress={() => { if(!selectedClub) return; setShowTime(!showTime); setShowCal(false); setShowClubs(false); }}
              >
                <Text style={{ color: selectedClub ? C.text : C.text2, fontSize:14 }}>
                  {selectedClub ? (selectedTime || "Seleccionar") : "Elige club primero"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Calendario inline */}
          {showCal && (
            <View style={{ backgroundColor:C.bg3, borderWidth:1, borderColor:C.border, borderRadius:16, padding:16, marginBottom:14 }}>
              <View style={{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <TouchableOpacity onPress={() => { if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1); }}
                  style={{ backgroundColor:C.bg4, borderWidth:1, borderColor:C.border, borderRadius:8, paddingVertical:4, paddingHorizontal:10 }}>
                  <Text style={{ color:C.text }}>‹</Text>
                </TouchableOpacity>
                <Text style={{ fontSize:14, fontWeight:"700", color:C.text }}>{MESES_FULL[calMonth]} {calYear}</Text>
                <TouchableOpacity onPress={() => { if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1); }}
                  style={{ backgroundColor:C.bg4, borderWidth:1, borderColor:C.border, borderRadius:8, paddingVertical:4, paddingHorizontal:10 }}>
                  <Text style={{ color:C.text }}>›</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection:"row", marginBottom:6 }}>
                {DIAS_ES.map(d=><Text key={d} style={{ flex:1, textAlign:"center", fontSize:11, color:C.text2 }}>{d}</Text>)}
              </View>
              <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
                {Array.from({length:firstDay}).map((_,i)=><View key={`e${i}`} style={{ width:"14.28%" }} />)}
                {Array.from({length:daysInMonth}).map((_,i)=>{
                  const d = new Date(calYear,calMonth,i+1);
                  const isPast = d < today;
                  const isSel  = d.toDateString()===selectedDate.toDateString();
                  const isT    = d.toDateString()===today.toDateString();
                  return (
                    <TouchableOpacity key={i} disabled={isPast}
                      onPress={()=>{setSelectedDate(d);setShowCal(false);}}
                      style={{ width:"14.28%", paddingVertical:7, borderRadius:8, alignItems:"center",
                        backgroundColor: isSel?C.accent:isT?"rgba(79,70,229,0.15)":"transparent" }}>
                      <Text style={{ fontSize:13, color:isPast?"rgba(255,255,255,0.2)":isSel?"#fff":C.text, fontWeight:isSel?"700":"400" }}>
                        {i+1}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Selector hora */}
          {showTime && timeSlots.length > 0 && (
            <View style={{ backgroundColor:C.bg3, borderWidth:1, borderColor:C.border, borderRadius:16, marginBottom:14, maxHeight:180 }}>
              <ScrollView>
                {timeSlots.map(t=>(
                  <TouchableOpacity key={t} onPress={()=>{setSelectedTime(t);setShowTime(false);}}
                    style={{ padding:12, borderBottomWidth:1, borderBottomColor:C.border, flexDirection:"row", justifyContent:"space-between" }}>
                    <Text style={{ fontSize:14, color:selectedTime===t?C.accent:C.text, fontWeight:selectedTime===t?"700":"400" }}>{t}</Text>
                    {selectedTime===t && <Text style={{ color:C.accent }}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Club */}
          <View style={{ marginBottom:14 }}>
            <Text style={S.label}>Club / Cancha</Text>
            <TouchableOpacity
              style={[S.input, showClubs && { borderColor:C.accent }]}
              onPress={()=>{setShowClubs(!showClubs);setShowCal(false);setShowTime(false);}}
            >
              <Text style={{ fontSize:14, color:selectedClub?C.text:C.text2 }}>
                {selectedClub?selectedClub.nombre:"Selecciona un club"}
              </Text>
            </TouchableOpacity>
            {showClubs && (
              <View style={{ backgroundColor:C.bg3, borderWidth:1, borderColor:C.border, borderRadius:12, marginTop:6 }}>
                {CLUBS.map(c=>(
                  <TouchableOpacity key={c.nombre} onPress={()=>{setSelectedClub(c);setShowClubs(false);}}
                    style={{ padding:12, borderBottomWidth:1, borderBottomColor:C.border }}>
                    <Text style={{ fontWeight:"600", color:selectedClub?.nombre===c.nombre?C.accent:C.text, fontSize:14 }}>{c.nombre}</Text>
                    <Text style={{ fontSize:12, color:C.text2, marginTop:2 }}>Lun–Dom · {c.abre} – {c.cierra}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Formato */}
          <View style={{ marginBottom:14 }}>
            <Text style={S.label}>Formato</Text>
            <View style={{ flexDirection:"row", gap:10 }}>
              {(["dobles","individual"] as const).map(f=>(
                <TouchableOpacity key={f}
                  onPress={()=>{setFormato(f);setJugadores([null,null,null]);}}
                  style={[S.formatOpt, formato===f && S.formatOptSelected]}>
                  <Text style={{ fontSize:22, marginBottom:4 }}>{f==="dobles"?"👥":"🧍"}</Text>
                  <Text style={{ fontSize:14, fontWeight:"700", color:C.text }}>{f==="dobles"?"Dobles":"Individual"}</Text>
                  <Text style={{ fontSize:12, color:C.text2 }}>{f==="dobles"?"2 vs 2":"1 vs 1"}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Jugadores */}
          <View style={{ marginBottom:14 }}>
            <Text style={S.label}>Jugadores</Text>
            <View style={{ flexDirection:"row", gap:8, flexWrap:"wrap" }}>
              {/* Tú */}
              <View style={[S.slot, S.slotFilled, { width:64 }]}>
                <View style={[S.avatar, { width:36, height:36, backgroundColor:C.accent }]}>
                  <Text style={[S.avatarText, { fontSize:13 }]}>{initiales}</Text>
                </View>
                <Text style={{ fontSize:11, color:C.text2 }}>Tú</Text>
              </View>

              {slots.map((j,idx)=>(
                <View key={idx}>
                  <TouchableOpacity
                    style={[S.slot, j && S.slotFilled, { width:64 }]}
                    onPress={()=>setShowPickerIdx(showPickerIdx===idx?null:idx)}
                  >
                    {j ? (
                      <>
                        <View style={[S.avatar, { width:36, height:36, backgroundColor:j.color }]}>
                          <Text style={[S.avatarText, { fontSize:13 }]}>{j.ini}</Text>
                        </View>
                        <Text style={{ fontSize:11, color:C.text2 }}>{j.nombre.split(" ")[0]}</Text>
                      </>
                    ) : (
                      <>
                        <Text style={{ fontSize:22, color:C.text2 }}>+</Text>
                        <Text style={{ fontSize:11, color:C.text2 }}>Invitar</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Picker jugadores */}
                  {showPickerIdx===idx && (
                    <View style={{ position:"absolute", top:72, left:0, zIndex:10, backgroundColor:C.bg3, borderWidth:1, borderColor:C.border, borderRadius:12, minWidth:160, overflow:"hidden" }}>
                      {JUGADORES_MOCK.filter(jm=>!slots.some((s,si)=>si!==idx&&s?.id===jm.id)).map(jm=>(
                        <TouchableOpacity key={jm.id} onPress={()=>toggleJugador(idx,jm)}
                          style={{ padding:12, borderBottomWidth:1, borderBottomColor:C.border, flexDirection:"row", alignItems:"center", gap:8,
                            backgroundColor:slots[idx]?.id===jm.id?"rgba(79,70,229,0.1)":"transparent" }}>
                          <View style={[S.avatar, { width:28, height:28, backgroundColor:jm.color }]}>
                            <Text style={[S.avatarText, { fontSize:11 }]}>{jm.ini}</Text>
                          </View>
                          <Text style={{ color:C.text, fontSize:13 }}>{jm.nombre}</Text>
                        </TouchableOpacity>
                      ))}
                      {j && (
                        <TouchableOpacity onPress={()=>toggleJugador(idx,null)}
                          style={{ padding:12 }}>
                          <Text style={{ color:C.red, fontSize:13 }}>✕ Quitar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Notificaciones */}
          <View style={{ marginBottom:20 }}>
            <Text style={S.label}>Notificar por</Text>
            <View style={{ flexDirection:"row", gap:10 }}>
              {(["whatsapp","push"] as const).map(n=>(
                <TouchableOpacity key={n} onPress={()=>setNotif(n)}
                  style={[S.formatOpt, notif===n && S.formatOptSelected,
                    notif===n&&n==="whatsapp"?{ backgroundColor:"rgba(37,211,102,0.1)", borderColor:"#25d366" }:{}]}>
                  <Text style={{ fontSize:22, marginBottom:4 }}>{n==="whatsapp"?"📱":"🔔"}</Text>
                  <Text style={{ fontSize:14, fontWeight:"700", color:C.text }}>{n==="whatsapp"?"WhatsApp":"Push"}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={S.btn} onPress={handleCrear}>
            <Text style={S.btnText}>Crear y notificar</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* Toast */}
      {toast ? (
        <View style={{ position:"absolute", bottom:90, alignSelf:"center", backgroundColor:C.green, paddingHorizontal:20, paddingVertical:12, borderRadius:12 }}>
          <Text style={{ color:"#fff", fontSize:14, fontWeight:"500" }}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}
