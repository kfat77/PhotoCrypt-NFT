/**
 * photoCrypt.js - PhotoCrypt 核心算法（浏览器版）
 * 
 * 功能：
 * 1. SHA-256 照片哈希（WebCrypto API）
 * 2. LSB 水印嵌入（Canvas 像素操作）
 * 3. 简化版感知哈希（Canvas 缩放+灰度）
 * 4. 设备签名生成（简化版）
 */

/**
 * 计算 ArrayBuffer 的 SHA-256 哈希
 */
export async function sha256Buffer(buffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 将 Blob 转为 ArrayBuffer
 */
export function blobToArrayBuffer(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

/**
 * 将字符串转为二进制位数组
 */
function stringToBits(str) {
  const bits = [];
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      bits.push((charCode >> j) & 1);
    }
  }
  return bits;
}

/**
 * 将二进制位数组转回字符串
 */
function bitsToString(bits) {
  const chars = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8 && i + j < bits.length; j++) {
      byte |= bits[i + j] << j;
    }
    chars.push(String.fromCharCode(byte));
  }
  return chars.join('');
}

/**
 * 将 Canvas 图像转为 Blob
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 1.0) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/**
 * 在图像中嵌入 LSB 水印
 * @param {HTMLImageElement} img - 原始图像
 * @param {string} message - 要嵌入的消息（JSON签名字符串）
 * @returns {HTMLCanvasElement} 含水印的 Canvas
 */
export function embedLSBWatermark(img, message) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 前 32 位存消息长度
  const messageBits = stringToBits(message);
  const lengthBits = [];
  const msgLen = messageBits.length;
  for (let i = 0; i < 32; i++) {
    lengthBits.push((msgLen >> i) & 1);
  }
  const allBits = [...lengthBits, ...messageBits];

  // 检查容量
  const maxBits = data.length * 2; // 每个像素 RGB 用 2 位
  if (allBits.length > maxBits) {
    throw new Error(`消息太长！最大容量: ${Math.floor(maxBits / 8)} 字节，当前: ${message.length} 字节`);
  }

  // 嵌入数据到 LSB (每个通道用 2 位: 位0和位1)
  for (let i = 0; i < allBits.length; i++) {
    const pixelIdx = Math.floor(i / 6); // 每像素6位 (R2+G2+B2)
    const channelIdx = Math.floor((i % 6) / 2); // 0=R, 1=G, 2=B
    const bitIdx = i % 2; // 0=bit0, 1=bit1
    const dataIdx = pixelIdx * 4 + channelIdx;

    if (dataIdx >= data.length) break;

    const mask = ~(1 << bitIdx) & 0xFF;
    data[dataIdx] = (data[dataIdx] & mask) | (allBits[i] << bitIdx);
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

/**
 * 从图像中提取 LSB 水印
 * @param {HTMLImageElement} img - 含水印的图像
 * @returns {string} 提取的消息
 */
export function extractLSBWatermark(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // 读取前 32 位长度
  let msgLen = 0;
  for (let i = 0; i < 32; i++) {
    const pixelIdx = Math.floor(i / 6);
    const channelIdx = Math.floor((i % 6) / 2);
    const bitIdx = i % 2;
    const dataIdx = pixelIdx * 4 + channelIdx;
    if (dataIdx >= data.length) break;
    msgLen |= ((data[dataIdx] >> bitIdx) & 1) << i;
  }

  // 读取消息
  const bits = [];
  for (let i = 32; i < 32 + msgLen; i++) {
    const pixelIdx = Math.floor(i / 6);
    const channelIdx = Math.floor((i % 6) / 2);
    const bitIdx = i % 2;
    const dataIdx = pixelIdx * 4 + channelIdx;
    if (dataIdx >= data.length) break;
    bits.push((data[dataIdx] >> bitIdx) & 1);
  }

  return bitsToString(bits);
}

/**
 * 计算简化版感知哈希
 * @param {HTMLImageElement} img - 图像
 * @returns {string} 感知哈希（16进制字符串）
 */
export function computePerceptualHash(img) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const size = 16;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  // 转为灰度并计算平均值
  const grayValues = [];
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(
      data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114
    );
    grayValues.push(gray);
    sum += gray;
  }

  const average = sum / grayValues.length;

  // 生成二进制哈希
  let binaryHash = '';
  for (const gray of grayValues) {
    binaryHash += gray > average ? '1' : '0';
  }

  // 转为16进制
  let hexHash = '';
  for (let i = 0; i < binaryHash.length; i += 4) {
    const chunk = binaryHash.substring(i, i + 4).padEnd(4, '0');
    hexHash += parseInt(chunk, 2).toString(16);
  }

  return hexHash;
}

