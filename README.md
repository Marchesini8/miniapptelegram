# Mini App Telegram - Grupo Interativo

Mini App estatico inspirado no comportamento do video de referencia:

- Janela compacta parecida com Telegram Desktop.
- Cabecalho azul com nome do grupo e status online.
- Mensagens entrando em sequencia, com pausas e indicador de digitacao.
- Horarios fixos por mensagem.
- Avatares, nomes coloridos, reacoes e cards de arquivo/video.
- Campo inferior bloqueado, simulando grupo onde o visitante apenas acompanha.

## Como rodar local

Com Node instalado, rode:

```bash
npm start
```

Depois abra:

```text
http://localhost:3000
```

Dentro do Telegram, o Mini App vai usar `Telegram.WebApp` automaticamente.

## Deploy no Railway

O projeto ja esta pronto para Railway:

- `package.json` define `npm start`.
- `server.js` usa `process.env.PORT`, como o Railway espera.
- `railway.json` configura Nixpacks, comando de start e healthcheck em `/health`.

No Railway, conecte o repositorio GitHub e faca o deploy. Depois copie a URL HTTPS gerada pelo Railway e cole no BotFather.

## Como editar o roteiro

Abra `app.js` e edite o array `script`.

Exemplo de mensagem:

```js
{ wait: 1200, from: "v", text: "mensagem aqui", time: "12:36" }
```

Campos principais:

- `wait`: tempo de espera antes da mensagem aparecer, em milissegundos.
- `from`: pessoa que enviou. As pessoas ficam no objeto `people`.
- `text`: texto da mensagem.
- `time`: horario mostrado no canto da mensagem.
- `media`: cria um card de arquivo/video.
- `reactions`: lista de reacoes abaixo da mensagem.
- `type: "system"`: cria um aviso central no chat.

## Usar no BotFather

1. Publique no Railway.
2. Copie a URL HTTPS final.
3. No `@BotFather`, use `/mybots`.
4. Selecione o bot.
5. Va em `Bot Settings > Configure Mini App > Enable Mini App`.
6. Cole a URL HTTPS.

## Nota

Use como grupo interativo, demonstracao, funil, jogo narrativo ou simulacao visual. Evite apresentar como se fossem pessoas reais conversando ao vivo.
