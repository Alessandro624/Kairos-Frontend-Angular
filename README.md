# Kairos Frontend

## Descrizione

Frontend del progetto **Kairos** – Piattaforma di gestione e prenotazione eventi.

---

## Requisiti di sistema

- Node.js (versione consigliata: ultima LTS, per lo sviluppo)
- npm (incluso con Node.js, per lo sviluppo)

## Struttura dell'environment-scheme

L'applicazione utilizza un sistema di configurazione ambientale definito in `src/environments/environment.schema.ts`. Questo file contiene le configurazioni base che possono essere estese per diversi ambienti (sviluppo, produzione, ecc.).

``` typescript
export const API_BASE_PATH = 'api';

export const environment = {
  production: false
};
```

Questo schema definisce:

- `API_BASE_PATH`: il percorso base per le chiamate API
- `environment.production`: flag che indica se l'applicazione è in modalità produzione

## Installazione

### 1. Clona il repository

``` bash
git clone [url-del-repository]
```

### 2. Rinomina il file `src/environments/environment.schema.ts` in `src/environments/environment.ts`

### 3. Installa le dipendenze

``` bash
npm install
```

## Avvio dell'applicazione

Per avviare l'applicazione in modalità sviluppo:

``` bash
ng serve
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:4200/`.

## Struttura del progetto

- `src/`: contiene il codice sorgente dell'applicazione

  - `environments/`: contiene i file di configurazione ambientale
  - `app/`: contiene i componenti, servizi e moduli dell'applicazione

- `public/`: contiene file statici accessibili pubblicamente
- `.angular/`: contiene file generati da Angular CLI
- `.vscode/`: contiene configurazioni per Visual Studio Code
