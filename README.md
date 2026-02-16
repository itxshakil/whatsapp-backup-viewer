# 📱 WhatsApp Backup Viewer & Analyzer

Explore and analyze your WhatsApp chat exports securely in your browser. Private, local-first, and feature-rich.

![WhatsApp Viewer](https://img.shields.io/badge/Privacy-First-075e54?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

---

## ✨ Features

- **🔒 Privacy First**: All processing happens locally in your browser. Your chat data is never uploaded to any server.
- **📁 Full Support**: Handles both `.txt` exports and `.zip` archives (with media support).
- **💬 WhatsApp-Like UI**: A familiar interface with chat bubbles, system messages, and date headers.
- **🖼️ Media Gallery**: Browse all photos, videos, and documents from your chat in one place.
- **📊 Chat Analytics**: Get insights into message frequency, busiest hours, most used emojis, and top words.
- **🔍 Smart Search**: Easily find specific messages with keyword highlighting and quick navigation.
- **🌓 Dark Mode**: Fully compatible with both light and dark themes, following your system preferences or manual toggle.
- **💾 Local Persistence**: Saves your chats securely in your browser's local storage (IndexedDB) for quick access later.
- **📱 PWA Ready**: Install it as a desktop or mobile app for a seamless experience.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shakila/whatsapp-backup-viewer.git
   cd whatsapp-backup-viewer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📖 How to Use

### 1. Export your WhatsApp Chat
- **iOS**: Open the chat > Tap on Contact/Group Name > **Export Chat** > **Attach Media**.
- **Android**: Open the chat > Three dots (Menu) > **More** > **Export Chat** > **Include Media**.
- **Tip**: Choose "Attach/Include Media" if you want to see photos and videos in the viewer.

### 2. View your Backup
- Open the application.
- Drag and drop your exported `.zip` file or `_chat.txt` file onto the upload zone.
- Your chat will be parsed and rendered in a WhatsApp-like interface.

---

## 🛠️ Built With

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **Vite** - Build Tool
- **Lucide React** - Icon Set
- **Dexie.js** - IndexedDB Wrapper for local storage
- **JSZip** - For processing .zip exports
- **Day.js** & **date-fns** - Date and time manipulation

---

## 🛡️ Privacy & Security

We take your privacy seriously. This application is a "Static Site" with no backend server. 
- **No data is uploaded**: All file parsing and rendering happen on your local machine.
- **Local Storage**: If you choose to "Save to browser storage", the data is stored in your browser's IndexedDB, which is only accessible by you on that specific browser.
- **Open Source**: You can audit the code yourself to ensure no data is being sent elsewhere.

---

## 🤝 Contributing

Contributions are welcome! If you have a feature request or found a bug, please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Disclaimer: This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or Meta Platforms, Inc.*
