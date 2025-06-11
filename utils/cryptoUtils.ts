// utils/cryptoUtils.ts

// Function to generate a random encryption key
export function generateEncryptionKey(): string {
  const array = new Uint8Array(32); // 256 bits
  window.crypto.getRandomValues(array);
  return bufferToBase64(array);
}

// Function to encrypt content with a generated key
export async function encryptContentWithKey(
  content: string,
  keyBase64: string,
): Promise<string> {
  const key = await importKeyFromBase64(keyBase64);
  return encryptContent(content, key);
}

// Function to encrypt content with a password
export async function encryptContentWithPassword(
  content: string,
  password: string,
): Promise<string> {
  const { key, salt } = await deriveKeyFromPassword(password);
  return encryptContent(content, key, salt);
}

// Shared function to encrypt content
async function encryptContent(
  content: string,
  key: CryptoKey,
  salt?: Uint8Array,
): Promise<string> {
  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM

  const encoder = new TextEncoder();
  const data = encoder.encode(content);

  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    data,
  );

  // Combine salt (if present), IV, and encrypted data
  let combined: Uint8Array;
  if (salt) {
    combined = new Uint8Array(
      salt.byteLength + iv.byteLength + encryptedData.byteLength,
    );
    combined.set(salt, 0); // Salt at the beginning
    combined.set(iv, salt.byteLength); // IV after salt
    combined.set(
      new Uint8Array(encryptedData),
      salt.byteLength + iv.byteLength,
    ); // Encrypted data after IV
  } else {
    combined = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    combined.set(iv, 0); // IV at the beginning
    combined.set(new Uint8Array(encryptedData), iv.byteLength); // Encrypted data after IV
  }

  return bufferToBase64(combined);
}

// Function to derive a key from password using PBKDF2
async function deriveKeyFromPassword(
  password: string,
): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  const encoder = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(32)); // 128-bit salt

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 1500000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );

  return { key, salt };
}

// Function to decrypt content
export async function decryptContent(
  encryptedBase64: string,
  keyInput: string,
): Promise<string> {
  const encryptedData = base64ToBuffer(encryptedBase64);

  let key: CryptoKey;
  let iv: Uint8Array;
  let ciphertext: Uint8Array;

  if (keyInput.length >= 44) {
    // Assume it's a Base64 encoded key (generated key)
    key = await importKeyFromBase64(keyInput);

    // Extract IV (first 12 bytes)
    iv = encryptedData.slice(0, 12);
    ciphertext = encryptedData.slice(12);
  } else {
    // Assume it's a password; derive key
    // Fixed indices to match encryption function's data structure
    const salt = encryptedData.slice(0, 32);
    iv = encryptedData.slice(32, 44); // Changed from (16, 28)
    ciphertext = encryptedData.slice(44); // Changed from 28

    key = await deriveKeyFromPasswordForDecryption(keyInput, salt);
  }

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
    },
    key,
    ciphertext,
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

// Function to derive key from password for decryption
async function deriveKeyFromPasswordForDecryption(
  password: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 1500000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  return key;
}

// Helper function to import key from Base64 string
async function importKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const rawKey = base64ToBuffer(base64Key);
  return window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", false, [
    "encrypt",
    "decrypt",
  ]);
}

// Helper function to convert Uint8Array to Base64 string
function bufferToBase64(buffer: Uint8Array): string {
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}

// Helper function to convert Base64 string to Uint8Array
function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
