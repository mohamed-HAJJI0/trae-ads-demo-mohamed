// ============================================
// Playable Ads — Main Logic
// ============================================

// Load ad images via Vite glob
const adModules = import.meta.glob('../../ads/*.webp', { eager: true });
const adImages = Object.values(adModules).map((m) => m.default || m);

// ============================================
// i18n / Translations
// ============================================
const I18N = {
  en: {
    landingTitle: 'Playable Ads',
    landingSubtitle: 'Choose your experience',
    oldAds: 'Old Ads 📺',
    newAds: 'New Ads 🎮',
    skipAd: 'Skip Ad',
    skipAdActive: 'Skip Ad →',
    back: '← Back',
    noAds: 'No .webp files found.\nAdd some to the /ads folder!',
    questionTag: '⚡ QUESTION {n} / 3',
    nextBtn: 'Got it, next question →',
    wrongTitle: '❌ WRONG!',
    correct: 'CORRECT! 🎯',
    perfect: 'PERFECT SCORE! 🏆',
    learnMore: 'Learn More →',
    brandLabels: {
      apple: 'Apple',
      visa: 'Visa',
      cocacola: 'Coca-Cola',
      mcdonalds: "McDonald's"
    },
    taglines: {
      apple: 'Think Different. Now you know why.',
      visa: 'Everywhere you want to be. Now you know it.',
      cocacola: 'Open Happiness. And a little history.',
      mcdonalds: "I'm Lovin' It. And now you get why."
    },
    scoreText: (n) => `You got ${n}/3 correct! 🏆`,
    urgentBanner: '⚡ LIMITED TIME • WIN BIG ⚡'
  },
  zh: {
    landingTitle: '可玩广告',
    landingSubtitle: '选择你的体验',
    oldAds: '老式广告 📺',
    newAds: '新型广告 🎮',
    skipAd: '跳过广告',
    skipAdActive: '跳过广告 →',
    back: '← 返回',
    noAds: '未找到 .webp 文件。\n请将广告图片添加到 /ads 文件夹!',
    questionTag: '⚡ 第 {n} 题 / 共 3 题',
    nextBtn: '知道了，下一题 →',
    wrongTitle: '❌ 答错了!',
    correct: '答对了! 🎯',
    perfect: '满分! 🏆',
    learnMore: '了解更多 →',
    brandLabels: {
      apple: '苹果',
      visa: 'Visa',
      cocacola: '可口可乐',
      mcdonalds: '麦当劳'
    },
    taglines: {
      apple: '非同凡想。现在你明白为什么了。',
      visa: '心所向,皆可至。现在你知道了。',
      cocacola: '畅爽开怀。还有一点小历史。',
      mcdonalds: '我就喜欢。现在你懂了吧。'
    },
    scoreText: (n) => `你答对了 ${n}/3 题! 🏆`,
    urgentBanner: '⚡ 限时活动 • 大奖来袭 ⚡'
  }
};

let currentLang = 'en';
const t = () => I18N[currentLang];

