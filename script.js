// ==========================================
// 1. TRANSLATION ENGINE (Chinese to Any)
// ==========================================
async function translateText() {
  const text = document.getElementById('sourceText').value;
  const targetLang = document.getElementById('targetLang').value;
  const resultElement = document.getElementById('translatedResult');

  if (!text.trim()) {
    resultElement.innerText = "Please enter text first / 请先输入文本";
    return;
  }

  resultElement.innerText = "Translating / 正在翻译...";

  try {
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh-CN|${targetLang}`);
    const data = await response.json();
    
    if (data.responseData) {
      resultElement.innerText = data.responseData.translatedText;
    } else {
      resultElement.innerText = "Translation error / 翻译失败";
    }
  } catch (error) {
    console.error(error);
    resultElement.innerText = "Network error / 网络错误";
  }
}

// ==========================================
// 2. MULTI-LANGUAGE CHATBOT
// ==========================================
function handleKeyPress(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const chatBody = document.getElementById('chatBody');
  const userText = input.value.trim();

  if (!userText) return;

  const userMsgDiv = document.createElement('div');
  userMsgDiv.className = 'chat-msg user';
  userMsgDiv.innerText = userText;
  chatBody.appendChild(userMsgDiv);

  input.value = '';
  chatBody.scrollTop = chatBody.scrollHeight;

  setTimeout(() => {
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'chat-msg bot';
    botMsgDiv.innerHTML = getBotReply(userText);
    chatBody.appendChild(botMsgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

function getBotReply(query) {
  const q = query.toLowerCase();

  if (q.includes('pyramid') || q.includes('金字塔') || q.includes('اهرام')) {
    return "The Giza Pyramids are open from 8 AM to 5 PM.<br><ruby>吉萨<rt>jí sà</rt></ruby><ruby>金字塔<rt>jīn zì tǎ</rt></ruby>每天8:00至17:00开放。";
  }
  if (q.includes('visa') || q.includes('签证') || q.includes('تاشير')) {
    return "Chinese citizens can get a Visa on Arrival.<br><ruby>中国<rt>zhōng guó</rt></ruby><ruby>公民<rt>gōng mín</rt></ruby>可以在埃及办理落地签。";
  }
  if (q.includes('hello') || q.includes('مرحبا') || q.includes('你好')) {
    return "<ruby>你好<rt>nǐ hǎo</rt></ruby>! Welcome! How can I assist your trip to Egypt or Chinese studies today?";
  }
  if (q.includes('hsk') || q.includes('level') || q.includes('مستوى')) {
    return "You can test your level on our <a href='learning.html'>Learning Page</a>!<br>您可以前往学习页面测试中文水平。";
  }

  return "Thank you for asking! Explore our top navigation menu for more info.";
}

// ==========================================
// 3. CHINESE PLACEMENT QUIZ & LEVELS
// ==========================================
const quizData = [
  {
    question: "ما معنى الكلمة الصينية: <ruby>你好<rt>nǐ hǎo</rt></ruby> ؟",
    options: ["شكراً", "مرحباً", "وداعاً", "نعم"],
    answer: 1
  },
  {
    question: "اختر الكلمة التي تعني 'شكراً' بالصينية مع النطق الصحيح:",
    options: [
      "<ruby>再见<rt>zài jiàn</rt></ruby>",
      "<ruby>不客气<rt>bú kè qì</rt></ruby>",
      "<ruby>谢谢<rt>xiè xie</rt></ruby>",
      "<ruby>对不起<rt>duì bu qǐ</rt></ruby>"
    ],
    answer: 2
  },
  {
    question: "ما ترجمة الجملة التالية: <ruby>我<rt>wǒ</rt></ruby><ruby>是<rt>shì</rt></ruby><ruby>学生<rt>xué sheng</rt></ruby> ؟",
    options: ["أنا معلم", "أنا طالب", "أنا سائح", "أنا طبيب"],
    answer: 1
  }
];

let currentQuestion = 0;
let score = 0;

function loadQuestion() {
  const qTitle = document.getElementById('questionTitle');
  const qText = document.getElementById('questionText');
  const optsContainer = document.getElementById('optionsContainer');

  if (currentQuestion >= quizData.length) {
    showQuizResults();
    return;
  }

  const q = quizData[currentQuestion];
  qTitle.innerText = `السؤال ${currentQuestion + 1} من ${quizData.length}`;
  qText.innerHTML = q.question;
  optsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.innerHTML = opt;
    btn.onclick = () => selectAnswer(index);
    optsContainer.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  if (selectedIndex === quizData[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;
  loadQuestion();
}

function showQuizResults() {
  document.getElementById('quizContainer').style.display = 'none';
  const dashboard = document.getElementById('learningDashboard');
  const resultText = document.getElementById('levelResult');
  const content = document.getElementById('levelContent');

  dashboard.style.display = 'block';

  let userLevel = "";
  let levelDetails = "";

  if (score === 0) {
    userLevel = "المستوى: مبتدئ مطلق (HSK 0)";
    levelDetails = "<ul><li>درس 1: الأرقام والتحيات الأساسية.</li><li>درس 2: النغمات الأربعة في اللغة الصينية (Pinyin).</li></ul>";
  } else if (score <= 2) {
    userLevel = "المستوى: مبتدئ (HSK 1)";
    levelDetails = "<ul><li>درس 1: تكوين الجمل البسيطة.</li><li>درس 2: مفردات السفر والتسوق بالصينية.</li></ul>";
  } else {
    userLevel = "المستوى: متوسط (HSK 2 - HSK 3)";
    levelDetails = "<ul><li>درس 1: المحادثات السياحية المتقدمة.</li><li>درس 2: قواعد الكلمات المساعدة.</li></ul>";
  }

  resultText.innerText = `درجتك: ${score} من ${quizData.length} - ${userLevel}`;
  content.innerHTML = levelDetails;
}