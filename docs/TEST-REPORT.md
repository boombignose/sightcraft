# Sightcraft — ผลตรวจและขอบเขตหลักฐาน

วันที่ตรวจ: 14 ตุลาคม 2026 · ชุดไฟล์รุ่น 1.0.0

อัปเดต 1.1: ดูผล motion, ตะกร้า, persistence และดาวน์โหลดสรุปใน [STOREFRONT-TEST.md](STOREFRONT-TEST.md) รายงานด้านล่างเก็บขอบเขตของตัวอย่างเดิม

## สิ่งที่ตรวจแล้ว

| รายการ | ผล | หลักฐาน |
| --- | --- | --- |
| Python standard-library tests | ผ่าน 8 กรณี | `python3 -m unittest discover -s tests -v` |
| ไฟล์จำเป็นและลิงก์ภายใน | ผ่าน `python3 scripts/check_repo.py` | ตัวตรวจไม่เชื่อมเน็ต และไม่ตัดสินคุณภาพภาพ/AI |
| Skill frontmatter | ผ่าน quick_validate.py ของ skill-creator | ตรวจโครงสร้าง ไม่ได้พิสูจน์ native discover |
| เว็บต้นแบบ | เปิดจริงและบันทึกภาพ | [บันทึก browser](evidence/reference-browser.json) |
| เว็บภาษาไทย | เปิดจริงที่ 1440×1000, 390×844, 320×740 ไม่มี horizontal overflow | [บันทึก browser](evidence/result-browser.json), [ภาพ 320px](evidence/result-320.png) |
| การเข้าถึงพื้นฐาน | Tab มี focus; Space เปิด/ปิด details; CTA ไป #work จริง | บันทึก browser และตรวจภาพ |
| ขยายข้อความ | เพิ่มขนาดข้อความทุก element ที่มีข้อความโดยตรงเป็น 200% ที่ viewport 390px ไม่มี horizontal overflow | [ภาพช่วงบนหลังขยาย](evidence/result-text-200.png) |
| Contrast ของคู่สีหลัก | Ink/paper 13.07:1, muted/paper 6.26:1, ink/lime 12.01:1, focus/paper 6.48:1 | [ผลคำนวณ WCAG relative luminance](evidence/contrast.json) |
| หน้าเปรียบเทียบ | เปิดจริงที่ 1440×1000 และ 390×844; ภาพทั้งสี่โหลดได้; Space เปิดภาพมือถือได้ | [ภาพเดสก์ท็อป](evidence/gallery-desktop.png), [ภาพมือถือ](evidence/gallery-mobile.png) |
| External page resources | ไม่พบคำขอออกนอก localhost จากหน้าตัวอย่าง/หน้าเปรียบเทียบ | รายการ externalRequests ว่างใน browser records |
| Review | ผู้ตรวจแยกอ่าน Skill/templates/checker/ตัวอย่าง ไม่พบปัญหาสำคัญ | ตรวจแบบ read-only พร้อมรัน 8 tests |

ทดสอบ browser ด้วย Chrome 155 บน macOS ผ่าน DevTools Protocol การขยายข้อความข้างต้นคือการปรับ computed font sizes ไม่ใช่ผลทดสอบ browser zoom หรือระบบช่วยการเข้าถึงทุกแบบ

## ตรวจภาพก่อน–หลัง

เปิดดูภาพ reference และ result ที่ render จริงทั้งเดสก์ท็อปและมือถือแล้ว ลำดับหัวเรื่อง โปสเตอร์ โทนกระดาษ accent และผลงานสองคอลัมน์ยังอยู่ครบ เว็บไทยเพิ่ม line-height และพื้นที่ให้วรรณยุกต์ เมนูมือถือขึ้นสองแถวและผลงานเรียงลงได้

ความต่างที่ตั้งใจ: ข้อความ/ชื่อธุรกิจเปลี่ยนเป็นไทย ฟอนต์ระบบไม่ได้จำลองฟอนต์จริง ตราวงกลมบนโปสเตอร์อยู่ด้านหน้ารูปทรงในผลลัพธ์ การตัดบรรทัดและความสูงหน้าเปลี่ยนตามภาษา เมื่อขยาย 200% หัวเรื่องบางคำขึ้นหลายบรรทัดเพื่อให้เนื้อหาแสดงครบ

## การทดสอบ Skill ที่ยังมีขอบเขต

- ตัวอย่างหลักและกรณีภาพถูกตัดทำโดยผู้จัดทำที่รู้ต้นแบบ ไม่ใช่การทดสอบโมเดลแบบอิสระ จึงไม่มีคะแนนความแม่นยำหรือข้ออ้างว่าใช้ได้เหมือนกันทุกโมเดล
- กรณี [ภาพถูกตัด](../examples/studio/CROPPED-CASE.md) แสดงผลลัพธ์ที่ควรได้: บอกว่า CTA และเนื้อหาด้านล่างยังไม่เห็น แยกการเสนอต่อจากหลักฐาน
- ยังไม่ได้ทดสอบติดตั้ง/auto-discover Skill บนเครื่องใหม่ และยังไม่ได้รันทดสอบ native installation ใน ChatGPT/Claude เส้นทางแนบไฟล์ในแชตเป็นคู่มือใช้งานด้วยตนเอง
- ยังไม่ได้ตรวจ Safari/Firefox, screen reader จริง หรือทุกคู่สีเล็ก ๆ ในกราฟิกตกแต่ง
- Workflow GitHub Actions แนบไว้ แต่ยังไม่ได้รันบน GitHub; ไม่ได้สร้าง remote repo หรือเผยแพร่เว็บ/โพสต์

## ตรวจไฟล์แจก

สร้าง ZIP รุ่นเตรียมส่งมอบจากรายการไฟล์ใน Git แล้วแตกไปยัง path ใหม่ที่มีทั้งภาษาไทยและช่องว่าง รัน 8 tests และตัวตรวจลิงก์จากโฟลเดอร์ที่แตกไฟล์ผ่าน เปิด index.html ด้วย file:// โดยบล็อก http/https แล้วภาพเปรียบเทียบทั้งสี่โหลดได้ ลิงก์ไปยังเว็บผลลัพธ์เปิดได้และ CTA ไป #work จริง

หลักฐาน: [บันทึกตรวจ archive รุ่นเตรียมส่งมอบ](evidence/archive-test.json) และ [ภาพหน้าเปรียบเทียบที่เปิดจากไฟล์แตก ZIP](evidence/archive-gallery.png) ชุดส่งมอบสุดท้ายตรวจซ้ำหลัง commit โดยเก็บ SHA-256 และจำนวนไฟล์ไว้ใน receipt ข้าง ZIP เพื่อไม่อ้าง hash ของ archive ภายในตัว archive เอง

## รันซ้ำ

จากโฟลเดอร์ที่แตก ZIP ใช้ `python3 -m unittest discover -s tests -v` และ `python3 scripts/check_repo.py` แล้วเปิด index.html ใน browser ตรวจภาพและลิงก์ตัวอย่างด้วยตัวเอง โดยไม่ต้องมีเซิร์ฟเวอร์

ตัวตรวจลิงก์รองรับ inline Markdown/HTML และ HTML fragment ไม่ตรวจ remote URL, Markdown anchor, CSS URL หรือ reference-style Markdown การตรวจโครงสร้างผ่านไม่รับรองคุณภาพดีไซน์หรือการทำตาม Skill ของ AI
