var EmbeddingGemmaChat=(function(m){"use strict";const S={value:0};function R(t={}){return S.value+=1,{apiUrl:t.apiUrl||"http://localhost:8001/consulta-webchat",position:t.position==="bottom-right"?"bottom-right":"bottom-left",title:t.title||"Asistente de remesas",welcomeMessage:t.welcomeMessage||"Hola, ¿en qué puedo ayudarte?",primaryColor:t.primaryColor||"#0b8a68",accentColor:t.accentColor||"#e3fff4",textColor:t.textColor||"#17342c",zIndex:Number(t.zIndex||9999),width:t.width||360,height:t.height||560,placeholder:t.placeholder||"Escribe tu consulta...",avatarUrl:t.avatarUrl||"",launcherIcon:t.launcherIcon||"",containerId:t.containerId||`embedding-gemma-chat-${S.value}`,errorMessage:t.errorMessage||"No pude conectarme con el servicio. Verifica que el backend esté disponible.",callbacks:{onOpen:t.onOpen,onClose:t.onClose,onMessageSent:t.onMessageSent,onMessageReceived:t.onMessageReceived,onError:t.onError}}}function r(t,e={}){const a=document.createElement(t);return e.className&&(a.className=e.className),e.text&&(a.textContent=e.text),e.type&&(a.type=e.type),e.attributes&&Object.entries(e.attributes).forEach(([s,g])=>{g!=null&&a.setAttribute(s,g)}),a}function U(t){return typeof t=="number"?`${t}px`:t}function f(t){return typeof t=="string"&&t.trim()?t:"#0b8a68"}function N(t){return{launcher:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 6.67 15.05l2.14 2.14a1 1 0 0 0 1.41-1.41l-2.14-2.14A9 9 0 0 0 12 3Zm0 2a7 7 0 1 1-4.95 11.95A7 7 0 0 1 12 5Zm-2.5 4a1 1 0 0 0 0 2H14a1 1 0 0 0 .8-1.6l-2-2.67a1 1 0 0 0-1.6 1.2L12 9H9.5Zm5 4H10a1 1 0 1 0-.8 1.6l2 2.67a1 1 0 0 0 1.6-1.2L12 15h2.5a1 1 0 1 0 0-2Z"/></svg>',avatar:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 5a3.25 3.25 0 1 1-3.25 3.25A3.25 3.25 0 0 1 12 7Zm0 12.2a7.2 7.2 0 0 1-5.32-2.36 5.9 5.9 0 0 1 10.64 0A7.2 7.2 0 0 1 12 19.2Z"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.7 5.3 12 10.59l5.3-5.3a1 1 0 1 1 1.4 1.42L13.41 12l5.29 5.3a1 1 0 0 1-1.4 1.4L12 13.41l-5.3 5.29a1 1 0 0 1-1.4-1.4L10.59 12 5.3 6.7a1 1 0 0 1 1.4-1.4Z"/></svg>',send:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.4 20.6a1 1 0 0 1-.33-1.05l2.2-6.61a1 1 0 0 0 0-.63l-2.2-6.61a1 1 0 0 1 1.4-1.2l16.8 7.6a1 1 0 0 1 0 1.82l-16.8 7.6a1 1 0 0 1-1.07-.12Zm3.83-7.1-1.46 4.37L17.9 12.4 5.77 6.93l1.46 4.37h5.27a1 1 0 0 1 0 2Z"/></svg>'}[t]||""}async function q(t,e){const a=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:e})});if(!a.ok)throw new Error(`HTTP ${a.status}`);const s=await a.json();if(!s||typeof s.response!="string")throw new Error("Invalid chat response payload");return s.response}const W=`
:host {
  all: initial;
}

.eg-chat-host,
.eg-chat-host * {
  box-sizing: border-box;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
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
}

.eg-chat-launcher:hover {
  transform: translateY(-2px);
}

.eg-chat-launcher svg {
  width: 34px;
  height: 34px;
  fill: currentColor;
}

.eg-chat-launcher--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(6px);
}

.eg-chat-panel {
  display: none;
  flex-direction: column;
  overflow: hidden;
  border-radius: 28px;
  background: #f5efe5;
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
  background: linear-gradient(180deg, #123629, #102d23);
  color: #fff;
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
  color: rgba(228, 242, 237, 0.85);
}

.eg-chat-close {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #fff;
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
`;function G(t={}){const e=R(t),a={isOpen:!1,isLoading:!1,messages:[],error:null};let s=null,g=null,C=null,c=null,l=null,d=null,x=null,p=null,y=null;function w(n){Object.assign(a,n),z()}function v(n,o){const i=e.callbacks?.[n];typeof i=="function"&&i(o)}function I(n){a.messages.push(n),H()}function Y(){s=r("div",{className:"eg-chat-host",attributes:{id:e.containerId}}),document.body.appendChild(s),g=s.attachShadow({mode:"open"}),C=r("style"),C.textContent=W,g.appendChild(C);const n=r("div",{className:`eg-chat-shell eg-chat-shell--${e.position}`});c=r("button",{className:"eg-chat-launcher",type:"button",text:"",attributes:{"aria-label":"Abrir chat"}}),c.innerHTML=e.launcherIcon||N("launcher"),c.addEventListener("click",B),l=r("section",{className:"eg-chat-panel",attributes:{"aria-hidden":"true"}});const o=r("header",{className:"eg-chat-header"}),i=r("div",{className:"eg-chat-title-wrap"}),u=r("div",{className:"eg-chat-avatar"});if(e.avatarUrl){const k=r("img",{className:"eg-chat-avatar-image",attributes:{src:e.avatarUrl,alt:e.title}});u.appendChild(k)}else u.innerHTML=N("avatar");const M=r("strong",{className:"eg-chat-title",text:e.title}),h=r("span",{className:"eg-chat-subtitle",text:"Cotización y requisitos en una conversación"});i.append(M,h);const b=r("button",{className:"eg-chat-close",type:"button",attributes:{"aria-label":"Cerrar chat"}});b.innerHTML=N("close"),b.addEventListener("click",E),o.append(u,i,b),d=r("div",{className:"eg-chat-messages",attributes:{role:"log","aria-live":"polite"}}),y=r("div",{className:"eg-chat-status"}),x=r("form",{className:"eg-chat-form"}),p=r("input",{className:"eg-chat-input",attributes:{type:"text",placeholder:e.placeholder,autocomplete:"off","aria-label":"Mensaje"}});const L=r("button",{className:"eg-chat-submit",type:"submit",attributes:{"aria-label":"Enviar"}});L.innerHTML=N("send"),x.addEventListener("submit",V),x.append(p,L),l.append(o,d,y,x),n.append(c,l),g.appendChild(n),e.welcomeMessage&&(a.messages=[{id:crypto.randomUUID(),role:"assistant",text:e.welcomeMessage}]),z()}function z(){!l||!c||!d||!y||!p||(s.style.zIndex=String(e.zIndex),l.style.width=U(e.width),l.style.height=U(e.height),l.style.setProperty("--eg-primary",f(e.primaryColor)),l.style.setProperty("--eg-accent",f(e.accentColor)),l.style.setProperty("--eg-text",f(e.textColor)),c.style.setProperty("--eg-primary",f(e.primaryColor)),c.style.setProperty("--eg-accent",f(e.accentColor)),l.classList.toggle("eg-chat-panel--open",a.isOpen),l.setAttribute("aria-hidden",String(!a.isOpen)),c.classList.toggle("eg-chat-launcher--hidden",a.isOpen),p.disabled=a.isLoading,x.querySelector(".eg-chat-submit").disabled=a.isLoading,y.textContent=a.isLoading?"Respondiendo...":a.error||"",y.classList.toggle("eg-chat-status--visible",!!(a.isLoading||a.error)),H())}function H(){d&&(d.innerHTML="",a.messages.forEach(n=>{const o=r("div",{className:`eg-chat-row eg-chat-row--${n.role}`}),i=r("div",{className:`eg-chat-bubble eg-chat-bubble--${n.role}`});J(i,n.text),o.appendChild(i),d.appendChild(o)}),d.scrollTop=d.scrollHeight)}function J(n,o){String(o||"").split(`
`).filter((M,h,b)=>M.trim()||h<b.length-1).forEach(M=>{const h=M.trim();if(h.match(/^https?:\/\/\S+$/)){const k=h,D=r("button",{className:"eg-chat-link-button",text:k.includes("wa.me")?"Abrir WhatsApp":"Abrir enlace",type:"button"});D.addEventListener("click",$=>{$.preventDefault(),$.stopPropagation(),window.open(k,"_blank","noopener,noreferrer")||window.location.assign(k)}),n.appendChild(D);return}const L=r("p",{className:"eg-chat-paragraph",text:h||" "});n.appendChild(L)})}function Z(){a.isOpen||(w({isOpen:!0}),v("onOpen",{config:e}),requestAnimationFrame(()=>{p?.focus()}))}function E(){a.isOpen&&(w({isOpen:!1}),v("onClose",{config:e}))}function B(){if(a.isOpen){E();return}Z()}async function V(n){if(n.preventDefault(),a.isLoading||!p)return;const o=p.value.trim();if(o){I({id:crypto.randomUUID(),role:"user",text:o}),v("onMessageSent",{message:o}),p.value="",w({isLoading:!0,error:null});try{const i=await q(e.apiUrl,o);I({id:crypto.randomUUID(),role:"assistant",text:i}),v("onMessageReceived",{message:i}),w({isLoading:!1,error:null})}catch(i){const u=e.errorMessage;I({id:crypto.randomUUID(),role:"assistant",text:u}),w({isLoading:!1,error:"No se pudo completar la solicitud."}),v("onError",i)}}}function P(){s?.remove()}return{config:e,mount:Y,destroy:P,publicApi:{open:Z,close:E,toggle:B,destroy:P,getState:()=>({...a,messages:[...a.messages]})}}}function _(){return typeof window<"u"?window:typeof globalThis<"u"?globalThis:{}}const O=new Map;function A(t={}){const e=G(t);return e.mount(),e.config.containerId&&O.set(e.config.containerId,e),e.publicApi}function T(t){const e=O.get(t);return e?(e.destroy(),O.delete(t),!0):!1}const j={init:A,destroy:T},F=_();return F.EmbeddingGemmaChat=j,m.default=j,m.destroy=T,m.init=A,Object.defineProperties(m,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}}),m})({});
