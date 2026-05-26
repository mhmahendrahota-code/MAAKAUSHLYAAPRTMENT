import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOCK_DB_PATH = path.join(__dirname, 'mock_db.json');
const SCHEMA_PATH = path.join(__dirname, '../models/schema.sql');

dotenv.config();

const { Pool } = pg;

let dbPool = null;
let isFallbackMode = false;

// Reactive Persistent Proxy for Mock Fallback Database
function createPersistedArrayProxy(arr) {
  return new Proxy(arr, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value === 'function') {
        return function (...args) {
          const result = value.apply(this, args);
          // Auto-persist on any mutating array method
          if (['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].includes(prop)) {
            saveMockDb();
          }
          return result;
        };
      }
      return value;
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver);
      saveMockDb();
      return result;
    }
  });
}

function createMockDbProxy(dbObj) {
  for (const key of Object.keys(dbObj)) {
    if (Array.isArray(dbObj[key])) {
      dbObj[key] = createPersistedArrayProxy(dbObj[key]);
    }
  }

  return new Proxy(dbObj, {
    set(target, prop, value, receiver) {
      if (Array.isArray(value)) {
        value = createPersistedArrayProxy(value);
      }
      const result = Reflect.set(target, prop, value, receiver);
      saveMockDb();
      return result;
    }
  });
}

