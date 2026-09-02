import pool from "../db/pool";
import crypto from "crypto";

async function createResetToken(userId: number) {
    // 1. Сгенерируй токен через crypto.randomBytes(32).toString('hex')
    const token = crypto.randomBytes(32).toString("hex");
    // 2. Вычисли expiresAt = сейчас + 1 час
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    // 3. Вставь в password_reset_tokens
    const queryCreateToken =
        `
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        values ($1, $2, $3)
        RETURNING token;
        `
    // 4. Верни токен
    const result = await pool.query(queryCreateToken, [userId, token, expiresAt]);
    return result.rows[0].token;
}

async function findValidResetToken(token: string) {
    const queryFindToken =
        `
        SELECT user_id, expires_at, used
        FROM password_reset_tokens
        WHERE token = $1 AND expires_at > NOW() AND used = FALSE
        `
    const result = await pool.query(queryFindToken, [token]);
    return result.rows[0] || null;
}

async function markTokenAsUsed(token: string) {
    await pool.query(
        `UPDATE password_reset_tokens SET used = TRUE WHERE token = $1`,
        [token]
    );
}

async function deleteUserTokens(userId: number) {
    await pool.query(
        `DELETE FROM password_reset_tokens WHERE user_id = $1`,
        [userId]
    );
}

export default { createResetToken, findValidResetToken, markTokenAsUsed, deleteUserTokens };