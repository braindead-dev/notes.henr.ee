// pasteData.ts
export const pageTitle = "Encryption";
export const pageContent = `
Here's a breakdown of how the encryption system works to ensure that only you and those you trust can view the contents of your paste.

---
### TL;DR
- **Encryption**: Military grade AES-256 encryption, done entirely in your browser.
- **Decryption**: Also done locally in your browser with the key you’re given.
- **Security**: We don't store or know your encryption key, and we will never transmit it online.
- **Stored Info**: We store the unencrypted paste title, creation time, and encrypted content (which we cannot decrypt).
---
## How We Encrypt

We use military grade **AES-256** encryption. Your paste's content is encrypted before it ever reaches our servers, so that no one, not even us, can access your paste's content without your key.

1. **Encryption in the browser**: Encryption and key derivation happens locally in your browser, so that the plaintext contents of your paste and the encryption key never leave your device.
2. **Decryption in the browser**: Decryption happens locally in your browser as well. When you visit an encrypted paste, you're required to enter the encryption key in order to decrypted the content.
3. **No knowledge of content**: Since paste content is encrypted on your device before being sent to us, we have no way of knowing what’s inside. Your encryption key is never sent through the internet.

## Accessing an Encrypted Paste

When you create a paste, you will receive an encryption key (don't lose this!!). To access the paste, visit the paste link and enter your key when prompted. Once you enter it, the content will be decrypted in your browser, and you can view the paste content.

***Important: We do not send your encryption key through the internet at any point. This is crucial for keeping your paste secure.***

## What Information Is Stored?

While we prioritize security and privacy, there are a few pieces of information that are stored when you create a paste. Here's what we store:

1. **The Title**: The title of the paste is **not encrypted**. This is viewable by anyone who accesses the paste link.
2. **Timestamp**: We record the time when the paste was created.
3. **IP Address**: Although we don’t directly collect IP addresses for tracking purposes, IP logs may be stored on the servers hosting our site. For full anonymity, consider using a logless VPN or an anonymous connection.
4. **Encrypted Paste Content**: We store the encrypted content of your paste. However, since we don't have access to your encryption key, we cannot decrypt it.

## Why We Don't Embed Keys in Links

Some encrypted pastebin services may generate a link with the encryption key embedded directly in the URL. This can be **insecure** for several reasons:

- **Server Logging**: If the encryption key is included in the URL, it could be logged by servers handling your web traffic. This means anyone with access to those logs (including admins or bad actors) could potentially decrypt your paste.
- **Interception**: If your internet traffic is intercepted (e.g., by your ISP or a hacker), they could retrieve the encryption key from the URL. This would compromise the security of your paste.

### Our Approach:
The key is **not included** in the URL. Instead, you must enter it manually after accessing the paste link. This ensures the key remains local to your device and never transmits over the internet.

### Stay Private, Stay Secure

We built this pastebin with user privacy as a priority. By encrypting everything client-side, we ensure that your paste contents are known only to you and those with whom you share the encryption key.

If you have further questions, feel free to reach out.

**Email** – contact@henrywa[.]ng
**Telegram** – [@henry99x](https://t.me/henry99x)
`;