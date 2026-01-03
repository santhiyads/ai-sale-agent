const db = require("../config/db");

const ChatSessionModel = {
  async findBySessionId(sessionId) {
    const [rows] = await db.query(
      "SELECT * FROM chat_sessions WHERE session_id = ? LIMIT 1",
      [sessionId]
    );
    return rows[0];
  },

  async create({ sessionId, campaignId, companyId }) {
    await db.query(
      `INSERT INTO chat_sessions (session_id, campaign_id, company_id)
       VALUES (?, ?, ?)`,
      [sessionId, campaignId, companyId]
    );
  },

  async updateState(sessionId, state) {
    await db.query(
      "UPDATE chat_sessions SET current_state = ? WHERE session_id = ?",
      [state, sessionId]
    );
  },

  async markCompleted(sessionId) {
    await db.query(
      "UPDATE chat_sessions SET is_completed = TRUE WHERE session_id = ?",
      [sessionId]
    );
  }
};

module.exports = ChatSessionModel;
