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
    readCarefully: (n) => `Read carefully... ${n}`,
    pickNow: '👆 Pick now!',
    wrongTitle: '❌ WRONG!',
    correct: 'CORRECT! 🎯',
    gotItCorrect: 'You got it correct! 🏆',
    gotItWrong: 'You got it wrong 😅',
    gotIt: 'Got it',
    continue: 'Continue →',
    continueWait: (n) => `Wait ${n}s...`,
    closingIn: (n) => `Auto-closing in ${n}...`,
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
    urgentBanner: '⚡ LIMITED TIME • WIN BIG ⚡'
  },
  zh: {
    landingTitle: '可玩广告',
    landingSubtitle: '选择你的体验',
    oldAds: '传统广告 📺',
    newAds: '互动广告 🎮',
    skipAd: '跳过广告',
    skipAdActive: '跳过广告 →',
    back: '← 返回',
    noAds: '未找到 .webp 文件。\n请将广告图片添加到 /ads 文件夹!',
    readCarefully: (n) => `仔细阅读... ${n}`,
    pickNow: '👆 现在选!',
    wrongTitle: '❌ 答错了!',
    correct: '正确! 🎯',
    gotItCorrect: '你答对了! 🏆',
    gotItWrong: '答错了 😅',
    gotIt: '明白了',
    continue: '继续 →',
    continueWait: (n) => `请等 ${n} 秒...`,
    closingIn: (n) => `${n} 秒后自动关闭...`,
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
    urgentBanner: '⚡ 限时活动 • 大奖来袭 ⚡'
  }
};

let currentLang = 'en';
const t = () => I18N[currentLang];

