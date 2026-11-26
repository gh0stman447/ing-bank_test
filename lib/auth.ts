import 'server-only';
import { randomBytes, createHash, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { getDb } from './db';
import type { User } from '@/types/crm';

const scryptAsync = promisify(scrypt);
export const SESSION_COOKIE = 'session';
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

export class UnauthorizedError extends Error {}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return getUserBySessionToken(token);
}

export async function getUserBySessionToken(token: string | undefined): Promise<User | null> {
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;

  const result = await getDb().query<User>(
    `SELECT users.id, users.name, users.email FROM sessions
     JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = $1 AND sessions.expires_at > NOW()`,
    [hashToken(token)],
  );

  return result.rows[0] ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new UnauthorizedError();

  return user;
}

export async function checkPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash || !/^[a-f0-9]{128}$/.test(hash)) return false;
  const actual = (await scryptAsync(password, salt, 64)) as Buffer;

  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
}

export async function createSession(userId: number) {
  const token = randomBytes(32).toString('hex');

  await getDb().query('DELETE FROM sessions WHERE expires_at <= NOW()');
  await getDb().query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '7 days')",
    [hashToken(token), userId],
  );

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_SECONDS,
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) await getDb().query('DELETE FROM sessions WHERE token_hash = $1', [hashToken(token)]);

  cookieStore.delete(SESSION_COOKIE);
}

export async function allowLogin(email: string) {
  const result = await getDb().query<{ attempts: number }>(
    `INSERT INTO login_attempts (email, attempts, started_at) VALUES ($1, 1, NOW())
     ON CONFLICT (email) DO UPDATE SET
       attempts = CASE WHEN login_attempts.started_at < NOW() - INTERVAL '15 minutes' THEN 1 ELSE login_attempts.attempts + 1 END,
       started_at = CASE WHEN login_attempts.started_at < NOW() - INTERVAL '15 minutes' THEN NOW() ELSE login_attempts.started_at END
     RETURNING attempts`,
    [email],
  );
  return result.rows[0].attempts <= 10;
}
