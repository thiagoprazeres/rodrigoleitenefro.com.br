const WHATSAPP_NUMBER = '5581993774102';

export interface LeadData {
  nome: string;
  telefone: string;
  email?: string;
}

export function buildWhatsAppUrl(lead: LeadData): string {
  const lines = [
    `*Novo contato pelo site*`,
    `Nome: ${lead.nome}`,
    `Telefone: ${lead.telefone}`,
    ...(lead.email ? [`E-mail: ${lead.email}`] : []),
  ];
  const msg = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}
