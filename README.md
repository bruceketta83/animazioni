# 🎞️ Animazioni di matematica

Brevi film animati per la scuola media: https://bruceketta83.github.io/animazioni/

| Animazione | Cartella | Durata |
| :--- | :--- | :--- |
| Il parallelogramma | [`parallelogramma/`](parallelogramma/) | 1:24 |

## Come aggiungere un'animazione

1. Crea una cartella con un nome corto, senza spazi: per esempio `trapezio/`.
2. Metti l'animazione in `trapezio/index.html`. L'indirizzo diventa `.../animazioni/trapezio/`.
3. Usa i font del repo: `<link rel="stylesheet" href="../fonts/fonts.css">`. Non usare Google Fonts o altri siti: il test lo segnala come errore.
4. Metti in alto il link `<a class="back" href="../">← Tutte le animazioni</a>`.
5. Tieni il lettore con gli stessi `id`: `#big` (pulsante grande), `#pp` (play/pausa), `#scrub` (barra), `#tc` (tempo), `#err` (messaggio senza WebGL2). Il test li usa.
6. Crea la copertina `img/trapezio.webp` (720 × 446) con un fotogramma significativo.
7. In `index.html` copia una scheda e cambia cartella, immagine e testi.
8. Nella pagina dei giochi (repo `bruceketta83.github.io`) aggiungi la scheda nella sezione "Animazioni".
9. Avvia i test: `npm test`.

## File

- `index.html`: la pagina con le schede delle animazioni.
- `fonts/`: Cormorant Garamond e Cormorant SC (SIL Open Font License 1.1), ridotti all'alfabeto latino.
- `img/`: le copertine.
- `tests/`: test automatici (Playwright). Per ogni scheda il test apre l'animazione, preme play e controlla che il tempo avanzi, che la tela sia disegnata e che non ci siano errori né file da altri siti.

## Crediti

Lo stile "Chinese Ink Wash" e il motore di pennello e carta di riso vengono dalla libreria [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) di Lemomo (LemoLab). Il codice del motore è sotto licenza MIT.
