(function () {
  const products = [...document.querySelectorAll('[data-product]')].map(card => ({
    id: card.dataset.product, name: card.querySelector('h3').textContent, price: Number(card.dataset.price),
  }));
  const key = 'sightcraft.orbit.cart.v1';
  const dialog = document.getElementById('cart-dialog');
  const openButton = document.getElementById('open-cart');
  const closeButton = document.getElementById('close-cart');
  const list = document.getElementById('cart-items');
  const count = document.getElementById('cart-count');
  const downloadButton = document.getElementById('download-summary');
  const clearButton = document.getElementById('clear-cart');
  const storageMessage = document.getElementById('storage-message');
  const status = document.getElementById('cart-status');
  const dialogStatus = document.getElementById('cart-dialog-status');
  const money = value => '฿' + value.toLocaleString('en-US');
  let items = [];
  let storage;
  let statusTimer;
  try {
    storage = window.localStorage;
    items = OrbitCart.readCart(storage.getItem(key), products);
    if (location.protocol === 'file:') storageMessage.textContent = 'ตะกร้าอาจไม่ถูกจำเมื่อเปิดไฟล์โดยตรง ดูวิธีเปิดผ่านเซิร์ฟเวอร์ในคู่มือ';
  } catch (error) {
    storageMessage.textContent = error instanceof SyntaxError || error instanceof RangeError
      ? 'ข้อมูลตะกร้าเดิมอ่านไม่ได้ เริ่มตะกร้าใหม่สำหรับรอบนี้'
      : 'เบราว์เซอร์ไม่อนุญาตให้จำตะกร้า ใช้งานได้ในรอบนี้แต่ข้อมูลอาจหายหลังปิดหน้า';
  }

  function announce(message) {
    clearTimeout(statusTimer);
    status.textContent = dialogStatus.textContent = '';
    (dialog.open ? dialogStatus : status).textContent = message;
    statusTimer = setTimeout(() => { status.textContent = dialogStatus.textContent = ''; }, 4000);
  }

  function persist() {
    try { storage?.setItem(key, JSON.stringify({ version: 1, items })); }
    catch { storageMessage.textContent = 'บันทึกตะกร้าไม่ได้ ใช้งานได้ในรอบนี้แต่ข้อมูลอาจหายหลังปิดหน้า'; }
  }

  function actionButton(text, action, id, label, disabled = false) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.dataset.action = action;
    button.dataset.id = id;
    button.className = action === 'remove' ? 'remove-button' : 'quantity-button';
    button.setAttribute('aria-label', label);
    button.disabled = disabled;
    return button;
  }

  function renderCart() {
    const active = document.activeElement;
    const restore = dialog.open && list.contains(active);
    const summary = OrbitCart.summarize(items, products);
    count.textContent = summary.count;
    openButton.setAttribute('aria-label', `เปิดตะกร้า ${summary.count} ชิ้น`);
    document.getElementById('cart-total').textContent = money(summary.total);
    clearButton.disabled = downloadButton.disabled = summary.count === 0;
    list.replaceChildren();
    if (!summary.count) {
      const empty = document.createElement('p');
      empty.className = 'empty-cart';
      empty.textContent = 'ตะกร้ายังว่าง เลือกสินค้าที่คุณสนใจแล้วเพิ่มลงตะกร้า';
      list.append(empty);
    }
    for (const item of summary.items) {
      const row = document.createElement('section');
      row.className = 'cart-line';
      row.dataset.cartItem = item.id;
      const title = document.createElement('h3');
      title.textContent = item.name;
      const price = document.createElement('p');
      price.textContent = `${money(item.price)} / ชิ้น · รวม ${money(item.total)}`;
      const quantity = document.createElement('div');
      quantity.className = 'quantity';
      quantity.setAttribute('role', 'group');
      quantity.setAttribute('aria-label', `จำนวน ${item.name}`);
      const value = document.createElement('output');
      value.textContent = item.quantity;
      value.setAttribute('aria-label', `จำนวน ${item.quantity} ชิ้น`);
      quantity.append(
        actionButton('−', 'decrease', item.id, `ลดจำนวน ${item.name}`, item.quantity === 1),
        value,
        actionButton('+', 'increase', item.id, `เพิ่มจำนวน ${item.name}`, item.quantity === 99),
        actionButton('นำออก', 'remove', item.id, `นำ ${item.name} ออกจากตะกร้า`),
      );
      row.append(title, price, quantity);
      list.append(row);
    }
    if (restore) {
      const target = [...list.querySelectorAll('button')].find(button => button.dataset.action === active.dataset.action && button.dataset.id === active.dataset.id && !button.disabled);
      (target || closeButton).focus();
    }
  }

  function update(id, quantity, message) {
    items = OrbitCart.changeQuantity(items, id, quantity, products);
    persist();
    renderCart();
    announce(message);
  }

  document.querySelectorAll('[data-add]').forEach(button => {
    button.disabled = false;
    const product = products.find(product => product.id === button.dataset.add);
    button.setAttribute('aria-label', `เพิ่ม ${product.name} ลงตะกร้า`);
    button.addEventListener('click', () => {
      const quantity = items.find(item => item.id === product.id)?.quantity || 0;
      if (quantity === 99) { announce('เพิ่มได้สูงสุด 99 ชิ้นต่อสินค้า'); return; }
      update(product.id, quantity + 1, `เพิ่ม ${product.name} ลงตะกร้าแล้ว`);
      count.classList.remove('confirm');
      void count.offsetWidth;
      count.classList.add('confirm');
    });
  });
  list.addEventListener('click', event => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const item = items.find(item => item.id === button.dataset.id);
    if (!item) return;
    const quantity = button.dataset.action === 'remove' ? 0 : item.quantity + (button.dataset.action === 'increase' ? 1 : -1);
    update(item.id, quantity, quantity ? 'อัปเดตจำนวนสินค้าแล้ว' : 'นำสินค้าออกจากตะกร้าแล้ว');
  });
  openButton.disabled = false;
  openButton.addEventListener('click', () => { renderCart(); dialog.showModal(); document.body.classList.add('cart-open'); });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('cart-open'); openButton.focus(); });
  clearButton.addEventListener('click', () => {
    items = [];
    persist();
    renderCart();
    closeButton.focus();
    announce('ล้างตะกร้าแล้ว');
  });
  downloadButton.addEventListener('click', () => {
    if (!items.length) return;
    const blob = new Blob([OrbitCart.summaryText(OrbitCart.summarize(items, products))], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orbit-summary.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce('สร้างไฟล์สรุปรายการในเครื่องแล้ว');
  });
  renderCart();
})();
