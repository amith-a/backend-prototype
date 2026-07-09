import pool from "../config/postgres";
import {
  CreateRefreshSession,
  RefreshSession,
} from "../types/refresh-session.types";

class RefreshSessionRepository {
  async create(session: CreateRefreshSession): Promise<void> {
    const query = `
  INSERT INTO refresh_sessions (
    user_id,
    token_hash,
    expires_at
  )
  VALUES ($1, $2, $3)
`;
    await pool.query(query, [
      session.userId,
      session.tokenHash,
      session.expiresAt,
    ]);
  }

  async findByTokenHash(tokenHash: string): Promise<RefreshSession | null> {
    const query = `SELECT
    id,
    user_id,
    token_hash,
    expires_at,
    revoked_at,
    created_at,
    updated_at
FROM refresh_sessions
WHERE token_hash = $1;`;

    const result = await pool.query(query, [tokenHash]);
    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      userId: row.user_id,
      tokenHash: row.token_hash,
      expiresAt: row.expires_at,
      revokedAt: row.revoked_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async revoke(sessionId: string): Promise<void> {
  const query = `
    UPDATE refresh_sessions
    SET
      revoked_at = NOW(),
      updated_at = NOW()
    WHERE id = $1;
  `;

  await pool.query(query, [sessionId]);
}

}
export default new RefreshSessionRepository();
