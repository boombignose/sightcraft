// Run in the browser console on index.html: paste this file, then await orbitSelfCheck().
async function orbitSelfCheck() {
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const settle = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const menuButton = document.querySelector('.menu-button');
  const mobileMenu = document.querySelector('#mobile-menu');
  const originalMenu = !mobileMenu.hidden;
  menuButton.click();
  assert(menuButton.getAttribute('aria-expanded') === String(!originalMenu), 'Menu expanded state must match visibility');
  assert(mobileMenu.hidden === originalMenu, 'Menu must toggle visibility');
  if (mobileMenu.hidden) menuButton.click();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert(mobileMenu.hidden && menuButton.getAttribute('aria-expanded') === 'false', 'Escape must close the menu');
  menuButton.click();
  mobileMenu.querySelector('a').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
  assert(mobileMenu.hidden, 'Choosing a category must close the menu');
  setMenu(originalMenu);
  for (const controls of document.querySelectorAll('[data-rail]')) {
    const rail = document.getElementById(controls.dataset.rail);
    const [previous, next] = controls.querySelectorAll('button');
    const originalScroll = rail.scrollLeft;
    rail.scrollTo({ left: 0, behavior: 'instant' });
    rail.dispatchEvent(new Event('scroll'));
    await settle();
    const canScroll = rail.scrollWidth > rail.clientWidth + 1;
    assert(controls.hidden === !canScroll, 'Rail controls must reflect overflow');
    assert(previous.disabled, 'Previous arrow must be disabled at the start');
    if (canScroll) {
      next.click();
      // Wait for native smooth scrolling to settle before checking its actual result.
      await new Promise(resolve => setTimeout(resolve, 700));
      assert(rail.scrollLeft > 0, 'Next arrow must scroll the rail forward');
      previous.click();
      await new Promise(resolve => setTimeout(resolve, 700));
      assert(rail.scrollLeft <= 1, 'Previous arrow must scroll the rail back');
      rail.scrollTo({ left: rail.scrollWidth, behavior: 'instant' });
      rail.dispatchEvent(new Event('scroll'));
      await settle();
      assert(next.disabled, 'Next arrow must be disabled at the end');
    }
    rail.scrollTo({ left: originalScroll, behavior: 'instant' });
  }
  const luminance = css => {
    const linear = css.match(/\d+/g).slice(0, 3).map(value => { const v = Number(value) / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
    return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  };
  const background = luminance(getComputedStyle(document.body).backgroundColor);
  for (const text of document.querySelectorAll('.notice, .category-section p')) {
    const foreground = luminance(getComputedStyle(text).color);
    const ratio = (Math.max(background, foreground) + .05) / (Math.min(background, foreground) + .05);
    assert(ratio >= 4.5, 'Small muted text contrast must reach 4.5:1; actual ' + ratio.toFixed(2));
  }
  assert(document.documentElement.scrollWidth <= innerWidth, 'Document must stay within the viewport');
  return 'PASS: menu, Escape, category close, rail movement, rail limits, small-text contrast, viewport overflow';
}