// ============================================
// Question Sets
// ============================================
// Each question has:
//   id, en/zh text, en/zh wrongMessage, answerChoices {A,B,C,D}, correctIndex
// Indices: 0=A, 1=B, 2=C, 3=D
// Correct answers marked ✓ in spec:
const QUESTION_SETS = [
  {
    id: 'apple',
    questions: [
      {
        text: { en: 'What year did iPhone launch?', zh: 'iPhone 是哪一年发布的?' },
        answers: ['2007', '2010', '2005', '2012'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Come on! Everyone knows iPhone launched in 2007! 📱🍎',
          zh: '拜托!大家都知道 iPhone 是 2007 年发布的!📱🍎'
        }
      },
      {
        text: { en: 'What material is iPhone 15 Pro made of?', zh: 'iPhone 15 Pro 是什么材质?' },
        answers: ['Titanium', 'Aluminum', 'Steel', 'Carbon fiber'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! Titanium is what makes the Pro feel so premium! 💎',
          zh: '错啦!钛金属才是 Pro 机型手感高级的秘诀!💎'
        }
      },
      {
        text: { en: 'Apple chip in iPhone 15?', zh: 'iPhone 15 用的是什么芯片?' },
        answers: ['A17 Pro', 'A15', 'M2', 'A16'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! The A17 Pro is the chip that powers the iPhone 15! ⚡',
          zh: '错啦!驱动 iPhone 15 的是 A17 Pro 芯片!⚡'
        }
      },
      {
        text: { en: 'How many cameras on iPhone 15 Pro Max?', zh: 'iPhone 15 Pro Max 有几个摄像头?' },
        answers: ['3', '2', '4', '1'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! The Pro Max has 3 cameras — wide, ultra-wide, and telephoto! 📸',
          zh: '错啦!Pro Max 有 3 个摄像头——广角、超广角和长焦!📸'
        }
      },
      {
        text: { en: "Apple's operating system?", zh: '苹果的操作系统叫什么?' },
        answers: ['iOS', 'Android', 'HarmonyOS', 'Windows'],
        correctIndex: 0,
        wrongMessage: {
          en: "Wrong! Apple's OS is iOS — that's the whole ecosystem! 🍎",
          zh: '错啦!苹果的系统叫 iOS——这可是整个生态!🍎'
        }
      },
      {
        text: { en: 'First iPhone with Face ID?', zh: '第一款带 Face ID 的 iPhone 是?' },
        answers: ['iPhone X', 'iPhone 8', 'iPhone 11', 'iPhone 6'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! iPhone X was the first with Face ID in 2017! 😎',
          zh: '错啦!iPhone X 是 2017 年第一款带 Face ID 的手机!😎'
        }
      },
      {
        text: { en: 'AirDrop is exclusive to?', zh: 'AirDrop 是哪个设备独有的功能?' },
        answers: ['Apple devices', 'All phones', 'Android', 'Samsung only'],
        correctIndex: 0,
        wrongMessage: {
          en: "Wrong! AirDrop is an Apple-only feature — that's the ecosystem! ✨",
          zh: '错啦!AirDrop 是苹果专属功能——这就是生态的厉害之处!✨'
        }
      }
    ]
  },
  {
    id: 'visa',
    questions: [
      {
        text: { en: 'Visa operates in how many countries?', zh: 'Visa 在多少个国家可以使用?' },
        answers: ['200+', '50', '100', '150'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! Visa works in 200+ countries — that\'s almost everywhere on Earth! 🌍💳',
          zh: '错啦!Visa 在 200 多个国家都能用——几乎覆盖全球!🌍💳'
        }
      },
      {
        text: { en: 'Visa processes how many transactions per second?', zh: 'Visa 每秒能处理多少笔交易?' },
        answers: ['65,000', '1,000', '10,000', '500'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! 65,000 transactions per second — faster than you can blink! ⚡',
          zh: '错啦!每秒 65,000 笔交易——比你眨眼还快!⚡'
        }
      },
      {
        text: { en: 'Visa was founded in?', zh: 'Visa 成立于哪一年?' },
        answers: ['1958', '1980', '1970', '1999'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! Visa has been around since 1958 — over 60 years! 📅',
          zh: '错啦!Visa 自 1958 年就存在了——已经超过 60 年!📅'
        }
      },
      {
        text: { en: "Visa's main competitor?", zh: 'Visa 的主要竞争对手是?' },
        answers: ['Mastercard', 'PayPal', 'Apple Pay', 'WeChat Pay'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! Mastercard is Visa\'s biggest rival — they go way back! 💳',
          zh: '错啦!Mastercard 才是 Visa 最大的对手——老对手了!💳'
        }
      },
      {
        text: { en: 'What does the Visa hologram protect against?', zh: 'Visa 全息图防的是?' },
        answers: ['Fraud', 'Scratches', 'Water', 'Hacking'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! The hologram is a security feature against fraud! 🔐',
          zh: '错啦!全息图是防伪的安全功能!🔐'
        }
      },
      {
        text: { en: 'Visa Infinite gives access to?', zh: 'Visa Infinite 能享受什么服务?' },
        answers: ['Airport lounges', 'Free flights', 'Hotel upgrades', 'Cash back only'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! Visa Infinite unlocks airport lounges worldwide! ✈️',
          zh: '错啦!Visa Infinite 可以进入全球机场贵宾厅!✈️'
        }
      },
      {
        text: { en: 'Contactless Visa payment limit per tap?', zh: 'Visa 非接触式支付每次上限是?' },
        answers: ['Varies by country', 'Always $50', 'Always $100', 'No limit'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! The contactless limit actually depends on the country! 🌐',
          zh: '错啦!非接触式支付限额其实是因国家而异的!🌐'
        }
      }
    ]
  },
  {
    id: 'cocacola',
    questions: [
      {
        text: { en: 'Coca-Cola was invented in?', zh: '可口可乐发明于哪一年?' },
        answers: ['1886', '1920', '1899', '1950'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! Coca-Cola has been refreshing people since 1886! 🥤🎉',
          zh: '错啦!可口可乐从 1886 年就开始让人畅爽了!🥤🎉'
        }
      },
      {
        text: { en: 'Secret formula is stored where?', zh: '神秘配方存放在哪里?' },
        answers: ['Atlanta vault', 'New York safe', 'London bank', 'Online encrypted'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! The secret formula is locked in an Atlanta vault — for real! 🔐',
          zh: '错啦!神秘配方锁在亚特兰大的金库里——真的!🔐'
        }
      },
      {
        text: { en: 'Coca-Cola sells in how many countries?', zh: '可口可乐在多少个国家销售?' },
        answers: ['200+', '100', '150', '50'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! Coke is sold in 200+ countries — almost everywhere! 🌍',
          zh: '错啦!可口可乐在 200 多个国家有售——几乎全球!🌍'
        }
      },
      {
        text: { en: 'Original Coca-Cola contained?', zh: '最初的可口可乐含有?' },
        answers: ['Cocaine traces', 'Caffeine only', 'Sugar only', 'Alcohol'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! The original 1886 formula had cocaine traces — they removed it later! 💀',
          zh: '错啦!1886 年的原始配方含有微量可卡因——后来才去除!💀'
        }
      },
      {
        text: { en: 'Coca-Cola color before caramel added?', zh: '添加焦糖色之前,可口可乐是什么颜色?' },
        answers: ['Green', 'Brown', 'Clear', 'Red'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! Before caramel coloring, the original Coke was actually green! 💚',
          zh: '错啦!加焦糖色之前,最初的可口可乐其实是绿色的!💚'
        }
      },
      {
        text: { en: 'Most sold Coca-Cola product?', zh: '可口可乐卖得最好的产品是?' },
        answers: ['Classic Coke', 'Coke Zero', 'Diet Coke', 'Sprite'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! Classic Coke is still the king — the original! 👑',
          zh: '错啦!经典可乐还是王者——原版!👑'
        }
      },
      {
        text: { en: 'Coca-Cola Santa Claus campaign started?', zh: '可口可乐圣诞老人广告始于哪一年?' },
        answers: ['1931', '1950', '1965', '1920'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! The iconic red Santa campaign began in 1931! 🎅',
          zh: '错啦!标志性的红衣圣诞老人广告始于 1931 年!🎅'
        }
      }
    ]
  },
  {
    id: 'mcdonalds',
    questions: [
      {
        text: { en: "McDonald's founded in?", zh: '麦当劳创立于哪一年?' },
        answers: ['1940', '1960', '1955', '1935'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! McDonald\'s has been flipping burgers since 1940! 🍔👴',
          zh: '错啦!麦当劳自 1940 年就开始翻汉堡了!🍔👴'
        }
      },
      {
        text: { en: "McDonald's operates in how many countries?", zh: '麦当劳在多少个国家开店?' },
        answers: ['100+', '50', '75', '200'],
        correctIndex: 0,
        wrongMessage: {
          en: "Wrong! McDonald's has 100+ countries of golden arches! 🏳️",
          zh: '错啦!麦当劳的金色拱门遍布 100 多个国家!🏳️'
        }
      },
      {
        text: { en: "Best selling McDonald's item ever?", zh: '麦当劳卖得最好的产品是?' },
        answers: ['Big Mac', 'McChicken', 'Fries', 'McNuggets'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! The Big Mac is the all-time champion! 🍔',
          zh: '错啦!巨无霸才是永恒的冠军!🍔'
        }
      },
      {
        text: { en: 'Golden Arches represent?', zh: '金色拱门代表什么?' },
        answers: ['Letter M', 'Two hills', 'French fries', 'A bridge'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! The Golden Arches are literally a giant M — look again! 🏳️',
          zh: '错啦!金色拱门其实就是一个巨大的 M——再看一眼!🏳️'
        }
      },
      {
        text: { en: "McDonald's Happy Meal launched in?", zh: '麦当劳开心乐园餐是哪年推出的?' },
        answers: ['1979', '1990', '1985', '1975'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! Happy Meal launched in 1979 — the kids loved it! 🎁',
          zh: '错啦!开心乐园餐 1979 年推出——孩子们超爱!🎁'
        }
      },
      {
        text: { en: "First McDonald's country outside USA?", zh: '麦当劳在美国之外开的第一个国家是?' },
        answers: ['Canada', 'UK', 'Japan', 'France'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Nope! Canada was first — our friendly neighbors up north! 🇨🇦',
          zh: '错啦!第一个是加拿大——北边的友好邻居!🇨🇦'
        }
      },
      {
        text: { en: "McDonald's serves how many customers daily?", zh: '麦当劳每天接待多少顾客?' },
        answers: ['69 million', '10 million', '30 million', '50 million'],
        correctIndex: 0,
        wrongMessage: {
          en: 'Wrong! 69 million customers daily — that\'s mind-blowing! 🤯',
          zh: '错啦!每天 6900 万顾客——难以置信!🤯'
        }
      }
    ]
  }
];

