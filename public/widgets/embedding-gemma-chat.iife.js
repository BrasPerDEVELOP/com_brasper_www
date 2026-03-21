var EmbeddingGemmaChat=(function(y){"use strict";const B={value:0};function F(t={}){return B.value+=1,{apiUrl:t.apiUrl||"http://localhost:8001/consulta-webchat",position:t.position==="bottom-right"?"bottom-right":"bottom-left",title:t.title||"Asistente de remesas",subtitle:t.subtitle||"Cotización y requisitos en una conversación",welcomeMessage:t.welcomeMessage||"Hola, ¿en qué puedo ayudarte?",primaryColor:t.primaryColor||"#0b8a68",accentColor:t.accentColor||"#e3fff4",textColor:t.textColor||"#17342c",fontFamily:t.fontFamily||'"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',fontImportUrl:t.fontImportUrl||"",launcherImageUrl:t.launcherImageUrl||"",headerBackground:t.headerBackground||"",headerColor:t.headerColor||"",headerTextColor:t.headerTextColor||"",headerSubtitleColor:t.headerSubtitleColor||"",panelBackground:t.panelBackground||"",zIndex:Number(t.zIndex||9999),width:t.width||360,height:t.height||560,placeholder:t.placeholder||"Escribe tu consulta...",avatarUrl:t.avatarUrl||"",launcherIcon:t.launcherIcon||"",containerId:t.containerId||`embedding-gemma-chat-${B.value}`,errorMessage:t.errorMessage||"No pude conectarme con el servicio. Verifica que el backend esté disponible.",callbacks:{onOpen:t.onOpen,onClose:t.onClose,onMessageSent:t.onMessageSent,onMessageReceived:t.onMessageReceived,onError:t.onError}}}function a(t,e={}){const r=document.createElement(t);return e.className&&(r.className=e.className),e.text&&(r.textContent=e.text),e.type&&(r.type=e.type),e.attributes&&Object.entries(e.attributes).forEach(([l,g])=>{g!=null&&r.setAttribute(l,g)}),r}function O(t){return typeof t=="number"?`${t}px`:t}function b(t){return typeof t=="string"&&t.trim()?t:"#0b8a68"}function W(t){return`linear-gradient(180deg, color-mix(in srgb, ${t} 72%, #000), color-mix(in srgb, ${t} 48%, #000))`}function M(t){return{launcher:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 6.67 15.05l2.14 2.14a1 1 0 0 0 1.41-1.41l-2.14-2.14A9 9 0 0 0 12 3Zm0 2a7 7 0 1 1-4.95 11.95A7 7 0 0 1 12 5Zm-2.5 4a1 1 0 0 0 0 2H14a1 1 0 0 0 .8-1.6l-2-2.67a1 1 0 0 0-1.6 1.2L12 9H9.5Zm5 4H10a1 1 0 1 0-.8 1.6l2 2.67a1 1 0 0 0 1.6-1.2L12 15h2.5a1 1 0 1 0 0-2Z"/></svg>',avatar:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 5a3.25 3.25 0 1 1-3.25 3.25A3.25 3.25 0 0 1 12 7Zm0 12.2a7.2 7.2 0 0 1-5.32-2.36 5.9 5.9 0 0 1 10.64 0A7.2 7.2 0 0 1 12 19.2Z"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 5.3 12 10.59l5.3-5.3a1 1 0 1 1 1.4 1.42L13.41 12l5.29 5.3a1 1 0 0 1-1.4 1.4L12 13.41l-5.3 5.29a1 1 0 0 1-1.4-1.4L10.59 12 5.3 6.7a1 1 0 0 1 1.4-1.4Z"/></svg>',send:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6a1 1 0 0 1-.33-1.05l2.2-6.61a1 1 0 0 0 0-.63l-2.2-6.61a1 1 0 0 1 1.4-1.2l16.8 7.6a1 1 0 0 1 0 1.82l-16.8 7.6a1 1 0 0 1-1.07-.12Zm3.83-7.1-1.46 4.37L17.9 12.4 5.77 6.93l1.46 4.37h5.27a1 1 0 0 1 0 2Z"/></svg>'}[t]||""}async function R(t,e){const r=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e})});if(!r.ok)throw new Error(`HTTP ${r.status}`);const l=await r.json();if(!l||typeof l.response!="string")throw new Error("Invalid chat response payload");return l.response}const q=`
/* La fuente del widget es independiente de la página: se define en :host y hereda al árbol del shadow */
:host {
  all: initial;
  font-family: var(
    --eg-font-family,
    "DM Sans",
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif
  );
}

:host *,
:host *::before,
:host *::after {
  box-sizing: border-box;
  font-family: inherit;
}

.eg-chat-shell {
  position: fixed;
  bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.eg-chat-shell--bottom-left {
  left: 20px;
}

.eg-chat-shell--bottom-right {
  right: 20px;
}

.eg-chat-launcher {
  width: 76px;
  height: 76px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(145deg, var(--eg-primary, #0b8a68), #0b624d);
  color: #fff;
  box-shadow: 0 18px 40px rgba(5, 33, 28, 0.35);
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform 180ms ease, opacity 180ms ease;
  overflow: hidden;
  padding: 0;
}

.eg-chat-launcher:hover {
  transform: translateY(-2px);
}

.eg-chat-launcher svg {
  width: 34px;
  height: 34px;
  fill: currentColor;
}

.eg-chat-launcher-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}

.eg-chat-launcher--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(6px);
}

/** Botón con GIF/imagen: sin relleno degradado, borde con color primario */
.eg-chat-launcher--media {
  background: var(--eg-launcher-media-bg, transparent);
  border: 3px solid var(--eg-primary, #0b8a68);
  box-shadow: 0 18px 40px rgba(5, 33, 28, 0.28);
}

.eg-chat-panel {
  display: none;
  flex-direction: column;
  overflow: hidden;
  border-radius: 28px;
  background: var(--eg-panel-bg, #f5efe5);
  color: var(--eg-text, #17342c);
  box-shadow: 0 30px 70px rgba(13, 27, 23, 0.28);
  border: 1px solid rgba(7, 32, 26, 0.08);
}

.eg-chat-panel--open {
  display: flex;
}

.eg-chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
  /* Por defecto el header sigue a --eg-primary (config.primaryColor). Sobrescribe con headerBackground. */
  background: var(
    --eg-header-bg,
    linear-gradient(
      180deg,
      color-mix(in srgb, var(--eg-primary, #0b8a68) 72%, #000),
      color-mix(in srgb, var(--eg-primary, #0b8a68) 48%, #000)
    )
  );
  color: var(--eg-header-text, #fff);
}

.eg-chat-avatar {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.eg-chat-avatar svg,
.eg-chat-close svg,
.eg-chat-submit svg {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

.eg-chat-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eg-chat-title-wrap {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 3px;
}

.eg-chat-title {
  font-size: 16px;
}

.eg-chat-subtitle {
  font-size: 12px;
  color: var(--eg-header-subtitle, rgba(255, 255, 255, 0.82));
}

.eg-chat-close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.eg-chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 14px;
  background:
    radial-gradient(circle at top right, rgba(169, 222, 191, 0.34), transparent 38%),
    linear-gradient(180deg, #f6f0e5 0%, #efe8dc 100%);
}

.eg-chat-row {
  display: flex;
  margin-bottom: 10px;
}

.eg-chat-row--assistant {
  justify-content: flex-start;
}

.eg-chat-row--user {
  justify-content: flex-end;
}

.eg-chat-bubble {
  max-width: 78%;
  padding: 12px 14px;
  border-radius: 18px;
  line-height: 1.4;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-word;
}

.eg-chat-bubble > :first-child {
  margin-top: 0;
}

.eg-chat-bubble > :last-child {
  margin-bottom: 0;
}

.eg-chat-bubble--assistant {
  background: #fff;
  color: #21342e;
  border-top-left-radius: 8px;
}

/* Indicador "escribiendo…" (estilo WhatsApp) */
.eg-chat-bubble--typing {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 0;
  box-shadow: 0 1px 0.5px rgba(11, 20, 26, 0.13);
}

.eg-chat-typing {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 10px;
}

.eg-chat-typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8696a0;
  animation: eg-chat-typing-bounce 1.35s ease-in-out infinite both;
}

.eg-chat-typing-dot:nth-child(2) {
  animation-delay: 0.22s;
}

.eg-chat-typing-dot:nth-child(3) {
  animation-delay: 0.44s;
}

@keyframes eg-chat-typing-bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

.eg-chat-bubble--user {
  background: var(--eg-primary, #0b8a68);
  color: #fff;
  border-top-right-radius: 8px;
}

.eg-chat-paragraph {
  margin: 0 0 8px;
  white-space: pre-wrap;
}

.eg-chat-link-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  margin-top: 6px;
  padding: 10px 14px;
  border: 0;
  border-radius: 12px;
  background: #1fb97a;
  color: #fff;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.eg-chat-link-button:hover {
  background: #169864;
}

.eg-chat-status {
  min-height: 0;
  padding: 0 16px;
  color: #7a3f30;
  font-size: 12px;
  opacity: 0;
  transition: opacity 150ms ease, padding 150ms ease;
}

.eg-chat-status--visible {
  min-height: 18px;
  padding: 8px 16px 0;
  opacity: 1;
}

.eg-chat-form {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background: #fff;
}

.eg-chat-input {
  flex: 1;
  border: 0;
  border-radius: 16px;
  background: #eff3f1;
  color: #1e2e29;
  padding: 14px 16px;
  font-size: 14px;
  outline: none;
}

.eg-chat-input::placeholder {
  color: #6f7c77;
}

.eg-chat-submit {
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 18px;
  background: linear-gradient(145deg, var(--eg-primary, #0b8a68), #0a6f57);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.eg-chat-submit[disabled],
.eg-chat-input[disabled] {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .eg-chat-shell--bottom-left,
  .eg-chat-shell--bottom-right {
    left: 12px;
    right: 12px;
    bottom: 12px;
  }

  .eg-chat-panel {
    width: auto !important;
    height: min(78vh, 580px) !important;
  }
}
`;function G(t={}){const e=F(t),r={isOpen:!1,isLoading:!1,messages:[],error:null};let l=null,g=null,L=null,c=null,n=null,d=null,x=null,h=null,v=null;function w(o){Object.assign(r,o),A()}function k(o,i){const s=e.callbacks?.[o];typeof s=="function"&&s(i)}function S(o){r.messages.push(o),j()}function J(){if(l=a("div",{className:"eg-chat-host",attributes:{id:e.containerId}}),document.body.appendChild(l),g=l.attachShadow({mode:"open"}),e.fontImportUrl){const p=a("link",{attributes:{rel:"stylesheet",href:e.fontImportUrl}});g.appendChild(p)}L=a("style"),L.textContent=q,g.appendChild(L);const o=a("div",{className:`eg-chat-shell eg-chat-shell--${e.position}`});if(c=a("button",{className:"eg-chat-launcher",type:"button",text:"",attributes:{"aria-label":"Abrir chat"}}),e.launcherImageUrl){const p=a("img",{className:"eg-chat-launcher-img",attributes:{src:e.launcherImageUrl,alt:"",decoding:"async"}});c.appendChild(p),c.classList.add("eg-chat-launcher--media")}else c.innerHTML=e.launcherIcon||M("launcher");c.addEventListener("click",H),n=a("section",{className:"eg-chat-panel",attributes:{"aria-hidden":"true"}});const i=a("header",{className:"eg-chat-header"}),s=a("div",{className:"eg-chat-title-wrap"}),m=a("div",{className:"eg-chat-avatar"});if(e.avatarUrl){const p=a("img",{className:"eg-chat-avatar-image",attributes:{src:e.avatarUrl,alt:e.title}});m.appendChild(p)}else m.innerHTML=M("avatar");const N=a("strong",{className:"eg-chat-title",text:e.title}),u=a("span",{className:"eg-chat-subtitle",text:e.subtitle});s.append(N,u);const f=a("button",{className:"eg-chat-close",type:"button",attributes:{"aria-label":"Cerrar chat"}});f.innerHTML=M("close"),f.addEventListener("click",U),i.append(m,s,f),d=a("div",{className:"eg-chat-messages",attributes:{role:"log","aria-live":"polite"}}),v=a("div",{className:"eg-chat-status"}),x=a("form",{className:"eg-chat-form"}),h=a("input",{className:"eg-chat-input",attributes:{type:"text",placeholder:e.placeholder,autocomplete:"off","aria-label":"Mensaje"}});const I=a("button",{className:"eg-chat-submit",type:"submit",attributes:{"aria-label":"Enviar"}});I.innerHTML=M("send"),x.addEventListener("submit",K),x.append(h,I),n.append(i,d,v,x),o.append(c,n),g.appendChild(o),e.welcomeMessage&&(r.messages=[{id:crypto.randomUUID(),role:"assistant",text:e.welcomeMessage}]),A()}function A(){!n||!c||!d||!v||!h||(l.style.zIndex=String(e.zIndex),l.style.setProperty("--eg-font-family",e.fontFamily),n.style.width=O(e.width),n.style.height=O(e.height),n.style.setProperty("--eg-primary",b(e.primaryColor)),n.style.setProperty("--eg-accent",b(e.accentColor)),n.style.setProperty("--eg-text",b(e.textColor)),e.headerBackground?n.style.setProperty("--eg-header-bg",e.headerBackground):typeof e.headerColor=="string"&&e.headerColor.trim()?n.style.setProperty("--eg-header-bg",W(b(e.headerColor))):n.style.removeProperty("--eg-header-bg"),e.headerTextColor?n.style.setProperty("--eg-header-text",e.headerTextColor):n.style.removeProperty("--eg-header-text"),e.headerSubtitleColor?n.style.setProperty("--eg-header-subtitle",e.headerSubtitleColor):n.style.removeProperty("--eg-header-subtitle"),e.panelBackground?n.style.setProperty("--eg-panel-bg",e.panelBackground):n.style.removeProperty("--eg-panel-bg"),c.style.setProperty("--eg-primary",b(e.primaryColor)),c.style.setProperty("--eg-accent",b(e.accentColor)),n.classList.toggle("eg-chat-panel--open",r.isOpen),n.setAttribute("aria-hidden",String(!r.isOpen)),c.classList.toggle("eg-chat-launcher--hidden",r.isOpen),h.disabled=r.isLoading,x.querySelector(".eg-chat-submit").disabled=r.isLoading,v.textContent=r.error||"",v.classList.toggle("eg-chat-status--visible",!!r.error),j())}function j(){if(d){if(d.innerHTML="",r.messages.forEach(o=>{const i=a("div",{className:`eg-chat-row eg-chat-row--${o.role}`}),s=a("div",{className:`eg-chat-bubble eg-chat-bubble--${o.role}`});V(s,o.text),i.appendChild(s),d.appendChild(i)}),r.isLoading){const o=a("div",{className:"eg-chat-row eg-chat-row--assistant"}),i=a("div",{className:"eg-chat-bubble eg-chat-bubble--assistant eg-chat-bubble--typing",attributes:{"aria-label":"El asistente está escribiendo",role:"status"}}),s=a("span",{className:"eg-chat-typing"});s.append(a("span",{className:"eg-chat-typing-dot"}),a("span",{className:"eg-chat-typing-dot"}),a("span",{className:"eg-chat-typing-dot"})),i.appendChild(s),o.appendChild(i),d.appendChild(o)}d.scrollTop=d.scrollHeight}}function V(o,i){String(i||"").split(`
`).filter((N,u,f)=>N.trim()||u<f.length-1).forEach(N=>{const u=N.trim();if(u.match(/^https?:\/\/\S+$/)){const p=u,D=a("button",{className:"eg-chat-link-button",text:p.includes("wa.me")?"Abrir WhatsApp":"Abrir enlace",type:"button"});D.addEventListener("click",$=>{$.preventDefault(),$.stopPropagation(),window.open(p,"_blank","noopener,noreferrer")||window.location.assign(p)}),o.appendChild(D);return}const I=a("p",{className:"eg-chat-paragraph",text:u||" "});o.appendChild(I)})}function z(){r.isOpen||(w({isOpen:!0}),k("onOpen",{config:e}),requestAnimationFrame(()=>{h?.focus()}))}function U(){r.isOpen&&(w({isOpen:!1}),k("onClose",{config:e}))}function H(){if(r.isOpen){U();return}z()}async function K(o){if(o.preventDefault(),r.isLoading||!h)return;const i=h.value.trim();if(i){S({id:crypto.randomUUID(),role:"user",text:i}),k("onMessageSent",{message:i}),h.value="",w({isLoading:!0,error:null});try{const s=await R(e.apiUrl,i);S({id:crypto.randomUUID(),role:"assistant",text:s}),k("onMessageReceived",{message:s}),w({isLoading:!1,error:null})}catch(s){const m=e.errorMessage;S({id:crypto.randomUUID(),role:"assistant",text:m}),w({isLoading:!1,error:"No se pudo completar la solicitud."}),k("onError",s)}}}function Z(){l?.remove()}return{config:e,mount:J,destroy:Z,publicApi:{open:z,close:U,toggle:H,destroy:Z,getState:()=>({...r,messages:[...r.messages]})}}}function Y(){return typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}}const C=new Map;function P(t={}){const e=G(t);return e.mount(),e.config.containerId&&C.set(e.config.containerId,e),e.publicApi}function E(t){const e=C.get(t);return e?(e.destroy(),C.delete(t),!0):!1}const T={init:P,destroy:E},_=Y();return _.EmbeddingGemmaChat=T,y.default=T,y.destroy=E,y.init=P,Object.defineProperties(y,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),y})({});
