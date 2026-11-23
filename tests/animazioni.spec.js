// Pagina iniziale e animazioni: ogni scheda porta a un'animazione che si apre e parte senza errori.
const { test, expect } = require('@playwright/test');

function watch(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => errors.push(`richiesta fallita: ${r.url()}`));
  // Tutto deve arrivare da questo sito: niente font o librerie da altri server.
  page.on('request', r => { if (!r.url().startsWith('http://localhost:4174/') && !r.url().startsWith('data:')) errors.push(`file esterno: ${r.url()}`); });
  return errors;
}

test('la pagina iniziale mostra le schede senza errori', async ({ page }) => {
  const errors = watch(page);
  await page.goto('./');
  const cards = page.locator('a.card');
  expect(await cards.count()).toBeGreaterThan(0);
  for (const img of await page.locator('a.card img').all()) {
    expect(await img.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('ogni animazione si apre, parte e disegna', async ({ page }) => {
  await page.goto('./');
  const links = await page.locator('a.card').evaluateAll(as => as.map(a => a.getAttribute('href')));
  for (const href of links) {
    const errors = watch(page);
    await page.goto(href);
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('#err')).toBeHidden();
    await page.click('#big');
    // Il tempo avanza (nel browser dei test, senza scheda video, il film va più lento).
    await expect(page.locator('#pp')).toHaveAttribute('aria-label', 'Pausa');
    await page.waitForFunction(() => !/^0:00 \//.test(document.getElementById('tc').textContent), null, { timeout: 20000 });
    // A metà film la tela non è vuota: ci sono pixel più scuri della carta.
    await page.evaluate(() => { const s = document.getElementById('scrub'); s.value = 500; s.dispatchEvent(new Event('input')); });
    await page.waitForTimeout(800);
    const inked = await page.locator('canvas').evaluate(c => {
      const o = document.createElement('canvas'); o.width = 64; o.height = 36;
      const x = o.getContext('2d'); x.drawImage(c, 0, 0, 64, 36);
      const d = x.getImageData(0, 0, 64, 36).data; let dark = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] + d[i + 1] + d[i + 2] < 450) dark++;
      return dark;
    });
    expect(inked, href).toBeGreaterThan(5);
    expect(await page.locator('a.back').getAttribute('href')).toBe('../');
    expect(errors, href).toEqual([]);
    page.removeAllListeners('request'); page.removeAllListeners('requestfailed'); page.removeAllListeners('pageerror'); page.removeAllListeners('console');
  }
});
