# Third-party notices

The optional, locally bundled `assets/vendor/cosmos-webgl.js` contains Three.js
0.186.1. It is built reproducibly with esbuild 0.28.2 using `npm ci --ignore-scripts` followed by
`npm run build:cosmos`. The bundle is requested only on HTTP(S) when the home
scene needs an animated renderer; Canvas remains available without it. There
are no CDN imports, React, GSAP or postprocessing dependencies.

## Three.js 0.186.1 — MIT

Copyright © 2010-2026 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## esbuild 0.28.2 — MIT (build tool)

Copyright (c) 2020 Evan Wallace

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## React Bits — reference-only inspiration

The user's reference document's FadeContent (lines 5098–5220) and SpotlightCard
(lines 65462–65546) informed the general fade-on-entry and radial-light ideas.
`assets/js/exhibition-effects.js` and the accompanying CSS are independently
authored native implementations. No React Bits component code or assets are
copied or bundled. Upstream is **MIT + Commons Clause License Condition v1.0**,
Copyright (c) 2026 David Haz, not plain MIT. License verified 2026-10-09 at
https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md.

## Existing ECharts runtime

The existing local Apache ECharts bundle retains its Apache-2.0 license header.
This change does not rebuild or replace that bundle. Its upstream notice and
license are available at https://github.com/apache/echarts/blob/master/LICENSE.
