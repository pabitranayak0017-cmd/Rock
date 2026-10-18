# Birthday Surprise — For My Dearest Sister 💖

A premium, interactive, single-page birthday surprise web application designed with modern glassmorphism UI, interactive canvas games, and smooth scene transitions.

---

### 🛠️ How to Open & Run in VS Code

#### Step 1: Open Project in VS Code
1. Open **VS Code**.
2. Click **File > Open Folder...** and select the root `birthday-surprise` folder.

#### Step 2: Install Live Server Extension
1. Click the **Extensions** icon on the left sidebar (or press `Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **Live Server** (by *Ritwick Dey*).
3. Click **Install**.

#### Step 3: Run the Website
1. Right-click on `index.html` in the VS Code File Explorer.
2. Click **Open with Live Server**.
3. Your default browser will launch the website automatically!

---

### 📷 How to Add Your Photos & Media

Place your personal files inside the `assets/` subfolders:

- **Gallery Photos:** Add 4 photos inside `assets/photos/` named `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, and `photo4.jpg`.
- **Puzzle Photo:** Add a square image inside `assets/photos/` named `puzzle.jpg`.
- **Background Song:** Add your MP3 file inside `assets/music/` named `birthday-song.mp3`.
- **Memory Video (Optional):** Add an MP4 video inside `assets/video/` named `memory.mp4`.

*(Note: If any photo or audio file is missing, built-in visual SVG fallbacks will seamlessly prevent any app errors!)*

---

### ✏️ How to Customize Sister Name, Passcode & Letter

All personalizations are conveniently located at the top of **`js/script.js`**:

```javascript
const birthdayConfig = {
    sisterName: "Ananya",     // Change Sister Name
    nickname: "Cutiepie",     // Change Nickname
    birthday: "22 April",     // Change Birthday Date
    passcode: "2204",         // Change Security PIN
    yourName: "Your Brother", // Change Your Name
    
    // Add custom memory captions or wishes directly inside this config!
};