// ============================================
// Utility helpers
// ============================================
function pickRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function shuffleAnswers(question) {
  // Build array of { letter, text } then shuffle, track new correctIndex
  const items = question.answers.map((text, idx) => ({
    text,
    isCorrect: idx === question.correctIndex
  }));
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return {
    ...question,
    shuffledAnswers: items,
    shuffledCorrectIndex: items.findIndex((x) => x.isCorrect)
  };
}

// ============================================
// App state
// ============================================
let state = {
  view: 'landing', // 'landing' | 'oldAds' | 'newAds' | 'question' | 'end'
  set: null,
  questions: [],
  currentQuestion: 0,
  score: 0,
  answering: false
};

// ============================================
// Render
// ============================================
const app = () => document.getElementById('app');

function render() {
  const root = app();
  root.innerHTML = '';
  // Always include the flash overlay at the top
  const flash = document.createElement('div');
  flash.id = 'flash';
  flash.className = 'flash';
  root.appendChild(flash);

  if (state.view === 'landing') return renderLanding(root);
  if (state.view === 'oldAds') return renderOldAds(root);
  if (state.view === 'newAds') return renderNewAds(root);
  if (state.view === 'question') return renderQuestion(root);
  if (state.view === 'end') return renderEnd(root);
}

function renderLanding(root) {
  const wrap = document.createElement('div');
  wrap.className = 'landing';
  wrap.innerHTML = `
    <button class="lang-toggle" id="langToggle">${currentLang === 'en' ? '中文' : 'EN'}</button>
    <h1 class="landing-title">${t().landingTitle}</h1>
    <p class="landing-subtitle">${t().landingSubtitle}</p>
    <div class="mode-buttons">
      <button class="mode-btn old" id="oldAdsBtn">${t().oldAds}</button>
      <button class="mode-btn new" id="newAdsBtn">${t().newAds}</button>
    </div>
  `;
  root.appendChild(wrap);

  wrap.querySelector('#langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    render();
  });
  wrap.querySelector('#oldAdsBtn').addEventListener('click', () => {
    state.view = 'oldAds';
    render();
  });
  wrap.querySelector('#newAdsBtn').addEventListener('click', () => {
    startNewAds();
    state.view = 'newAds';
    render();
  });
}

