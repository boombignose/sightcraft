# Sightcraft motion and working storefront implementation plan

> Execute inline with superpowers:executing-plans; user explicitly approved this scope.

Goal: deliver motion/interaction guidance and an original working local store demo.
Spec: ../specs/2026-10-14-motion-storefront-design.md

1. Add failing cart tests through the cart operation/summary interface, implement the minimal dependency-free model, and run the whole JS suite.
2. Wire existing Orbit markup to add/cart/quantity/remove/clear/download controls; preserve native menu, rails and details. Add named native dialog, storage validation/fallback and reduced-motion-safe CSS animation. Test via real browser flow.
3. Update Skill and both templates with motion/behavior sections; add demo docs and entry point to gallery/README. Reuse the existing checker and add Node tests to existing CI.
4. Capture desktop/mobile/cart, record actual browser evidence and any limits, review the diff, run all required checks, commit and create/extract/verify v1.1.0 ZIP.

Test contracts: catalog item IDs and integer THB prices; quantity 1–99 (0 removes); unknown IDs/invalid saved shape reject; summary total from catalog, not saved prices; cart storage contains only IDs/quantities. HTTP origin for reliable reload test; file:// smoke test with honest storage fallback.
