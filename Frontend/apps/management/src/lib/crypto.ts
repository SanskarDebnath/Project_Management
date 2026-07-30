import CryptoJS from 'crypto-js';
import { AES_SECRET_KEY } from './config';

export function encryptData(data: any): string {
  try {
    const jsonString = typeof data === 'string' ? data : JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, AES_SECRET_KEY).toString();
  } catch (err) {
    console.error('Encryption failed:', err);
    return typeof data === 'string' ? data : JSON.stringify(data);
  }
}

export function decryptData(ciphertext: string): any {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, AES_SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) {
      return JSON.parse(ciphertext);
    }
    return JSON.parse(decryptedString);
  } catch (err) {
    try {
      return JSON.parse(ciphertext);
    } catch {
      return ciphertext;
    }
  }
}