function renderOldAds(root) {
  const wrap = document.createElement('div');
  wrap.className = 'old-ads';

  // Back button
  const back = document.createElement('button');
  back.className = 'skip-btn-back';
  back.textContent = t().back;
  back.addEventListener('click', () => {
    state.view = 'landing';
    render();
  });
  wrap.appendChild(back);

  if (adImages.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'placeholder-msg';
    msg.textContent = t().noAds;
    wrap.appendChild(msg);
  } else {
    const img = document.createElement('img');
    img.className = 'old-ads-image';
    const chosen = adImages[Math.floor(Math.random() * adImages.length)];
    img.src = chosen;
    img.alt = 'Ad';
    wrap.appendChild(img);
  }

  // Skip button
  const skip = document.createElement('button');
  skip.className = 'skip-btn';
  skip.textContent = t().skipAd;
  skip.disabled = true;
  wrap.appendChild(skip);

  setTimeout(() => {
    skip.textContent = t().skipAdActive;
    skip.classList.add('active');
    skip.disabled = false;
    skip.addEventListener('click', () => {
      state.view = 'landing';
      render();
    });
  }, 5000);

  root.appendChild(wrap);
}

function startNewAds() {
  state.set = QUESTION_SETS[Math.floor(Math.random() * QUESTION_SETS.length)];
  const selected = pickRandom(state.set.questions, 3);
  state.questions = selected.map(shuffleAnswers);
  state.currentQuestion = 0;
  state.score = 0;
  state.answering = false;
}

