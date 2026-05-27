export type Language = "uz" | "en";
export type ContrastMode = "normal" | "high";
export type TextSize = "normal" | "large";

export type DeviceType = "smart-lock" | "temp-sensor" | "pacemaker" | "security-camera";

export interface IoTDeviceMetadata {
  id: DeviceType;
  nameUz: string;
  nameEn: string;
  icon: string;
  descriptionUz: string;
  descriptionEn: string;
  typicalPayloadUz: string;
  typicalPayloadEn: string;
  powerLimitUz: string;
  powerLimitEn: string;
}

export interface GlossaryItem {
  term: string;
  definitionUz: string;
  definitionEn: string;
  category: "Symmetric" | "Asymmetric" | "IoT" | "General";
}

export const IOT_DEVICES: IoTDeviceMetadata[] = [
  {
    id: "temp-sensor",
    nameUz: "Aqlli Termometr (Datchik)",
    nameEn: "Smart Temperature Sensor",
    icon: "Thermometer",
    descriptionUz: "Haroratni o'lchaydigan kichik datchik. Juda kam energiya va xotiraga ega. Batareyada yillar davomida ishlaydi.",
    descriptionEn: "Highly resource-constrained device. Senses temperature and transmits small numeric payloads. Runs on a coin battery for years.",
    typicalPayloadUz: "TEMP: 24.5C, HUMID: 48%",
    typicalPayloadEn: "TEMP: 24.5C, HUMID: 48%",
    powerLimitUz: "Juda yuqori cheklov (Atigi 8-bit Mikrokontroller, kichik batareya)",
    powerLimitEn: "Extremely lightweight budget (8-bit microcontrollers, coin cell battery)"
  },
  {
    id: "smart-lock",
    nameUz: "Aqlli Uskunalar va Qulflar",
    nameEn: "Smart Door Lock",
    icon: "Lock",
    descriptionUz: "Eshikni ochish va yopish buyruqlarini boshqaradigan xavfsizlik datchigi. Suyuq aloqa va minimal kechikish talab etiladi.",
    descriptionEn: "Allows keyless entry commands. Extremely sensitive to replay attacks. Low power budget but demands immediate, low-latency execution.",
    typicalPayloadUz: "CMD: UNLOCK, ID: DEV_40912",
    typicalPayloadEn: "CMD: UNLOCK, ID: DEV_40912",
    powerLimitUz: "O'rtacha cheklov (Kichik batareya, tezkor shifrlash talab etiladi)",
    powerLimitEn: "Medium lightweight budget (AAA batteries, fast responsive symmetric checking needed)"
  },
  {
    id: "pacemaker",
    nameUz: "Aqlli Elektrokardiostimulyator",
    nameEn: "Smart Pacemaker (Medical)",
    icon: "HeartPulse",
    descriptionUz: "Yurak urishini ushlab turadigan va shifokorga masofadan ma'lumot uzatadigan tibbiy implant. Xavfsizligi o'ta muhim bo'lgan hayotiy vosita.",
    descriptionEn: "Active medical implant regulating heartbeat. Ultra-critical medical safety. Encryption cannot fail; zero tolerance for overhead. Absolute key security required.",
    typicalPayloadUz: "HEART_RATE: 72, STATUS: OK, BATTERY: 92%",
    typicalPayloadEn: "HEART_RATE: 72, STATUS: OK, BATTERY: 92%",
    powerLimitUz: "Yuqori darajada kritik cheklov (Batareyani almashtirish jarrohlikni talab qiladi)",
    powerLimitEn: "Critical energy budget (Battery replacement requires surgery, ultra-low passive standby usage)"
  },
  {
    id: "security-camera",
    nameUz: "Aqlli Kuzatuv Kamerasi",
    nameEn: "Smart Industrial IP Camera",
    icon: "Video",
    descriptionUz: "Yuqori aniqlikdagi video oqimni tarmoqqa uzatadigan qurilma. Tezkor, yuqori tezlikda ma'lumot shifrlashni (AES) talab qiladi.",
    descriptionEn: "Streams high-definition real-time video feeds. Broad bandwidth but requires ultra-fast symmetric stream cipher blocks to prevent lag.",
    typicalPayloadUz: "[FRAME_DATA: 4096 bytes JPEG stream...]",
    typicalPayloadEn: "[FRAME_DATA: 4096 bytes JPEG stream...]",
    powerLimitUz: "Kam cheklov (Doimiy elektr tarmog'iga ulangan, lekin doimiy katta oqim shifrlanadi)",
    powerLimitEn: "Relatively unconstrained (AC Mains powered, but high bandwidth requires dedicated hardware acceleration)"
  }
];

