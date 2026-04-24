const WHATSAPP_NUMBER = '5581994385112';

const onlyDigits = (value: string): string => value.replace(/\D+/g, '');

const formatPhoneBR = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const isValidPhoneBR = (value: string): boolean => {
  const digits = onlyDigits(value);
  return digits.length === 10 || digits.length === 11;
};

const setError = (field: HTMLInputElement, message: string): void => {
  const errorId = field.getAttribute('aria-describedby');
  if (!errorId) return;
  const target = document.getElementById(errorId);
  if (target) target.textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
};

export const initWhatsAppForm = (): void => {
  const form = document.querySelector<HTMLFormElement>('#whatsapp-form');
  if (!form) return;

  const nomeInput = form.querySelector<HTMLInputElement>('#form-nome');
  const telefoneInput = form.querySelector<HTMLInputElement>('#form-telefone');
  if (!nomeInput || !telefoneInput) return;

  telefoneInput.addEventListener('input', () => {
    telefoneInput.value = formatPhoneBR(telefoneInput.value);
    if (telefoneInput.value) setError(telefoneInput, '');
  });

  nomeInput.addEventListener('input', () => {
    if (nomeInput.value.trim().length >= 2) setError(nomeInput, '');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nome = nomeInput.value.trim();
    const telefone = telefoneInput.value.trim();

    let hasError = false;
    if (nome.length < 2) {
      setError(nomeInput, 'Informe seu nome completo.');
      nomeInput.focus();
      hasError = true;
    }
    if (!isValidPhoneBR(telefone)) {
      setError(telefoneInput, 'Informe um telefone válido com DDD.');
      if (!hasError) telefoneInput.focus();
      hasError = true;
    }
    if (hasError) return;

    const message = `Olá, Dr. Rodrigo. Meu nome é ${nome} e gostaria de agendar uma consulta. Telefone: ${telefone}.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  });
};
