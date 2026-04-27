const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const TOKEN = "8665887598:AAFXJeaNW9ugWufs5n-f4Xhc6OGSq4wxi24";
const TELEGRAM_URL = `https://api.telegram.org/bot${TOKEN}`;

let paso = 0;
let emocionActual = "";

// 🔥 FLUJO COMPLETO (TUYO)
const flujo = {

  "Feliz": {
    preguntas: [
      { p: "¿Qué fue lo mejor que te pasó hoy?", o: ["Logré algo", "Compartí con alguien", "Me divertí", "Todo salió bien"] },
      { p: "¿Con quién compartiste ese momento?", o: ["Amigos", "Familia", "Pareja", "Solo"] },
      { p: "¿Te gustaría repetirlo?", o: ["Sí", "Claro que sí", "Tal vez", "No sé"] },
      { p: "¿Qué fue lo que más disfrutaste?", o: ["La compañía", "El momento", "La emoción", "Todo"] },
      { p: "¿Cómo te gustaría sentirte mañana?", o: ["Igual", "Más feliz", "Tranquilo", "Motivado"] }
    ],
    final: "Me alegra mucho saber que te sientes así 😊✨ Sigue disfrutando esos momentos, te lo mereces."
  },

  "Neutral": {
    preguntas: [
      { p: "¿Cómo estuvo tu día?", o: ["Normal", "Aburrido", "Tranquilo", "Regular"] },
      { p: "¿Hubo algo destacable?", o: ["Sí", "No", "Tal vez", "Poco"] },
      { p: "¿Te gustaría hacer algo diferente?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Qué te gustaría hacer ahora?", o: ["Descansar", "Salir", "Ver algo", "Nada"] },
      { p: "¿Cómo quieres sentirte mañana?", o: ["Mejor", "Igual", "Más feliz", "Motivado"] }
    ],
    final: "A veces los días neutros también son necesarios 😌 Todo está bien, mañana puede sorprenderte."
  },

  "Triste": {
    preguntas: [
      { p: "¿Qué te hizo sentir así?", o: ["Algo pasó", "Soledad", "Problemas", "No sé"] },
      { p: "¿Desde cuándo te sientes así?", o: ["Hoy", "Hace días", "Hace semanas", "No sé"] },
      { p: "¿Te cuesta hablar de ello?", o: ["Sí", "No", "Un poco", "Mucho"] },
      { p: "¿Has hablado con alguien?", o: ["Sí", "No", "Me cuesta", "Tal vez"] },
      { p: "¿Qué crees que te ayudaría?", o: ["Hablar", "Descansar", "Salir", "Nada"] },
      { p: "¿Te sientes solo?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Qué pensamiento se repite?", o: ["Dudas", "Recuerdos", "Miedo", "Vacío"] },
      { p: "¿Has llorado?", o: ["Sí", "No", "Quiero", "No puedo"] },
      { p: "¿Te gustaría distraerte?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Qué te da un poco de paz?", o: ["Música", "Dormir", "Hablar", "Nada"] },
      { p: "¿Te gustaría sentirte mejor?", o: ["Sí", "No", "Tal vez", "Tiempo"] },
      { p: "¿Te tratas con dureza?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Qué necesitas ahora?", o: ["Apoyo", "Tiempo", "Silencio", "Compañía"] },
      { p: "¿Crees que esto pasará?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Quieres intentarlo mañana?", o: ["Sí", "No", "Tal vez", "Poco a poco"] }
    ],
    final: "Lo que sientes es válido 💙 No tienes que cargar con todo solo. Poco a poco, todo mejora."
  },

  "Ansioso": {
    preguntas: [
      { p: "¿Qué está causando tu ansiedad?", o: ["Pensamientos", "Escuela", "Personas", "No sé"] },
      { p: "¿Tu mente está acelerada?", o: ["Sí", "Mucho", "Un poco", "No"] },
      { p: "¿Sientes tensión en el cuerpo?", o: ["Sí", "No", "Mucho", "Poco"] },
      { p: "¿Te cuesta concentrarte?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Respiras rápido?", o: ["Sí", "No", "A veces", "Mucho"] },
      { p: "¿Has intentado calmarte?", o: ["Sí", "No", "Un poco", "No sé cómo"] },
      { p: "¿Qué te preocupa más?", o: ["Futuro", "Errores", "Personas", "Todo"] },
      { p: "¿Te sientes abrumado?", o: ["Sí", "No", "Mucho", "Poco"] },
      { p: "¿Te ayudaría respirar profundo?", o: ["Sí", "No", "Tal vez", "Intentaré"] },
      { p: "¿Puedes hacer una pausa?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Te gustaría distraerte?", o: ["Sí", "No", "Tal vez", "No sé"] },
      { p: "¿Qué te calma?", o: ["Música", "Silencio", "Respirar", "Nada"] },
      { p: "¿Te sientes mejor ahora?", o: ["Sí", "Un poco", "No", "Igual"] },
      { p: "¿Quieres intentarlo otra vez?", o: ["Sí", "No", "Tal vez", "Despacio"] },
      { p: "¿Confías en que pasará?", o: ["Sí", "No", "Tal vez", "Espero"] }
    ],
    final: "Respira... estás haciendo lo mejor que puedes 🧘‍♂️ Esto también va a pasar, no estás solo."
  },

  "Enojado": {
    preguntas: [
      { p: "¿Qué provocó tu enojo?", o: ["Persona", "Situación", "Problema", "Todo"] },
      { p: "¿Qué fue lo peor de eso?", o: ["Injusticia", "Molestia", "Frustración", "Todo"] },
      { p: "¿Cómo reaccionaste?", o: ["Grité", "Me callé", "Me fui", "Exploté"] },
      { p: "¿Te arrepientes?", o: ["Sí", "No", "Tal vez", "Un poco"] },
      { p: "¿Sigues molesto?", o: ["Sí", "Mucho", "Poco", "No"] },
      { p: "¿Te gustaría calmarte?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Qué te ayudaría?", o: ["Respirar", "Alejarme", "Hablar", "Tiempo"] },
      { p: "¿Te afecta mucho?", o: ["Sí", "No", "Mucho", "Poco"] },
      { p: "¿Puedes soltarlo?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Quieres resolverlo?", o: ["Sí", "No", "Tal vez", "Después"] },
      { p: "¿Te sientes escuchado?", o: ["Sí", "No", "A veces", "Nunca"] },
      { p: "¿Te gustaría expresarlo mejor?", o: ["Sí", "No", "Tal vez", "Intento"] },
      { p: "¿Te estás calmando?", o: ["Sí", "No", "Un poco", "Lento"] },
      { p: "¿Quieres dejarlo ir?", o: ["Sí", "No", "Tal vez", "Poco"] },
      { p: "¿Te sientes mejor ahora?", o: ["Sí", "No", "Un poco", "Más o menos"] }
    ],
    final: "Sentir enojo es humano 😌 Lo importante es cómo decides seguir. Tienes control sobre ti."
  }
};