// Dynamic In-Memory Store for Mocking DB when PostgreSQL is unavailable
export const mockDb = createMockDbProxy({
  users: [
    {
      id: 100,
      name: "आरडब्ल्यूए प्रशासक (RWA Admin)",
      email: "admin@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2", // 'password123'
      role: "Admin",
      gender: "Male",
      flat_no: "A-100",
      phone: "9876543210",
      aadhaar_number: null,
      family_members: null,
      family_member_names: null,
      vehicles: null,
      move_in_date: null,
      lease_duration: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      profile_picture: null,
      created_at: new Date()
    },
    {
      id: 1,
      name: "नौशाद अहमद (Naushad Ahmad)",
      email: "naushad@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2", // 'password123'
      role: "Resident",
      gender: "Male",
      flat_no: "A-101",
      phone: "9770779072",
      aadhaar_number: "4321 8765 9900",
      family_members: 4,
      family_member_names: JSON.stringify([{name: "शबाना अहमद", phone: "9770779073"}, {name: "आसिफ अहमद", phone: "9770779074"}]),
      vehicles: JSON.stringify([{type: "Car", number: "CG 04 MB 0101", sticker: true}, {type: "Bike", number: "CG 04 K 9876", sticker: false}]),
      move_in_date: "2021-08-10",
      lease_duration: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      profile_picture: null,
      has_pet: true,
      pet_details: "1 Labra Dog (Jack)",
      created_at: new Date()
    },
    {
      id: 2,
      name: "सूफी इलियास चिश्ती (Sufi Illias Chisti)",
      email: "resident@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2", // 'password123'
      role: "Resident",
      gender: "Male",
      flat_no: "B-304",
      phone: "7869551226",
      aadhaar_number: null,
      family_members: null,
      family_member_names: null,
      vehicles: null,
      move_in_date: null,
      lease_duration: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      profile_picture: null,
      created_at: new Date()
    },
    {
      id: 3,
      name: "सुरक्षा गार्ड शिंदे (Gatekeeper)",
      email: "guard@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2", // 'password123'
      role: "Security",
      gender: "Male",
      flat_no: null,
      phone: "+918888877777",
      aadhaar_number: null,
      family_members: null,
      family_member_names: null,
      vehicles: null,
      move_in_date: null,
      lease_duration: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      profile_picture: null,
      created_at: new Date()
    },
    {
      id: 4,
      name: "स्वदेश कटियार (Swadesh Katiyar)",
      email: "swadesh@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-102",
      phone: "8966996677",
      aadhaar_number: null,
      family_members: null,
      family_member_names: null,
      vehicles: null,
      move_in_date: null,
      lease_duration: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      profile_picture: null,
      created_at: new Date()
    },
    {
      id: 5,
      name: "आलोक बारिया (Alok Bariya)",
      email: "alok@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-103",
      phone: "9109328032",
      occupancy_status: "Rented",
      owner_name: "प्रकाश बारिया",
      owner_phone: "9988776655",
      aadhaar_number: "5544 3322 1100",
      family_members: 2,
      lease_duration: "11 months",
      move_in_date: "2023-05-01",
      has_pet: true,
      pet_details: "1 Persian Cat",
      is_legacy_bachelor: true,
      exemption_ref: "RWA-2024-U72 (Date: 12-May-2024)",
      tenant_type: "Bachelor",
      police_verification_status: "verified",
      police_verification_date: "2023-05-10",
      noc_document_ref: "NOC/2023/102",
      bachelor_notes: "Legacy bachelor, approved by committee",
      created_at: new Date()
    },
    {
      id: 6,
      name: "अयाज़ भाई (Ayaz Bhai)",
      email: "ayaz@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-104",
      phone: "7879553997",
      created_at: new Date()
    },
    {
      id: 7,
      name: "डॉ. अमित सिंह (Dr. Amit Singh)",
      email: "amit@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-105",
      phone: "9926974248",
      created_at: new Date()
    },
    {
      id: 8,
      name: "हेमलाल पाल (Hemlal Pal)",
      email: "hemlal@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-106",
      phone: "9575836600",
      created_at: new Date()
    },
    {
      id: 9,
      name: "सर्वेश मिश्रा (Sarvesh Mishra)",
      email: "sarvesh@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-107",
      phone: "9907749456",
      occupancy_status: "Rented",
      owner_name: "गोपाल मिश्रा",
      owner_phone: "9111222333",
      aadhaar_number: "7766 5544 3322",
      family_members: 3,
      lease_duration: "24 months",
      move_in_date: "2022-10-01",
      has_pet: true,
      pet_details: "2 Lovebirds",
      tenant_type: "Bachelor",
      police_verification_status: "pending",
      police_verification_date: null,
      noc_document_ref: null,
      bachelor_notes: "3 flatmates. Need police verification.",
      created_at: new Date()
    },
    {
      id: 10,
      name: "आकाश दुबे (Akash Dubey)",
      email: "akash@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-108",
      phone: "8823006747",
      created_at: new Date()
    },
    {
      id: 11,
      name: "लाल बहादुर यादव (Lal Bahadur Yadav)",
      email: "lalbahadur@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-109",
      phone: "9329995551",
      created_at: new Date()
    },
    {
      id: 12,
      name: "भरत कुमार अग्रवाल (Bharat Kumar Agrawal)",
      email: "bharat@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-111",
      phone: "7778889990",
      aadhaar_number: null,
      family_members: null,
      family_member_names: null,
      vehicles: null,
      move_in_date: null,
      lease_duration: null,
      emergency_contact_name: null,
      emergency_contact_phone: null,
      profile_picture: null,
      created_at: new Date()
    },
    {
      id: 13,
      name: "चंद्रकांत बुरांडे (Chandrakant Burande)",
      email: "chandrakant@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-111",
      phone: "8602451035",
      created_at: new Date()
    },
    {
      id: 14,
      name: "नरेंद्र परमार (Narendra Parmar)",
      email: "narendra@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-112",
      phone: "9827920102",
      created_at: new Date()
    },
    {
      id: 15,
      name: "हिमांशु (Himanshu)",
      email: "himanshu@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-113",
      phone: "7240889708",
      created_at: new Date()
    },
    {
      id: 16,
      name: "नरेश (Naresh)",
      email: "naresh@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-114",
      phone: "8602333455",
      created_at: new Date()
    },
    {
      id: 17,
      name: "अशोक निषाद (Ashok Nishad)",
      email: "ashok@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-115",
      phone: "9827928559",
      created_at: new Date()
    },
    {
      id: 18,
      name: "हेमंत पांडे (Hemant Pandey)",
      email: "hemant@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-116",
      phone: "9981112078",
      created_at: new Date()
    },
    {
      id: 19,
      name: "केदार हंडघोरे (Kedar Handghore)",
      email: "kedar@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-117",
      phone: "9022544971",
      created_at: new Date()
    },
    {
      id: 20,
      name: "राजू दास (Raju Das)",
      email: "raju@maakaushalya.com",
      password_hash: "$2a$10$sO7JsRFGkmx2mZ6Qg0ZNReaWgwcngSmtGLoKWsC3joOQ0fuzyFIb2",
      role: "Resident",
      gender: "Male",
      flat_no: "C-118",
      phone: "7697187098",
      created_at: new Date()
    }
  ],
  notices: [
    {
      id: 1,
      title: "वार्षिक आम बैठक - एजीएम (AGM)",
      content: "माँ कौशल्या अपार्टमेंट, सेक्टर 1 की वार्षिक आम बैठक (AGM) रविवार, 14 जून 2026 को सुबह 10:00 बजे क्लबहाउस में निर्धारित की गई है। सभी फ्लैट मालिकों से बैठक में भाग लेने का विनम्र अनुरोध है।",
      created_by: 1,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "लिफ्ट मरम्मत व रख-रखाव कार्यक्रम (Elevator Servicing)",
      content: "ब्लॉक B की लिफ्ट की सर्विसिंग कल दोपहर 2:00 बजे से शाम 5:00 बजे तक की जाएगी। कृपया इस अवधि के दौरान सीढ़ियों या ब्लॉक A की लिफ्ट का उपयोग करें। असुविधा के लिए खेद है।",
      created_by: 1,
      created_at: new Date()
    }
  ],
  bills: [
    {
      id: 1,
      resident_id: 2,
      amount: 4500.00,
      status: "unpaid",
      billing_month: "मई 2026",
      due_date: new Date(2026, 4, 30),
      created_at: new Date(2026, 4, 1)
    },
    {
      id: 2,
      resident_id: 2,
      amount: 4200.00,
      status: "paid",
      billing_month: "अप्रैल 2026",
      due_date: new Date(2026, 3, 30),
      paid_at: new Date(2026, 3, 10),
      payment_reference: "TXN1029384756",
      created_at: new Date(2026, 3, 1)
    }
  ],
  tickets: [
    {
      id: 1,
      title: "बाथरूम की छत से पानी का रिसाव (Water Seepage)",
      description: "बाथरूम की सीलिंग से लगातार पानी टपक रहा है। ऊपर वाले फ्लैट के पाइप से रिसाव होने की आशंका है। कृपया प्लंबर भेजने की कृपा करें।",
      category: "Plumbing",
      status: "open",
      created_by: 2,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "कॉरिडोर की लाइट खराब (Hallway Light Fused)",
      description: "फ्लैट B-304 के ठीक सामने लगी कॉरिडोर की सीलिंग ट्यूबलाइट फ्यूज हो गई है, इसे बदलने की कृपा करें।",
      category: "Electrical",
      status: "resolved",
      created_by: 2,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
  ],
  visitor_logs: [
    {
      id: 1,
      name: "रमेश शर्मा",
      phone: "+919876543210",
      purpose: "अमेज़न डिलीवरी (Amazon Delivery)",
      gender: "Male",
      flat_no: "B-304",
      check_in: new Date(Date.now() - 2 * 60 * 60 * 1000),
      check_out: new Date(Date.now() - 110 * 60 * 1000),
      logged_by: 3
    },
    {
      id: 2,
      name: "डॉ. विनय मेहता",
      phone: "+918887776665",
      purpose: "अतिथि (Guest)",
      gender: "Male",
      flat_no: "A-101",
      check_in: new Date(Date.now() - 1 * 60 * 60 * 1000),
      check_out: null,
      logged_by: 3
    }
  ],
  committee_members: [
    {
      id: 1,
      name: "नौशाद अहमद (Naushad Ahmad)",
      designation: "अध्यक्ष (President)",
      phone: "9770779072",
      email: "naushad@maakaushalya.com",
      flat_no: "A-101",
      display_order: 1
    },
    {
      id: 2,
      name: "स्वदेश कटियार (Swadesh Katiyar)",
      designation: "सचिव (Secretary)",
      phone: "8966996677",
      email: "swadesh@maakaushalya.com",
      flat_no: "C-102",
      display_order: 2
    },
    {
      id: 3,
      name: "आरडब्ल्यूए प्रशासक (RWA Admin)",
      designation: "कोषाध्यक्ष (Treasurer)",
      phone: "9876543210",
      email: "admin@maakaushalya.com",
      flat_no: "A-100",
      display_order: 3
    }
  ],
  helplines: [
    {
      id: 1,
      title: "मुख्य गार्ड गेट हाउस (Gate)",
      number: "+91 80 4910291",
      note: "इंटरकॉम: 99 / 24 घंटे आपातकालीन",
      display_order: 1
    },
    {
      id: 2,
      title: "सोसायटी एडमिन डेस्क (Resident Welfare Association)",
      number: "+91 80 4910292",
      note: "सोम - शनि: सुबह 9:30 - शाम 5:30",
      display_order: 2
    },
    {
      id: 3,
      title: "विद्युत रखरखाव (Electricity)",
      number: "+91 9988010291",
      note: "बिजली कट, प्लग, जनरेटर हेल्प",
      display_order: 3
    },
    {
      id: 4,
      title: "जल एवं प्लम्बर हेल्पलाइन (Water)",
      number: "+91 9988010292",
      note: "पानी रिसाव, टैंक शेड्यूल",
      display_order: 4
    }
  ],
  gallery_events: [
    { 
      id: 1, 
      title: "गणेश चतुर्थी उत्सव (Ganesh Chaturthi Utsav)", 
      content: "माँ कौशल्या अपार्टमेंट में गणेश चतुर्थी के पावन अवसर पर भव्य गणेश स्थापना और दैनिक संध्या आरती का आयोजन किया गया। अंतिम दिन सभी निवासियों की सहभागिता के साथ भंडारा और विसर्जन यात्रा निकाली गई।", 
      image_url: "https://images.unsplash.com/photo-1567591974584-f18551452228?w=800&auto=format&fit=crop&q=60", 
      event_date: new Date(2025, 8, 15) 
    },
    { 
      id: 2, 
      title: "स्वतंत्रता दिवस ध्वजारोहण (Independence Day Flag Hoisting)", 
      content: "15 अगस्त के शुभ अवसर पर सोसायटी परिसर में आरडब्ल्यूए समिति द्वारा ध्वजारोहण कार्यक्रम आयोजित किया गया। बच्चों के लिए देशभक्ति गीत व सांस्कृतिक प्रतियोगिताएं रखी गईं और अंत में मिठाई वितरित की गई।", 
      image_url: "https://images.unsplash.com/photo-1532375811409-905115e3b5a9?w=800&auto=format&fit=crop&q=60", 
      event_date: new Date(2025, 7, 15) 
    },
    { 
      id: 3, 
      title: "स्वच्छता एवं वृक्षारोपण अभियान (Green & Clean Drive)", 
      content: "माँ कौशल्या अपार्टमेंट को हरा-भरा और स्वच्छ बनाने के लिए आरडब्ल्यूए और युवा विंग द्वारा विशेष वृक्षारोपण अभियान चलाया गया। परिसर के विभिन्न कोनों में 50+ छायादार और औषधीय पौधे रोपे गए।", 
      image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60", 
      event_date: new Date(2026, 4, 10) 
    }
  ]
});

// Persistence Helpers for Mock Fallback Database
export const loadMockDb = () => {
  try {
    if (fs.existsSync(MOCK_DB_PATH)) {
      const data = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      
      // Parse ISO Date strings back to JavaScript Date objects symmetrically
      const parseDates = (obj) => {
        if (!obj || typeof obj !== 'object') return;
        for (const k of Object.keys(obj)) {
          if (typeof obj[k] === 'string' && (k.endsWith('_at') || k === 'move_in_date' || k.endsWith('_date') || k === 'created_at')) {
            const date = new Date(obj[k]);
            if (!isNaN(date.getTime())) obj[k] = date;
          } else if (typeof obj[k] === 'object') {
            parseDates(obj[k]);
          }
        }
      };
      parseDates(parsed);
      Object.assign(mockDb, parsed);
      console.log("📂 Persistent JSON Fallback Database loaded successfully.");
    } else {
      saveMockDb();
    }
  } catch (err) {
    console.warn("⚠️ Failed to load persistent JSON database:", err.message);
  }
};

export const saveMockDb = () => {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(mockDb, null, 2), 'utf-8');
  } catch (err) {
    console.error("⚠️ Failed to persist JSON database:", err.message);
  }
};

