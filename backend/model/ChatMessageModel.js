const db = require("../config/db");

const ChatMessageModel = {
  async save({ sessionId, role, content, intent = null }) {
    await db.query(
      `INSERT INTO chat_messages (session_id, role, content, intent)
       VALUES (?, ?, ?, ?)`,
      [sessionId, role, content, intent]
    );
  },

  async getLastMessages(sessionId, limit = 6) {
    const [rows] = await db.query(
      `SELECT role, content
       FROM chat_messages
       WHERE session_id = ?
       ORDER BY created_at DESC
       LIMIT ?`,
      [sessionId, limit]
    );
    return rows.reverse(); // keep chat order
  }
};

module.exports = ChatMessageModel;
