# Gerador de Currículo ATS — Versão PWA (App Instalável)

Mesma aplicação do gerador de currículos original (sem anúncios), transformada em
**Progressive Web App**: instalável na tela inicial, abre em tela cheia sem barra
de navegador, funciona offline, e está pronta para ser empacotada com o **PWABuilder**
(publicação na Google Play Store, Microsoft Store, etc.).

## O que foi adicionado em relação à versão "normal"
- `manifest.json` — nome, ícones, cor do tema, modo "standalone" (tela cheia, sem
  barra de endereço)
- `service-worker.js` — cacheia o app inteiro na primeira visita; depois disso,
  abre instantaneamente e **funciona sem internet**
- `icons/` — ícone em várias resoluções (incluindo versão "maskable", exigida pelo
  Android e pelo PWABuilder)
- Banner de "Instalar App" que aparece automaticamente quando o navegador permite
- Ajustes de "área segura" (notch / ilha dinâmica do iPhone) pra nada ficar cortado
- Teclado/zoom/scroll ajustados pra parecer um app nativo, não uma página

## Deploy na Vercel
1. Suba esta pasta pra um repositório **novo** no GitHub.
2. Na Vercel: "Add New Project" → Framework preset: **"Other"**. Sem build command.
3. **Importante:** PWA exige HTTPS pra funcionar — a Vercel já entrega isso
   automaticamente, não precisa configurar nada.

## Como testar se instalou certo
- **Android (Chrome):** abra o site publicado → deve aparecer o banner "Instalar" no
  topo, ou o menu (⋮) → "Instalar aplicativo" / "Adicionar à tela inicial".
- **iPhone (Safari):** abra o site → toque em Compartilhar (□↑) → "Adicionar à Tela
  de Início". (iOS não mostra o banner automático — é sempre manual, limitação da Apple.)
- **Desktop (Chrome/Edge):** ícone de instalação (⊕ ou computador) aparece na barra
  de endereço.

Depois de instalado, o ícone fica na tela inicial/launcher, abre sem barra de
navegador, e funciona mesmo com o avião no modo avião.

## Publicando nas lojas de app com o PWABuilder
1. Publique o site na Vercel primeiro (precisa de uma URL real com HTTPS).
2. Acesse **pwabuilder.com**, cole a URL do site publicado.
3. O PWABuilder vai analisar o `manifest.json` e o `service-worker.js` automaticamente
   (ambos já estão prontos e validados neste projeto) e dar uma pontuação.
4. A partir daí, ele gera o pacote pronto pra:
   - **Google Play Store** (Android, via TWA — Trusted Web Activity)
   - **Microsoft Store** (Windows)
   - iOS tem suporte mais limitado (a Apple não permite instalação via loja do
     mesmo jeito) — o PWABuilder mostra as opções disponíveis pra cada loja.

## Atualizando o app depois de publicado
Sempre que você alterar o `index.html`, `libs/` ou `styles/`, abra o
`service-worker.js` e troque `curriculo-ats-v1` para `curriculo-ats-v2` (ou
qualquer número seguinte) na primeira linha. Isso força quem já instalou o app a
baixar a versão nova automaticamente na próxima vez que abrir — sem isso, o
Service Worker continua servindo a versão antiga do cache.

## Estrutura de arquivos
```
index.html
manifest.json           → configuração do PWA
service-worker.js       → cache offline
icons/
  icon-192.png
  icon-512.png
  icon-maskable-512.png → ícone "sangrado" (Android aplica a máscara de forma)
  apple-touch-icon.png  → ícone pro iOS
  favicon-32.png
libs/html2canvas.min.js
libs/jspdf.umd.min.js
libs/docx.min.js
styles/tailwind.css
vercel.json
```
