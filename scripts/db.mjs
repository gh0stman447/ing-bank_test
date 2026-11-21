import { existsSync } from 'node:fs';
import { readdir, readFile } from 'node:fs/promises';
import { scryptSync, randomBytes } from 'node:crypto';
import pg from 'pg';

if (existsSync('.env')) process.loadEnvFile('.env');

if (!process.env.DATABASE_URL)
  throw new Error('Скопируйте .env.example в .env и задайте DATABASE_URL');

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 5000,
});

const command = process.argv[2];
let client;

try {
  client = await pool.connect();

  if (command === 'migrate') {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(7654321)');
    await client.query(
      'CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())',
    );

    const files = (await readdir(new URL('../db/migrations/', import.meta.url)))
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const applied = await client.query('SELECT 1 FROM schema_migrations WHERE name=$1', [file]);
      if (applied.rowCount) continue;

      await client.query(
        await readFile(new URL(`../db/migrations/${file}`, import.meta.url), 'utf8'),
      );
      await client.query('INSERT INTO schema_migrations(name) VALUES($1)', [file]);
      console.log(`Применена миграция: ${file}`);
    }

    await client.query('COMMIT');
    console.log('Миграции актуальны');
  } else if (command === 'seed') {
    await client.query('BEGIN');
    const salt = randomBytes(16).toString('hex');
    const hash = `${salt}:${scryptSync('Demo2026!', salt, 64).toString('hex')}`;

    await client.query(
      'INSERT INTO users(email,name,password_hash) VALUES($1,$2,$3) ON CONFLICT(email) DO NOTHING',
      ['demo@example.com', 'Демо пользователь', hash],
    );

    const names = [
      'Альфа',
      'Вектор',
      'Горизонт',
      'Атлас',
      'Меридиан',
      'Орбита',
      'Спектр',
      'Маяк',
      'Импульс',
      'Контур',
      'Парус',
      'Сфера',
    ];

    for (const [index, name] of names.entries()) {
      const code = `CL-${String(index + 1).padStart(3, '0')}`;
      await client.query(
        'INSERT INTO clients(name,code) VALUES($1,$2) ON CONFLICT(code) DO NOTHING',
        [`ООО «${name}»`, code],
      );

      const { rows } = await client.query('SELECT id FROM clients WHERE code=$1', [code]);
      for (let j = 1; j <= 3; j++) {
        await client.query(
          'INSERT INTO deals(date,number,amount,client_id,description) VALUES($1,$2,$3,$4,$5) ON CONFLICT(number) DO NOTHING',
          [
            `2026-11-${String(index + j).padStart(2, '0')}`,
            `DEMO-${index + 1}-${j}`,
            (index + 1) * 15000 + j * 1250,
            rows[0].id,
            'Тестовая сделка',
          ],
        );
      }
    }

    await client.query('COMMIT');

    console.log(
      'Демо-данные готовы: 12 клиентов, 36 сделок. Пользователь demo@example.com / Demo2026!.',
    );
  } else if (command === 'check') {
    const { rows } = await client.query(
      'SELECT current_database() AS database, (SELECT count(*) FROM clients) AS clients, (SELECT count(*) FROM deals) AS deals, (SELECT count(*) FROM users) AS users',
    );

    console.table(rows);
  } else throw new Error('Команда: migrate | seed | check');
} catch (error) {
  if (client) await client.query('ROLLBACK').catch(() => {});

  console.error(error.message);
  process.exitCode = 1;
} finally {
  client?.release();
  await pool.end();
}
