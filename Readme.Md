# ayo_hopeleaks Discord Bot

Willkommen bei **ayo remake**!  
Dies ist ein moderner Discord-Bot für Moderation, Support, Logging, Tickets, Verifizierung und viele weitere Features – perfekt für deinen Community-Server.

---

## Features

- **Slash Commands** (`/ban`, `/unban`, `/lock`, `/unlock`, `/setup_supportnotify`, uvm.)
- **Ticket-System** und Vorschläge
- **Support-Benachrichtigungen** (Voice + Log)
- **Logging** (Channels, Rollen, Nachrichten, Voice, uvm.)
- **Verifizierungssystem**
- **Abmeldesystem** für Teammitglieder
- **Rollenvergabe via Button**
- **Einfach konfigurierbar über `config.json`**

---

## Installation

### Voraussetzungen

- Node.js **v18** oder neuer
- Einen Discord Bot-Account (Token)  
  [Bot erstellen & Token generieren → Discord Developer Portal](https://discord.com/developers/applications)

### 1. Bot clonen

```bash
git clone https://github.com/6nte/ayo_hopeleaks.git
cd ayo_hopeleaks
```

### 2. Abhängigkeiten installieren

```bash
npm install
```

### 3. Konfiguration

Bearbeite die Datei **`config.json`** und trage deine Werte ein:

- `token`: **Bot Token** aus dem Discord Developer Portal
- `clientId`: Die Client-ID deines Bots
- `guildId`: Die Server-ID, auf dem der Bot genutzt wird
- `adminRoleId`: Die ID der Admin-Rolle, die Befehle wie `/ban` & `/setup_supportnotify` ausführen darf
- Weitere Channel-, Rollen- und Log-IDs (je nach Feature)

**Beispiel:**
```json
{
  "token": "DEIN_DISCORD_BOT_TOKEN",
  "clientId": "BOT_CLIENT_ID",
  "guildId": "SERVER_ID",
  "adminRoleId": "ADMIN_ROLE_ID",
  ...
}
```

> **Tipp:** IDs findest du in Discord mit Entwickler-Modus (Rechtsklick auf Rolle/Channel → ID kopieren).

---

## Starten des Bots

```bash
node index.js
```

Der Bot sollte nun online gehen und die Konsole zeigt "Ready! Logged in as ...".

---

## Slash Commands & Features

| Command                  | Beschreibung                                               | Wer darf ausführen      |
|--------------------------|------------------------------------------------------------|-------------------------|
| `/ban`                   | Bannt einen User mit Grund                                 | Admin                   |
| `/unban`                 | Entbannt einen User per User-ID                            | Admin                   |
| `/lock` / `/unlock`      | Channel sperren/entsperren                                 | Admin                   |
| `/setup_supportnotify`   | Support-Voice & Log-Channel konfigurieren *(einmalig)*     | Admin                   |
| `/resetsupportnotify`    | Supportnotify-Einstellungen zurücksetzen                   | Admin                   |
| `/sendticket`            | Ticket-System Panel senden                                 | Admin                   |
| `/sendverify`            | Verifizierungs-Panel senden                                | Admin                   |
| `/vorschlag`             | Vorschlag einreichen                                       | Jeder                   |
| uvm.                     | ...weitere Commands siehe `/commands/`                     |                         |

---

## SupportNotify & Logging

- **/setup_supportnotify [VoiceChannel] [LogChannel]**  
  Richtet fest ein, dass beim Joinen des VoiceChannels eine Nachricht ins LogChannel gesendet wird.
- **/resetsupportnotify**  
  Schaltet das Feature wieder frei für neue Einrichtung.

---

## Eigene Commands hinzufügen

Lege eine neue Datei in `/commands/` an.  
Beispielstruktur siehe vorhandene Commands wie `ban.js`.

---

## Fehlerbehebung

- Prüfe, ob dein Bot die richtigen Berechtigungen und Intents hat.
- Konfiguration (`config.json`) muss gültig und vollständig sein.
- Für Support: [Discord Support](https://discord.gg/hope-leaks) oder Issues im Repo erstellen.

---

## Credits

- Bot von @entezx & @affezx  
- Template und Weiterentwicklung: [Hopeleaks](https://discord.gg/hope-leaks)
- **Bitte Credits erhalten, wenn du diesen Bot benutzt!**

---

Viel Spaß mit ayo_hopeleaks!