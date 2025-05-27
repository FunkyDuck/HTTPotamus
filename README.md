# 🦛 HTTPotamus

**HTTP requests, served hot.**
HTTPotamus est un client HTTP léger, rapide et accessible, pour tester, sauvegarder et rejouer des requêtes — dans le navigateur ou en version desktop.

Développé avec Angular & Tauri, il mise sur la simplicité, sans sacrifier la puissance.

---

## 📚 Sommaire

* [Fonctionnalités](#-fonctionnalités)
* [Développement](#-développement)
* [Build](#-build)
* [Stack technique](#-stack-technique)
* [Roadmap](#-roadmap)
* [Licence](#-licence)

---

## 🚀 Fonctionnalités

* 🔥 Envoi de requêtes HTTP (GET, POST, PUT, DELETE, etc.)
* 🗾 Affichage structuré des réponses (code, en-têtes, JSON…)
* 📂 Sauvegarde locale via **IndexedDB (OpenDB)**
* 🔓 Historique consultable et requêtes favorites
* 📄 Export / import de collections
* 🌃 **Mode sombre, parce que les devs méritent un peu de confort**
* 💽 Fonctionne en **web app** et **app desktop légère (Tauri)**
* 🧘 Ultra léger, sans pub, sans tracking, juste toi et tes requêtes

---

## 🛠️ Développement

### Lancer en local

```bash
git clone https://github.com/FunkyDuck/HTTPotamus.git
cd HTTPotamus
npm install
npm start
```

Puis ouvre [http://localhost:4200](http://localhost:4200) dans ton navigateur.

### Version desktop (Tauri)

> Nécessite Node.js, Rust, et le CLI Tauri (`cargo install create-tauri-app`)

```bash
npm run tauri dev
```

---

## 📆 Build

### Web

```bash
npm run build
```

Le build se trouve dans `dist/`.

### Desktop

```bash
npm run tauri build
```

Tu obtiendras un exécutable natif (Windows, macOS, Linux selon la plateforme).

---

## 🧠 Stack technique

* **Angular 18.1.3**
* **Tauri** pour la version desktop
* **IndexedDB** via OpenDB
* **TypeScript**

---

## 📌 Roadmap

* [x] App desktop (Tauri)
* [x] Historique et favoris
* [x] Export / import de données
* [ ] Organisation des requêtes
* [ ] UI/UX polishing
* [ ] Système de plugins (en réflexion)

---

## 📄 Licence

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) MIT — ![Angular](https://img.shields.io/badge/Angular-18.1.3-DD0031?logo=angular&logoColor=white) — [@FunkyDuck](https://github.com/FunkyDuck)
