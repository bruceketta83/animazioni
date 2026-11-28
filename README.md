# 🎞️ Animazioni e video

Film, video e laboratori interattivi per la scuola media: https://bruceketta83.github.io/animazioni/

| Titolo | Cartella | Tipo | Durata |
| :--- | :--- | :--- | :--- |
| Il parallelogramma | [`parallelogramma/`](parallelogramma/) | film | 1:24 |
| I triangoli | [`triangoli/`](triangoli/) | video | 1:30 |
| La regola dell'ottetto | [`ottetto/`](ottetto/) | interattivo | – |
| L'Europa, penisola di penisole (in inglese) | [`europa/`](europa/) | video | 2:00 |
| Viaggio dentro la materia: l'atomo | [`atomo/`](atomo/) | video | 1:46 |
| Atomi e legami chimici | [`legami/`](legami/) | video | 3:00 |

## Come aggiungere un contenuto

Ogni contenuto ha una cartella con un nome corto, senza spazi (per esempio `trapezio/`). L'indirizzo diventa `.../animazioni/trapezio/`. Ogni scheda in `index.html` ha `data-tipo`: il test controlla ogni tipo in modo diverso.

### Film (`data-tipo="film"`)

1. Metti il film in `trapezio/index.html`.
2. Usa i font del repo: `<link rel="stylesheet" href="../fonts/fonts.css">`.
3. Metti in alto il link `<a class="back" href="../">← Tutte le animazioni</a>`.
4. Tieni il lettore con gli stessi `id`: `#big`, `#pp`, `#scrub`, `#tc`, `#err`.

### Video MP4 (`data-tipo="video"`)

1. Copia `triangoli/index.html` nella cartella nuova e cambia titolo e testi.
2. Prepara il video per lo streaming, senza ricodificarlo: `ffmpeg -i originale.mp4 -c copy -movflags +faststart trapezio/video.mp4`.
3. Crea la copertina del lettore: `ffmpeg -ss 30 -i trapezio/video.mp4 -frames:v 1 trapezio/poster.webp`.
4. Tieni ogni video sotto i 50 MB (GitHub rifiuta i file sopra i 100 MB).

### Pagina interattiva (`data-tipo="interattivo"`)

1. Metti la pagina in `trapezio/index.html`, con il link `<a class="back" href="../">`.
2. Non caricare niente da altri siti: niente `cdn.tailwindcss.com`, niente Google Fonts. Il test lo segnala come errore.
3. Se la pagina usa Tailwind, genera il CSS una volta sola e mettilo nella pagina (vedi `ottetto/`): `npx tailwindcss@3 -o out.css --content trapezio/index.html --minify`.

### Per tutti

1. Crea la copertina `img/trapezio.webp` (720 × 446) con un fotogramma significativo.
2. In `index.html` copia una scheda e cambia cartella, `data-tipo`, immagine e testi.
3. Nella pagina dei giochi (repo `bruceketta83.github.io`) aggiungi la scheda nella sezione "Animazioni e video".
4. Avvia i test: `npm test`.

## File

- `index.html`: la pagina con le schede.
- `video.css`: lo stile delle pagine dei video.
- `fonts/`: Cormorant Garamond e Cormorant SC (SIL Open Font License 1.1), ridotti all'alfabeto latino. Licenza di Plus Jakarta Sans, incorporato in `ottetto/`.
- `img/`: le copertine.
- `tests/`: test automatici (Playwright). Per ogni scheda il test apre la pagina e controlla che funzioni secondo il suo tipo, senza errori e senza file da altri siti.

## Crediti

Per il parallelogramma, lo stile "Chinese Ink Wash" e il motore di pennello e carta di riso vengono dalla libreria [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) di Lemomo (LemoLab). Il codice del motore è sotto licenza MIT.

La regola dell'ottetto usa stili generati con [Tailwind CSS](https://tailwindcss.com) 3.4 (licenza MIT) e il font Plus Jakarta Sans (SIL Open Font License 1.1).
