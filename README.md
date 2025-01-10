# Task-Planner-and-Tracker

## Obiectiv

Realizarea unei aplicații web care permite alocarea și monitorizarea realizării task-urilor, cu funcționalități specifice pentru **administratori**, **manageri** și **executanți**, oferind o experiență optimizată pentru desktop, dispozitive mobile și tablete.

---

## Funcționalități

### Gestionare utilizatori

- **Administrator**:
  - Poate adăuga utilizatori noi (manageri și executanți).
  - Atribuie fiecărui executant un manager.

- **Manager**:
  - Poate vizualiza și administra lista de utilizatori pe care îi gestionează.

- **Executant**:
  - Poate consulta doar informațiile proprii și lista de task-uri alocate.

### Gestionare task-uri

- **Creare task**:
  - Managerul creează un task cu descriere detaliată, inițial în starea `OPEN`.

- **Alocare task**:
  - Managerul alocă un task unui executant, schimbând starea task-ului în `PENDING`.

- **Rezolvarea task-urilor**:
  - Executantul marchează un task ca fiind realizat (`COMPLETED`).

- **Finalizare task**:
  - Managerul poate închide un task `COMPLETED`, schimbând starea în `CLOSED`.

- **Consultarea istoricului**:
  - Executantul poate vedea istoricul task-urilor proprii.
  - Managerul poate consulta istoricul task-urilor unui executant.

---

## Tehnologii utilizate

- **Frontend**:
  - HTML5, CSS3 și JavaScript pentru interfața utilizatorului.
  - Framework SPA bazat pe React.js.

- **Backend**:
  - Node.js cu Express pentru gestionarea API-ului RESTful.
  - Sequelize pentru maparea obiect-relațională (ORM).
  - MySQL pentru gestionarea datelor relaționale.

---

## Arhitectură

### Fluxul datelor

1. **Frontend**:
   - Realizează cereri HTTP către backend printr-un API RESTful.
   - Actualizează interfața în timp real pentru o experiență de tip SPA.

2. **Backend**:
   - Gestionează operațiunile CRUD pentru utilizatori și task-uri.
   - Controlează accesul la date în funcție de roluri (administrator, manager, executant).

3. **Baza de date**:
   - Relatională (**MySQL**), cu tabele pentru utilizatori, task-uri și relațiile dintre ele.

---
  
## Instrucțiuni de rulare
1. Clonați repository-ul cu proiectul.
2. Creați în directorul `client` un fișier `.env` cu informațiile serverului.
3. Creați în directorul `server` un fișier `.env` cu informațiile bazei de date.
4. Din directorul `client` rulați `npm install`.
5. Din directorul `client` rulați `npm run dev`.
6. Din directorul `server` rulați `npm install`.
7. Din directorul `server` rulați `npm run dev`.
8. Accesați aplicația în browser la: https://localhost:5173.
