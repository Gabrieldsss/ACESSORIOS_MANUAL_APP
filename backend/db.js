require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL nao configurada. Copie backend/.env.example para backend/.env e preencha.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Cria as tabelas se ainda nao existirem (schema.sql usa "IF NOT EXISTS",
// entao e seguro rodar isso toda vez que o servidor sobe).
async function garantirSchema() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await pool.query(schema);
}

module.exports = { pool, garantirSchema };
