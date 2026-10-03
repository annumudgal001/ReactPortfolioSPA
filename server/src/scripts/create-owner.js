import 'dotenv/config';
import mongoose from 'mongoose';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { askPassword } from '../auth/password-prompt.js';
import { z } from 'zod';
import { connectDB } from '../config/db.js';
import { Owner } from '../auth/auth.models.js';
import { hashPassword } from '../auth/password.js';
const prompt = createInterface({ input: stdin, output: stdout, terminal: !!stdin.isTTY });
try {
  await connectDB();
  if (await Owner.exists({})) throw new Error('An owner already exists. This command never overwrites accounts.');
  const email = z.string().trim().toLowerCase().email().max(120).parse(await prompt.question('Owner email: '));
  prompt.close();
  let password;
  while (true) {
    password = await askPassword('Password (12–256 characters; masked): ');
    if (password.length < 12 || password.length > 256) {
      console.log(`Received ${password.length} characters. Use 12–256 characters, then press Enter.`);
      continue;
    }
    const confirmation = await askPassword('Confirm password: ');
    if (password !== confirmation) {
      console.log('Passwords do not match. Please try again.');
      continue;
    }
    break;
  }
  await Owner.create({ email, passwordHash: await hashPassword(password) });
  console.log('Owner created. Sign in at /admin.');
} catch (error) { console.error('Owner setup failed:', error.message); process.exitCode = 1; }
finally { prompt.close(); await mongoose.disconnect(); }
