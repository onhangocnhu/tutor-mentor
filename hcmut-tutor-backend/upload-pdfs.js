/**
 * Script để upload PDF files trực tiếp vào hệ thống thư viện
 * Cách dùng: node upload-pdfs.js
 * 
 * Đặt các file PDF cần upload vào thư mục này trước khi chạy script
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_URL = 'http://localhost:3001/library/upload';

// Danh sách file PDF cần upload
const pdfFiles = [
  {
    filePath: './SBT_Vat_Ly_1.pdf', // Đặt file vào cùng thư mục với script
    title: 'Sách Bài Tập Vật Lý 1',
    author: 'Bộ môn Vật lý',
    year: 2023,
    category: 'Giáo trình',
    department: 'Khoa học Ứng dụng',
    language: 'Tiếng Việt',
    description: 'Sách bài tập Vật lý 1 dành cho sinh viên năm nhất các ngành kỹ thuật'
  },
  {
    filePath: './Rosen_Discrete_Mathematics.pdf',
    title: 'Discrete Mathematics and Its Applications (7th Edition)',
    author: 'Kenneth H. Rosen',
    year: 2012,
    category: 'Giáo trình',
    department: 'Khoa học & Kỹ thuật Máy tính',
    language: 'Tiếng Anh',
    description: 'Sách giáo trình Toán rời rạc ứng dụng trong Khoa học máy tính - Phiên bản thứ 7'
  },
  {
    filePath: './Quiz_Hoa_dai_cuong.pdf',
    title: 'Quiz 2: Cấu tạo nguyên tử',
    author: 'Bộ môn Hóa học',
    year: 2025,
    category: 'Đề thi',
    department: 'Khoa học Ứng dụng',
    language: 'Tiếng Việt',
    description: 'Đề quiz 2 môn Hóa đại cương - Chủ đề: Cấu tạo nguyên tử'
  }
];

async function uploadPdf(pdfInfo) {
  const { filePath, title, author, year, category, department, language, description } = pdfInfo;
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File không tồn tại: ${filePath}`);
    return null;
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('title', title);
  form.append('author', author);
  form.append('year', year.toString());
  form.append('category', category);
  form.append('department', department);
  form.append('language', language);
  form.append('description', description);
  form.append('type', 'digital');
  form.append('userId', 'student001');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: form,
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`✅ Đã upload: ${title}`);
      return data.document;
    } else {
      console.log(`❌ Lỗi upload ${title}: ${data.message}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Lỗi kết nối khi upload ${title}: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Bắt đầu upload PDF files...\n');
  console.log('📝 Hướng dẫn:');
  console.log('   1. Đặt các file PDF vào thư mục này');
  console.log('   2. Đổi tên file theo danh sách trong script');
  console.log('   3. Chạy: node upload-pdfs.js');
  console.log('');
  console.log('📁 Danh sách file cần có:');
  pdfFiles.forEach(pdf => {
    const exists = fs.existsSync(pdf.filePath);
    console.log(`   ${exists ? '✓' : '✗'} ${pdf.filePath} -> ${pdf.title}`);
  });
  console.log('');

  const existingFiles = pdfFiles.filter(pdf => fs.existsSync(pdf.filePath));
  
  if (existingFiles.length === 0) {
    console.log('⚠️ Không tìm thấy file PDF nào. Vui lòng đặt file vào thư mục này.');
    return;
  }

  console.log(`📤 Đang upload ${existingFiles.length} file...\n`);
  
  for (const pdf of existingFiles) {
    await uploadPdf(pdf);
  }
  
  console.log('\n✨ Hoàn thành!');
}

main();
