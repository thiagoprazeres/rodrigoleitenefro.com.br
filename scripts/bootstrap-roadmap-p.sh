#!/usr/bin/env bash
# Bootstrap do roadmap Fase P (Prototipação) no GitHub.
# Idempotente: pode rodar várias vezes sem criar duplicatas.
# Requer: gh (autenticado), repo atual com origin no GitHub.

set -euo pipefail

MILESTONE_TITLE="Fase P — Prototipação"
MILESTONE_DUE="2026-05-07T23:59:59Z"
MILESTONE_DESC="Design system emergente do código, conteúdo final, SEO/analytics wiring, Lighthouse 100. Code-first, local-first, 100% CLI."

# -------- labels --------
label() {
  local name="$1" color="$2" desc="$3"
  if gh label list --limit 200 --json name --jq '.[].name' | grep -qx "$name"; then
    gh label edit "$name" --color "$color" --description "$desc" >/dev/null
  else
    gh label create "$name" --color "$color" --description "$desc" >/dev/null
  fi
  echo "  label: $name"
}

echo "→ labels"
label "fase:mapeamento"   "6F42C1" "MAPA · Mapeamento"
label "fase:arquitetura"  "0366D6" "MAPA · Arquitetura"
label "fase:prototipacao" "28A745" "MAPA · Prototipação"
label "fase:aprendizagem" "D93F0B" "MAPA · Aprendizagem"
label "tipo:feat"         "A2EEEF" "Nova funcionalidade"
label "tipo:chore"        "FBCA04" "Manutenção/tooling"
label "tipo:docs"         "0075CA" "Documentação"
label "tipo:bug"          "D73A4A" "Bug"
label "prioridade:alta"   "B60205" "Alta prioridade"
label "bloqueado"         "000000" "Bloqueado por dependência externa"

# -------- milestone --------
echo "→ milestone"
owner_repo=$(gh repo view --json nameWithOwner --jq .nameWithOwner)
ms_number=$(gh api "repos/$owner_repo/milestones?state=open" --jq ".[] | select(.title==\"$MILESTONE_TITLE\") | .number" || true)
if [[ -z "$ms_number" ]]; then
  ms_number=$(gh api "repos/$owner_repo/milestones" \
    -f title="$MILESTONE_TITLE" \
    -f description="$MILESTONE_DESC" \
    -f due_on="$MILESTONE_DUE" \
    --jq .number)
  echo "  criada #$ms_number"
else
  echo "  já existia #$ms_number"
fi

# -------- issues --------
DOD=$'\n\n### Definition of Done\n- [ ] typecheck ✓\n- [ ] build ✓\n- [ ] Lighthouse ≥ 95 (perf/a11y/SEO/bp)\n- [ ] code review ✓\n- [ ] deploy preview Netlify ✓'

issue() {
  local title="$1" body="$2" labels="$3"
  if gh issue list --state all --search "\"$title\" in:title" --json title --jq '.[].title' | grep -qx "$title"; then
    echo "  skip (existe): $title"
    return
  fi
  gh issue create \
    --title "$title" \
    --body "$body$DOD" \
    --label "$labels" \
    --milestone "$MILESTONE_TITLE" >/dev/null
  echo "  ok: $title"
}

echo "→ issues"

issue "P01 — Design tokens" \
"SCSS variables para paleta, tipografia, spacing, radius, breakpoints, shadows.\n\n**Paleta base** (extraída do IG do Dr. Rodrigo):\n- Primária verde-escuro \`#1B3A2D\`\n- Branco / off-white\n- Detalhe dourado sóbrio\n\n**Tipografia:** Manrope (self-hosted woff2, sem Google Fonts runtime).\n\nArquivos: \`src/styles/tokens/*.scss\` + \`src/styles/_tokens.scss\` barrel." \
"fase:prototipacao,tipo:feat,prioridade:alta"

issue "P02 — Reset + typography base" \
"Normalize minimal + scale tipográfico baseado nos tokens. Carregar Manrope (400/600/800) via \`@font-face\` apontando pra \`public/fonts/*.woff2\` com \`font-display: swap\`." \
"fase:prototipacao,tipo:feat"

issue "P03 — Primitivos UI" \
"Componentes mínimos usados pelas seções: \`Button\` (primary/secondary/link), \`Section\`, \`Container\` (max-width + padding lateral), \`Link\` (com estados a11y). Zero framework CSS." \
"fase:prototipacao,tipo:feat"

issue "P04 — Copy final consolidado" \
"Consolidar \`docs/copy.md\` com headlines + body de todas as seções, usando a voz autêntica do Dr. Rodrigo (textos do briefing + posts IG DXcu6csDof6 e DWhh0Nix6WD). Inclui decisões: RQE 300 exibido, atendimento 100% particular, sem nomes comerciais de programas." \
"fase:prototipacao,tipo:docs,prioridade:alta"

