import { env } from '@/data/env/server';
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(env.DATABASE_URL);