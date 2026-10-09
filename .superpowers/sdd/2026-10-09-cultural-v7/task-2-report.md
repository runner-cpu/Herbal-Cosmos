# Task 2 implementation report

Completed in `D:/Programming/Objects/c/herbal-cosmos/.worktrees/herbal-v7` on `codex/cultural-v7`. No push or publication performed. Explicit owned-file staging excludes incidental `output/review/` verification screenshots.

## Delivered behavior

- Native three-chapter exhibition: 识一草 / 合一方 / 传一艺, one dominant SVG and adjacent detail column, semantic object-selection buttons, focused/pressed controls and compact mobile geometry.
- Recognition uses eight actual runtime knowledge-card IDs. Five principal tastes have traditional phase/color labels and distinct theme-aware color swatches; 淡、涩 and 味型待补 remain separate neutral categories. A unique herb can have multiple flavor edges. Node/edge count is 16/13 with current records.
- Compose defaults to 四君子汤, with 麻黄汤 and 桂枝汤 available. Bipartite graphs have 5/4, 5/4 and 6/5 nodes/edges. Diagram-cited roles are optional and case-scoped; an uncited membership role resolves to null. 炙甘草 remains a source material name while 甘草 is only a related knowledge-card index. 白芍 is disclosed as the source's modern teaching interpretation.
- Inherit defaults to Lum and switches to 中药炮制技术. Typed practice/participant/transmission edges have 12/11 and 7/6 nodes/edges. No specific Lum herb links, five-phase projection, mentor lineage or mandatory processing sequence is invented.
- Claim-level records carry the required case/entity/system/source/locator/date/evidence/kind/status schema. Source disclosures stay adjacent and can remain open during selection; diagrams are linked as evidence and never copied.
- Canonical exhibit hashes encode chapter, case, object selection and optional roles. Browser back restores them; invalid/mismatched IDs recover deterministically. Bare `#/heritage` enters inherit; anchored food/classics and `#/herbs?section=culture` preserve the archive. Navigation title and owner tests distinguish these routes.
- Reading note stays collapsed until explicit opening or “将这条理解写入札记”. Saved-note status is visible in its summary; entries persist per selected object in dedicated local key `herbal_exhibition_notes_v1`. Object, takeaway and source are editable, canonical provenance URL is retained. Keyboard save gives status feedback. SVG export escapes XML, wraps long text and revokes blob URLs; no external sharing. Existing favorites/storage/event flow and 我的本草 quiz/history links are reused.
- Production scripts load after the final combined data export and before runtime's first render. Uses existing `window.HERBS`/`window.FORMULAS`; no new aliases or data-pipeline changes. Static classic scripts support basic direct `file://` reading. No new image generation, React, GSAP, timers for entry animation or blocking transitions.

## Source verification

Full locators, URLs, scope and transcription caveats are in `docs/exhibition-sources.md`.

- Controller verified HKBU F00067/F00001/F00002 records and original-size diagram legends, and supplied `verified-source-notes.md`. Exact legends establish the displayed roles, not plain record text alone.
- Controller read UNESCO Lum 01386 text with practice types, communities, named professional roles and transmission contexts. The exhibition retains its independent cultural context.
- Controller read Wikisource 《黄帝内经·素问》第二卷, 阴阳应像大论第五. Display uses original 苍/黑 terms and simplified 咸; source disclosure calls it a community transcription not completely proofread.
- Implementer additionally fetched `https://www.ihchina.cn/project_details/14788.html` successfully using public HTTP `Invoke-WebRequest`, decoded readable text and read the actual introductory/history/institution fields before authoring processing summaries. Avoids unsupported universal 净制→切制→炮炙 pipeline and dated practitioner statistics.
- Eight herb flavor edges intentionally disclose their immediate provenance as project knowledge-card fields. Individual pharmacopoeia text was not reverified; the classical source supports cultural correspondences only.
- All 37 ethnic candidates remain review. No data or original units were modified.

## TDD and verification evidence

1. Added pure case/state tests before implementation. `node --test tests/exhibition.test.mjs tests/exhibition-router.test.mjs`: observed RED, 1 pass / 8 failures (absent pure layer and old bare-heritage mapping). Implemented data and router; GREEN 9/9.
2. Added browser tests before UI wiring. `PLAYWRIGHT_PORT=4187 npx playwright test tests/browser/exhibition.spec.js --project=chromium --grep "chapter scenes" --reporter=line`: observed RED, absent scene (0 instead of 1).
3. Initial full new Chromium suite: 8 pass / 2 failures. Corrected test selectors for exact form label and disclosure-open state (the disclosure intentionally retained source-open state); next Chromium+mobile focused run 20/20 passed.
4. Controller visual review exposed SVG text scaling at375 despite no overflow. Added a real rendered-scale regression using computed font size × `getScreenCTM().a`. Observed RED 4.93px versus14px minimum. Compact geometry and20px SVG type fixed it; all scene labels now meet14px at375 and11px at320 in automated checks. Visually inspected independently captured desktop/mobile scenes, plus controller CUA review of mobile compose/night mode.
5. Added note-collapsed/reopening behavior before refinement; observed RED (form still visible). Explicit-write/open and saved summary status now pass.
6. Added traditional color-swatch behavior before implementation; observed RED (0 instead of5); distinct day/night colors now pass.
7. Combined navigation run initially reported 47 pass / 1 skip / 2 failures from obsolete bare-heritage title expectation. Updated approved-route title expectation, added anchored archive title coverage, and checked longscroll navigation owner on bare heritage.
8. Final focused command: `$env:PLAYWRIGHT_PORT='4187'; npx playwright test tests/browser/exhibition.spec.js tests/browser/exhibition-navigation.spec.js tests/browser/navigation.spec.js --project=chromium --project=mobile --reporter=line`: **51 passed, 1 skipped**, 32.5s. Skip is existing browser-specific trusted CDP gesture test. Includes Task1 navigation/attribute/star regressions, graph counts, sources, diagram roles, keyboard/back, local notes/export/favorites, 320/375/1440 layout, night/reduced-motion and direct file URLs.
9. Final full `npm test`: **133 passed, 0 failed**.
10. `npm run check:browser-copies`: in sync. `npm run check:inline`: 0 issues. `npm run validate:app`: 71 files,1,449,590 precached bytes,0 issues. `git diff --check`: no whitespace errors.

Final measured file sizes: `exhibition-cases.js`12,986 bytes, `exhibition.js`21,347 bytes; both below40,000-byte module limit. Unmodified `runtime.js`91,227 bytes, below100,000.

## Self-review and genuine limitations

- These are curated readings, not a full-network replacement, and no medical/DIY dosing flow was added.
- Source verification relies on the controller's recorded browser checks for HKBU/UNESCO/classical transcription; implementer independently reread processing HTTP text. The project does not claim authoritative edition validation or new field-level pharmacopoeia audit.
- Full cross-browser release suite, 768px coverage, offline service-worker refresh and deployed Pages smoke belong to controller integration/release verification. Task2 focused suite used Chromium desktop+mobile only.
- SVG selection is pointer-based with a keyboard-equivalent semantic object list. Small mobile scenes use a different compact arrangement of the same data, not a zoom/pan feature. They remain readable under the rendered-scale regression.
- Saving is explicitly local; clearing browser data removes notes. Unavailable-storage fallback reports session-only status but is not separately browser-tested in this task. Unsaved form edits are not auto-saved across selections; explicit save/export is available.
- No temporary screenshot asset is required at runtime; incidental verification screenshots are excluded from commit. Controller provides separate review.
