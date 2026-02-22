const table = new Uint32Array(256).map((_, i) => {
  let c = i;
  for (let k = 0; k < 8; k += 1) {
    c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

const crc32 = (data: Uint8Array) => {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const textEncoder = new TextEncoder();

const u16 = (value: number) => [value & 0xff, (value >>> 8) & 0xff];
const u32 = (value: number) => [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];

interface ZipFileInput {
  name: string;
  data: Uint8Array;
}

export const createZipBlob = (files: ZipFileInput[]): Blob => {
  const localHeaders: number[] = [];
  const centralHeaders: number[] = [];
  let offset = 0;

  files.forEach((file) => {
    const fileNameBytes = textEncoder.encode(file.name);
    const crc = crc32(file.data);

    const localHeader = [
      ...u32(0x04034b50),
      ...u16(20),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(crc),
      ...u32(file.data.length),
      ...u32(file.data.length),
      ...u16(fileNameBytes.length),
      ...u16(0),
      ...fileNameBytes,
      ...file.data,
    ];

    localHeaders.push(...localHeader);

    const centralHeader = [
      ...u32(0x02014b50),
      ...u16(20),
      ...u16(20),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(crc),
      ...u32(file.data.length),
      ...u32(file.data.length),
      ...u16(fileNameBytes.length),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u16(0),
      ...u32(0),
      ...u32(offset),
      ...fileNameBytes,
    ];

    centralHeaders.push(...centralHeader);
    offset += localHeader.length;
  });

  const centralSize = centralHeaders.length;
  const centralOffset = localHeaders.length;

  const endRecord = [
    ...u32(0x06054b50),
    ...u16(0),
    ...u16(0),
    ...u16(files.length),
    ...u16(files.length),
    ...u32(centralSize),
    ...u32(centralOffset),
    ...u16(0),
  ];

  const bytes = new Uint8Array([...localHeaders, ...centralHeaders, ...endRecord]);
  return new Blob([bytes], { type: 'application/zip' });
};