// Automatic SQL Schema and Seeding Utility
const initializeSchema = async () => {
  try {
    if (fs.existsSync(SCHEMA_PATH)) {
      const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf-8');
      
      // Split schema by semicolon to prevent PG multi-statement transaction errors
      const statements = schemaSql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => {
          // Remove comment-only lines and check if there's actual SQL remaining
          const withoutComments = stmt.split('\n').filter(line => !line.trim().startsWith('--')).join('\n').trim();
          return withoutComments.length > 0;
        });
        
      for (const statement of statements) {
        await dbPool.query(statement);
      }
      
      console.log("🚀 PostgreSQL Database tables initialized successfully from schema.sql.");

      // Check if database is empty to seed it
      const userCountRes = await dbPool.query("SELECT COUNT(*) FROM users");
      if (parseInt(userCountRes.rows[0].count) === 0) {
        console.log("🌱 Database is empty, seeding all data from mock database...");
        
        // --- Seed Users ---
        for (const user of mockDb.users) {
          await dbPool.query(
            `INSERT INTO users (id, name, email, password_hash, role, gender, flat_no, phone, occupancy_status, tenant_type, owner_name, owner_phone, aadhaar_number, family_members, family_member_names, vehicles, move_in_date, lease_duration, emergency_contact_name, emergency_contact_phone, profile_picture, has_pet, pet_details, is_legacy_bachelor, exemption_ref, police_verification_status, police_verification_date, noc_document_ref, bachelor_notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29) ON CONFLICT (email) DO NOTHING`,
            [user.id, user.name, user.email, user.password_hash, user.role, user.gender || 'Male', user.flat_no, user.phone, user.occupancy_status || 'Self-Occupied', user.tenant_type || 'Family', user.owner_name, user.owner_phone, user.aadhaar_number, user.family_members, user.family_member_names, user.vehicles, user.move_in_date, user.lease_duration, user.emergency_contact_name, user.emergency_contact_phone, user.profile_picture, user.has_pet || false, user.pet_details, user.is_legacy_bachelor || false, user.exemption_ref, user.police_verification_status || 'pending', user.police_verification_date || null, user.noc_document_ref || null, user.bachelor_notes || null]
          );
        }
        // Reset users sequence to max id
        await dbPool.query(`SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users))`);
        console.log("  ✅ Users seeded.");

        // --- Seed Notices ---
        for (const notice of mockDb.notices) {
          await dbPool.query(
            `INSERT INTO notices (id, title, content, created_by, created_at)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
            [notice.id, notice.title, notice.content, notice.created_by, notice.created_at]
          );
        }
        await dbPool.query(`SELECT setval('notices_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notices))`);
        console.log("  ✅ Notices seeded.");

        // --- Seed Bills ---
        for (const bill of mockDb.bills) {
          await dbPool.query(
            `INSERT INTO bills (id, resident_id, amount, status, billing_month, due_date, paid_at, payment_reference, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
            [bill.id, bill.resident_id, bill.amount, bill.status, bill.billing_month, bill.due_date, bill.paid_at || null, bill.payment_reference || null, bill.created_at]
          );
        }
        await dbPool.query(`SELECT setval('bills_id_seq', (SELECT COALESCE(MAX(id), 1) FROM bills))`);
        console.log("  ✅ Bills seeded.");

        // --- Seed Tickets ---
        for (const ticket of mockDb.tickets) {
          await dbPool.query(
            `INSERT INTO tickets (id, title, description, category, status, created_by, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (id) DO NOTHING`,
            [ticket.id, ticket.title, ticket.description, ticket.category, ticket.status, ticket.created_by, ticket.created_at, ticket.updated_at]
          );
        }
        await dbPool.query(`SELECT setval('tickets_id_seq', (SELECT COALESCE(MAX(id), 1) FROM tickets))`);
        console.log("  ✅ Tickets seeded.");

        // --- Seed Visitor Logs ---
        for (const log of mockDb.visitor_logs) {
          await dbPool.query(
            `INSERT INTO visitor_logs (id, name, phone, gender, purpose, flat_no, check_in, check_out, logged_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (id) DO NOTHING`,
            [log.id, log.name, log.phone, log.gender || 'Male', log.purpose, log.flat_no, log.check_in, log.check_out || null, log.logged_by]
          );
        }
        await dbPool.query(`SELECT setval('visitor_logs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM visitor_logs))`);
        console.log("  ✅ Visitor logs seeded.");

        // --- Seed Committee Members ---
        for (const member of mockDb.committee_members) {
          await dbPool.query(
            `INSERT INTO committee_members (id, name, designation, phone, email, flat_no, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
            [member.id, member.name, member.designation, member.phone, member.email, member.flat_no, member.display_order]
          );
        }
        await dbPool.query(`SELECT setval('committee_members_id_seq', (SELECT COALESCE(MAX(id), 1) FROM committee_members))`);
        console.log("  ✅ Committee members seeded.");

        // --- Seed Helplines ---
        for (const helpline of mockDb.helplines) {
          await dbPool.query(
            `INSERT INTO helplines (id, title, number, note, display_order)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
            [helpline.id, helpline.title, helpline.number, helpline.note, helpline.display_order]
          );
        }
        await dbPool.query(`SELECT setval('helplines_id_seq', (SELECT COALESCE(MAX(id), 1) FROM helplines))`);
        console.log("  ✅ Helplines seeded.");

        // --- Seed Gallery Events ---
        for (const event of mockDb.gallery_events) {
          await dbPool.query(
            `INSERT INTO gallery_events (id, title, content, image_url, event_date)
             VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING`,
            [event.id, event.title, event.content, event.image_url, event.event_date]
          );
        }
        await dbPool.query(`SELECT setval('gallery_events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM gallery_events))`);
        console.log("  ✅ Gallery events seeded.");

        console.log("🌱 All seed data populated successfully!");
      }
    }
  } catch (err) {
    console.error("⚠️ Failed to initialize SQL database schema:", err.message);
  }
};

// Initialize DB Client Pool
try {
  if (process.env.DATABASE_URL && process.env.DATABASE_FALLBACK !== 'true') {
    dbPool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Test the pool connection
    await dbPool.query('SELECT NOW()');
    console.log("🚀 PostgreSQL Database connected successfully.");
    await initializeSchema();
  } else {
    throw new Error("DATABASE_URL is not defined or DATABASE_FALLBACK is enabled.");
  }
} catch (error) {
  isFallbackMode = true;
  console.warn("⚠️ Database connection failed or fallback mode is active.");
  console.warn(`⚠️ Falling back to persistent JSON database. Reason: ${error.message}`);
  loadMockDb();
}

export const getDb = () => dbPool;
export const isFallback = () => isFallbackMode;

// Executing SQL raw helper
export const query = async (text, params) => {
  if (isFallbackMode) {
    throw new Error("Cannot execute direct SQL queries in Mock Fallback Mode.");
  }
  return dbPool.query(text, params);
};
