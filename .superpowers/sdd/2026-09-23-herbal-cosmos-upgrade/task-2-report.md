# Task 2 report

## Files

- scripts/build-herb-catalog.mjs — exported buildCatalog/buildFromSources, source-only CLI, deterministic IDs and output.
- tests/catalog-build.test.mjs — order-independent aggregation and byte-stability tests.
- data/herb-catalog.js — two approved authority entries for the browser default catalog.
- data/catalog/manifest.js and data/catalog/chunk-c00.js — static browser manifest/chunk globals.
- reports/catalog-review.json — ten unverified/noisy candidates retained for review.

## TDD evidence

RED (before implementation): node --test tests/catalog-build.test.mjs failed with SyntaxError: module did not provide an export named buildCatalog.

GREEN: node --test tests/catalog-build.test.mjs — 2 passed, 0 failed.

CLI: node scripts/build-herb-catalog.mjs — generated 2 approved and 10 review entries.

## Determinism evidence

Two unchanged builds produced identical hashes:

| file | first | second |
| --- | --- | --- |
| data/herb-catalog.js | 7083418fd9bbbee6ae958cb18d3d2670437480b4 | 7083418fd9bbbee6ae958cb18d3d2670437480b4 |
| data/catalog/manifest.js | 158d1faa92606883954c0be545ce991b1f3edf97 | 158d1faa92606883954c0be545ce991b1f3edf97 |
| data/catalog/chunk-c00.js | 3df523e2a64a31fe074bd22f644b1420f61c9aa7 | 3df523e2a64a31fe074bd22f644b1420f61c9aa7 |
| reports/catalog-review.json | d23f9e1210836488e99a6addcf10baf5e6368c24 | d23f9e1210836488e99a6addcf10baf5e6368c24 |

## Self-review and concerns

- Inputs are limited to committed data/sources/*.json; no .tmp-* paths are read.
- Authority remains intentionally limited to the two evidenced names; all other candidates stay in review and are excluded from chunks/default search.
- Review IDs are deterministic hashes of raw names; approved IDs are deterministic hashes of canonical names.
- Source revisions are read from source-manifest.json; no current timestamp is emitted.
- Concern: existing UI still loads data/herb-catalog.js as a single static script; chunk lazy-loading integration is intentionally outside Task 2.

## Boundary fix

The writer now removes only existing files matching data/catalog/chunk-cNN.js before writing current chunks. A regression test first creates two chunks, shrinks to one, asserts chunk-c01.js is gone, and rebuilds twice to confirm the remaining chunk hash is stable. Full suite result: 7 passed, 0 failed.
