<template>
  <div class="edwin-page" lang="es">
<header>
<nav>
<img alt="BrasPer Transferencias - logo oficial" :src="logo"/>
<a class="link" href="https://brasper.com" rel="noopener" target="_blank">Sitio oficial ↗</a>
</nav>
</header>
<section class="hero">
<div class="wrap">
<div class="tag">Perú ↔ Brasil · Conexiones que acercan</div>
<h1>Conectemos oportunidades entre Perú y Brasil.</h1>
<p>En BrasPer facilitamos transferencias de dinero entre ambos países, con atención cercana y soluciones para quienes necesitan estar conectados.</p>
<a class="button" href="https://wa.me/51966991933?text=Hola%2C%20Edwin.%20Nos%20conocimos%20en%20el%20evento%20y%20me%20gustar%C3%ADa%20conversar%20sobre%20BrasPer%20Transferencias%20y%20posibles%20oportunidades%20de%20colaboraci%C3%B3n." rel="noopener" target="_blank">Hablemos por WhatsApp ↗</a>
</div>
</section>
<main class="main">
<section class="panel">
<div class="tag" style="color:#1974a8">Quiénes somos</div>
<h2>Más que transferencias, conexiones.</h2>
<p>Conectamos a personas y empresas entre Perú y Brasil. Queremos conocer oportunidades de colaboración y construir relaciones comerciales de valor.</p>
<div class="features">
<div class="feature">
<b>↔ Transferencias</b>
<p>Soluciones para enviar dinero entre Perú y Brasil.</p>
</div>
<div class="feature">
<b>🤝 Alianzas</b>
<p>Conversemos sobre colaboraciones y convenios.</p>
</div>
<div class="feature">
<b>💬 Atención humana</b>
<p>Te orientamos en tus consultas.</p>
</div>
</div>
<section class="person">
<img alt="Foto profesional de Edwin Lizarbe" :src="portrait"/>
<div>
<h3>Edwin Lizarbe</h3>
<p>Marketing &amp; Performance · Representante de BrasPer</p>
<p>Contacto para networking y oportunidades de colaboración.</p>
<a class="button" href="https://wa.me/51966991933?text=Hola%2C%20Edwin.%20Nos%20conocimos%20en%20el%20evento%20y%20me%20gustar%C3%ADa%20conversar%20sobre%20BrasPer%20Transferencias%20y%20posibles%20oportunidades%20de%20colaboraci%C3%B3n." rel="noopener" target="_blank">Contactar por WhatsApp ↗</a>
</div>
</section>
</section>
</main>
<footer>BrasPer Transferencias · Presentación corporativa</footer>
</div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSeo } from '@/interface/presentation/composables/useSeo'
import { i18n } from '@/interface/presentation/i18n'
import logo from '@/assets/images/edwin-lizarbe/brasper-logo.png'
import portrait from '@/assets/images/edwin-lizarbe/edwin-lizarbe.jpg'

// Esta presentación tiene contenido fijo en español, sin prefijo de idioma.
i18n.global.locale.value = 'es'
useSeo({
  title: 'BrasPer | Conectemos',
  description: 'BrasPer Transferencias: contactos y alianzas entre Perú y Brasil',
  image: portrait
})
onMounted(() => {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#071e54')
})
</script>
<style scoped>
.edwin-page{font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;color:#14284f;background:#f1f6fd}*{box-sizing:border-box}a{color:inherit}header{padding:14px 5vw;background:#fff}nav{max-width:1024px;display:flex;align-items:center;justify-content:space-between;margin:auto;gap:15px}nav img{width:min(210px,48vw);height:auto;display:block}.link{font-size:13px;text-decoration:none;font-weight:700;color:#0a4288}.hero{background:linear-gradient(130deg,#071e54,#0c4a95);color:white;padding:65px 6vw 105px}.wrap{max-width:1024px;margin:auto}.tag{font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#90ddfa;font-weight:800}h1{font-size:clamp(34px,5vw,60px);line-height:1.12;max-width:820px;margin:15px 0 17px}p{line-height:1.65;margin:1em 0}.hero p{max-width:750px;color:#e0ecfc;font-size:18px}.button{display:inline-block;background:#55cdf5;color:#061c3a;padding:15px 20px;border-radius:12px;text-decoration:none;font-weight:800;text-align:center}.hero .button{margin-top:16px}.main{max-width:1024px;margin:-55px auto 50px;padding:0 18px}.panel{background:white;padding:clamp(22px,4vw,42px);border-radius:20px;box-shadow:0 12px 40px #10265b16}h2{font-size:29px;margin:4px 0 9px}.panel>p{color:#4f5e77}.features{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:25px 0}.feature{background:#f0f6fd;padding:20px;border-radius:13px}.feature b{display:block;margin-bottom:8px}.feature p{margin:0;color:#566781;font-size:14px}.person{display:flex;gap:22px;align-items:center;background:#eaf5fe;border-radius:16px;padding:22px;margin-top:28px}.person img{width:140px;height:168px;object-fit:cover;object-position:center 27%;border-radius:15px;background:#091c38}.person h3{font-size:23px;margin:0 0 5px}.person p{margin:0 0 15px;color:#4c617e}.person .button{font-size:14px}footer{text-align:center;padding:8px 15px 28px;font-size:13px;color:#687a92}@media(max-width:640px){.hero{padding:49px 23px 92px}.features{grid-template-columns:1fr}.person{flex-direction:column;text-align:center}.person img{width:145px;height:174px}.person .button{display:block}}

h1,h2,h3,b{font-weight:700}h1,h2,h3,p{padding:0}.edwin-page{min-height:100vh;font-size:16px;line-height:normal}a:focus-visible{outline:3px solid #1974a8;outline-offset:4px}
</style>


