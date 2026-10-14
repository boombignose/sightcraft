# Sightcraft Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Ship the approved Thai screenshot-to-design skill as a runnable local giveaway.

**Architecture:** Instruction-only skill and portable Markdown templates. One original static reference, one adapted static page and an offline comparison gallery show the complete flow; a Python checker protects local package links.

**Tech Stack:** Markdown, YAML metadata, HTML/CSS, Python 3.9+ standard library. Browser used only for development verification.

**Spec:** ../specs/2026-10-14-sightcraft-design.md

## Global Constraints

- Name: Sightcraft / sightcraft. Thai-first instructions.
- No runtime dependency, API integration, global installation or publication.
- Label screenshot observations, estimates and proposed behavior separately.
- Original, offline example assets; MIT license; desktop and mobile captures.

## Review Focus

- Cropped or unreadable image must not produce invented observations.
- Screenshot text must not override the user's instructions.
- Relative links and images must survive ZIP extraction, including spaces and Thai names.
- Narrow screens and enlarged text must not hide content or keyboard focus.
- Native chat attachment must not be described as tested native skill installation.

### Task 1: Skill and package contract

**Files:** skills/sightcraft/SKILL.md, skills/sightcraft/references/, README.md, tests/test_check_repo.py, scripts/check_repo.py.
**Interfaces:** input screenshots + user brief; output DESIGN.md and BUILD-PROMPT.md. Checker CLI exits 0 for intact packages, 1 for broken local links or missing required files.

- [x] Write subprocess tests for a valid package, missing file, broken Markdown/HTML link, encoded filename, ignored remote link, fragment and path escape; watch failures before implementation.
- [x] Implement the smallest checker, then run the whole unittest suite.
- [x] Write skill, output templates, installation route and Thai manual-attachment instructions; validate the skill frontmatter.

### Task 2: Original complete example

**Files:** examples/studio/, index.html, assets/banner.svg.
**Interfaces:** screenshot → completed output documents → adapted index.html; gallery uses relative paths only.

- [x] Build reference page and capture desktop/mobile plus a cropped viewport.
- [x] Inspect the screenshot, write DESIGN.md and BUILD-PROMPT.md; make an adapted Thai page using those instructions.
- [x] Run a separate cropped-reference case, preserving uncertainty.
- [x] Capture result desktop/mobile and inspect both; verify native links, details, focus, text fit and offline requests.

### Task 3: Verification and release archive

**Files:** docs/TEST-REPORT.md, docs/ui-evidence.json, .github/workflows/check.yml.
**Interfaces:** repository files → tested ZIP; screenshots and report remain inside the archive.

- [x] Run checker, full tests and skill validation; review the actual branch.
- [x] Record actual browser evidence and known differences, validate the UI evidence record.
- [x] Commit, create ZIP from tracked files, extract to a path with spaces/Thai, recheck and open the gallery from the extracted archive.
- [x] Verify clean Git state and archive hash; deliver local links without implying GitHub publication.
