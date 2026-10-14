# Sightcraft motion and working storefront

User selected: upgrade both Skill and demo with animation, product selection, cart and local summary. Keep the screenshot-to-DESIGN.md-to-BUILD-PROMPT.md interface, add motion/interaction decisions to both documents, and distinguish proposed animation from observed motion.

Reuse the original Orbit HTML/SVG from the real-site evaluation as examples/storefront; do not bundle Apple screenshots. Keep runtime dependency-free and local. Cart supports four fixed sample products, add/update/remove/clear, integer quantity 1–99, integer THB prices from the local catalog, reload persistence where storage is available, and a downloadable text summary. No personal-data fields, real order submission, payment, backend or deployment.

Public test interfaces confirmed by the selected user flow: pure cart operations/summary and actual browser UI controls. Invalid saved cart/schema/IDs/quantities must be rejected; denied storage must retain session functionality and explain the limit. Default content remains visible without animation, reduced motion disables decorative motion, dialog has a name, keyboard close/focus restoration and live status.

Motion: 160ms feedback, 240ms panel, 420ms entrance; opacity/transform for hero/cards/cart and a brief badge confirmation. Preserve the existing style. Improve the mobile vertical gap by placing rail controls at the edge instead of a separate tall row.

Verify cart arithmetic and malformed input with Node built-ins; verify add→quantity→reload→summary download→remove/clear, keyboard dialog, storage failure and reduced motion in Chrome at 1440, 390, 320 plus 767/768. Recheck package links and skill validation. Ship a new versioned ZIP; preserve v1.0.0 and original Apple evaluation evidence.
