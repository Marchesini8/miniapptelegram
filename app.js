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
  le: { name: "Leonardo S.", initials: "LS", color: "#d91b7b" },
  vi: { name: "Vitor F.", initials: "VF", color: "#16a34a" },
  ma: { name: "Mariana P.", initials: "MP", color: "#9333ea" },
  gu: { name: "Gustavo R.", initials: "GR", color: "#0ea5e9" },
  ra: { name: "Rafaela N.", initials: "RN", color: "#f97316" },
  jo: { name: "Joao V.", initials: "JV", color: "#14b8a6" },
  ca: { name: "Camila D.", initials: "CD", color: "#ef4444" },
  pe: { name: "Pedro L.", initials: "PL", color: "#475569" },
  lu: { name: "Lucas M.", initials: "LM", color: "#65a30d" },
  an: { name: "Ana B.", initials: "AB", color: "#db2777" },
  me: { name: "Mc Mirella \u{1F525}", initials: "MC", color: "#2aabee" },
};

const videos = [
  {
    id: "v1",
    wait: 900,
    duration: "1:12",
    size: "18.4 MB",
    time: "12:40",
    caption: "Conteudo exclusivo para membros VIP",
    theme: "warm",
    reactions: [
      { emoji: "\u{1F525}", count: 46, gain: 18 },
      { emoji: "\u{1F60D}", count: 33, gain: 14 },
      { emoji: "\u{1F970}", count: 37, gain: 11 },
    ],
  },
  {
    id: "v2",
    wait: 1900,
    duration: "0:49",
    size: "12.7 MB",
    time: "12:41",
    caption: "so pra quem entrou no grupo agora",
    theme: "soft",
    reactions: [
      { emoji: "\u{1F525}", count: 61, gain: 22 },
      { emoji: "\u2764", count: 48, gain: 17 },
      { emoji: "\u{1F440}", count: 29, gain: 9 },
    ],
  },
  {
    id: "v3",
    wait: 2100,
    duration: "2:05",
    size: "28.8 MB",
    time: "12:43",
    caption: "mais um liberado aqui primeiro",
    theme: "dark",
    reactions: [
      { emoji: "\u{1F60D}", count: 72, gain: 20 },
      { emoji: "\u{1F525}", count: 54, gain: 19 },
      { emoji: "\u{1F92F}", count: 21, gain: 8 },
    ],
  },
  {
    id: "v4",
    wait: 2400,
    duration: "0:36",
    size: "7.2 MB",
    time: "12:44",
    caption: "ultimo aviso antes de fechar",
    theme: "warm",
    reactions: [
      { emoji: "\u{1F525}", count: 89, gain: 25 },
      { emoji: "\u2764", count: 66, gain: 20 },
      { emoji: "\u{1F60D}", count: 52, gain: 15 },
    ],
  },
];

const positiveComments = [
  { from: "le", text: "me avisem quando sair novo", time: "12:40" },
  { from: "vi", text: "baixou aqui, qualidade ta absurda", time: "12:40" },
  { from: "ma", text: "entrei achando que era comum, mas esse grupo ta forte", time: "12:41" },
  { from: "gu", text: "as reacoes subindo rapido demais kkk", time: "12:41" },
  { from: "ra", text: "quem chegou agora ainda pegou coisa boa", time: "12:41" },
  { from: "jo", text: "manda mais desse estilo", time: "12:42" },
  { from: "ca", text: "isso aqui parece live de tao movimentado", time: "12:42" },
  { from: "pe", text: "nao para, o grupo acordou de vez", time: "12:43" },
  { from: "lu", text: "conteudo vindo certinho, gostei", time: "12:43" },
  { from: "an", text: "so comentario positivo, agora entendi", time: "12:44" },
  { from: "vi", text: "o melhor e que chega tudo direto aqui", time: "12:44" },
  { from: "le", text: "quem entrou cedo se deu bem", time: "12:45" },
];

const usedCommentIndexes = new Set();
let online = 2014;
let playbackTimer = null;
let currentStep = 0;

function nextComment() {
  const available = positiveComments
    .map((comment, index) => ({ comment, index }))
    .filter((entry) => !usedCommentIndexes.has(entry.index));

  if (!available.length) return null;

  const entry = available[0];
  usedCommentIndexes.add(entry.index);
  return entry.comment;
}

function buildScript() {
  const items = [
    { type: "system", wait: 450, text: "21.483 membros, 2.014 online" },
    { type: "comment", wait: 600, from: "gu", text: "cheguei agora, ja liberou algo?", time: "12:39" },
    { type: "comment", wait: 1100, from: "ma", text: "sim, fica olhando que aparece aqui", time: "12:39" },
  ];

  videos.forEach((video, videoIndex) => {
    items.push({ type: "video", ...video });
    const commentsAfterVideo = videoIndex === 0 ? 3 : 2;

    for (let i = 0; i < commentsAfterVideo; i += 1) {
      const comment = nextComment();
      if (comment) items.push({ type: "comment", wait: 850 + i * 360, ...comment });
    }

    items.push({
      type: "system",
      wait: 600,
      text: `${Object.values(people)[videoIndex + 1].name} esta digitando...`,
      transient: true,
    });
  });

  items.push({ type: "system", wait: 1200, text: "Sem novas mensagens por enquanto" });
  return items;
}

