import CryptoJS from "crypto-js";

const SECRET_KEY = "TerraHivePrototypeKey123";

// 🔐 Enkripsi ke format HEX aman (tanpa +, /, =)
export const encryptData = (data: string): string => {
  try {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.lib.WordArray.random(16); // IV acak untuk keamanan

    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // gabungkan IV + ciphertext jadi satu (HEX)
    return iv.toString(CryptoJS.enc.Hex) + encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  } catch {
    return "";
  }
};

// 🔓 Dekripsi dari HEX string
export const decryptData = (combinedHex: string): string => {
  try {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const ivHex = combinedHex.slice(0, 32);
    const ciphertextHex = combinedHex.slice(32);

    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Hex.parse(ciphertextHex);

    const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });

    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
};
