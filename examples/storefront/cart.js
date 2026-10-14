(function (root) {
  function productFor(id, quantity, products, minimum = 1) {
    const product = products.find(product => product.id === id);
    if (!product || !Number.isInteger(quantity) || quantity < minimum || quantity > 99 || !Number.isSafeInteger(product.price) || product.price < 0) {
      throw new RangeError('Invalid product or quantity');
    }
    return product;
  }

  function changeQuantity(items, id, quantity, products) {
    productFor(id, quantity, products, 0);
    const remaining = items.filter(item => item.id !== id);
    return quantity === 0 ? remaining : [...remaining, { id, quantity }];
  }

  function summarize(items, products) {
    const lines = items.map(item => {
      const product = productFor(item.id, item.quantity, products);
      return { id: item.id, name: product.name, price: product.price, quantity: item.quantity, total: product.price * item.quantity };
    });
    return { items: lines, count: lines.reduce((sum, item) => sum + item.quantity, 0), total: lines.reduce((sum, item) => sum + item.total, 0) };
  }

  function readCart(text, products) {
    if (text === null) return [];
    const saved = JSON.parse(text);
    if (!saved || saved.version !== 1 || !Array.isArray(saved.items) || saved.items.length > products.length) throw new RangeError('Invalid saved cart');
    const seen = new Set();
    return saved.items.map(item => {
      if (!item || seen.has(item.id)) throw new RangeError('Invalid saved cart item');
      productFor(item.id, item.quantity, products);
      seen.add(item.id);
      return { id: item.id, quantity: item.quantity };
    });
  }

  function summaryText(summary) {
    if (!summary.count) throw new RangeError('Cart is empty');
    const money = value => '฿' + value.toLocaleString('en-US');
    return ['Orbit Store — สรุปรายการในเครื่อง', '', ...summary.items.map(item => `${item.name} × ${item.quantity} — ${money(item.total)}`), '', `รวม ${summary.count} ชิ้น — ${money(summary.total)}`, '', 'รายการนี้ยังไม่ใช่คำสั่งซื้อ ไม่มีการส่งข้อมูลหรือรับชำระเงิน'].join('\n');
  }

  const api = { changeQuantity, summarize, readCart, summaryText };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OrbitCart = api;
})(globalThis);
