const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const TOKEN = "8665887598:AAFXJeaNW9ugWufs5n-f4Xhc6OGSq4wxi24";
const TELEGRAM_URL = `https://api.telegram.org/bot${TOKEN}`;

let paso = 0;
let emocionActual = "";

// 🔥 FLUJO COMPLETO
const flujo = {

  "Feliz": {
    preguntas: [
      { p: "¿Qué fue lo mejor que te pasó hoy?", o: ["Logro", "Amigos", "Diversión", "Todo bien"] },
      { p: "¿Con quién compartiste ese momento?", o: ["Familia", "Amigos", "Pareja", "Solo"] },
      { p: "¿Te gustaría repetirlo?", o: ["Sí", "Obvio", "Tal vez", "No sé"] },
      { p: "¿Qué disfrutaste más?", o: ["Compañía", "Momento", "Emoción", "Todo"] },
      { p: "¿Cómo quieres sentirte mañana?", o: ["Igual", "Más feliz", "Tranquilo", "Motivado"] }
    ],
    final: "Me alegra mucho que te sientas así 😊✨"
  },

  "Neutral": {
    preguntas: [
      { p: "¿Cómo estuvo tu día?", o: ["Normal", "Aburrido", "Tranquilo", "Regular"] },
      { p: "¿Hubo algo interesante?", o: ["Sí", "No", "Tal vez", "Poco"] },
      { p: "¿Te gustaría cambiar algo?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Qué te gustaría hacer?", o: ["Descansar", "Salir", "Ver algo", "Nada"] },
      { p: "¿Cómo quieres sentirte mañana?", o: ["Mejor", "Igual", "Más feliz", "Motivado"] }
    ],
    final: "Los días tranquilos también cuentan 😌"
  },

  "Triste": {
    preguntas: [
      { p: "¿Qué te hizo sentir así?", o: ["Algo pasó", "Soledad", "Problemas", "No sé"] },
      { p: "¿Desde cuándo?", o: ["Hoy", "Días", "Semanas", "No sé"] },
      { p: "¿Te cuesta hablarlo?", o: ["Sí", "No", "Un poco", "Mucho"] },
      { p: "¿Hablaste con alguien?", o: ["Sí", "No", "Me cuesta", "Tal vez"] },
      { p: "¿Qué necesitas?", o: ["Hablar", "Descansar", "Salir", "Nada"] },
      { p: "¿Te sientes solo?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Qué pensamiento tienes?", o: ["Dudas", "Recuerdos", "Miedo", "Vacío"] },
      { p: "¿Has llorado?", o: ["Sí", "No", "Quiero", "No puedo"] },
      { p: "¿Quieres distraerte?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Qué te calma?", o: ["Música", "Dormir", "Hablar", "Nada"] },
      { p: "¿Quieres sentirte mejor?", o: ["Sí", "No", "Tal vez", "Tiempo"] },
      { p: "¿Te juzgas?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Qué necesitas ahora?", o: ["Apoyo", "Tiempo", "Silencio", "Compañía"] },
      { p: "¿Crees que pasará?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Intentarías mañana?", o: ["Sí", "No", "Tal vez", "Poco a poco"] }
    ],
    final: "No estás solo 💙 todo mejora poco a poco."
  },

  "Ansioso": {
    preguntas: [
      { p: "¿Qué te preocupa?", o: ["Futuro", "Escuela", "Personas", "Todo"] },
      { p: "¿Tu mente va rápido?", o: ["Sí", "Mucho", "Un poco", "No"] },
      { p: "¿Sientes tensión?", o: ["Sí", "No", "Mucho", "Poco"] },
      { p: "¿Te cuesta concentrarte?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Respiras rápido?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Intentaste calmarte?", o: ["Sí", "No", "Un poco", "No sé cómo"] },
      { p: "¿Qué te preocupa más?", o: ["Futuro", "Errores", "Personas", "Todo"] },
      { p: "¿Te sientes abrumado?", o: ["Sí", "No", "Mucho", "Poco"] },
      { p: "¿Te ayudaría respirar?", o: ["Sí", "No", "Tal vez", "Intentaré"] },
      { p: "¿Puedes pausar?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Quieres distraerte?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Qué te calma?", o: ["Música", "Silencio", "Respirar", "Nada"] },
      { p: "¿Te sientes mejor?", o: ["Sí", "Un poco", "No", "Igual"] },
      { p: "¿Intentar otra vez?", o: ["Sí", "No", "Tal vez", "Despacio"] },
      { p: "¿Crees que pasará?", o: ["Sí", "No", "Tal vez", "Espero"] }
    ],
    final: "Respira… estás haciendo lo mejor que puedes 🧘‍♂️"
  },

  "Enojado": {
    preguntas: [
      { p: "¿Qué te molestó?", o: ["Persona", "Situación", "Todo", "Problema"] },
      { p: "¿Qué fue lo peor?", o: ["Injusticia", "Molestia", "Frustración", "Todo"] },
      { p: "¿Cómo reaccionaste?", o: ["Grité", "Me callé", "Me fui", "Exploté"] },
      { p: "¿Te arrepientes?", o: ["Sí", "No", "Tal vez", "Un poco"] },
      { p: "¿Sigues molesto?", o: ["Sí", "Mucho", "Poco", "No"] },
      { p: "¿Quieres calmarte?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Qué ayudaría?", o: ["Respirar", "Alejarme", "Hablar", "Tiempo"] },
      { p: "¿Te afecta mucho?", o: ["Sí", "No", "Mucho", "Poco"] },
      { p: "¿Puedes soltarlo?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Quieres resolverlo?", o: ["Sí", "No", "Tal vez", "Después"] },
      { p: "¿Te sientes escuchado?", o: ["Sí", "No", "A veces", "Nunca"] },
      { p: "¿Quieres expresarte mejor?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Te estás calmando?", o: ["Sí", "No", "Un poco", "Lento"] },
      { p: "¿Quieres dejarlo ir?", o: ["Sí", "No", "Tal vez", "Poco"] },
      { p: "¿Te sientes mejor?", o: ["Sí", "No", "Un poco", "Más o menos"] }
    ],
    final: "Sentir enojo es humano 😌 tú decides qué hacer con él."
  }
};

