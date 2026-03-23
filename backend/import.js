const XLSX = require('xlsx');
const mongoose = require('mongoose');
const Student = require('./models/Student');
const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const MONGO_URI = 'mongodb+srv://mohammedyf786_db_user:qqbCtQVWgfJORXhz@tceme.zsjllke.mongodb.net/tceme?appName=tceme';

// 🔧 Path to your Excel file
const EXCEL_FILE = './data/All Student List ME Dept New.xlsx';

// 🔧 Sheet name - check tab name at bottom of Excel file
const STUDENT_SHEET = 'All students';

// 🔧 Map your Excel columns → model fields
function mapStudentRow(row) {
  return {
    name:       row['Student Name']  || '',
    regNo:      String(row['Roll Number'] || ''),
    department: 'Mechanical Engineering',
    batch:      String(row['BATCH'] || '').trim(),
    tutorName:  row['Tutor Name']    || '',
    email:      row['Email']         || '',
    phone:      String(row['Phone']  || ''),
    photo:      row['Photo']         || '',
  };
}

async function importData() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const workbook = XLSX.readFile(EXCEL_FILE);

  console.log('📋 Sheets found:', workbook.SheetNames);

  const sheetName = workbook.SheetNames.includes(STUDENT_SHEET)
    ? STUDENT_SHEET
    : workbook.SheetNames[0];

  console.log(`📄 Using sheet: "${sheetName}"`);

  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log(`📊 Rows found: ${rows.length}`);

  if (rows.length > 0) {
    console.log('🔍 First row columns:', Object.keys(rows[0]));
  }

  const docs = rows.map(mapStudentRow).filter(d => d.name);

  await Student.deleteMany({});
  await Student.insertMany(docs, { ordered: false });
  console.log(`✅ Imported ${docs.length} student records`);

  await mongoose.disconnect();
  console.log('✅ Import complete!');
}

importData().catch(err => {
  console.error('❌ Import failed:', err.message);
  process.exit(1);
});
