import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("La variable d'environnement DATABASE_URL est requise.");
}

// Connexion HTTP serverless avec Neon
const sql = neon(databaseUrl);

// Initialisation de Drizzle ORM avec le client et le schéma
export const db = drizzle({ client: sql, schema });