export const GLOSSARY: GlossaryItem[] = [
  {
    term: "Simmetrik Shifrlash",
    definitionUz: "Ma'lumotni shifrlashda ham, deshifrlashda ham bir xil yashirin kalitdan foydalanadigan algoritmlar sinfi (Masalan: AES, ChaCha20). O'ta tez va kam energiya sarflaydi.",
    definitionEn: "Encryption where the same secret key is used both to encrypt and decrypt (e.g., AES, ChaCha20). Super fast, lightweight, perfect for bulk IoT data streaming.",
    category: "Symmetric"
  },
  {
    term: "Asimmetrik Shifrlash",
    definitionUz: "Matnni ochiq kalit (Public) orqali shifrlab, faqat shaxsiy kalit (Private) orqali ochishga imkon beradigan tizim (Masalan: RSA, ECC). Kalitlarni xavfsiz almashishda qo'llaniladi.",
    definitionEn: "A core method utilizing a public key for encryption and a private key for decryption (e.g. RSA, ECC). Guarantees security without pre-shared secret keys.",
    category: "Asymmetric"
  },
  {
    term: "Ochiq Kalit (Public Key)",
    definitionUz: "Barcha uchun ochiq bo'lgan va ma'lumotni shifrlashda qo'llaniladigan kalit. Uni tarmoqda bemalol uzatish mumkin, u orqali ma'lumot zararli kimsalar tomonidan ochilmaydi.",
    definitionEn: "A cryptographic key available to anyone. Used to encrypt payloads. Knowing this key does not reveal the decrypting private key.",
    category: "Asymmetric"
  },
  {
    term: "Maxfiy Kalit (Private Key)",
    definitionUz: "Faqatgina ma'lumot egasida (qurilmada yoki serverda) yashirin saqlanadigan kalit. U orqali shifrlangan ma'lumot o'qiladi. Uni boshqalarga uzatish mutlaqo mumkin emas.",
    definitionEn: "A strictly private key owned by one party (the device or server). Used to decrypt or sign data. Must never be exposed on the network.",
    category: "Asymmetric"
  },
  {
    term: "Gibrid Shifrlash (Hybrid Crypto)",
    definitionUz: "Zamonaviy dunyoning asosi: Kalitlarni almashish uchun asimmetrik shifrlashdan (RSA/ECC) foydalanib, haqiqiy ma'lumot oqimini shifrlash uchun tezroq simmetrik shifrlashga (AES) o'tiladi.",
    definitionEn: "The real-world design combines advantages: asymmetric encryption (RSA/ECC) securely shares a single-use session key, while high-speed symmetric (AES) encrypts block streams.",
    category: "General"
  },
  {
    term: "AES (Advanced Encryption Standard)",
    definitionUz: "Butun dunyoda tan olingan simmetrik shifrlash standarti. IoT qurilmalarida uni apparat darajasida tezlashtirish (hardware acceleration) orqali juda tez ishlatish mumkin.",
    definitionEn: "The worldwide standard symmetric algorithm. Often accelerated in silicon inside microcontrollers, providing high speed with minimal battery usage.",
    category: "Symmetric"
  },
  {
    term: "ECC (Elliptic Curve Cryptography)",
    definitionUz: "Elliptik egri chiziqli matematika asosidagi asimmetrik shifrlash. RSA algorithmga qaraganda ancha kalit o'lchami kichik bo'lsada, yuqori xavfsizlik taqdim etadi (IoT mos).",
    definitionEn: "Asymmetric cryptography utilizing elliptic curves. Delivers security matching 3072-bit RSA with just 256-bit keys, drastically saving RAM and transmit energy in IoT.",
    category: "Asymmetric"
  },
  {
    term: "Eavesdropper (Hacker/Sniffer)",
    definitionUz: "Tarmoq kanali bo'ylab ma'lumot ulanmalarini eshitib turgan ruxsatsiz kiber-hujumchi. Shifrlanmagan har bir sirni osongina o'g'irlaydi.",
    definitionEn: "An unauthorized visual or network interloper monitoring transmission lines. Instantly steals unencrypted cleartext data over unsecured channels.",
    category: "IoT"
  }
];
