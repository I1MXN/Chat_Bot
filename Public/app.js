function mostrarBot(data) {
  const chat = document.getElementById("chat-box");
  const opciones = document.getElementById("opciones");

  chat.innerHTML += `<div class="bot">${data.texto}</div>`;
  chat.scrollTop = chat.scrollHeight;

  opciones.innerHTML = "";

  if (data.opciones) {
    data.opciones.forEach(op => {
      opciones.innerHTML += `
        <button class="card" onclick="enviar('${op}')">
          ${op}
        </button>
      `;
    });
  }

  if (data.tipo === "final") {
    setTimeout(() => enviar("inicio"), 2000);
  }
}

function enviar(mensaje) {
  const chat = document.getElementById("chat-box");

  chat.innerHTML += `<div class="user">${mensaje}</div>`;

  fetch("/api/chat", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ mensaje })
  })
  .then(res => res.json())
  .then(data => mostrarBot(data));
}

window.onload = () => enviar("inicio");