const script = buildScript();

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
}

function setPresence() {
  online += 3 + Math.floor(Math.random() * 12);
  groupStatus.textContent = `21.483 membros, ${online.toLocaleString("pt-BR")} online`;
}

function createAvatar(person) {
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = person.initials;
  avatar.style.background = person.color;
  return avatar;
}

function createSystem(text, transient = false) {
  const el = document.createElement("div");
  el.className = `system-pill${transient ? " transient" : ""}`;
  el.textContent = text;
  chat.appendChild(el);
  joinHint.textContent = text;
  scrollToBottom();
}

function createTyping(fromKey) {
  const person = people[fromKey] || people.le;
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

function createVideoCard(video) {
  const card = document.createElement("div");
  card.className = `media-card ${video.theme || "warm"}`;

  const duration = document.createElement("div");
  duration.className = "video-duration";
  duration.textContent = video.duration;

  const circle = document.createElement("div");
  circle.className = "download-circle";
  circle.textContent = "\u2193";

  const size = document.createElement("div");
  size.className = "file-size";
  size.textContent = video.size;

  card.append(duration, circle, size);
  return card;
}

function createReactionStrip(reactions) {
  const strip = document.createElement("div");
  strip.className = "reactions floating";

  reactions.forEach((reactionConfig, index) => {
    const reaction = document.createElement("span");
    reaction.className = "reaction";
    reaction.dataset.count = String(reactionConfig.count);
    reaction.dataset.gain = String(reactionConfig.gain);
    reaction.innerHTML = `<span>${reactionConfig.emoji}</span><b>${reactionConfig.count}</b>`;
    reaction.style.animationDelay = `${index * 120}ms`;
    strip.appendChild(reaction);
  });

  return strip;
}

function animateReactions(strip) {
  const pills = [...strip.querySelectorAll(".reaction")];
  pills.forEach((pill, pillIndex) => {
    const start = Number(pill.dataset.count || 0);
    const gain = Number(pill.dataset.gain || 0);
    const number = pill.querySelector("b");
    let tick = 0;

    const interval = window.setInterval(() => {
      tick += 1;
      const next = start + Math.ceil((gain * tick) / 8);
      number.textContent = String(next);
      pill.classList.remove("pulse");
      void pill.offsetWidth;
      pill.classList.add("pulse");

      if (tick >= 8) {
        window.clearInterval(interval);
      }
    }, 520 + pillIndex * 130);
  });
}

function createMessage(item) {
  const person = people[item.from] || people.le;
  const row = document.createElement("div");
  row.className = `message${item.self ? " self" : ""}${item.type === "video" ? " video-message self" : ""}`;

  if (!item.self && item.type !== "video") row.appendChild(createAvatar(person));

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (item.type === "video") {
    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = people.me.name;
    sender.style.color = people.me.color;
    bubble.appendChild(sender);

    const videoWrap = document.createElement("div");
    videoWrap.className = "video-wrap";
    videoWrap.appendChild(createVideoCard(item));

    if (item.reactions?.length) {
      const strip = createReactionStrip(item.reactions);
      videoWrap.appendChild(strip);
      window.setTimeout(() => animateReactions(strip), 450);
    }

    bubble.appendChild(videoWrap);
  } else if (!item.self) {
    const sender = document.createElement("div");
    sender.className = "sender";
    sender.textContent = person.name;
    sender.style.color = person.color;
    bubble.appendChild(sender);
  }

  if (item.text || item.caption) {
    const body = document.createElement("div");
    body.className = "body";
    body.textContent = item.text || item.caption;
    bubble.appendChild(body);
  }

  const meta = document.createElement("span");
  meta.className = "meta";
  meta.textContent = item.type === "video" ? `${item.time} \u2713\u2713` : item.time;
  bubble.appendChild(meta);

  if (item.type !== "video" && item.reactions?.length) {
    const strip = createReactionStrip(item.reactions);
    bubble.appendChild(strip);
    window.setTimeout(() => animateReactions(strip), 450);
  }

  row.appendChild(bubble);
  chat.appendChild(row);
  scrollToBottom();
}

function playItem(item) {
  if (item.type === "system") {
    createSystem(item.text, item.transient);
    currentStep += 1;
    playNext();
    return;
  }

  const fromKey = item.type === "video" ? "me" : item.from;
  const typing = createTyping(fromKey);
  const typingTime = item.type === "video" ? 650 : Math.min(1150, 380 + item.text.length * 18);

  window.setTimeout(() => {
    typing.remove();
    createMessage(item);
    setPresence();
    currentStep += 1;
    playNext();
  }, typingTime);
}

function playNext() {
  const item = script[currentStep];
  if (!item) return;

  playbackTimer = window.setTimeout(() => playItem(item), item.wait);
}

sendDataButton.addEventListener("click", () => {
  const payload = {
    action: "grupo_interativo_aberto",
    group: "Grupo VIP de Mc Mirella",
    currentStep,
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
