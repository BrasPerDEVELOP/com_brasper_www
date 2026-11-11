import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'

const assets = readdirSync('dist/assets').filter((file) => file.endsWith('.js'))
const js = assets.map((file) => readFileSync(`dist/assets/${file}`, 'utf8')).join('\n')
assert.ok(!js.includes('MARINA25'), 'A hardcoded coupon remains in the build')
assert.ok(js.includes('/coupons/automatic'), 'Automatic API coupons must remain enabled')
assert.ok(js.includes('apibras.finzeler.com'), 'The production API must remain configured')
for (const locale of ['es', 'en', 'br']) {
  const html = readFileSync(`dist/${locale}/index.html`, 'utf8')
  assert.ok(html.includes('src="/promocion/assets/'), 'JS must load under /promocion/')
  assert.ok(html.includes(`https://brasper.com/promocion/${locale}`), 'Canonical must include the base path')
  assert.ok(html.includes('noindex,nofollow'), 'The test page must remain noindex')
  const file = locale === 'br' ? 'pr' : locale
  assert.ok(existsSync(`dist/assets/images/promocion/${file}.png`), 'Localized promotion image missing')
}
console.log('Promotion build verified: base path, three banners, API coupons and no fixed coupon.')
