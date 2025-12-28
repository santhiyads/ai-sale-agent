 Local:   http://localhost:5173/
S
run front end :npm run dev



cd frontend
npm create vite@latest
![alt text]({3BF9299A-D4B1-4BB2-A8BD-582ABA13DDDC}.png)
# choose React + JavaScript
npm install
npm run dev


frontend/
 ├── src/
 │   ├── App.jsx
 │   └── main.jsx
 └── package.json


frontend/
 ├── src/
 │   ├── pages/
 │   │   └── AdDemoPage.jsx     ← main demo screen
 │   ├── components/
 │   │   ├── VideoPlayer.jsx
 │   │   ├── ChatBubble.jsx
 │   │   ├── Message.jsx
 │   │   └── TypingIndicator.jsx
 │   ├── styles/
 │   │   └── chat.css
 │   └── services/
 │       └── chatApi.js
--------------------------------------