// ============================================
// Brand Themes
// ============================================
// Each brand has its own background, accents, button colors, flash colors.
const THEMES = {
  apple: {
    displayName: 'Apple',
    displayNameZh: '苹果',
    bg: '#FFFFFF',
    text: '#1D1D1F',
    accent: '#1D1D1F',
    btnBg: '#FFFFFF',
    btnText: '#1D1D1F',
    btnBorder: '#1D1D1F',
    letterBg: '#1D1D1F',
    letterText: '#FFFFFF',
    correct: '#34C759',
    wrong: '#FF3B30',
    fontStack: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
    fontWeight: 400
  },
  visa: {
    displayName: 'VISA',
    displayNameZh: 'Visa',
    bg: '#1A1F71',
    text: '#FFFFFF',
    accent: '#F7B731',
    btnBg: '#F7B731',
    btnText: '#1A1F71',
    btnBorder: '#F7B731',
    letterBg: '#1A1F71',
    letterText: '#F7B731',
    correct: '#F7B731',
    wrong: '#FF3B30',
    fontStack: '"Times New Roman", Georgia, serif',
    fontWeight: 800
  },
  cocacola: {
    displayName: 'Coca-Cola',
    displayNameZh: '可口可乐',
    bg: '#F40009',
    text: '#FFFFFF',
    accent: '#FFFFFF',
    btnBg: '#FFFFFF',
    btnText: '#F40009',
    btnBorder: '#FFFFFF',
    letterBg: '#F40009',
    letterText: '#FFFFFF',
    correct: '#FFFFFF',
    wrong: '#8B0000',
    fontStack: 'Georgia, "Brush Script MT", cursive',
    fontWeight: 700
  },
  mcdonalds: {
    displayName: "McDonald's 🍟",
    displayNameZh: '麦当劳 🍟',
    bg: '#FFC72C',
    text: '#1A1A1A',
    accent: '#DA291C',
    btnBg: '#DA291C',
    btnText: '#FFFFFF',
    btnBorder: '#DA291C',
    letterBg: '#DA291C',
    letterText: '#FFFFFF',
    correct: '#FFFFFF',
    wrong: '#8B0000',
    fontStack: '"Comic Sans MS", "Trebuchet MS", sans-serif',
    fontWeight: 800
  }
};

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
        text: {
          en: "You're on a date and want the best low-light selfie. Which phone makes you look like a professional photographer?",
          zh: '你正在约会,想拍出最好看的暗光自拍照。哪款手机能让你拍出专业摄影师的感觉?'
        },
        answers: [
          { en: 'Samsung Galaxy', zh: '三星 Galaxy' },
          { en: 'Google Pixel', zh: '谷歌 Pixel' },
          { en: 'iPhone 15 Pro', zh: 'iPhone 15 Pro' },
          { en: 'Xiaomi 14', zh: '小米 14' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "iPhone 15 Pro's camera was rated #1 for portraits in 2024 — your date deserved better! �😬",
          zh: 'iPhone 15 Pro 的相机在 2024 年被评为人像之王——你的约会对象值得更好的!�😬'
        }
      },
      {
        text: {
          en: "Your friend bets you $50 that no phone can shoot 4K video in the dark. You pull out your iPhone and...",
          zh: '朋友跟你打赌 50 美元,说没有手机能在暗光下拍 4K 视频。你掏出 iPhone,然后...'
        },
        answers: [
          { en: 'Lose the bet', zh: '输掉赌局' },
          { en: 'Win easily', zh: '轻松赢了' },
          { en: 'The phone crashes', zh: '手机死机' },
          { en: 'It shoots 1080p only', zh: '只能拍 1080p' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "iPhone shoots cinematic 4K even at night. You just lost $50! 🎬�",
          zh: 'iPhone 即使在夜里也能拍电影级 4K 视频。你输了 50 块!🎬�'
        }
      },
      {
        text: {
          en: "You're at a concert, battery at 5%. Which phone's low-power mode lasts the longest to catch the finale?",
          zh: '你在听演唱会,电量只剩 5%。哪款手机的低电量模式最耐用,能撑到你听完最后一首歌?'
        },
        answers: [
          { en: 'Android average', zh: '普通安卓' },
          { en: 'iPhone 15', zh: 'iPhone 15' },
          { en: 'Old Nokia', zh: '老款诺基亚' },
          { en: 'Huawei', zh: '华为' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "iPhone's optimized battery in low-power mode outlasts the competition. You missed the finale! 🎵😭",
          zh: 'iPhone 的低电量模式优化极强,撑得比谁都久。你错过了最后一首歌!🎵😭'
        }
      },
      {
        text: {
          en: "Your boss needs the presentation NOW. Which phone hotspot is most stable under pressure?",
          zh: '老板现在就要你的演示文稿。哪款手机开热点最稳定?'
        },
        answers: [
          { en: 'Any phone works', zh: '任何手机都行' },
          { en: 'iPhone', zh: 'iPhone' },
          { en: 'Depends on carrier', zh: '看运营商' },
          { en: 'Samsung', zh: '三星' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "iPhone's hotspot stability is legendary in the industry. Your boss is not happy! 💼�",
          zh: 'iPhone 热点的稳定性业内传奇。你老板不高兴了!💼�'
        }
      },
      {
        text: {
          en: "You drop your phone in a pool. Which one survives?",
          zh: '你把手机掉进游泳池了。哪款能活下来?'
        },
        answers: [
          { en: 'Most phones', zh: '大多数手机' },
          { en: 'iPhone 15', zh: 'iPhone 15' },
          { en: 'Cheap Android', zh: '廉价安卓' },
          { en: 'Depends on case', zh: '看保护壳' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: 'iPhone 15 has IP68 rating — survives 6 meters underwater for 30 minutes. Splash! 💦📱',
          zh: 'iPhone 15 是 IP68 防水——在 6 米深的水下撑 30 分钟没问题!💦📱'
        }
      },
      {
        text: {
          en: "You want to share a huge video file instantly with your friend nearby. What's faster than Bluetooth and WiFi combined?",
          zh: '你想把一个超大视频文件秒传给旁边的朋友。什么比蓝牙和 WiFi 加起来还快?'
        },
        answers: [
          { en: 'Email it', zh: '发邮件' },
          { en: 'AirDrop on iPhone', zh: 'iPhone 隔空投送' },
          { en: 'USB cable', zh: 'USB 数据线' },
          { en: 'Google Drive', zh: '谷歌云盘' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "AirDrop transfers a 1GB video in seconds. You wasted 10 minutes emailing it! �⚡",
          zh: 'AirDrop 几秒传完 1GB 视频。你发邮件浪费了 10 分钟!�⚡'
        }
      },
      {
        text: {
          en: "Your earbuds connect automatically the second you open the case. Which ecosystem does this perfectly?",
          zh: '你一打开耳机盒,耳机就自动连上了。哪个生态有这种神仙体验?'
        },
        answers: [
          { en: 'Any brand', zh: '任何品牌都行' },
          { en: 'Apple AirPods + iPhone', zh: '苹果 AirPods + iPhone' },
          { en: 'Samsung buds', zh: '三星耳机' },
          { en: 'Sony earbuds', zh: '索尼耳机' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "AirPods + iPhone magic connection is unmatched. Everyone else is still pairing manually! 🎧✨",
          zh: 'AirPods 配 iPhone 的秒连体验无人能敌。其他品牌还在手动配对!🎧✨'
        }
      }
    ]
  },
  {
    id: 'visa',
    questions: [
      {
        text: {
          en: "You're stranded abroad with no cash. Which card works in the most countries worldwide?",
          zh: '你在国外没现金了,一筹莫展。哪张卡在全球用得最广?'
        },
        answers: [
          { en: 'Mastercard', zh: '万事达' },
          { en: 'Visa', zh: 'Visa' },
          { en: 'AmEx', zh: '美国运通' },
          { en: 'Local debit card', zh: '当地借记卡' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa works in 200+ countries — more than any other card. You're still stranded! 🌍�",
          zh: 'Visa 在 200 多个国家都能用——比任何卡都多。你还是困在原地!🌍�'
        }
      },
      {
        text: {
          en: 'Your card gets stolen in Paris. Which card freezes instantly from your phone in 10 seconds?',
          zh: '你的卡在巴黎被偷了。哪张卡能让你 10 秒内在手机上把它冻结?'
        },
        answers: [
          { en: 'Cash only', zh: '只用现金' },
          { en: 'Visa via app', zh: 'Visa 手机 APP' },
          { en: 'Call the bank', zh: '打给银行' },
          { en: 'Cancel manually', zh: '手动注销' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa's app lets you freeze your card instantly. Your money was already gone! 💳❄️",
          zh: 'Visa 的 APP 可以秒冻结卡片。你的钱已经被刷走了!💳❄️'
        }
      },
      {
        text: {
          en: "You're buying sneakers online at midnight. Which payment is processed fastest with zero downtime?",
          zh: '你半夜在抢购球鞋。哪种支付处理速度最快、永不宕机?'
        },
        answers: [
          { en: 'Bank transfer', zh: '银行转账' },
          { en: 'Visa', zh: 'Visa' },
          { en: 'Crypto', zh: '加密货币' },
          { en: 'PayPal', zh: 'PayPal' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa processes 65,000 transactions per second — midnight drops are no problem! ⚡�",
          zh: 'Visa 每秒处理 65,000 笔交易——半夜抢鞋根本不在话下!⚡�'
        }
      },
      {
        text: {
          en: 'You land in Tokyo with no yen. Which card works at every convenience store with zero setup?',
          zh: '你空降东京,身上没日元。哪张卡能不用任何设置,直接在任何便利店刷?'
        },
        answers: [
          { en: 'Travel card', zh: '旅行卡' },
          { en: 'Visa', zh: 'Visa' },
          { en: 'Local SIM card', zh: '当地电话卡' },
          { en: 'Travellers cheque', zh: '旅行支票' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa is accepted at virtually every 7-Eleven in Japan. You went hungry! 🍙�",
          zh: '日本几乎所有 7-11 都收 Visa。你饿肚子了!🍙�'
        }
      },
      {
        text: {
          en: 'Your flight gets cancelled. Which card automatically covers your hotel and rebooking?',
          zh: '你的航班被取消了。哪张卡能自动报销酒店和改签费?'
        },
        answers: [
          { en: 'Any card', zh: '任何卡都行' },
          { en: 'Visa Infinite', zh: 'Visa Infinite' },
          { en: 'Travel insurance only', zh: '只有旅行保险' },
          { en: 'Airline voucher', zh: '航空公司代金券' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa Infinite includes travel protection — your card had your back. Too bad you didn't use it! ✈️�️",
          zh: 'Visa Infinite 自带旅行保障——本来你的卡能罩着你。可惜你没用!✈️�️'
        }
      },
      {
        text: {
          en: "You're at a street market that only does tap payment. Which card works everywhere contactless?",
          zh: '你在一个只接受拍卡支付的街边小摊。哪张卡全球都能拍卡?'
        },
        answers: [
          { en: 'Only newer cards', zh: '只有新卡才行' },
          { en: 'Visa', zh: 'Visa' },
          { en: 'Only Apple Pay', zh: '只有 Apple Pay' },
          { en: 'Cash only', zh: '只收现金' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa contactless works at millions of terminals globally. You missed those handmade souvenirs! 🎪💸",
          zh: 'Visa 非接触式支付在全球几百万台终端都能用。那些手工艺品你没买成!🎪💸'
        }
      },
      {
        text: {
          en: 'You need to split a dinner bill in seconds with 6 people. Which card ecosystem makes it painless?',
          zh: '你要和 6 个人秒分晚餐账单。哪个卡生态能让你 0 痛感地分账?'
        },
        answers: [
          { en: 'Venmo', zh: 'Venmo' },
          { en: 'Visa Send', zh: 'Visa Send' },
          { en: 'Bank transfer', zh: '银行转账' },
          { en: 'Cash collection', zh: '收现金' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "Visa Send lets you split and send money instantly. You spent 20 minutes doing math! �️🧮",
          zh: 'Visa Send 可以秒分秒转账。你算了 20 分钟!�️🧮'
        }
      }
    ]
  },
  {
    id: 'cocacola',
    questions: [
      {
        text: {
          en: "It's 40°C outside and you need something ice cold. Which drink has been perfecting refreshment since 1886?",
          zh: '外面 40 度高温,你急需一杯冰镇解渴的饮料。哪款饮料从 1886 年起就在钻研「清爽」二字?'
        },
        answers: [
          { en: 'Pepsi', zh: '百事可乐' },
          { en: 'Sprite', zh: '雪碧' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Red Bull', zh: '红牛' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "Coca-Cola has been the world's refreshment since 1886. You picked wrong on a hot day! ☀️🥤",
          zh: '可口可乐自 1886 年起就是「清爽」的代名词。大热天你选错了!☀️🥤'
        }
      },
      {
        text: {
          en: "You're hosting a party and want the drink everyone actually finishes. What do you buy?",
          zh: '你在办派对,想买一款大家都愿意喝光的饮料。买啥?'
        },
        answers: [
          { en: 'Juice', zh: '果汁' },
          { en: 'Water', zh: '矿泉水' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Iced tea', zh: '冰茶' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "Coca-Cola is the #1 consumed soft drink at parties globally. Your guests left thirsty! 🎉�",
          zh: '可口可乐是全球派对上消耗最多的软饮。你的客人没喝够!🎉�'
        }
      },
      {
        text: {
          en: "Your friend says 'grab me something from the fridge' at a restaurant. What do they actually want?",
          zh: '在餐厅朋友跟你说「帮我从冰箱里拿个喝的」,他到底想要啥?'
        },
        answers: [
          { en: 'Water', zh: '水' },
          { en: 'Beer', zh: '啤酒' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Lemonade', zh: '柠檬水' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "When people say 'grab me a drink' they mean Coca-Cola 70% of the time. You failed your friend! 🙃",
          zh: '70% 的人说「帮我拿瓶饮料」其实指的就是可口可乐。你辜负了朋友!🙃'
        }
      },
      {
        text: {
          en: 'You need a drink that pairs with literally any food on earth. What wins?',
          zh: '你需要一款几乎能搭配任何食物的饮料。谁赢?'
        },
        answers: [
          { en: 'Wine', zh: '红酒' },
          { en: 'Beer', zh: '啤酒' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Orange juice', zh: '橙汁' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "Coca-Cola's balance of sweet and acid pairs with everything from pizza to steak. Bold choice! 🍕🥩",
          zh: '可口可乐的甜酸平衡,从披萨到牛排都能搭。你这搭配相当大胆!🍕🥩'
        }
      },
      {
        text: {
          en: "You spill a drink on a rusty bolt to loosen it. Which drink actually works as a cleaning agent?",
          zh: '你想用饮料浇在生锈的螺丝上让它松动。哪款饮料真的能当除锈剂?'
        },
        answers: [
          { en: 'Water', zh: '水' },
          { en: 'Pepsi', zh: '百事可乐' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Sprite', zh: '雪碧' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "Coca-Cola's phosphoric acid can loosen rust — it's a life hack AND a drink! �🤯",
          zh: '可口可乐里的磷酸能除锈——既是饮料,也是生活神器!�🤯'
        }
      },
      {
        text: {
          en: "You're in a country you've never heard of. Which drink brand is guaranteed to be there?",
          zh: '你来到了一个听都没听过的国家。哪款饮料品牌一定有售?'
        },
        answers: [
          { en: 'Starbucks', zh: '星巴克' },
          { en: 'Red Bull', zh: '红牛' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Pepsi', zh: '百事可乐' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: 'Coca-Cola is sold in every country except North Korea and Cuba. It beat your geography! 🌍',
          zh: '除了朝鲜和古巴,全球每个国家都有可口可乐。它比你的地理知识还强!🌍'
        }
      },
      {
        text: {
          en: "It's New Year's Eve and everyone raises a glass. What's in most glasses worldwide?",
          zh: '跨年夜大家一起举杯,全球大多数人杯子里装的是啥?'
        },
        answers: [
          { en: 'Champagne', zh: '香槟' },
          { en: 'Beer', zh: '啤酒' },
          { en: 'Coca-Cola', zh: '可口可乐' },
          { en: 'Juice', zh: '果汁' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "Coca-Cola is the world's most consumed New Year's drink. Pop the cap not the cork! �",
          zh: '可口可乐是全球跨年夜喝得最多的饮料。开瓶盖,而不是开香槟!�'
        }
      }
    ]
  },
  {
    id: 'mcdonalds',
    questions: [
      {
        text: {
          en: "It's 3am, you're starving, nothing is open. Which place is most likely still serving hot food?",
          zh: '凌晨 3 点,你饿疯了,啥店都关了。哪家最可能还在出热乎饭?'
        },
        answers: [
          { en: 'Local diner', zh: '当地小餐馆' },
          { en: 'Pizza place', zh: '披萨店' },
          { en: "McDonald's", zh: '麦当劳' },
          { en: 'Sushi bar', zh: '寿司店' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "McDonald's 24hr locations saved more late night hunger emergencies than anyone. You went to bed hungry! ��",
          zh: '24 小时麦当劳拯救过无数个深夜饿疯的灵魂。你饿着肚子去睡了!��'
        }
      },
      {
        text: {
          en: "You have 5 minutes before your train. Which restaurant guarantees your food is ready before you finish paying?",
          zh: '你离火车发车只剩 5 分钟。哪家能保证你还没付完款,饭就到手了?'
        },
        answers: [
          { en: 'Subway', zh: '赛百味' },
          { en: 'KFC', zh: '肯德基' },
          { en: "McDonald's", zh: '麦当劳' },
          { en: 'Burger King', zh: '汉堡王' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "McDonald's average service time is 3 minutes — the fastest in fast food. You missed your train! 🚂💨",
          zh: '麦当劳平均出餐 3 分钟——快餐里最快的。你误了火车!🚂💨'
        }
      },
      {
        text: {
          en: "You're in a foreign country and need familiar food fast. Which restaurant is in 100+ countries?",
          zh: '你在异国他乡,想快速吃上一口熟悉的味道。哪家在 100 多个国家都有?'
        },
        answers: [
          { en: 'Subway', zh: '赛百味' },
          { en: 'KFC', zh: '肯德基' },
          { en: "McDonald's", zh: '麦当劳' },
          { en: 'Pizza Hut', zh: '必胜客' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "McDonald's operates in 100+ countries — your comfort food travels with you! 🌍�",
          zh: '麦当劳遍布 100 多个国家——熟悉的味道走到哪都有!🌍�'
        }
      },
      {
        text: {
          en: "You're feeding 4 kids under 10 with zero drama. What's the only meal that comes with a toy?",
          zh: '你要喂 4 个 10 岁以下的小孩,还要全场无哭闹。哪个套餐自带玩具?'
        },
        answers: [
          { en: 'Burger King Kids Meal', zh: '汉堡王儿童餐' },
          { en: 'KFC Kids Box', zh: '肯德基儿童套餐' },
          { en: "McDonald's Happy Meal", zh: '麦当劳开心乐园餐' },
          { en: 'Subway Kids', zh: '赛百味儿童餐' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "Happy Meal = happy kids = happy parents. You chose chaos! 🧸😅",
          zh: '开心乐园餐 = 开心小孩 = 开心家长。你选了混乱!🧸😅'
        }
      },
      {
        text: {
          en: "Your friend says 'let's get fries' — where do you go without even discussing it?",
          zh: '朋友说「走,去吃薯条」——你们心照不宣,直接去哪家?'
        },
        answers: [
          { en: 'KFC', zh: '肯德基' },
          { en: 'Five Guys', zh: 'Five Guys' },
          { en: "McDonald's", zh: '麦当劳' },
          { en: 'Burger King', zh: '汉堡王' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "McDonald's fries are the most recognized fries on earth. No discussion needed! �👑",
          zh: '麦当劳的薯条是地球上最知名的薯条。根本不用讨论!�👑'
        }
      },
      {
        text: {
          en: "You need free WiFi, AC, and a seat for 2 hours with no pressure to leave. Where do you go?",
          zh: '你需要免费 WiFi、空调、一个能坐 2 小时也不会被赶的位子。去哪里?'
        },
        answers: [
          { en: 'Starbucks', zh: '星巴克' },
          { en: 'Library', zh: '图书馆' },
          { en: "McDonald's", zh: '麦当劳' },
          { en: 'A park', zh: '公园' }
        ],
        correctIndex: 2,
        wrongMessage: {
          en: "McDonald's McCafé zones are the world's most used free coworking spots. Surprise! 💻☕",
          zh: '麦当劳的 McCafé 区是全球最常用的免费办公点。惊不惊喜?💻☕'
        }
      },
      {
        text: {
          en: "You want the most ordered burger in human history. What do you ask for?",
          zh: '你想点人类历史上被点单最多的汉堡。你要啥?'
        },
        answers: [
          { en: 'Whopper', zh: '皇堡' },
          { en: 'Big Mac', zh: '巨无霸' },
          { en: 'Quarter Pounder', zh: '1/4 磅堡' },
          { en: 'McChicken', zh: '麦香鸡' }
        ],
        correctIndex: 1,
        wrongMessage: {
          en: "The Big Mac has sold billions since 1968 — it's the most iconic burger ever made. 🍔👴",
          zh: '巨无霸自 1968 年起已经卖出了几十亿个——史上最具代表性的汉堡!🍔👴'
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
  // Build array of { ans, isCorrect } then shuffle, track new correctIndex
  const items = question.answers.map((ans, idx) => ({
    ans,
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
  // Clear any running countdown interval from a previous render
  if (state.countdownInterval) {
    clearInterval(state.countdownInterval);
    state.countdownInterval = null;
  }
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
  // 'end' view is no longer used; fall back to landing
  state.view = 'landing';
  return renderLanding(root);
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
  const selected = pickRandom(state.set.questions, 1);
  state.questions = selected.map(shuffleAnswers);
  state.currentQuestion = 0;
  state.score = 0;
  state.answering = false;
  state.questionLocked = true;
  state.countdownInterval = null;
}

function renderNewAds(root) {
  // Show the first question view
  state.view = 'question';
  renderQuestion(root);
}

function renderQuestion(root) {
  const theme = THEMES[state.set.id] || THEMES.apple;
  const wrap = document.createElement('div');
  wrap.className = `new-ads theme-${state.set.id}`;
  // Apply theme colors via inline style (in case CSS hasn't loaded the class yet)
  wrap.style.setProperty('--theme-bg', theme.bg);
  wrap.style.setProperty('--theme-text', theme.text);
  wrap.style.setProperty('--theme-accent', theme.accent);
  wrap.style.setProperty('--theme-btn-bg', theme.btnBg);
  wrap.style.setProperty('--theme-btn-text', theme.btnText);
  wrap.style.setProperty('--theme-btn-border', theme.btnBorder);
  wrap.style.setProperty('--theme-letter-bg', theme.letterBg);
  wrap.style.setProperty('--theme-letter-text', theme.letterText);
  wrap.style.setProperty('--theme-correct', theme.correct);
  wrap.style.setProperty('--theme-wrong', theme.wrong);
  wrap.style.fontFamily = theme.fontStack;
  wrap.style.fontWeight = theme.fontWeight;
  wrap.style.color = theme.text;

  // Brand header
  const header = document.createElement('div');
  header.className = 'brand-header';
  const displayName = currentLang === 'en' ? theme.displayName : theme.displayNameZh;
  header.innerHTML = `
    <div class="brand-subtitle left">⚡ ${t().urgentBanner.split('•')[0].trim()}</div>
    <div class="brand-logo">${displayName}</div>
    <div class="brand-subtitle right">${t().urgentBanner.split('•')[1]?.trim() || ''}</div>
  `;
  wrap.appendChild(header);

  // Question area
  const area = document.createElement('div');
  area.className = 'question-area';
  const q = state.questions[state.currentQuestion];

  // Countdown (above the question, shown while locked)
  const countdown = document.createElement('div');
  countdown.className = 'read-countdown';
  countdown.id = 'readCountdown';
  countdown.textContent = t().readCarefully(3);
  area.appendChild(countdown);

  const qText = document.createElement('div');
  qText.className = 'question-text';
  qText.textContent = q.text[currentLang];
  area.appendChild(qText);

  const answers = document.createElement('div');
  answers.className = 'answers';
  answers.id = 'answersContainer';

  q.shuffledAnswers.forEach((entry, idx) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn locked';
    btn.disabled = true;
    const letter = ['A', 'B', 'C', 'D'][idx];
    const text = entry.ans[currentLang];
    btn.innerHTML = `
      <span class="answer-letter">${letter}</span>
      <span class="answer-text">${text}</span>
      <span class="answer-icon">🔒</span>
    `;
    btn.addEventListener('click', () => handleAnswer(idx, btn, answers, q));
    answers.appendChild(btn);
  });
  area.appendChild(answers);

  wrap.appendChild(area);
  root.appendChild(wrap);

  // Start 3-second countdown
  startQuestionCountdown(answers, countdown);
}

function startQuestionCountdown(answersContainer, countdownEl) {
  let n = 3;
  state.questionLocked = true;
  countdownEl.textContent = t().readCarefully(n);

  state.countdownInterval = setInterval(() => {
    n--;
    if (n > 0) {
      countdownEl.textContent = t().readCarefully(n);
    } else {
      clearInterval(state.countdownInterval);
      state.countdownInterval = null;
      state.questionLocked = false;
      // Unlock buttons
      countdownEl.classList.add('done');
      countdownEl.textContent = t().pickNow;
      const btns = answersContainer.querySelectorAll('.answer-btn');
      btns.forEach((b) => {
        b.disabled = false;
        b.classList.remove('locked');
        b.querySelector('.answer-icon').textContent = '⚡';
      });
    }
  }, 1000);
}

function handleAnswer(idx, btn, answersContainer, q) {
  if (state.answering) return;
  if (state.questionLocked) return;
  state.answering = true;

  // Clear any running countdown
  if (state.countdownInterval) {
    clearInterval(state.countdownInterval);
    state.countdownInterval = null;
  }

  // Lock all buttons
  const allBtns = answersContainer.querySelectorAll('.answer-btn');
  allBtns.forEach((b) => (b.disabled = true));

  const isCorrect = idx === q.shuffledCorrectIndex;
  const theme = THEMES[state.set.id] || THEMES.apple;

  if (isCorrect) {
    state.score++;
    btn.classList.add('correct');
    btn.querySelector('.answer-icon').textContent = '✅';
    flashScreen(theme.correct);
    showCorrectOverlay();
    showContinueButton(goToLanding, 0);
  } else {
    btn.classList.add('wrong');
    btn.querySelector('.answer-icon').textContent = '❌';
    // Highlight the correct one
    allBtns[q.shuffledCorrectIndex].classList.add('correct');
    allBtns[q.shuffledCorrectIndex].querySelector('.answer-icon').textContent = '✅';
    flashScreen(theme.wrong);
    showWrongPopup(q.wrongMessage[currentLang]);
    showContinueButton(goToLanding, 3);
  }
}

function showContinueButton(cb, delaySec = 0) {
  // Remove any existing continue button first
  document.querySelectorAll('.continue-btn').forEach((b) => b.remove());

  const btn = document.createElement('button');
  btn.className = 'continue-btn';
  btn.textContent = t().continue;

  if (delaySec > 0) {
    btn.disabled = true;
    let n = delaySec;
    btn.textContent = t().continueWait(n);
    btn.dataset.intervalId = '';
    const interval = setInterval(() => {
      n--;
      if (n > 0) {
        btn.textContent = t().continueWait(n);
      } else {
        clearInterval(interval);
        btn.disabled = false;
        btn.textContent = t().continue;
      }
    }, 1000);
  }

  btn.addEventListener('click', () => {
    btn.remove();
    cb();
  });
  document.getElementById('app').appendChild(btn);
}

function goToLanding() {
  state.view = 'landing';
  state.answering = false;
  state.questionLocked = false;
  render();
}

function flashScreen(color) {
  const flash = document.getElementById('flash');
  if (!flash) return;
  // Use inline style for dynamic color from theme
  flash.style.background = color;
  flash.classList.add('show');
  setTimeout(() => {
    flash.classList.remove('show');
  }, 400);
}

function showCorrectOverlay() {
  const theme = THEMES[state.set.id] || THEMES.apple;
  const overlay = document.createElement('div');
  overlay.className = 'correct-overlay';
  overlay.style.background = theme.correct;
  // For white correct flash, use dark text; for green use dark text
  const textColor = theme.correct.toLowerCase() === '#ffffff' ? '#1A1A1A' : '#FFFFFF';
  overlay.innerHTML = `
    <div class="correct-check">✅</div>
    <div class="correct-text" style="color: ${textColor}; text-shadow: 0 0 20px rgba(0,0,0,0.4), 0 4px 0 rgba(0,0,0,0.3);">${t().correct}</div>
  `;
  document.getElementById('app').appendChild(overlay);
  // Stays on screen until user clicks the Continue button (no auto-navigate)
}

function showWrongPopup(message) {
  const backdrop = document.createElement('div');
  backdrop.className = 'wrong-popup-backdrop';
  backdrop.innerHTML = `
    <div class="wrong-popup">
      <div class="wrong-title">${t().wrongTitle}</div>
      <div class="wrong-message">${message}</div>
    </div>
  `;
  document.getElementById('app').appendChild(backdrop);
  // Stays on screen until user clicks the Continue button (no auto-navigate)
}

// ============================================
// Boot
// ============================================
render();
