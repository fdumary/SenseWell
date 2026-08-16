import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[i] = c;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcVal = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function parsePNG(filePath) {
  const buf = fs.readFileSync(filePath);
  let offset = 8;
  let width, height, bitDepth, colorType;
  const idatChunks = [];

  while (offset < buf.length) {
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.slice(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') {
      idatChunks.push(data);
    } else if (type === 'IEND') {
      break;
    }
  }

  if (colorType !== 6 || bitDepth !== 8) {
    return null; // Only RGBA 8-bit
  }

  const inflated = zlib.inflateSync(Buffer.concat(idatChunks));
  const rawData = Buffer.alloc(width * height * 4);
  const rowSize = width * 4;

  let inOffset = 0;
  for (let y = 0; y < height; y++) {
    const filter = inflated[inOffset++];
    const prevRowOffset = (y - 1) * rowSize;
    const currRowOffset = y * rowSize;

    for (let x = 0; x < rowSize; x++) {
      const byteVal = inflated[inOffset++];
      const left = x >= 4 ? rawData[currRowOffset + x - 4] : 0;
      const up = y > 0 ? rawData[prevRowOffset + x] : 0;
      const upLeft = y > 0 && x >= 4 ? rawData[prevRowOffset + x - 4] : 0;

      let val = 0;
      if (filter === 0) val = byteVal;
      else if (filter === 1) val = (byteVal + left) & 0xff;
      else if (filter === 2) val = (byteVal + up) & 0xff;
      else if (filter === 3) val = (byteVal + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        let pr = left;
        if (pb < pa && pb <= pc) pr = up;
        else if (pc < pa) pr = upLeft;
        val = (byteVal + pr) & 0xff;
      }
      rawData[currRowOffset + x] = val;
    }
  }

  return { width, height, rawData };
}

function encodePNG(width, height, rawData) {
  const rowSize = width * 4;
  const filtered = Buffer.alloc(height * (1 + rowSize));

  for (let y = 0; y < height; y++) {
    filtered[y * (1 + rowSize)] = 0; // Filter 0 (None)
    rawData.copy(filtered, y * (1 + rowSize) + 1, y * rowSize, (y + 1) * rowSize);
  }

  const compressed = zlib.deflateSync(filtered, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bit
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // Deflate
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // No interlace

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', compressed),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}

function cropPNG(inputPath, outputPath) {
  const png = parsePNG(inputPath);
  if (!png) return;

  const { width, height, rawData } = png;
  let minX = width, minY = height, maxX = 0, maxY = 0;
  let hasPixels = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = rawData[(y * width + x) * 4 + 3];
      if (a > 10) {
        hasPixels = true;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!hasPixels) return;

  // Add 4px padding
  minX = Math.max(0, minX - 4);
  minY = Math.max(0, minY - 4);
  maxX = Math.min(width - 1, maxX + 4);
  maxY = Math.min(height - 1, maxY + 4);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const cropData = Buffer.alloc(cropW * cropH * 4);

  for (let y = 0; y < cropH; y++) {
    const srcStart = ((minY + y) * width + minX) * 4;
    const srcEnd = srcStart + cropW * 4;
    const destStart = y * cropW * 4;
    rawData.copy(cropData, destStart, srcStart, srcEnd);
  }

  const outBuf = encodePNG(cropW, cropH, cropData);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, outBuf);
  console.log(`Trimmed ${path.basename(inputPath)} -> ${cropW}x${cropH}`);
}

function processDirectory(srcDir, outDir) {
  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const full = path.join(srcDir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file.includes('Unused assets')) continue;
      processDirectory(full, path.join(outDir, file));
    } else if (file.endsWith('.png')) {
      const cleanName = file.replace('.png.png', '.png');
      cropPNG(full, path.join(outDir, cleanName));
    }
  }
}

processDirectory('src/assets', 'public/assets/trimmed');
processDirectory('src/assets', 'src/assets/trimmed');
console.log('Finished trimming all assets!');