// 🧠 LÓGICA
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
      opciones: null,
      tipo: "final"
    };
  }

  return {
    texto: "Selecciona una emoción",
    opciones: Object.keys(flujo)
  };
}

// WEB
app.post("/api/chat", (req, res) => {
  res.json(responder(req.body.mensaje));
});

// ROOT FIX
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// TELEGRAM
app.post("/telegram", async (req, res) => {
  try {
    console.log("📩 Update:", JSON.stringify(req.body, null, 2));

    const mensaje = req.body?.message?.text;
    const chatId = req.body?.message?.chat?.id;

    if (!mensaje || !chatId) {
      return res.sendStatus(200);
    }

    let respuesta;

    try {
      respuesta = responder(mensaje);
    } catch (err) {
      console.error("❌ Error en responder():", err);
      respuesta = {
        texto: "Hubo un error interno 😢",
        opciones: null
      };
    }

    await fetch(`${TELEGRAM_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: respuesta.texto || "Error inesperado",
        reply_markup: respuesta.opciones
          ? {
              keyboard: respuesta.opciones.map(op => [{ text: op }]),
              resize_keyboard: true
            }
          : { remove_keyboard: true }
      })
    });

    res.sendStatus(200);

  } catch (error) {
    console.error("💥 ERROR GENERAL TELEGRAM:", error);
    res.sendStatus(200); // 🔥 IMPORTANTE: nunca 500
  }
});

// RENDER PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor corriendo");
});