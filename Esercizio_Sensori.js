// ===== DATI: non modificarli =====

const SOGLIE = {
  temperatura: { min: 18, max: 26 },
  umidita: { min: 30, max: 70 }
}

const letture = [
  { id: "T01", tipo: "temperatura", valore: 21.5, posizione: { piano: 0, stanza: "Atrio" } },
  { id: "T02", tipo: "temperatura", valore: 27.8, batteria: 64, posizione: { piano: 1, stanza: "Lab 3" } },
  { id: "U01", tipo: "umidita", valore: 45, batteria: 0, posizione: { piano: 1, stanza: "Lab 3" } },
  { id: "T03", tipo: "temperatura", valore: null, batteria: 12, posizione: { piano: 1, stanza: "Aula 12" } },
  { id: "U02", tipo: "umidita", valore: 78, posizione: { piano: 0, stanza: "Palestra" } },
  { id: "T04", tipo: "temperatura", valore: 16.2, batteria: 91, posizione: { piano: 2, stanza: "Aula 21" } },
  { id: "T05", tipo: "temperatura", valore: 22, batteria: 55 },
  { id: "U03", tipo: "umidita", valore: 25, batteria: 73, posizione: { piano: 2, stanza: "Aula 21" } },
  { id: "T06", tipo: "temperatura", valore: 26, posizione: { piano: 0, stanza: "Palestra" } },
  { id: "T07", tipo: "temperatura", valore: 29.1, batteria: 38, posizione: { piano: 1, stanza: "Lab 3" } },
  { id: "U04", tipo: "umidita", valore: null, posizione: { piano: 2, stanza: "Aula 22" } },
  { id: "T08", tipo: "temperatura", valore: 19.4, batteria: 8, posizione: { piano: 3, stanza: "Biblioteca" } }
]


// ===== 1 · Il riepilogo · forEach, ?? =====

let n = 1
letture.forEach((lettura) => {
  const valore = lettura.valore ?? "nessun dato"
  console.log(`${n}. ${lettura.id} . ${lettura.tipo} . ${valore}`)
  n++
})

// ===== 2 · Le schede · map, ternario, ?., ?? =====

const schede = letture.map((lettura) => {
  const soglia = SOGLIE[lettura.tipo]
  const stato = lettura.valore == null
    ? "OFFLINE"
    : lettura.valore < soglia.min || lettura.valore > soglia.max
      ? "ALARME"
      : "OK"
  return {
    id: lettura.id,
    tipo: lettura.tipo,
    valore: lettura.valore,
    batteria: lettura.batteria,
    piano: lettura.posizione?.piano,
    stanza: lettura.posizione?.stanza ?? "non installato",
    stato: stato
  }
})
console.log(schede[6])

// ===== 3 · Gli allarmi · filter, map, join =====

const allarmi = schede.filter((scheda) => scheda.stato === "ALARME")
const offline = schede.filter((scheda) => scheda.stato === "OFFLINE")

console.log(
  `${allarmi.length} letture in allarme: ${allarmi.map((scheda) => scheda.id).join(", ")}`
)
console.log(
  `${offline.length} sensori offline: ${offline.map((scheda) => scheda.id).join(", ")}`
)

// ===== 4 · Dov'è il sensore · find, ?., ??, ternario =====

function infoSensore(id) {
  const sensore = letture.find((lettura) => lettura.id === id)
  if (!sensore) {
    return `Sensore ${id} inesistente`
  }
  const stanza = sensore.posizione?.stanza ?? "non installato"
  const piano = sensore.posizione?.piano ?? "-"
  return `${id} . ${stanza} . piano ${piano}`
}
console.log(infoSensore("U02"))
console.log(infoSensore("T05"))
console.log(infoSensore("X99"))

// ===== 5 · La media · filter, reduce =====

const temperature = letture.filter(
  (lettura) => lettura.tipo === "temperatura" && lettura.valore != null
)
const somma = temperature.reduce(
  (totale, lettura) => totale + lettura.valore,
  0
)
const media = somma / temperature.length
console.log(
  `Temperatura media: ${media.toFixed(1)} °C su ${temperature.length} sensori`
)

// ===== 6 · Allarmi per stanza · reduce =====

const allarmiPerStanza = allarmi.reduce((acc, allarme) => {
  const stanza = allarme.stanza
  acc[stanza] = (acc[stanza] ?? 0) + 1
  return acc
}, {})
console.log(allarmiPerStanza)
console.log(allarmiPerStanza["Aula 12"] ?? 0)

// ===== 7 · Il rapporto di piano · tutto insieme =====

function rapportoPiano(piano) {
  const sensoriPiano = schede.filter((scheda) => scheda.piano === piano)
  if (sensoriPiano.length === 0) {
    return `Piano ${piano} · nessun sensore`
  }
  const allarmiPiano = sensoriPiano
    .filter((scheda) => scheda.stato === "ALARME")
    .map((scheda) => scheda.id)
    .join(", ")
  const batterie = sensoriPiano
    .filter((scheda) => scheda.batteria != null)
  const batteriaMinima = batterie.length > 0
    ? batterie.reduce((min, scheda) => Math.min(min, scheda.batteria), Infinity)
    : null
  const testoAllarmi = allarmiPiano || "nessuno"
  const testoBatteria = batteriaMinima !== null
    ? `${batteriaMinima}%`
    : "tutti a rete"
  const parolaSensori = sensoriPiano.length === 1
    ? "sensore"
    : "sensori"
  return `Piano ${piano} · ${sensoriPiano.length} ${parolaSensori} · in allarme: ${testoAllarmi} · batteria minima: ${testoBatteria}`
}
[0, 1, 2, 3, 4].forEach((piano) => {
  console.log(rapportoPiano(piano))
})