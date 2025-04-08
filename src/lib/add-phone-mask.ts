export const addPhoneMask = (phone: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');

  if (cleanPhone.length !== 11) {
    return phone;
  }

  return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};
