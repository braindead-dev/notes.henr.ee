// utils/cryptoUtils.ts
export function generateEncryptionKey(): string {
    // Generate a random 256-bit (32-byte) key encoded in Base64
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    
    // Convert Uint8Array to string without spread operator
    let keyString = '';
    array.forEach((byte) => {
      keyString += String.fromCharCode(byte);
    });
  
    return btoa(keyString);
}  
  
// Function to encrypt content
export async function encryptContent(content: string, keyBase64: string): Promise<string> {
    const key = await importKey(keyBase64);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for AES-GCM
  
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
  
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );
  
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.byteLength + encryptedData.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedData), iv.byteLength);
  
    // Convert Uint8Array to Base64 string without using the spread operator
    return bufferToBase64(combined);
}

// Function to decrypt content
export async function decryptContent(encryptedBase64: string, keyBase64: string): Promise<string> {
    const key = await importKey(keyBase64);

    // Convert Base64 string to Uint8Array
    const combined = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

    // Extract IV (first 12 bytes)
    const iv = combined.slice(0, 12);

    // Extract the encrypted data (remaining bytes)
    const encryptedData = combined.slice(12);

    // Decrypt the data
    const decryptedData = await window.crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv,
        },
        key,
        encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);  // Return decrypted content as a string
}

// Helper function to import the key
async function importKey(keyBase64: string): Promise<CryptoKey> {
    const rawKey = Uint8Array.from(atob(keyBase64), (c) => c.charCodeAt(0));
    return window.crypto.subtle.importKey(
        'raw',
        rawKey,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
    );
}
  
// Helper function to convert Uint8Array to Base64 string
function bufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
}
  