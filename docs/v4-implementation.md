# V4 implementation — 2026-09-26

Base: e94c4a3. User authorizes implementation and publication to main and gh-pages.

## Data and source integrity (root)
- Import factual fields from pinned public records, retain row provenance and source limitations.
- Expand knowledge cards to at least 600 genuine entries, without claiming all are pharmacopoeia entries.
- Expand searchable names using admitted source records, retain uncertain historical fragments in review.
- Generated assets/js/data/expanded.generated.js runs AFTER featured.js and BEFORE runtime.js. It mutates HERBS/FORMULAS/ZHENGS in place and enriches existing matching herbs.
- Data fields: id/name/pinyin/latin/qi/wei/meridian/cat/eff/food/source/note/origin (province array)/sourceRefs/image/imageAlt. Missing facts never receive invented defaults.

## Formula and syndrome expansion (isolated task)
- Add 29 independently sourced formulas to reach 50; add 12 syndromes to reach 30.
- Own only data/sources/formulas-expanded.json, data/sources/syndromes-expanded.json, supporting source documentation and focused tests.
- Use herb canonical names in source records; root builder resolves name to existing/generated IDs.
- Preserve original dose units; no invented gram conversions or role assignments. Unknown roles use 未标注.

## Visualizations and interaction (isolated task)
- Own index.html, assets/css/site.css, assets/js/core/runtime.js, assets/js/charts/insights.js, assets/js/lib/insight-aggregates.mjs, assets/js/pages/cosmos.js, assets/js/pages/cross-navigation.js and focused interaction/aggregate tests.
- Add co-occurrence heatmap, dose boxplot (only compatible grams), province distribution (reported distribution, not certified geographic origin).
- Charts support meaningful click-through, empty/loading states, responsive sizing and instance disposal.
- Improve cosmos focus/search/color feedback and bidirectional syndrome/formula navigation while preserving themes and reduced motion.
- Insert expanded.generated.js after featured.js; runtime counts stay data-driven.
- Replace inaccurate 已核验 wording with source-transparent 名称索引 where needed.

## Searched images (isolated task)
- Own scripts/fetch-herb-images.mjs, data/sources/herb-images.json, images/herbs/open/, IMAGE_SOURCES_V4.md.
- Prefer Wikimedia Commons images with exact species/subject matches, author and license recorded; no name-only random results.
- Source input .tmp-v3/tcmData.json has 899 rows (key data). Each row 中药名/来源 includes botanical Latin where known.
- Image map keyed by canonical Chinese name, independent of generated IDs. Download bounded size, limited concurrency, cache/retry. No synthetic or unrelated substitute images.

## Integration and release (root)
- Review each isolated result, build data, validate sources/IDs/counts/images, run unit and desktop/mobile browser regression.
- Publish same verified commit to main and gh-pages, confirm successful Actions and live assets.
- Report actual counts and any remaining explicit coverage gaps.
