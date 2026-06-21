import crypto from "crypto";

// AES-256-GCM encryption for sensitive tokens stored at rest (e.g. GitHub
// access tokens). Requires a 32-byte (64 hex character) key set as
// ENCRYPTION_KEY in the environment.
const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  console.warn(
    "WARNING: ENCRYPTION_KEY is missing or not 64 hex characters (32 bytes). " +
      "Token encryption will fail until this is fixed in .env.",
  );
}

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  // Store iv + authTag + ciphertext together, separated by colons, so we
  // have everything needed to decrypt later in one string.
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, dataHex] = encryptedText.split(":");

  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error("Invalid encrypted text format");
  }

  const key = Buffer.from(ENCRYPTION_KEY, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(dataHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