function renderNewAds(root) {
  // Show the first question view
  state.view = 'question';
  renderQuestion(root);
}

function renderQuestion(root) {
  const wrap = document.createElement('div');
  wrap.className = 'new-ads';

  // Progress bar
  const progress = document.createElement('div');
  progress.className = 'progress-bar';
  for (let i = 0; i < 3; i++) {
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    if (i < state.currentQuestion) seg.classList.add('done');
    else if (i === state.currentQuestion) seg.classList.add('active');
    progress.appendChild(seg);
  }
  wrap.appendChild(progress);

  // Brand header
  const header = document.createElement('div');
  header.className = 'brand-header';
  header.innerHTML = `
    <button class="back-arrow" id="backBtn">←</button>
    <div class="brand-subtitle left">⚡ ${t().urgentBanner.split('•')[0].trim()}</div>
    <div class="brand-logo">${t().brandLabels[state.set.id]}</div>
    <div class="brand-subtitle right">${t().urgentBanner.split('•')[1]?.trim() || ''}</div>
  `;
  wrap.appendChild(header);

  header.querySelector('#backBtn').addEventListener('click', () => {
    state.view = 'landing';
    render();
  });

  // Question area
  const area = document.createElement('div');
  area.className = 'question-area';
  const q = state.questions[state.currentQuestion];

  const tag = document.createElement('div');
  tag.className = 'question-tag';
  tag.innerHTML = t().questionTag.replace('{n}', state.currentQuestion + 1);
  area.appendChild(tag);

  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.textContent = q.text[currentLang];
  area.appendChild(qText);

  const answers = document.createElement('div');
  answers.className = 'answers';

  q.shuffledAnswers.forEach((ans, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    const letter = ['A', 'B', 'C', 'D'][idx];
    btn.innerHTML = `
      <span class="answer-letter">${letter}</span>
      <span class="answer-text">${ans.text}</span>
      <span class="answer-icon">⚡</span>
    `;
    btn.addEventListener('click', () => handleAnswer(idx, btn, answers, q));
    answers.appendChild(btn);
  });
  area.appendChild(answers);

  wrap.appendChild(area);
  root.appendChild(wrap);
}

