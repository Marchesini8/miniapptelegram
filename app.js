const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const chat = document.querySelector("#chat");
const groupStatus = document.querySelector("#group-status");
const joinHint = document.querySelector("#join-hint span");
const sendDataButton = document.querySelector("#send-data");

const people = {
  v: { name: "Velon M.", initials: "V", color: "#8b5cf6" },
  f: { name: "Felipe C.", initials: "F", color: "#22c55e" },
  d: { name: "Diegos.", initials: "D", color: "#06b6d4" },
  t: { name: "Thiago.", initials: "T", color: "#f97316" },
  g: { name: "Gabriel R.", initials: "G", color: "#64748b" },
  da: { name: "Daniel R.", initials: "D", color: "#14b8a6" },
  gu: { name: "Gustavo R.", initials: "G", color: "#ec4899" },
  pa: { name: "Pedro L.", initials: "P", color: "#475569" },
  jo: { name: "Joao V.", initials: "J", color: "#38bdf8" },
  he: { name: "Henrique M.", initials: "H", color: "#65a30d" },
  me: { name: "Mc Mirella \u{1F525}", initials: "M", color: "#2aabee" },
};

const script = [
  { wait: 700, type: "system", text: "14 mensagens nao lidas" },
  { wait: 400, from: "v", text: "voce entrou ja viu onde clica?", time: "12:36" },
  { wait: 1100, from: "f", text: "vim correndo quando vi a notif", time: "12:36" },
  { wait: 900, from: "d", text: "que sorte ter entrado", time: "12:36" },
  { wait: 1300, from: "t", text: "manda o proximo!", time: "12:37", reactions: ["\u{1F525} 3"] },
  { wait: 1500, from: "g", text: "cheguei agora, perdi algo?", time: "12:37" },
  { wait: 1900, from: "da", text: "nao para nunca esse grupo", time: "12:38" },
  {
    wait: 2200,
    from: "me",
    self: true,
    media: { size: "62.4 MB", dark: false },
    text: "Conteudo exclusivo para membros VIP",
    time: "12:38",
    reactions: ["\u2665 21", "\u{1F525} 18", "\u{1F440} 9"],
  },
  { wait: 1700, type: "system", text: "Gustavo R. esta digitando..." },
  { wait: 900, from: "gu", text: "serio isso?", time: "12:39" },
  { wait: 1300, from: "pa", text: "nao e premium demais", time: "12:39" },
  { wait: 1400, from: "jo", text: "primeira vez aqui, muito bom", time: "12:40" },
  { wait: 1200, from: "he", text: "passando pra agradecer o adm", time: "12:40" },
  { wait: 1800, type: "system", text: "Henrique M. esta digitando..." },
  { wait: 900, from: "he", text: "isso aqui ta muito bem feito", time: "12:40" },
  {
    wait: 2100,
    from: "me",
    self: true,
    media: { size: "20.8 MB", dark: true },
    text: "",
    time: "12:41",
    reactions: ["\u{1F525} 30", "\u2665 24"],
  },
  { wait: 1500, from: "t", text: "o que foi isso acabou de vir", time: "12:41" },
  {
    wait: 2200,
    from: "me",
    self: true,
    media: { size: "7.2 MB", dark: false },
    text: "",
    time: "12:42",
    reactions: ["\u{1F60D} 17", "\u{1F525} 12"],
  },
  { wait: 1300, type: "system", text: "Vitor F. reagiu ao arquivo" },
  { wait: 1200, from: "v", text: "isso sim parece grupo real", time: "12:42" },
];

let index = 0;
let online = 23600;
let playbackTimer = null;

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

function setPresence() {
  online += Math.floor(Math.random() * 9) - 2;
  if (online < 23580) online = 23604;
  const rounded = (online / 1000).toFixed(1);
  groupStatus.textContent = `114 membros, ${rounded}k online`;
}

function createAvatar(person) {
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = person.initials;
  avatar.style.background = person.color;
  return avatar;
}

function createSystem(text) {
  const el = document.createElement("div");
  el.className = "system-pill";
  el.textContent = text;
  chat.appendChild(el);
  joinHint.textContent = text;
  scrollToBottom();
}

function createTyping(fromKey) {
  const person = people[fromKey] || people.v;
  const row = document.createElement("div");
  row.className = "message typing";
  row.appendChild(createAvatar(person));

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = "<i></i><i></i><i></i>";
  row.appendChild(bubble);
  chat.appendChild(row);
  scrollToBottom();
  return row;
}

function createMedia(media) {
  const card = document.createElement("div");
  card.className = `media-card${media.dark ? " dark" : ""}`;

  const circle = document.createElement("div");
  circle.className = "download-circle";
  circle.textContent = "\u2193";

  const size = document.createElement("div");
  size.className = "file-size";
  size.textContent = media.size;

  card.append(circle, size);
  return card;
}

function createMessage(item) {
  const person = people[item.from] || people.v;
  const row = document.createElement("div");
  row.className = `message${item.self ? " self" : ""}${item.alt ? " alt" : ""}`;

  if (!item.self) row.appendChild(createAvatar(person));

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (!item.self) {
    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = person.name;
    sender.style.color = person.color;
    bubble.appendChild(sender);
  }

  if (item.reply) {
    const reply = document.createElement("div");
    reply.className = "reply-line";
    reply.textContent = item.reply;
    bubble.appendChild(reply);
  }

  if (item.media) bubble.appendChild(createMedia(item.media));

  if (item.text) {
    const body = document.createElement("div");
    body.className = "body";
    body.textContent = item.text;
    bubble.appendChild(body);
  }

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = item.self ? `${item.time} \u2713\u2713` : item.time;
  bubble.appendChild(meta);

  if (item.reactions?.length) {
    const reactions = document.createElement("div");
    reactions.className = "reactions";
    item.reactions.forEach((reactionText) => {
      const reaction = document.createElement("span");
      reaction.className = "reaction";
      reaction.textContent = reactionText;
      reactions.appendChild(reaction);
    });
    bubble.appendChild(reactions);
  }

  row.appendChild(bubble);
  chat.appendChild(row);
  scrollToBottom();
}

function playNext() {
  const item = script[index];
  if (!item) {
    playbackTimer = window.setTimeout(() => {
      index = 0;
      createSystem("Novas mensagens chegando...");
      playNext();
    }, 5000);
    return;
  }

  playbackTimer = window.setTimeout(() => {
    if (item.type === "system") {
      createSystem(item.text);
      index += 1;
      playNext();
      return;
    }

    const typing = createTyping(item.from);
    const typingTime = Math.min(1200, 420 + (item.text || "arquivo").length * 18);
    window.setTimeout(() => {
      typing.remove();
      createMessage(item);
      setPresence();
      index += 1;
      playNext();
    }, typingTime);
  }, item.wait);
}

sendDataButton.addEventListener("click", () => {
  const payload = {
    action: "grupo_interativo_aberto",
    group: "Grupo VIP de Mc Mirella",
    currentStep: index,
  };

  if (tg?.sendData) {
    tg.sendData(JSON.stringify(payload));
    return;
  }

  createSystem("No Telegram, este botao envia os dados para o bot.");
});

window.addEventListener("beforeunload", () => {
  if (playbackTimer) window.clearTimeout(playbackTimer);
});

playNext();
