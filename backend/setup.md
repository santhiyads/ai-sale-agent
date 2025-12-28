run backend : node server.js






cd backend
npm init -y
npm install express cors dotenv

folder structure
backend/
 ├── app.js
 ├── routes/
 │   └── chat.routes.js
 ├── controllers/
 │   └── chat.controller.js
 ├── services/
 ├── transformers/
 ├── rag/
 ├── enums/
 └── mock/


---------------------------------------------------------
 | Folder       | Why it exists                        |
| ------------ | ------------------------------------ |
| routes       | Only URL → controller mapping        |
| controllers  | Handle HTTP request & response       |
| services     | Business logic (chat flow, AI calls) |
| transformers | Convert raw API → AI-ready data      |
| rag          | Build AI context                     |
| enums        | Fixed values (chat states)           |
| mock         | Fake AdTip APIs for prototype        |
---------------------------------------------------------
*Routes should NOT contain logic
*Controller handles logic

---------------------------------

npm install dotenv


OpenAI Integration


1️⃣ Install OpenAI SDK

From backend folder:

npm install openai

2️⃣ Add Environment Variable

Create / update .env in backend:

OPENAI_API_KEY=your_api_key_here

