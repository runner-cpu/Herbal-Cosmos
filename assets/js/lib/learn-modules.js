/* Learning lab extension modules: picture quiz and culture reading.
 * Loaded after the data chunks; all herb data is read from window at call time. */
(function(){
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
  const fact = value => value && value !== '未标注' ? value : '待补充';
  const missingLabel = () => '待补充';
  const $ = sel => document.querySelector(sel);
  const pictureState = { index: 0, answered: false, current: null };

  function knowledgeHerbs(){
    return (window.HERBS || []).filter(h => h.kind !== 'formula-material');
  }
  function learnState(){
    return window.HerbalLearnState || (window.HerbalLearnState = { total: 0, correct: 0 });
  }
  function saveStats(){
    try { localStorage.setItem('herbal_learn_stats', JSON.stringify({ total: learnState().total, correct: learnState().correct })); } catch { /* optional */ }
  }

  function renderPictureQuiz(){
    const card = $('#pictureQuizCard'); if (!card || card.hidden) return;
    const state = learnState();
    const pool = knowledgeHerbs().filter(h => h.image && h.imageAlt && h.name);
    if (pool.length < 4) { card.innerHTML = '<p class="muted">图片素材整理中，稍后再来。</p>'; return; }
    const correct = pool[Math.floor(Math.random() * pool.length)];
    const sameCat = knowledgeHerbs().filter(h => h !== correct && h.image && h.cat === correct.cat);
    const others = knowledgeHerbs().filter(h => h !== correct && h.image && h.cat !== correct.cat);
    const distractors = [];
    while (distractors.length < 3 && (sameCat.length || others.length)) {
      const source = sameCat.length && distractors.length < 2 ? sameCat : others;
      const pick = source.splice(Math.floor(Math.random() * source.length), 1)[0];
      if (!distractors.includes(pick)) distractors.push(pick);
    }
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    pictureState.current = correct; pictureState.answered = false;
    const progress = ((pictureState.index % 10) / 10) * 100;
    const figure = window.HerbalStamp && window.HerbalStamp.herbImage ? window.HerbalStamp.herbImage(correct, '') : '<img src="' + esc(correct.image) + '" alt="">';
    card.innerHTML = '<div class="quiz-top"><span class="badge celadon">看图识药 · 累计正确 ' + state.correct + ' 题</span><span class="muted" style="font-size:12px;">按来源生物照片辨认本草</span></div>'
      + '<div class="progress"><i style="width:' + progress + '%"></i></div>'
      + '<div class="picture-quiz-figure">' + figure + '</div>'
      + '<div class="quiz-q">这是哪一味本草？</div>'
      + '<div class="quiz-options">' + options.map((o, i) => '<button class="quiz-option" data-picture-answer="' + i + '">' + esc(o.name) + '</button>').join('') + '</div>'
      + '<div id="pictureFeedback" aria-live="polite"></div>';
    card.querySelectorAll('[data-picture-answer]').forEach(btn => btn.addEventListener('click', () => {
      if (pictureState.answered) return;
      pictureState.answered = true;
      const picked = Number(btn.dataset.pictureAnswer), target = options[picked], ok = target === correct;
      state.total++; if (ok) state.correct++; saveStats();
      card.querySelectorAll('[data-picture-answer]').forEach((b, i) => { b.disabled = true; if (options[i] === correct) b.classList.add('correct'); if (i === picked && !ok) b.classList.add('wrong'); });
      const tip = esc(correct.name) + ' · ' + esc(fact(correct.qi)) + ' · ' + esc(fact(correct.wei)) + ' · 归' + esc(correct.meridian.join('、') || missingLabel()) + '经<br>' + esc(correct.eff || '');
      $('#pictureFeedback').innerHTML = '<div class="quiz-note">' + (ok ? '认对了！' : '再看看这张图。') + '<br>' + tip + '</div><button class="quiz-next" id="pictureNext">下一题 →</button>';
      const stats = $('#learnStats'); if (stats) stats.textContent = '已完成 ' + state.total + ' · 正确 ' + state.correct;
      pictureState.index++;
      $('#pictureNext').onclick = () => { pictureState.answered = false; renderPictureQuiz(); };
    }));
  }

  let cultureExpanded = false;
  function renderLearnCulture(){
    const grid = $('#learnCultureGrid'); if (!grid) return;
    const items = cultureExpanded ? (window.HERITAGE || []) : (window.HERITAGE || []).slice(0, 3);
    const images = window.HERITAGE_IMAGES || {};
    grid.innerHTML = items.map(item => '<article class="home-culture-card"><div class="home-culture-image"><img src="' + esc(images[item.name] || '') + '" alt="' + esc(item.name) + '" loading="lazy"></div><div class="home-culture-copy"><span>' + esc(item.type) + '</span><h3>' + esc(item.name) + '</h3><p>' + esc(item.note) + '</p></div></article>').join('');
    const button = $('#learnCultureExpand'); if (button) button.textContent = cultureExpanded ? '收起精选' : '查看全部';
  }

  window.HerbalLearn = {
    renderPictureQuiz,
    renderLearnCulture,
    toggleCulture: () => { cultureExpanded = !cultureExpanded; renderLearnCulture(); }
  };
})();
