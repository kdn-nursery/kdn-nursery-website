export function configuredWhatsappNumber(
  raw: string | undefined = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
): string | null {
  const value = raw?.trim() ?? "";
  if (!/^[1-9]\d{7,14}$/.test(value)) return null;
  return value;
}

export function whatsappEnquiryHref(
  message: string,
  number: string | null = configuredWhatsappNumber(),
): string | null {
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
