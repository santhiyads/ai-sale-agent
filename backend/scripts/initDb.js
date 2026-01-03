require("dotenv").config();
const db = require("../config/db");

async function initDb() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(64) UNIQUE NOT NULL,
        campaign_id BIGINT NOT NULL,
        company_id BIGINT NOT NULL,
        current_state VARCHAR(32) DEFAULT 'INIT',
        is_completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(64) NOT NULL,
        role ENUM('user','assistant') NOT NULL,
        content TEXT NOT NULL,
        intent VARCHAR(50) NULL,
        input_type ENUM('text','voice') DEFAULT 'text',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX(session_id)
      )
    `);

    console.log("✅ DB initialized");
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

initDb();