function handleAnswer(idx, btn, answersContainer, q) {
  if (state.answering) return;
  state.answering = true;

  const isCorrect = idx === q.shuffledCorrectIndex;

  if (isCorrect) {
    state.score++;
    btn.classList.add('correct');
    btn.querySelector('.answer-icon').textContent = '✅';
    // Flash gold
    flashScreen('gold');
    showCorrectOverlay(() => {
      advanceQuestion();
    });
  } else {
    btn.classList.add('wrong');
    btn.querySelector('.answer-icon').textContent = '❌';
    // Mark correct
    const allBtns = answersContainer.querySelectorAll('.answer-btn');
    allBtns[q.shuffledCorrectIndex].classList.add('correct');
    allBtns[q.shuffledCorrectIndex].querySelector('.answer-icon').textContent = '✅';
    flashScreen('red');
    showWrongPopup(q.wrongMessage[currentLang], () => {
      advanceQuestion();
    });
  }
}

function advanceQuestion() {
  state.answering = false;
  state.currentQuestion++;
  if (state.currentQuestion >= 3) {
    state.view = 'end';
  }
  render();
}

function flashScreen(color) {
  const flash = document.getElementById('flash');
  if (!flash) return;
  flash.className = `flash ${color} show`;
  setTimeout(() => {
    flash.className = `flash ${color}`;
  }, 250);
}

function showCorrectOverlay(cb) {
  const overlay = document.createElement('div');
  overlay.className = 'correct-overlay';
  overlay.innerHTML = `
    <div class="correct-check">✅</div>
    <div class="correct-text">${t().correct}</div>
  `;
  document.getElementById('app').appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
    cb();
  }, 1500);
}

function showWrongPopup(message, cb) {
  const backdrop = document.createElement('div');
  backdrop.className = 'wrong-popup-backdrop';
  backdrop.innerHTML = `
    <div class="wrong-popup">
      <div class="wrong-title">${t().wrongTitle}</div>
      <div class="wrong-message">${message}</div>
      <button class="next-btn" id="nextBtn">${t().nextBtn}</button>
    </div>
  `;
  document.getElementById('app').appendChild(backdrop);
  backdrop.querySelector('#nextBtn').addEventListener('click', () => {
    backdrop.remove();
    cb();
  });
}

function renderEnd(root) {
  const wrap = document.createElement('div');
  wrap.className = 'end-screen';

  const perfect = state.score === 3;

  if (perfect) {
    // Confetti!
    if (window.confetti) {
      window.confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#CC0000', '#FFD700', '#FFA500', '#fff']
      });
      setTimeout(() => {
        window.confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        window.confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
    }
  }

  wrap.innerHTML = `
    <button class="lang-toggle" id="langToggle">${currentLang === 'en' ? '中文' : 'EN'}</button>
    <div class="urgent-banner">${t().urgentBanner}</div>
    <div class="end-brand-logo">${t().brandLabels[state.set.id]}</div>
    <div class="end-score">${t().scoreText(state.score)}</div>
    <div class="end-tagline">${t().taglines[state.set.id]}</div>
    <button class="learn-more-btn" id="learnMore">${t().learnMore}</button>
  `;
  root.appendChild(wrap);

  wrap.querySelector('#langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'zh' : 'en';
    render();
  });
  wrap.querySelector('#learnMore').addEventListener('click', () => {
    state.view = 'landing';
    render();
  });
}

// ============================================
// Boot
// ============================================
render();
