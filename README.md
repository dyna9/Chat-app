# Chat App 💬

Eine Echtzeit-Chat-Anwendung mit Dark Blue/Black Design, mehreren Channels und Admin-Panel.

## Features ✨

- ✅ Echtzeit-Chat mit WebSockets (Socket.io)
- ✅ Zwei Channels: #general und #staff
- ✅ Authentifizierung (Register/Login)
- ✅ Owner-System (erster User = Owner)
- ✅ Admin-Panel zur Mod-Verwaltung
- ✅ Dark Blue/Black Design
- ✅ Benutzer-Management
- ✅ Message-History

## Tech Stack 🛠️

### Frontend
- React
- Socket.io Client
- Axios
- CSS (Dark Blue/Black Theme)

### Backend
- Node.js
- Express
- Socket.io
- MongoDB
- JWT Authentication
- Bcrypt für Passwort-Hashing

## Installation 📦

### Prerequisites
- Node.js >= 14
- MongoDB (lokal oder Atlas)

### Backend Setup

```bash
cd backend
npm install
npm start
```

Backend läuft auf: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend läuft auf: `http://localhost:3000`

## Umgebungsvariablen 🔑

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Nutzung 🎯

1. **Registrieren**: Neuer Account erstellen (erster User wird Owner)
2. **Login**: Mit Credentials einloggen
3. **Chat**: In #general chatten
4. **Admin-Panel**: Als Owner/Mod ins Admin-Panel gehen (nur für Owner/Mods sichtbar)
5. **Mods verwalten**: Owner kann Mods hinzufügen/entfernen
6. **Staff Chat**: Owner und Mods können #staff-Channel nutzen

## Project Structure 📁

```
chat-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
└── README.md
```

## License 📄

MIT
