# scripts/

Helpers CLI para geração de assets de marca.

Requer `.env` preenchido (veja `.env.example`).

## Uso previsto

```bash
# Ideogram (logo, banners com texto)
node scripts/ideogram.mjs "prompt aqui" --out insumos/brand/logo.png

# Recraft (SVG vetorial nativo)
node scripts/recraft.mjs "prompt aqui" --out insumos/brand/logo.svg
```

## Status

- [ ] `ideogram.mjs` — implementar quando `IDEOGRAM_API_KEY` estiver disponível
- [ ] `recraft.mjs` — implementar quando `RECRAFT_API_KEY` estiver disponível

Figma é consumido via MCP (ver `.mcp.json`), não precisa de script.