// 🧠 FUNCIÓN CENTRAL
function responder(mensaje) {

  if (mensaje === "inicio" || mensaje.toLowerCase().includes("hola")) {
    paso = 0;
    emocionActual = "";
    return {
      texto: "Hola 😊 ¿Cómo te sientes hoy?",
      opciones: Object.keys(flujo)
    };
  }

  if (flujo[mensaje]) {
    emocionActual = mensaje;
    paso = 0;

    return {
      texto: flujo[mensaje].preguntas[0].p,
      opciones: flujo[mensaje].preguntas[0].o
    };
  }

  if (emocionActual) {
    paso++;

    const lista = flujo[emocionActual].preguntas;

    if (paso < lista.length) {
      return {
        texto: lista[paso].p,
        opciones: lista[paso].o
      };
    }

    const final = flujo[emocionActual].final;

    paso = 0;
    emocionActual = "";

    return {
      texto: final,
      opciones: null
    };
  }

  return {
    texto: "Selecciona una emoción",
    opciones: Object.keys(flujo)
  };
}

// 🌐 WEB
app.post("/api/chat", (req, res) => {
  res.json(responder(req.body.mensaje));
});

// 📱 TELEGRAM
app.post("/telegram", async (req, res) => {
  const mensaje = req.body.message?.text;
  const chatId = req.body.message?.chat?.id;

  if (!mensaje) return res.sendStatus(200);

  const respuesta = responder(mensaje);

  await fetch(`${TELEGRAM_URL}/sendMessage`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      chat_id: chatId,
      text: respuesta.texto,
      reply_markup: respuesta.opciones
        ? {
            keyboard: respuesta.opciones.map(op => [{ text: op }]),
            resize_keyboard: true
          }
        : { remove_keyboard: true }
    })
  });

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});