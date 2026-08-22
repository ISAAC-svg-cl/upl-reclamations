/**
 * Générateur léger et autonome de QR Code
 * Permet d'authentifier les récépissés officiels UPL
 */

export function generateQrCodeUrl(text: string, size = 130): string {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=1E3A8A&bgcolor=FFFFFF&margin=1`;
}
