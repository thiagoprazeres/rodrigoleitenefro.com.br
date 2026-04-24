# rodrigoleitenefro.com.br

Landing page do Dr. Rodrigo Leite — Nefrologia e Clínica Médica, Recife/PE.
Projeto autoral Cafeína Dev — método MAPA sobre o Closed-Loop Person-to-Person Service System Framework.

## Agente orquestrador

Claude Opus 4.7 — Zimmermann + Hohpe. Opera com autonomia total.
Modelo: `claude-opus-4-7`

## Stack

- Vite + TypeScript strict (noUncheckedIndexedAccess, exactOptionalPropertyTypes)
- SCSS via sass
- Netlify SSG + DNS (thiagoprazeres team)
- GitHub Actions CI/CD (typecheck → build → deploy)
- GA4 + Google Ads + Meta Pixel (lazy, env-driven)
- Figma MCP (project scope, .mcp.json)

## Identidade do cliente

- **Médico:** Rodrigo José Barros Rodrigues Leite
- **Especialidades:** Clínica Médica + Nefrologia
- **Consultório:** Clínica AEVUM — RioMar Trade Center, Torre 4, Sala 809, Recife/PE
- **CRM:** 15162 (PE) | **RQE:** 300 (exibido no site conforme CFM 2.336/2023)
- **Rotulagem CFM obrigatória:** `MÉDICO · CRM-PE 15162 · RQE 300` em todo material publicitário
- ⚠️ **TODO validar com Dr. Rodrigo:** RQE 300 cobre Nefrologia, Clínica Médica ou ambas? A Resolução 2.336 exige RQE próprio por especialidade anunciada. Se só houver RQE para uma, rever copy da outra.
- **Instagram:** @dr.rodrigoleitenefro

## Contatos (não publicar sem validação)

- **WhatsApp (leads, bio IG):** 5581994385112 ← CTA principal do site
- **Consultório:** 5581943851112
- **Pessoal (NUNCA publicar):** 5581991604040

## CTA principal

`wa.me/5581994385112` — número alinhado com a bio atual do Instagram do Dr. Rodrigo.

## Padrões

- pt-BR · BRL · DDI +55
- Lighthouse 100 (perf, a11y, SEO, best practices)
- WCAG AA
- Commits em português
- ESLint strict + Prettier
- **Compliance:** CFM 2.336/2023 (publicidade médica) + LGPD 13.709/2018 (tratamento de dados)

## Roadmap — GitHub Issues + Milestones + Releases

- **Milestone = fase MAPA** (M, A, P, A)
- **Issue = entregável atômico** com Definition of Done checklist
- **Release = versão publicada em produção** (tag vX.Y.Z)
- **Labels:** `fase:mapeamento` `fase:arquitetura` `fase:prototipacao` `fase:aprendizagem` `tipo:bug` `tipo:feat` `tipo:chore` `tipo:docs` `prioridade:alta` `bloqueado`
- Definition of Done padrão: typecheck ✓ · build ✓ · Lighthouse ≥ 95 · code review ✓ · deploy preview ✓

## Fases MAPA

- [x] M — Mapeamento (briefing, Instagram, fotos, transcrições, recomendações técnicas)
- [x] A — Arquitetura (stack, tooling, CI/CD, DNS, analytics wiring)
- [ ] P — Prototipação (design system, HTML semântico, conteúdo, CTA, formulário)
- [ ] A — Aprendizagem (GA4 data, conversões, iterações)

## Insumos

```
insumos/           ← gitignored
  briefing.md
  instagram.md
  recomendacoes-tecnicas.md
  fotos.md
  fornecedores.md
  whatsapp-projeto-site/
  transcricoes/
```

## Variáveis de ambiente

Ver `.env.example`. Nunca commitar `.env`.
Keys pendentes: FIGMA_TOKEN, IDEOGRAM_API_KEY, RECRAFT_API_KEY,
VITE_GA_MEASUREMENT_ID, VITE_GOOGLE_ADS_ID, VITE_GOOGLE_ADS_CONVERSION,
VITE_META_PIXEL_ID, VITE_GSC_VERIFICATION, OPENAI_API_KEY.