/**
 * 生成设备签名数据（简化版）
 * 实际生产环境应使用 WebCrypto 的 ECDSA 或 Ed25519
 */
export function generateSignature(imageHash, deviceModel, timestamp) {
  // 简化版：用 HMAC-SHA256 模拟签名
  // 实际应使用真正的非对称密钥对
  const signData = `${imageHash}|${deviceModel}|${timestamp}`;
  // 这里用简单的混淆作为演示
  let hash = 0;
  for (let i = 0; i < signData.length; i++) {
    const char = signData.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const signature = btoa(signData).substring(0, 64);
  return signature;
}

/**
 * 生成完整的 PhotoCrypt 验证数据
 */
export async function generateVerificationData(imageBlob, deviceModel) {
  const timestamp = Math.floor(Date.now() / 1000);

  // 1. 计算 SHA-256 哈希
  const buffer = await blobToArrayBuffer(imageBlob);
  const imageHash = await sha256Buffer(buffer);

  // 2. 生成签名
  const signature = generateSignature(imageHash, deviceModel, timestamp);

  // 3. 创建验证数据结构
  const verificationData = {
    imageHash,
    timestamp,
    deviceModel,
    signature,
    publicKey: 'web-device-key-2024',
    version: '1.0.0'
  };

  return verificationData;
}

/**
 * 完整的 PhotoCrypt 加密流程
 * @param {HTMLImageElement} img - 原始图像元素
 * @param {Blob} originalBlob - 原始图像 Blob
 * @param {string} deviceModel - 设备型号
 * @returns {Object} { watermarkedCanvas, verificationData, watermarkedBlob }
 */
export async function photoCryptEncrypt(img, originalBlob, deviceModel) {
  // 1. 生成验证数据
  const verificationData = await generateVerificationData(originalBlob, deviceModel);

  // 2. 将验证数据转为 JSON 字符串
  const sigJson = JSON.stringify(verificationData);

  // 3. 嵌入 LSB 水印
  const watermarkedCanvas = embedLSBWatermark(img, sigJson);

  // 4. 计算感知哈希（基于水印后的图像）
  const watermarkedImg = new Image();
  const watermarkedDataUrl = watermarkedCanvas.toDataURL('image/png');
  await new Promise((resolve) => {
    watermarkedImg.onload = resolve;
    watermarkedImg.src = watermarkedDataUrl;
  });
  const perceptualHash = computePerceptualHash(watermarkedImg);

  // 5. 生成 watermarked Blob
  const watermarkedBlob = await canvasToBlob(watermarkedCanvas, 'image/png');

  // 6. 添加感知哈希到验证数据
  verificationData.perceptualHash = perceptualHash;

  return {
    watermarkedCanvas,
    watermarkedBlob,
    verificationData,
    watermarkedDataUrl
  };
}

/**
 * 验证 PhotoCrypt 水印照片
 * @param {HTMLImageElement} img - 含水印的照片
 * @returns {Object|null} 验证数据或 null
 */
export function photoCryptVerify(img) {
  try {
    const extracted = extractLSBWatermark(img);
    const data = JSON.parse(extracted);
    return data;
  } catch (e) {
    return null;
  }
}
