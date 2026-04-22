#!/usr/bin/env node
// Gera imagem/SVG via API Recraft v3.
// Uso: node scripts/recraft.mjs "prompt" --out insumos/brand/arquivo.svg [--style=vector_illustration]

import 'dotenv/config';
import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const API_URL = 'https://external.api.recraft.ai/v1/images/generations';
const KEY = process.env.RECRAFT_API_KEY;

if (!KEY) {
  console.error('❌ RECRAFT_API_KEY ausente no .env');
  process.exit(1);
}

const args = process.argv.slice(2);
const prompt = args.find(a => !a.startsWith('--'));
const out = argVal('--out') ?? 'insumos/brand/recraft.svg';
const style = argVal('--style') ?? 'vector_illustration';
const size = argVal('--size') ?? '1024x1024';

if (!prompt) {
  console.error('Uso: node scripts/recraft.mjs "prompt" --out caminho.svg');
  process.exit(1);
}

function argVal(name) {
  const a = args.find(x => x.startsWith(`${name}=`));
  return a?.split('=').slice(1).join('=');
}

console.log(`→ Recraft: "${prompt}" (${style}, ${size})`);

const res = await fetch(API_URL, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt, style, size, response_format: 'url' }),
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
