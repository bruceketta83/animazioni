// Pagina iniziale e contenuti: ogni scheda porta a una pagina che si apre e funziona senza errori.
// Ogni scheda ha data-tipo: "film" (lettore a inchiostro), "video" (file MP4) o "interattivo".
const { test, expect } = require('@playwright/test');

function watch(page) {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => {
    // Il browser interrompe da solo lo scaricamento del video quando ha i dati che servono.
    if (r.url().endsWith('.mp4') && /ERR_ABORTED/.test(r.failure()?.errorText || '')) return;
    errors.push(`richiesta fallita: ${r.url()}`);
  });
  // Tutto deve arrivare da questo sito: niente font o librerie da altri server.
  page.on('request', r => {
    const u = r.url();
    if (!u.startsWith('http://localhost:4174/') && !u.startsWith('data:') && !u.startsWith('blob:')) errors.push(`file esterno: ${u}`);
  });
  return errors;
}

// Conta i pixel diversi dallo sfondo in una tela (64 × 36 campioni).
async function inkedPixels(canvas, dark = true) {
  return canvas.evaluate((c, dark) => {
    const o = document.createElement('canvas'); o.width = 64; o.height = 36;
    const x = o.getContext('2d'); x.drawImage(c, 0, 0, 64, 36);
    const d = x.getImageData(0, 0, 64, 36).data; let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const s = d[i] + d[i + 1] + d[i + 2];
      if (dark ? s < 450 : s > 200) n++;
    }
    return n;
  }, dark);
}

async function cards(page) {
  await page.goto('./');
  return page.locator('a.card').evaluateAll(as => as.map(a => ({ href: a.getAttribute('href'), tipo: a.dataset.tipo })));
}

test('la pagina iniziale mostra le schede senza errori', async ({ page }) => {
  const errors = watch(page);
  const list = await cards(page);
  expect(list.length).toBeGreaterThan(0);
  for (const c of list) expect(['film', 'video', 'interattivo'], c.href).toContain(c.tipo);
  for (const img of await page.locator('a.card img').all()) {
    expect(await img.evaluate(i => i.complete && i.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test('ogni film si apre, parte e disegna', async ({ page }) => {
  for (const { href } of (await cards(page)).filter(c => c.tipo === 'film')) {
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
    expect(await inkedPixels(page.locator('canvas')), href).toBeGreaterThan(5);
    expect(await page.locator('a.back').getAttribute('href')).toBe('../');
    expect(errors, href).toEqual([]);
    page.removeAllListeners();
  }
});

test('ogni video si carica e ha la sua copertina', async ({ page }) => {
  for (const { href } of (await cards(page)).filter(c => c.tipo === 'video')) {
    const errors = watch(page);
    await page.goto(href);
    const video = page.locator('video');
    await expect(video).toBeVisible();
    // I dati del video (durata) arrivano subito: il file è pronto per lo streaming.
    await page.waitForFunction(() => document.querySelector('video').readyState >= 1, null, { timeout: 15000 });
    expect(await video.evaluate(v => v.duration), href).toBeGreaterThan(10);
    const poster = await video.evaluate(v => v.poster);
    expect((await page.request.get(poster)).ok(), href).toBe(true);
    expect(await page.locator('a.back').getAttribute('href')).toBe('../');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), href).toBeLessThanOrEqual(0);
    expect(errors, href).toEqual([]);
    page.removeAllListeners();
  }
});

test('ogni pagina interattiva si apre e risponde', async ({ page }) => {
  for (const { href } of (await cards(page)).filter(c => c.tipo === 'interattivo')) {
    const errors = watch(page);
    await page.goto(href);
    await expect(page.locator('canvas').first()).toBeVisible();
    // Gli stili sono nella pagina: lo sfondo ha il suo colore anche senza rete.
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    // Si passa all'ultimo passo e la tela disegna qualcosa di chiaro sul fondo scuro.
    const last = page.locator('button[id^="btn-step-"]').last();
    if (await last.count()) await last.click();
    await page.waitForTimeout(1200);
    expect(await inkedPixels(page.locator('canvas').first(), false), href).toBeGreaterThan(5);
    expect(await page.locator('a.back').getAttribute('href')).toBe('../');
    expect(errors, href).toEqual([]);
    page.removeAllListeners();
  }
});
