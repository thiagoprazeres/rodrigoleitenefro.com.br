#!/usr/bin/env node
// Gera imagem via API Ideogram v3.
// Uso: node scripts/ideogram.mjs "prompt" --out insumos/brand/arquivo.png [--aspect=ASPECT_1_1] [--model=V_3]

import 'dotenv/config';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const API_URL = 'https://api.ideogram.ai/v1/ideogram-v3/generate';
const KEY = process.env.IDEOGRAM_API_KEY;

if (!KEY) {
  console.error('❌ IDEOGRAM_API_KEY ausente no .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const prompt = args.find(a => !a.startsWith('--'));
const out = argVal('--out') ?? 'insumos/brand/ideogram.png';
const aspect = argVal('--aspect') ?? 'ASPECT_1_1';

if (!prompt) {
  console.error('Uso: node scripts/ideogram.mjs "prompt" --out caminho.png');
  process.exit(1);
}

function argVal(name) {
  const a = args.find(x => x.startsWith(`${name}=`));
  return a?.split('=').slice(1).join('=');
}

const form = new FormData();
form.append('prompt', prompt);
form.append('aspect_ratio', aspect);
form.append('rendering_speed', 'DEFAULT');

console.log(`→ Ideogram: "${prompt}" (${aspect})`);

const res = await fetch(API_URL, {
  method: 'POST',
  headers: { 'Api-Key': KEY },
  body: form,
});

if (!res.ok) {
  console.error(`❌ ${res.status}:`, await res.text());
  process.exit(1);
}

const json = await res.json();
const url = json.data?.[0]?.url;
if (!url) {
  console.error('❌ resposta sem URL:', JSON.stringify(json, null, 2));
  process.exit(1);
}

const img = await fetch(url).then(r => r.arrayBuffer());
await mkdir(dirname(out), { recursive: true });
await writeFile(out, Buffer.from(img));
console.log(`✓ salvo em ${out}`);