issue "P05 — Seção Hero" \
"Foto-01 (Dr. Rodrigo retrato 3/4) + headline + subhead + CTA WhatsApp Business. LCP < 2s (imagem preload, dimensões explícitas, formato AVIF+WebP fallback)." \
"fase:prototipacao,tipo:feat,prioridade:alta"

issue "P06 — Seção Propósito" \
"Texto de boas-vindas do próprio Dr. Rodrigo (\"quando o paciente entende, ele participa\"). Tipografia grande, respiração ampla, sem imagem competindo." \
"fase:prototipacao,tipo:feat"

issue "P07 — Seção Sobre" \
"Bio expandida + diferencial verbal \"escuta cuidadosa sem pressa\". Foto-02 (Dr. Rodrigo no corredor). Hierarquia: nome + tagline + parágrafo curto." \
"fase:prototipacao,tipo:feat"

issue "P08 — Seção Especialidades" \
"**Nefrologia** (voz do próprio médico via post IG DXcu6csDof6): não é só casos graves, foco em prevenção e diagnóstico precoce, DRC evolui silenciosamente, \"não precisa limitar sua vida\".\n\n**Clínica Médica**: cuidado integral e completo, o paciente enquanto pessoa.\n\nSEM nomes comerciais de programas (decisão do médico em áudio)." \
"fase:prototipacao,tipo:feat"

issue "P09 — Seção Trajetória" \
"Timeline sóbria: UFPE (1999–2004) → Hosp. Barão de Lucena (res. Clín. Médica, 2006–2007) → HC/UFPE (res. Nefro, 2008–2009) → Barão de Lucena nefrologista (desde 2010) → Maria Lucinda RT Hemodiálise (desde 2014). Visual tipográfico, não ícones coloridos." \
"fase:prototipacao,tipo:feat"

issue "P10 — Seção Consultório" \
"Clínica AEVUM · RioMar Trade Center · Torre 4 · Sala 809 · Recife/PE. Foto-03 (consultório). Mapa estático (Netlify Functions ou imagem gerada no build — sem iframe do Google Maps em runtime, pra não quebrar Lighthouse)." \
"fase:prototipacao,tipo:feat"

issue "P11 — CTA final + Footer" \
"CTA final: \"Agendar consulta\" → \`wa.me/5581993774102\`. Footer: Instagram @dr.rodrigoleitenefro, endereço resumido, CRM 15162 | RQE 300, link política de privacidade (placeholder)." \
"fase:prototipacao,tipo:feat"

issue "P12 — SEO meta + OG image" \
"\`<title>\`, \`<meta description>\`, canonical, robots. OG image 1200×630 gerada no build a partir de SVG (foto-01 + nome + tagline), exportada como PNG otimizado." \
"fase:prototipacao,tipo:feat"

issue "P13 — sitemap.xml + robots.txt" \
"Gerados no build Vite (plugin simples ou script postbuild). Sitemap com a URL canônica; robots liberando tudo exceto \`/admin\` (se existir)." \
"fase:prototipacao,tipo:feat"

issue "P14 — JSON-LD structured data" \
"Schema.org Physician + LocalBusiness + Person. Inclui nome, especialidades, endereço do consultório, telefone, horário, imagem, sameAs (Instagram)." \
"fase:prototipacao,tipo:feat"

issue "P15 — Formulário de captura → WhatsApp" \
"Form nome + telefone (obrigatórios) + email (opcional). Submit = redirect pra \`wa.me/5581993774102?text=\` com mensagem pré-preenchida. Validação client-side pt-BR (telefone BR). Sem backend." \
"fase:prototipacao,tipo:feat,prioridade:alta"

issue "P16 — GA4 + GSC wiring" \
"Integração GA4 (measurement ID via \`VITE_GA_MEASUREMENT_ID\`) e meta de verificação GSC (\`VITE_GSC_VERIFICATION\`). Lazy-load do script GA4 pra não afetar LCP. **Bloqueado até as IDs chegarem.**" \
"fase:prototipacao,tipo:feat,bloqueado"

issue "P17 — Lighthouse 100 audit" \
"Auditoria final no preview Netlify: performance, acessibilidade, SEO, best practices. Alvo: 100/100/100/100. Corrigir qualquer regressão antes do merge pra main." \
"fase:prototipacao,tipo:chore,prioridade:alta"

echo
echo "✓ roadmap Fase P bootstrapped"
echo "  → https://github.com/$owner_repo/milestone/$ms_number"
