# Regole di lavoro — Progetto Roelmi (Redesign Sito)

## Regole fondamentali di sviluppo

### Struttura file
- Creare sempre file separati per ogni sezione o componente
- Non creare mai un unico file HTML monolitico con tutto il codice
- CSS separato per ogni sezione, mai tutto in un solo foglio stile
- JS separato e modulare, mai inline nell'HTML salvo casi eccezionali

### Approccio per sessione
- Lavorare su una sezione/file alla volta
- Completare e verificare ogni file prima di passare al successivo
- Ogni sessione ha un obiettivo chiaro e circoscritto

### Struttura cartelle del progetto
```
/SITO
  index.html
  CLAUDE.md
  /css
    reset.css
    base.css
    header.css
    hero.css
    footer.css
    (altri file per sezione)
  /js
    main.js
    (altri file per funzionalità)
  /images
  /fonts
```

### Collegamento dei file
- Usare sempre `<link>` nell'`index.html` per i CSS
- Usare sempre `<script src="...">` per i JS
- Mantenere l'`index.html` snello: solo struttura e riferimenti ai file esterni

## Regole di comunicazione

- Procedere passo per passo, senza anticipare sezioni non ancora richieste
- Prima di iniziare una nuova sezione, confermare con l'utente
- Se una scelta stilistica è ambigua, chiedere prima di implementare
- Segnalare sempre quale file si sta creando o modificando

## Informazioni progetto (da completare)

- **Cliente:** Roelmi
- **Tipo sito:** Redesign sito
- **Sezioni previste:** da definire
- **Palette colori:** da definire
- **Font:** da definire
- **Stile:** da definire
- **Lingue:** da definire

## Note aggiornate in corso d'opera

_(aggiornare man mano che emergono decisioni di progetto)_
