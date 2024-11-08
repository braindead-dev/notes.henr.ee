export const pageTitle = "Encryption";
export const pageContent = `
Here's a breakdown of how the encryption system works to ensure that only you and those you trust can view the contents of your paste.

---
### TL;DR
- **Enabling Encryption:** Click the grey lock next to the Publish button to encrypt your paste.
- **Encryption**: We use military-grade AES-256-GCM encryption, performed entirely in your browser.
- **Decryption**: Also done locally in your browser with the key or password you’re given.
- **Security**: We don't know your encryption key or password, and we will never transmit it online.
- **Stored Info**: We store the unencrypted paste title, creation time, and encrypted content (which we cannot decrypt).
---
## How We Encrypt
For key-based encryption, we employ **AES-256-GCM** with a **256-bit key**, a standard known for its robust security even against the anticipated advancements in quantum computing.

For password-based encryption, we use **PBKDF2 key derivation** using **1.5 million iterations** and **SHA-256**. This setup ensures that even a powerful computer would require millions of years to break a strong password.

1. **Encryption in the browser**: Encryption and key derivation happen entirely in your browser, using a 256-bit key (for direct key encryption) or PBKDF2 with 1.5 million iterations (for password encryption). The plaintext contents of your paste and the encryption key never leave your device.
2. **Decryption in the browser**: Decryption also occurs locally in your browser. When you access an encrypted paste, you'll need to enter the encryption key or password to decrypt the content.
3. **Zero knowledge**: Since paste content is encrypted on your device before being sent to us, we have no way of knowing its contents. Your encryption key or password is never transmitted online.

Our project is open source and encryption can be reviewed in [cryptoUtils.ts](https://github.com/braindead-dev/notes.henr.ee/blob/main/utils/cryptoUtils.ts). All cryptography is performed using the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

## Accessing an Encrypted Paste

Upon creating an encrypted paste, you will receive an encryption key or use your password to secure the paste. To access it, visit the paste link and enter the encryption key or password when prompted. Once entered, decryption occurs locally in your browser, and you can view the paste content.

***Important: We do not send your encryption key or password through the internet at any point. This is critical to keeping your paste secure.***

## What Information Is Stored?

We prioritize security and privacy while storing minimal information upon creating a paste:

1. **The Title**: The paste title is **not encrypted** and viewable by anyone with access to the paste link.
2. **Timestamp**: We record the time when the paste was created.
3. **Hosting Information**: This website is hosted via **Vercel**, which may collect their own analytics data. For details on what data Vercel may collect, refer to their [Privacy Policy](https://vercel.com/legal/privacy-policy).
4. **Encrypted Paste Content**: We store the encrypted content of your paste, which we cannot decrypt due to the lack of access to your encryption key.

## Why We Don't Embed Keys in Links

Some pastebin services include the encryption key in the link after a hashtag, meaning the key is stored locally (not transmitted online). While this prevents interception through network inspection, it’s still not ideal for several reasons:

- **Browser History**: Embedding the key in the link can compromise security, as it may persist in browser history, which could be accessible if your device is compromised.
- **Ease of Compromise**: Sharing a link with an embedded key exposes it in a raw format, which can be risky, especially if the communication channel isn't secure or is prone to being logged.

### Our Approach:
To enhance security, we avoid embedding the key in the link. Instead, you must enter it manually upon accessing the paste link, keeping the key local to your device and never transmitting it over the internet.

### Stay Private, Stay Secure

Our pastebin prioritizes user privacy by ensuring that all encryption occurs client-side. This approach guarantees that only you and those you trust have access to your paste contents.

---

If you have any further questions, feel free to reach out.

**Email** – contact@henrywa[.]ng / **Repository** – [braindead-dev/notes.henr.ee](https://github.com/braindead-dev/notes.henr.ee/)
`;