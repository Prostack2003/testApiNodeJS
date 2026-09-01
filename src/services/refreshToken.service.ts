import pool from "../db/pool";

async function saveRefreshToken(userId: number, token: string, expiresAt: Date) {
    // Сначала удаляем старые токены пользователя
    await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);

    // Потом создаём новый
    const query =
        `
        INSERT INTO refresh_tokens (user_id, token, expires_at)
        VALUES ($1, $2, $3)
        `;
    await pool.query(query, [userId, token, expiresAt]);
}

async function findRefreshToken(token: string) {
    const query = `
        SELECT user_id, expires_at
        FROM refresh_tokens
        WHERE token = $1 AND expires_at > NOW()
    `;
    const result = await pool.query(query, [token]);
    return result.rows[0] || null;
}

async function deleteRefreshToken(token: string) {
    const query = 'DELETE FROM refresh_tokens WHERE token = $1';
    await pool.query(query, [token]);
}

export default {saveRefreshToken, findRefreshToken, deleteRefreshToken};