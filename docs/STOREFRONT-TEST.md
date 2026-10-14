# Sightcraft 1.1 — Motion + working storefront

ตรวจวันที่ 14 ตุลาคม 2026 ด้วย Chrome 155 บน macOS ภาพและ browser records อยู่ใน [evidence/storefront](evidence/storefront)

## ผลทดสอบจริง

- ใช้ pointer กด Phone 2 เครื่องและ Buds 1 ชุด ได้ **฿63,700** เพิ่ม Phone เป็น 3 ได้ **฿93,600** ลดกลับได้ยอดเดิม
- ปิด dialog ด้วย Escape คืน focus ไปปุ่มเปิดตะกร้า เปิดหน้าใหม่บน localhost แล้วจำนวนยังเป็น 3 ชิ้น
- กดดาวน์โหลดจริงและเปิด [ไฟล์สรุป](evidence/storefront/sample-summary.txt) พบ 3 ชิ้น รวม 63,700 พร้อมข้อความ “ยังไม่ใช่คำสั่งซื้อ”
- Keyboard Tab อยู่ภายใน native modal นำ Buds ออกเหลือ 59,800 ล้างแล้วแสดงตะกร้าว่างและปุ่มดาวน์โหลดปิดใช้
- ไม่มี page overflow ที่ 1440×1000, 390×844, 320×740, 767×900 และ 768×900 รวมข้อความ 200% ที่ 390px
- Normal motion: browser แสดง animation `arrive` ระยะ 0.42s และ panel `panel-in`; reduced motion แสดง animation `none`, transition `0s` และ controls ยังทำงาน
- Saved JSON เสีย: มีข้อความเริ่มตะกร้าใหม่; quantity 99 ไม่เพิ่มเกิน; ปิดกั้น localStorage แล้วเพิ่มสินค้า/เห็นยอด 29,900 ใน session ได้ พร้อมข้อความบันทึกไม่ได้
- เปิด file:// แล้ว local scripts และตะกร้าทำงานใน Chrome ที่ตรวจ ไม่พบ external request หรือ runtime exception ใน flow ปกติ

หลักฐานเต็ม: [browser.json](evidence/storefront/browser.json), [ภาพ desktop](evidence/storefront/desktop.png), [ภาพ mobile](evidence/storefront/mobile.png), [ตะกร้าบน desktop](evidence/storefront/cart-desktop.png), [ตะกร้าบนมือถือ](evidence/storefront/cart-mobile.png)

## Tests และขอบเขต

`node --test tests/cart.test.cjs` ตรวจ arithmetic, quantity bounds/removal, corrupt/version/duplicate/unknown storage, การไม่เชื่อ saved prices, summary text และราคา catalog ที่ไม่ถูกต้อง ใช้ Node built-ins ไม่มี package เพิ่ม

Python package checks ยังตรวจลิงก์และรูปแบบชุดไฟล์ แยกจากการตรวจภาพ/interaction จริง ไม่ได้รัน GitHub CI และยังไม่ได้ทดสอบ native skill auto-discovery บนเครื่องใหม่

ตรวจภาพที่ render จริงแล้ว UI รักษาบุคลิกเดิม มีปุ่มตะกร้าบน nav และ panel ที่อ่านชัดทั้งสองขนาด มือถือปรับลูกศรขึ้นไปริมแถวเพื่อลดระยะว่าง ภาพสินค้ายังเป็น SVG ตัวอย่าง ไม่มีการรับเงิน ส่งออเดอร์ เก็บข้อมูลบุคคล หรือ stock backend ยังไม่ตรวจ Safari/Firefox และ screen reader จริง

การจำตะกร้าผ่าน file:// ไม่รับรองข้าม browser ให้เปิดบน localhost เพื่อใช้ origin เดิม ตาม [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) ข้อมูลใน localStorage ไม่ใช่ฐานข้อมูลออเดอร์ และลบได้จาก browser
