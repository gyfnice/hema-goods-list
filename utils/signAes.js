const CryptoJS = require('crypto-js');

const secretKey = 'gyfniceSecretKey'; // Replace with your secret key

// Encryption function
function encrypt(inputDate, persistDays = 30) {
    const currentDate = new Date(inputDate);

    // 将日期往后推
    currentDate.setDate(currentDate.getDate() + Number(persistDays));

    // 生成加密字符串
    const text = currentDate.toISOString();
    console.log('text :>> ', text);
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return encodeURIComponent(ciphertext);
}

// Decryption function
function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(
        decodeURIComponent(ciphertext),
        secretKey
    );
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
function checkIsCorrectDate(ciphertext) {
    const dateString = decrypt(ciphertext);
    // 解析日期
    const decryptedDate = new Date(dateString);
    console.log('decryptedDate :>> ', decryptedDate);
    // 检查日期是否有效
    if (isNaN(decryptedDate?.getTime?.())) {
        return null; // 日期解析失败
    }

    // 检查解密后的日期是否在当前时间之前
    if (Date.now() >= decryptedDate.getTime()) {
        return null; // 解密后的日期在当前时间之后
    }
    return true;
}
module.exports = {
    encrypt,
    decrypt,
    checkIsCorrectDate
};
