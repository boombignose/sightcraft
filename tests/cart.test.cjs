const test = require('node:test');
const assert = require('node:assert/strict');
const cart = require('../examples/storefront/cart.js');
const products = [
  { id: 'phone', name: 'Orbit Phone Pro', price: 29900 },
  { id: 'buds', name: 'Orbit Buds', price: 3900 },
];

test('two phones and one set of buds total 63,700 baht, using catalog prices', () => {
  let items = cart.changeQuantity([], 'phone', 2, products);
  items = cart.changeQuantity(items, 'buds', 1, products);
  assert.deepEqual(cart.summarize(items, products), {
    items: [
      { id: 'phone', name: 'Orbit Phone Pro', price: 29900, quantity: 2, total: 59800 },
      { id: 'buds', name: 'Orbit Buds', price: 3900, quantity: 1, total: 3900 },
    ],
    count: 3, total: 63700,
  });
});

test('quantity updates keep other lines and zero removes without changing the original cart', () => {
  const original = [{ id: 'phone', quantity: 2 }, { id: 'buds', quantity: 1 }];
  assert.deepEqual(cart.changeQuantity(original, 'phone', 1, products), [{ id: 'buds', quantity: 1 }, { id: 'phone', quantity: 1 }]);
  assert.deepEqual(cart.changeQuantity(original, 'phone', 0, products), [{ id: 'buds', quantity: 1 }]);
  assert.equal(original[0].quantity, 2);
  assert.deepEqual(cart.summarize([], products), { items: [], count: 0, total: 0 });
});

test('unknown product and invalid quantities cannot enter a cart', () => {
  assert.throws(() => cart.changeQuantity([], 'unknown', 1, products), RangeError);
  for (const quantity of [-1, 1.5, 100, NaN, '2']) {
    assert.throws(() => cart.changeQuantity([], 'phone', quantity, products), RangeError);
  }
  assert.equal(cart.changeQuantity([], 'phone', 99, products)[0].quantity, 99);
});

test('saved data contains IDs and quantities; saved prices are ignored', () => {
  assert.deepEqual(cart.readCart(null, products), []);
  const items = cart.readCart('{"version":1,"items":[{"id":"phone","quantity":2,"price":1}]}', products);
  assert.deepEqual(items, [{ id: 'phone', quantity: 2 }]);
  assert.equal(cart.summarize(items, products).total, 59800);
});

test('corrupt, outdated, duplicate or invalid stored carts are rejected for UI recovery', () => {
  assert.throws(() => cart.readCart('{broken', products), SyntaxError);
  for (const value of [null, [], {version:2,items:[]}, {version:1,items:[{id:'unknown',quantity:1}]}, {version:1,items:[{id:'phone',quantity:0}]}, {version:1,items:[{id:'phone',quantity:1},{id:'phone',quantity:2}]}]) {
    assert.throws(() => cart.readCart(JSON.stringify(value), products), RangeError);
  }
});

test('download summary lists the chosen items and total without implying an order was sent', () => {
  const summary = cart.summarize([{id:'phone',quantity:2},{id:'buds',quantity:1}], products);
  const text = cart.summaryText(summary);
  assert.ok(text.includes('Orbit Phone Pro × 2 — ฿59,800'));
  assert.ok(text.includes('รวม 3 ชิ้น — ฿63,700'));
  assert.ok(text.includes('ยังไม่ใช่คำสั่งซื้อ'));
  assert.throws(() => cart.summaryText(cart.summarize([], products)), RangeError);
});

test('negative or fractional catalog prices cannot enter totals', () => {
  for (const price of [-1,1.5,Number.MAX_SAFE_INTEGER+1]) {
    assert.throws(() => cart.summarize([{id:'phone',quantity:1}], [{id:'phone',name:'Phone',price}]), RangeError);
  }
});
