// ═══════════════════════════════════════════════════════
// EL · Influence Academy — lessons-content.js
// Полный контент всех 31 урока + логика страницы
// ═══════════════════════════════════════════════════════

if (!EL.requireAuth()) throw '';
const user = EL.getCurrentUser();
document.getElementById('navAv').textContent = user.avatar;
document.getElementById('navNm').textContent = user.name;

let currentGrade = 'junior';
let currentLesson = null;
const params = new URLSearchParams(location.search);
if (params.get('grade')) currentGrade = params.get('grade');

function switchGrade(g) {
  currentGrade = g;
  ['junior','middle','senior'].forEach(x =>
    document.getElementById('tab-'+x).classList.toggle('active', x===g));
  renderSidebar();
}

function renderSidebar() {
  const u = EL.getCurrentUser();
  const overall = EL.getOverallProgress(u.id);
  document.getElementById('sbPct').textContent = overall + '%';
  document.getElementById('sbBar').style.setProperty('--w', overall + '%');
  const data = CURRICULUM[currentGrade];
  let html = '';
  data.modules.forEach(mod => {
    html += `<div class="mod-header">${mod.title}</div>`;
    mod.lessons.forEach(l => {
      const done = u.progress && u.progress[l.id];
      const isActive = l.id === currentLesson;
      const unlocked = EL.isLessonUnlocked(u.id, l.id);
      const sc = done ? 'ls-done' : 'ls-cur';
      const si = done ? '✓' : unlocked ? '▶' : '🔒';
      html += `<div class="l-item${isActive?' active':''}${!unlocked?' locked':''}" onclick="loadLesson('${l.id}')">
        <div class="l-status ${unlocked||done ? sc : 'ls-lock'}">${si}</div>
        <div class="l-name">${l.title}</div>
        <div class="l-dur">${l.duration}м</div>
      </div>`;
    });
  });
  document.getElementById('sbList').innerHTML = html;
}

// ─── SHARED BLOCKS ──────────────────────────────────────
const CONCEPTS_HTML = `<div class="concept-grid">
  <div class="cc"><span class="cc-tag t-nano">Nano</span><div class="cc-title">Нано-инфлюенсер</div><div class="cc-sub">Узкая ниша, максимальное доверие. Аудитория — реальные знакомые и преданные фанаты.</div><div class="cc-ft">1K – 10K подписчиков · ER 5–8%</div></div>
  <div class="cc"><span class="cc-tag t-micro">Micro</span><div class="cc-title">Микро-инфлюенсер</div><div class="cc-sub">Оптимальный баланс охвата и вовлечённости. Часто работают в конкретной нише.</div><div class="cc-ft">10K – 100K подписчиков · ER 3–5%</div></div>
  <div class="cc"><span class="cc-tag t-macro">Macro</span><div class="cc-title">Макро-инфлюенсер</div><div class="cc-sub">Широкий охват, узнаваемое лицо. Работает для масштабирования кампаний.</div><div class="cc-ft">100K – 1M подписчиков · ER 1–3%</div></div>
  <div class="cc"><span class="cc-tag t-mega">Mega</span><div class="cc-title">Мега-инфлюенсер</div><div class="cc-sub">Знаменитость с огромным охватом. Для имиджевых кампаний и массового запуска.</div><div class="cc-ft">1M+ подписчиков · ER 0.5–1.5%</div></div>
</div>`;

const TABLE_METRICS = `<table class="mtable">
  <thead><tr><th>Метрика</th><th>Что измеряет</th><th>Формула</th><th>Норма</th></tr></thead>
  <tbody>
    <tr><td class="td-n">ER</td><td class="td-d">Вовлечённость аудитории</td><td><span class="td-f">(likes+comm)/reach×100</span></td><td class="td-d">Micro: 3–6%</td></tr>
    <tr><td class="td-n">Reach</td><td class="td-d">Уникальных охваченных пользователей</td><td><span class="td-f">данные платформы</span></td><td class="td-d">—</td></tr>
    <tr><td class="td-n">Impressions</td><td class="td-d">Всего показов, включая повторные</td><td><span class="td-f">данные платформы</span></td><td class="td-d">Всегда > Reach</td></tr>
    <tr><td class="td-n">CPM</td><td class="td-d">Стоимость 1000 показов</td><td><span class="td-f">бюджет / показы × 1000</span></td><td class="td-d">60–400 ₽</td></tr>
    <tr><td class="td-n">CPE</td><td class="td-d">Стоимость одного взаимодействия</td><td><span class="td-f">бюджет / engagements</span></td><td class="td-d">5–50 ₽</td></tr>
    <tr><td class="td-n">ROI</td><td class="td-d">Возврат на инвестиции</td><td><span class="td-f">(доход − затраты) / затраты × 100%</span></td><td class="td-d">> 100%</td></tr>
    <tr><td class="td-n">CPA</td><td class="td-d">Стоимость целевого действия</td><td><span class="td-f">бюджет / конверсии</span></td><td class="td-d">Зависит от ниши</td></tr>
    <tr><td class="td-n">CTR</td><td class="td-d">Кликабельность ссылки</td><td><span class="td-f">клики / показы × 100%</span></td><td class="td-d">1–5%</td></tr>
  </tbody>
</table>`;

const N8N = {
  basic: `<div class="n8n-flow">
    <div class="n8n-node trigger">⏰ Триггер<br><small>Событие-запуск</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">🔄 Обработка<br><small>Фильтр / трансформация</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">⚡ Действие<br><small>Запрос к сервису</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node output">📤 Результат<br><small>Уведомление / запись</small></div>
  </div>
  <p style="font-size:12px;color:var(--muted);margin-top:10px">Пример: Новый договор в CRM → n8n получает данные → Форматирует бриф → Отправляет инфлюенсеру по email → Уведомляет команду в Telegram</p>`,

  report: `<div class="n8n-flow">
    <div class="n8n-node trigger">⏰ Schedule Trigger<br><small>Каждую пятницу 17:00</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">📊 Google Sheets<br><small>Читаем метрики за неделю</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">🧮 Function Node<br><small>Считаем итоги: ER, CPE, охват</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">📋 Format HTML<br><small>Собираем красивый отчёт</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node output">✉️ Gmail / SMTP<br><small>Отправляем клиенту</small></div>
  </div>`,

  onboarding: `<div class="n8n-flow">
    <div class="n8n-node trigger">✍️ Webhook<br><small>Контракт подписан в CRM</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">📧 Email<br><small>Приветственное письмо</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">📋 Email<br><small>Бриф и материалы</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">📅 Notion / Trello<br><small>Создаём задачи команде</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node output">💬 Telegram Bot<br><small>Уведомление команды</small></div>
  </div>`,

  monitoring: `<div class="n8n-flow">
    <div class="n8n-node trigger">🔔 Webhook<br><small>LiveDune: пост опубликован</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">📊 HTTP Request<br><small>Получаем метрики поста</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">📝 Google Sheets<br><small>Записываем в таблицу кампании</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node output">📱 Telegram<br><small>Алерт команде с цифрами</small></div>
  </div>`,

  crm: `<div class="n8n-flow">
    <div class="n8n-node trigger">➕ Новый инфлюенсер в CRM</div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">🔍 HypeAuditor API<br><small>Автопроверка аудитории</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">🧮 Скоринг<br><small>Считаем рейтинг пригодности</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">📊 Обновляем CRM<br><small>Заполняем поля ER, Score</small></div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node output">💬 Уведомление менеджеру</div>
  </div>`,

  advanced: `<div class="n8n-flow" style="flex-wrap:wrap">
    <div class="n8n-node trigger">🔗 Webhook CRM</div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">🔍 HypeAuditor API</div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node">🧮 Скоринг и фильтры</div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node action">📊 Google Sheets + CRM</div>
    <span class="n8n-arrow">→</span>
    <div class="n8n-node output">📱 Telegram + Email команде</div>
  </div>
  <p style="font-size:12px;color:var(--muted);margin-top:10px">Вся цепочка запускается автоматически при добавлении нового инфлюенсера — без участия человека.</p>`
};

// ─── LESSON CONTENT LIBRARY ────────────────────────────────
const CONTENT = {

  // ════════════ JUNIOR ════════════════════════════════════

  j1: {
    badge: 'Junior · Модуль 1 · Урок 1',
    title: 'Что такое Influence&#8209;маркетинг',
    meta: ['⏱ 10 минут', '📖 Теория + примеры', '🎯 Junior'],
    blocks: [
      {
        label: 'Что это такое',
        html: `<p>Influence-маркетинг — это продвижение бренда, продукта или услуги через людей, которым доверяет аудитория. Инфлюенсер (от англ. influence — влиять) — человек, способный формировать мнения и поведение своих подписчиков.</p>
        <p>В отличие от классической рекламы, ключевую роль здесь играет <strong>личный авторитет</strong>: подписчики воспринимают рекомендацию не как рекламный посыл, а как совет близкого знакомого. Это меняет всё — уровень доверия, вовлечённость и конверсию.</p>`,
        insight: 'Люди покупают у людей. Инфлюенсер — мост между брендом и аудиторией, построенный на доверии.'
      },
      {
        label: 'Рост рынка и цифры',
        html: `<p>Рынок influence-маркетинга растёт стремительно:</p>
        <ul>
          <li><strong>2016 год</strong> — $1.7 млрд</li>
          <li><strong>2020 год</strong> — $9.7 млрд</li>
          <li><strong>2024 год</strong> — $21+ млрд</li>
        </ul>
        <p>По данным Influencer Marketing Hub, <strong>89% маркетологов</strong> считают ROI от influence-маркетинга сопоставимым или лучше, чем у других каналов. 63% компаний планируют увеличить бюджет на него в следующем году.</p>
        <p>В России рынок тоже активно развивается: после 2022 года центр сместился в Telegram, YouTube и ВКонтакте, при этом объём рынка продолжает расти.</p>`,
        insight: 'Influence-маркетинг — не тренд, а полноценный канал. Он уже давно занял место рядом с контекстной и таргетированной рекламой.'
      },
      {
        label: 'Почему это работает',
        html: `<p>Три фундаментальных механизма делают influence-маркетинг эффективным:</p>
        <ul>
          <li><strong>Доверие</strong> — аудитория инфлюенсера выстраивалась годами. Рекомендация воспринимается как личная, а не корпоративная</li>
          <li><strong>Нативность</strong> — контент органично вписывается в ленту. Мозг не включает «баннерную слепоту»</li>
          <li><strong>Точный таргет</strong> — каждый инфлюенсер уже работает с конкретной нишевой аудиторией. Не нужно платить за показы незаинтересованным людям</li>
        </ul>
        <p>Результат: CTR у influence-контента в <strong>2–5 раз выше</strong>, чем у таргетированных баннеров. Вовлечённость — в 4–8 раз выше классической медийки.</p>`
      },
      {
        label: 'Кто такой инфлюенсер на самом деле',
        html: `<p>Инфлюенсером не обязательно быть звездой с миллионом подписчиков. Инфлюенсер — это <strong>любой человек с лояльной аудиторией в конкретной нише</strong>.</p>
        <ul>
          <li>Эксперт по фитнесу с 8 000 подписчиков в Instagram</li>
          <li>Городской фотограф с 15 000 фолловеров в Telegram</li>
          <li>Мама двоих детей, рассказывающая о воспитании (50K YouTube)</li>
          <li>IT-специалист, ведущий канал о карьере в tech (12K Telegram)</li>
        </ul>
        <p>Главное — <strong>доверие аудитории и её соответствие ЦА бренда</strong>. Размер — вторично.</p>`,
        insight: 'Правило influence-маркетинга: лучше 10 000 вовлечённых, чем 500 000 пассивных.'
      },
      {
        label: 'Задачи на разных этапах воронки',
        html: `<p>Influence-маркетинг работает на всех этапах воронки продаж:</p>
        <ul>
          <li><strong>Awareness (знакомство)</strong> — широкие охватные коллабы с macro/mega инфлюенсерами</li>
          <li><strong>Consideration (рассмотрение)</strong> — экспертные обзоры и сравнения от micro-инфлюенсеров</li>
          <li><strong>Conversion (покупка)</strong> — промокоды, партнёрские ссылки у nano/micro с высоким доверием</li>
          <li><strong>Loyalty (удержание)</strong> — амбассадорские программы, долгосрочные партнёрства</li>
        </ul>`
      }
    ]
  },

  j2: {
    badge: 'Junior · Модуль 1 · Урок 2',
    title: 'Типы инфлюенсеров',
    meta: ['⏱ 8 минут', '📖 Теория', '🎯 Junior'],
    blocks: [
      {
        label: 'Классификация по охвату',
        type: 'concepts',
        insight: 'Средний ER нано-инфлюенсера — 5–8%. У мега-звезды — 0.5–1.5%. При одинаковом бюджете нано даст в 5–10 раз больше вовлечения.'
      },
      {
        label: 'Классификация по типу контента',
        html: `<p>Кроме охвата, инфлюенсеры делятся по тематике и формату:</p>
        <ul>
          <li><strong>Lifestyle</strong> — повседневная жизнь, путешествия, мода, еда. Широкая аудитория, работает для большинства потребительских товаров</li>
          <li><strong>Эксперт</strong> — врач, юрист, финансист, IT-специалист. Узкая, но очень лояльная аудитория. Высокое доверие к рекомендациям</li>
          <li><strong>Entertainer</strong> — юмор, шоу, стримеры, игровые блогеры. Молодая аудитория, высокий охват, ниже конверсия</li>
          <li><strong>UGC-creator</strong> — создаёт контент <em>для брендов</em>, не публикуя на свою аудиторию. Стоимость ниже, гибкость выше</li>
          <li><strong>Активист / эксперт мнений</strong> — лидеры сообществ, журналисты, блогеры на острые темы. Высокое доверие, сложные переговоры</li>
        </ul>`,
        insight: 'UGC-creators — недооценённый формат. Они создают контент, который бренд потом использует сам: в таргете, на сайте, в email. Стоит в 3–5 раз дешевле обычного инфлюенсера.'
      },
      {
        label: 'Когда какой тип выбирать',
        html: `<p>Простая матрица выбора:</p>
        <ul>
          <li><strong>Тест с малым бюджетом (до 50K ₽)</strong> → Nano. Низкий риск, высокая нативность</li>
          <li><strong>Нишевый продукт</strong> → Nano + Micro. Важна точность аудитории, а не охват</li>
          <li><strong>Масштабирование проверенной кампании</strong> → Micro + Macro</li>
          <li><strong>Имиджевый запуск, выход на массовый рынок</strong> → Macro + Mega</li>
          <li><strong>Локальный бизнес</strong> → Nano с геотаргетингом (блогеры твоего города)</li>
        </ul>`
      },
      {
        label: 'Сравнение по ключевым параметрам',
        html: `<table class="mtable">
          <thead><tr><th>Тип</th><th>Охват</th><th>Средний ER</th><th>Стоимость</th><th>Лучше всего для</th></tr></thead>
          <tbody>
            <tr><td class="td-n" style="color:var(--green)">Nano</td><td>1K–10K</td><td style="color:var(--green)">5–8%</td><td>Бартер – 10K ₽</td><td class="td-d">Ниши, локал, тесты</td></tr>
            <tr><td class="td-n" style="color:var(--gold)">Micro</td><td>10K–100K</td><td style="color:var(--gold)">3–5%</td><td>10K – 80K ₽</td><td class="td-d">Большинство запусков</td></tr>
            <tr><td class="td-n" style="color:#ff7a45">Macro</td><td>100K–1M</td><td>1–3%</td><td>80K – 500K ₽</td><td class="td-d">Масштабирование</td></tr>
            <tr><td class="td-n" style="color:#c084fc">Mega</td><td>1M+</td><td>0.5–1.5%</td><td>500K ₽+</td><td class="td-d">Имиджевые кампании</td></tr>
          </tbody>
        </table>`
      }
    ]
  },

  j3: {
    badge: 'Junior · Модуль 1 · Урок 3',
    title: 'Анализ аудитории инфлюенсера',
    meta: ['⏱ 12 минут', '🔍 Инструменты', '🎯 Junior'],
    blocks: [
      {
        label: 'Зачем анализировать до переговоров',
        html: `<p>Количество подписчиков — это не аудитория. Аудитория — это реальные люди, которые смотрят, вовлекаются и покупают. Перед любой коллаборацией нужно убедиться в двух вещах:</p>
        <ul>
          <li><strong>Аудитория настоящая</strong> — нет накрутки, боты в минимуме</li>
          <li><strong>Аудитория ваша</strong> — демография, интересы, гео совпадают с ЦА бренда</li>
        </ul>
        <p>Без проверки можно заплатить 100 000 ₽ за охват, из которого 50% — боты из Индии и 30% — аудитория совсем не вашей ниши.</p>`,
        insight: 'До 40% подписчиков некоторых блогеров — неактивные аккаунты или накрутка. HypeAuditor считает это «Audience Quality Score».'
      },
      {
        label: 'Красные флаги — признаки накрутки',
        html: `<p>На что смотреть при ручном анализе:</p>
        <ul>
          <li><strong>Резкие скачки подписчиков</strong> — рост на 10 000 за 2 дня без вирусного поста = накрутка</li>
          <li><strong>Несоответствие лайков и комментариев</strong> — 50 000 лайков и 12 комментариев вида «🔥🔥👏»</li>
          <li><strong>Комментарии от пустых аккаунтов</strong> — аватарок нет, постов 0, подписки на 1000+ аккаунтов</li>
          <li><strong>ER аномально низкий</strong> — 500K подписчиков, ER 0.1% = явная проблема</li>
          <li><strong>Гео аудитории не совпадает с контентом</strong> — русскоязычный блогер, 60% аудитории из Бразилии</li>
        </ul>`
      },
      {
        label: 'Что проверять — чеклист',
        html: `<ul>
          <li><strong>ER (Engagement Rate)</strong> — норма для micro: 3–6%. Для nano: 5–8%</li>
          <li><strong>Audience Quality Score</strong> — в HypeAuditor: выше 70 — хорошо, выше 85 — отлично</li>
          <li><strong>Демография</strong> — пол, возраст, топ-гео. Должно совпадать с портретом ЦА</li>
          <li><strong>Качество комментариев</strong> — читай 20–30 комментариев вручную. Живые? Содержательные?</li>
          <li><strong>Динамика роста</strong> — органичный постепенный рост vs резкие скачки</li>
          <li><strong>Рекламная история</strong> — что рекламировал раньше? Конкуренты? Подозрительные продукты?</li>
        </ul>`
      },
      {
        label: 'Инструменты анализа',
        html: `<ul>
          <li><strong>HypeAuditor</strong> (hypeauditor.com) — стандарт индустрии. Проверка накрутки, демография, ER-score. Бесплатный план даёт базовый анализ</li>
          <li><strong>TrendHERO</strong> — глубокий анализ Instagram и Telegram, история коллабораций</li>
          <li><strong>LiveDune</strong> — мониторинг аккаунтов в динамике, история постов и метрик</li>
          <li><strong>Popsters</strong> — сравнение вовлечённости между несколькими блогерами</li>
          <li><strong>Telemetr.me</strong> — специально для Telegram: рост, охваты, рекламная история</li>
        </ul>`,
        insight: 'Для старта достаточно HypeAuditor (бесплатный план) + Telemetr.me для Telegram. 10 минут проверки = экономия 50–200K ₽ бюджета.'
      }
    ]
  },

  j4: {
    badge: 'Junior · Модуль 1 · Урок 4',
    title: 'Основные метрики: ER, Reach, CPM',
    meta: ['⏱ 15 минут', '📊 Формулы', '🎯 Junior'],
    blocks: [
      {
        label: 'Полная таблица метрик',
        type: 'table'
      },
      {
        label: 'ER — самая важная метрика',
        html: `<p><strong>Engagement Rate (ER)</strong> — коэффициент вовлечённости. Показывает, какой процент охваченной аудитории реально взаимодействует с контентом.</p>
        <p><strong>Формула:</strong> ER = (Лайки + Комментарии + Репосты) / Охват × 100%</p>
        <p>Нормы ER по типам инфлюенсеров (Instagram, 2024):</p>
        <ul>
          <li>Nano (до 10K): <strong>5–8%</strong> — отлично, норма</li>
          <li>Micro (10–100K): <strong>3–5%</strong> — хорошо</li>
          <li>Macro (100K–1M): <strong>1–3%</strong> — норма</li>
          <li>Mega (1M+): <strong>0.5–1.5%</strong> — ожидаемо</li>
        </ul>
        <p>В Telegram ER считается иначе: ERR = просмотры / подписчики. Норма: 20–50% для активного канала.</p>`,
        insight: 'ER ниже 1% у micro-инфлюенсера — серьёзный тревожный сигнал. Либо накрутка, либо «мёртвая» аудитория.'
      },
      {
        label: 'Reach vs Impressions — в чём разница',
        html: `<p>Эти метрики часто путают:</p>
        <ul>
          <li><strong>Reach (охват)</strong> — количество <em>уникальных</em> пользователей, увидевших пост</li>
          <li><strong>Impressions (показы)</strong> — <em>общее</em> количество показов, включая повторные просмотры одним пользователем</li>
        </ul>
        <p><strong>Пример:</strong> пост увидели 10 000 человек, каждый в среднем 2 раза → Reach = 10 000, Impressions = 20 000</p>
        <p>Для оценки influence-кампаний важнее <strong>Reach</strong> — он показывает реальный охват уникальной аудитории.</p>`
      },
      {
        label: 'CPM и CPE — как считать деньги',
        html: `<p><strong>CPM (Cost Per Mille)</strong> — стоимость 1000 показов:<br>
        <code>CPM = Бюджет / Показы × 1000</code></p>
        <p>Пример: заплатил 30 000 ₽, получил 600 000 показов → CPM = 50 ₽</p>
        <p><strong>Средние CPM в influence-маркетинге (Россия, 2024):</strong></p>
        <ul>
          <li>Instagram Stories: 80–200 ₽</li>
          <li>Instagram Reels: 150–400 ₽</li>
          <li>YouTube интеграция: 300–800 ₽</li>
          <li>Telegram: 200–600 ₽</li>
        </ul>
        <p><strong>CPE (Cost Per Engagement)</strong> — стоимость одного взаимодействия:<br>
        <code>CPE = Бюджет / Количество engagements</code></p>`,
        insight: 'Сравнивай CPM между инфлюенсерами — это объективный способ оценить эффективность независимо от их охвата.'
      },
      {
        label: 'Как читать метрики в комплексе',
        html: `<p>Метрики никогда не работают в изоляции. Правильный анализ — смотреть на связку:</p>
        <ul>
          <li><strong>Высокий Reach + низкий ER</strong> → пассивная аудитория, много ботов или нерелевантных подписчиков</li>
          <li><strong>Низкий Reach + высокий ER</strong> → нишевый nano-инфлюенсер с преданной аудиторией — часто лучший выбор</li>
          <li><strong>Хороший CPM + плохой ROI</strong> → охватываем много, но не тех. Проблема в таргетинге, а не в инфлюенсере</li>
          <li><strong>Низкий CPM + высокий CPA</strong> → дёшево показываем, но плохо конвертируем. Проблема в оффере или в несоответствии аудитории</li>
        </ul>`
      }
    ]
  },

  j5: {
    badge: 'Junior · Модуль 2 · Урок 5',
    title: 'Поиск инфлюенсеров',
    meta: ['⏱ 10 минут', '🔍 Практика', '🎯 Junior'],
    blocks: [
      {
        label: 'Два подхода к поиску',
        html: `<p>Поиск инфлюенсеров делится на <strong>ручной</strong> и <strong>через платформы</strong>. На старте лучше начать с ручного — это даёт понимание рынка и насмотренность.</p>
        <ul>
          <li><strong>Ручной поиск</strong> — Instagram/TikTok хэштеги, поиск по нише, рекомендованные аккаунты</li>
          <li><strong>Биржи</strong> — GetBlogger, Epicstars, Perfluence, LabelUp: готовая база с фильтрами</li>
          <li><strong>Подписчики конкурентов</strong> — кто уже взаимодействует с похожими брендами</li>
          <li><strong>Telegram-каталоги</strong> — TGStat, Telemetr с поиском по тематике и охватам</li>
          <li><strong>Рекомендации действующих партнёров</strong> — лучшие инфлюенсеры знают друг друга</li>
        </ul>`
      },
      {
        label: 'Критерии отбора — чеклист',
        html: `<p>Перед внесением инфлюенсера в шортлист проверь каждый пункт:</p>
        <ul>
          <li>✅ ER соответствует норме для его размера (см. урок 4)</li>
          <li>✅ Аудитория по демографии совпадает с ЦА бренда</li>
          <li>✅ Тематика контента релевантна продукту</li>
          <li>✅ Публикует 2–3+ раза в неделю (активный аккаунт)</li>
          <li>✅ Нет публичных скандалов и репутационных рисков</li>
          <li>✅ Не рекламирует прямых конкурентов последние 3 месяца</li>
          <li>✅ Комментарии живые и содержательные</li>
          <li>✅ Проверка через HypeAuditor показала AQS выше 70</li>
        </ul>`,
        insight: 'Лучшие инфлюенсеры — те, кто сам уже пользуется или интересуется твоим продуктом. Их рекомендация максимально нативна и не требует проработанного сценария.'
      },
      {
        label: 'Шортлист и приоритизация',
        html: `<p>После первичного отбора у тебя может быть 30–50 кандидатов. Как выбрать лучших?</p>
        <p>Создай простую таблицу с весами:</p>
        <ul>
          <li>ER score (30% веса)</li>
          <li>Релевантность аудитории (30%)</li>
          <li>Качество контента (20%)</li>
          <li>Стоимость размещения (20%)</li>
        </ul>
        <p>Начни переговоры с топ-5 по рейтингу. Остальные — резервный список на случай, если кто-то откажет или не договоришься по цене.</p>`
      }
    ]
  },

  j6: {
    badge: 'Junior · Модуль 2 · Урок 6',
    title: 'Написание брифа',
    meta: ['⏱ 14 минут', '📝 Практика', '🎯 Junior'],
    blocks: [
      {
        label: 'Зачем нужен бриф',
        html: `<p>Бриф — документ, который снимает все вопросы инфлюенсера ДО создания контента. Без него инфлюенсер снимает «как понял», и ты получаешь контент, который нужно переснимать 3–5 раз.</p>
        <p><strong>Хороший бриф:</strong> сокращает правки с 5–7 до 1–2 раундов. Это экономит 2–3 недели времени и сохраняет отношения с инфлюенсером.</p>
        <p><strong>Плохой бриф:</strong> «Снимите что-нибудь про наш продукт, должно быть классно и нативно» — это не бриф, это источник конфликтов.</p>`
      },
      {
        label: 'Полная структура брифа',
        html: `<ol style="padding-left:20px">
          <li style="margin-bottom:12px"><strong>О бренде</strong> — кто мы, наши ценности, tone of voice, позиционирование. Как мы хотим выглядеть в глазах аудитории</li>
          <li style="margin-bottom:12px"><strong>Продукт / услуга</strong> — что продвигаем, 3–5 ключевых преимуществ, УТП. Что важно донести до аудитории</li>
          <li style="margin-bottom:12px"><strong>Цель кампании</strong> — конкретная: охват / продажи / лиды / установки приложения / подписки</li>
          <li style="margin-bottom:12px"><strong>Целевая аудитория</strong> — кто должен увидеть и запомнить. Демография, боли, интересы</li>
          <li style="margin-bottom:12px"><strong>Формат контента</strong> — Reels, Stories, YouTube-интеграция, Telegram-пост, TikTok. Длительность, ориентация</li>
          <li style="margin-bottom:12px"><strong>Ключевые сообщения</strong> — 2–3 тезиса, которые ОБЯЗАТЕЛЬНО должны прозвучать</li>
          <li style="margin-bottom:12px"><strong>Запреты (MUST NOT)</strong> — что нельзя говорить, показывать, упоминать. Конкуренты, спорные темы</li>
          <li style="margin-bottom:12px"><strong>Технические требования</strong> — качество съёмки, наличие лого/продукта в кадре, ссылка / промокод</li>
          <li style="margin-bottom:12px"><strong>Дедлайны</strong> — дата сдачи черновика, окно согласования (2–3 дня), дата публикации</li>
          <li style="margin-bottom:12px"><strong>Отчётность</strong> — какие скриншоты со статистикой прислать и когда (обычно через 48–72 часа)</li>
        </ol>`,
        insight: 'Бриф без раздела «Запреты» — незаконченный бриф. Инфлюенсер должен чётко знать, что нельзя делать, не только что нужно.'
      },
      {
        label: 'Типичные ошибки в брифах',
        html: `<ul>
          <li><strong>Слишком много обязательных тезисов</strong> — если их больше 5, контент будет выглядеть как реклама советского телевидения</li>
          <li><strong>Нет примеров тона</strong> — «будьте нативными» без примера каждый понимает по-своему</li>
          <li><strong>Нереальные дедлайны</strong> — «нужно к завтрашнему утру» = плохой контент и испорченные отношения</li>
          <li><strong>Нет технических требований</strong> — инфлюенсер снял вертикальное видео, а нужно было горизонтальное</li>
          <li><strong>Забыли про маркировку</strong> — по закону нужен тег #реклама или #ad. Штрафы — проблема бренда и инфлюенсера</li>
        </ul>`
      }
    ]
  },

  j7: {
    badge: 'Junior · Модуль 2 · Урок 7',
    title: 'Переговоры для новичков',
    meta: ['⏱ 11 минут', '🤝 Практика', '🎯 Junior'],
    blocks: [
      {
        label: 'Первый контакт — как не облажаться',
        html: `<p>Первое сообщение определяет тон всего сотрудничества. Большинство брендов провалются ещё здесь — отправляют шаблонные массовые рассылки. Инфлюенсеры их видят сразу.</p>
        <p><strong>Плохое начало:</strong> «Здравствуйте! Мы компания X. Хотим предложить вам сотрудничество. Пришлите ваши условия.»</p>
        <p><strong>Хорошее начало:</strong> «Привет! Видел твой пост про [конкретная тема] — думаю, нашему продукту [название] это было бы очень органично. Мы делаем [короткое описание]. Можем обсудить?»</p>
        <ul>
          <li>Упомяни конкретный пост или тему — показывает, что ты реально смотришь контент</li>
          <li>Будь кратким — 3–4 предложения максимум в первом сообщении</li>
          <li>Укажи примерный формат и бюджет сразу — экономит время обоих</li>
          <li>Дай ссылку на бренд — пусть сами посмотрят</li>
        </ul>`,
        insight: 'Лучшее первое сообщение — персонализированное, краткое и содержащее конкретное предложение. Не «как вас зовут?», а «вот что я предлагаю».'
      },
      {
        label: 'Ориентировочные ставки (Россия, 2024)',
        html: `<table class="mtable">
          <thead><tr><th>Тип</th><th>Instagram Stories</th><th>Instagram Reels</th><th>YouTube интеграция</th><th>Telegram пост</th></tr></thead>
          <tbody>
            <tr><td class="td-n">Nano (1K–10K)</td><td>Бартер–3K ₽</td><td>Бартер–5K ₽</td><td>—</td><td>Бартер–2K ₽</td></tr>
            <tr><td class="td-n">Micro (10–100K)</td><td>5K–30K ₽</td><td>10K–50K ₽</td><td>20K–80K ₽</td><td>5K–40K ₽</td></tr>
            <tr><td class="td-n">Macro (100K–1M)</td><td>30K–200K ₽</td><td>50K–300K ₽</td><td>80K–500K ₽</td><td>40K–250K ₽</td></tr>
            <tr><td class="td-n">Mega (1M+)</td><td>от 200K ₽</td><td>от 300K ₽</td><td>от 500K ₽</td><td>от 250K ₽</td></tr>
          </tbody>
        </table>`,
        insight: 'Эти цифры — ориентир. Реальные ставки сильно зависят от ниши, качества аудитории и конкретного инфлюенсера. Торговаться на 20–30% — норма рынка.'
      },
      {
        label: 'Как вести переговоры',
        html: `<ul>
          <li><strong>Всегда торгуйся</strong> — 20–30% скидки это норма. Инфлюенсеры называют «стартовую» цену с запасом</li>
          <li><strong>Предлагай долгосрочное партнёрство</strong> — 3–6 публикаций по сниженной цене за каждую. Инфлюенсеры ценят стабильность</li>
          <li><strong>Бартер + доплата</strong> — для нано-блогеров отличный вариант: продукт + небольшой гонорар</li>
          <li><strong>Не торгуйся на качестве</strong> — если хочешь дешевле, снизь количество публикаций, но не проси срезать бюджет за тот же объём</li>
          <li><strong>Фиксируй условия письменно</strong> — даже переписка в Telegram лучше, чем устное согласие</li>
        </ul>`
      }
    ]
  },

  j8: {
    badge: 'Junior · Модуль 2 · Урок 8',
    title: 'Оценка результатов кампании',
    meta: ['⏱ 12 минут', '📊 Аналитика', '🎯 Junior'],
    blocks: [
      {
        label: 'Когда и что собирать',
        html: `<p>Постаналитика — самый недооценённый этап. Большинство новичков закрывают кампанию сразу после публикации. Правильный подход — ждать 48–72 часа и собирать полную картину.</p>
        <p><strong>Что запрашивать у инфлюенсера:</strong></p>
        <ul>
          <li>Скриншот статистики поста: охват, показы, переходы по ссылке</li>
          <li>Скриншот Stories: охват, клики, переходы на профиль</li>
          <li>Если YouTube — просмотры, CTR, среднее время просмотра</li>
        </ul>
        <p><strong>Что отслеживаешь сам:</strong></p>
        <ul>
          <li>Использование промокода (из системы учёта продаж)</li>
          <li>Переходы по UTM-ссылке (Google Analytics / Яндекс.Метрика)</li>
          <li>Рост подписчиков бренда в день публикации</li>
        </ul>`,
        insight: 'Никогда не полагайся только на данные инфлюенсера. Всегда отслеживай своими UTM и промокодами — это единственный способ видеть реальную конверсию.'
      },
      {
        label: 'Как считать эффективность',
        html: `<p>После сбора данных считай ключевые метрики:</p>
        <ul>
          <li><strong>CPE:</strong> Бюджет / (Лайки + Комментарии + Репосты)</li>
          <li><strong>CPM:</strong> Бюджет / Охват × 1000</li>
          <li><strong>CPC (Cost Per Click):</strong> Бюджет / Переходы по ссылке</li>
          <li><strong>CPA (Cost Per Action):</strong> Бюджет / Конверсии (покупки, регистрации)</li>
          <li><strong>ROI:</strong> (Доход от кампании − Бюджет) / Бюджет × 100%</li>
        </ul>`
      },
      {
        label: 'Создаём базу данных инфлюенсеров',
        html: `<p>После каждой кампании вноси данные в таблицу. Через 5–10 кампаний у тебя появятся <strong>личные бенчмарки</strong> — и ты будешь понимать, что хорошо, а что плохо для твоей ниши.</p>
        <p><strong>Минимальные поля таблицы:</strong> Инфлюенсер | Платформа | Охват | ER поста | Бюджет | CPE | CPM | Конверсии | CPA | Рекомендация (работать ещё / нет)</p>`,
        insight: 'Лучшие агентства строят базу «проверенных» инфлюенсеров по нишам — это экономит 60% времени на поиск и переговоры для следующих кампаний.'
      }
    ]
  },

  j9: {
    badge: 'Junior · Модуль 3 · Урок 9',
    title: 'KPI и метрики успеха',
    meta: ['⏱ 13 минут', '📊 Теория', '🎯 Junior'],
    blocks: [
      {
        label: 'Почему KPI нужно ставить до кампании',
        html: `<p><strong>KPI (Key Performance Indicators)</strong> — конкретные, измеримые показатели, по которым оцениваешь успех. Без KPI нет критерия «хорошо» или «плохо» — и клиент, и ты сам не понимаете, была ли кампания успешной.</p>
        <p>Правило: <strong>KPI ставится ДО старта кампании</strong>, согласовывается с клиентом и прописывается в медиаплане. После — ты сравниваешь факт с планом.</p>
        <p><strong>Плохая постановка KPI:</strong> «Хотим хорошие результаты и рост продаж»<br>
        <strong>Хорошая постановка KPI:</strong> «Охват ≥ 200 000 уникальных пользователей, ER ≥ 3%, промокод использован ≥ 150 раз, ROI ≥ 120%»</p>`,
        insight: 'Без KPI нет оценки. Без оценки нет роста. Без роста нет доверия клиента.'
      },
      {
        label: 'Четыре уровня KPI',
        html: `<ul>
          <li><strong>Awareness KPI</strong> (знакомство с брендом):
            <ul><li>Reach (охват уникальных пользователей)</li><li>Impressions (общее кол-во показов)</li><li>Brand Mentions (упоминания бренда)</li><li>Share of Voice в нише</li></ul>
          </li>
          <li><strong>Engagement KPI</strong> (вовлечённость):
            <ul><li>ER (Engagement Rate)</li><li>Comments (качество и количество)</li><li>Saves / Reposts — признак «сохранить, чтобы вернуться»</li><li>Story views и Swipe-up</li></ul>
          </li>
          <li><strong>Conversion KPI</strong> (прямые действия):
            <ul><li>Clicks по ссылке (CPC)</li><li>Promo code uses (использование промокода)</li><li>App installs, Sign-ups, Sales</li><li>CPA (стоимость одного действия)</li></ul>
          </li>
          <li><strong>Retention KPI</strong> (долгосрочный эффект):
            <ul><li>New followers бренда в день публикации</li><li>Повторные покупки от аудитории инфлюенсера</li><li>Brand search volume (рост поисковых запросов)</li></ul>
          </li>
        </ul>`
      },
      {
        label: 'Как формулировать KPI для клиента',
        html: `<p>KPI должны быть <strong>SMART</strong>:</p>
        <ul>
          <li><strong>S</strong>pecific — конкретные («охват» vs «охват 150 000 уникальных»)</li>
          <li><strong>M</strong>easurable — измеримые (числа, %, ₽)</li>
          <li><strong>A</strong>chievable — достижимые (не 10M охвата с бюджетом 50K)</li>
          <li><strong>R</strong>elevant — релевантные цели бизнеса</li>
          <li><strong>T</strong>ime-bound — с датой измерения</li>
        </ul>
        <p><strong>Пример SMART KPI:</strong> «До 30 ноября достигнуть охвата 200K уникальных пользователей в ЦА 25–40 лет в Москве и Санкт-Петербурге при бюджете 120 000 ₽, ER не менее 3.5%»</p>`
      }
    ]
  },

  j10: {
    badge: 'Junior · Модуль 3 · Урок 10',
    title: 'Постаналитика кампании',
    meta: ['⏱ 10 минут', '📊 Практика', '🎯 Junior'],
    blocks: [
      {
        label: 'Что такое постаналитика и зачем она нужна',
        html: `<p>Постаналитика — это структурированный разбор результатов кампании после её завершения. Цель — понять, что сработало, что нет, и вынести уроки для следующей кампании.</p>
        <p>Без постаналитики каждая кампания — это «с нуля». С постаналитикой — каждая следующая кампания умнее предыдущей.</p>`
      },
      {
        label: 'Структура постаналитического отчёта',
        html: `<ol style="padding-left:20px">
          <li style="margin-bottom:10px"><strong>Сводная таблица по инфлюенсерам</strong> — Имя | Охват | ER | CPE | CPM | Конверсии | CPA | ROI</li>
          <li style="margin-bottom:10px"><strong>Топ-3 лучших публикации</strong> — скриншоты, метрики, гипотезы почему сработало</li>
          <li style="margin-bottom:10px"><strong>Топ-3 худших публикации</strong> — метрики, гипотезы почему не сработало</li>
          <li style="margin-bottom:10px"><strong>План vs факт</strong> — таблица со всеми KPI: что планировали / что получили / отклонение в %</li>
          <li style="margin-bottom:10px"><strong>Инсайты</strong> — 3–5 конкретных наблюдений («Stories конвертируют лучше Reels у этой аудитории», «Промокод использовали только 8% перешедших»)</li>
          <li style="margin-bottom:10px"><strong>Рекомендации</strong> — кого из инфлюенсеров продолжить, от кого отказаться, что изменить в следующей кампании</li>
        </ol>`,
        insight: 'Постаналитика ценна не ради красивых цифр. Ценны инсайты — «почему?». Одна строчка «промокод сработал в 2 раза лучше у nano vs macro» стоит дороже 10 красивых диаграмм.'
      },
      {
        label: 'Как работать с провалами',
        html: `<p>Не каждая кампания будет успешной. Правильная реакция на провал:</p>
        <ul>
          <li><strong>Не паниковать и не обвинять инфлюенсера</strong> — сначала ищи системные причины</li>
          <li><strong>Задай вопрос «почему?» пять раз</strong> — каждый раз докапываясь до следующего уровня причины</li>
          <li><strong>Зафиксируй гипотезу</strong> — «не сработало, потому что аудитория инфлюенсера — 70% мужчины, а наш продукт для женщин»</li>
          <li><strong>Проверь гипотезу в следующей кампании</strong> — это и есть data-driven подход</li>
        </ul>`
      }
    ]
  },

  j11: {
    badge: 'Junior · Модуль 3 · Урок 11',
    title: 'Первый отчёт для клиента',
    meta: ['⏱ 9 минут', '📄 Практика', '🎯 Junior'],
    blocks: [
      {
        label: 'Принцип «перевёрнутой пирамиды»',
        html: `<p>Клиент читает отчёт первые 30–60 секунд. Если за это время не видит главного — считай, что отчёт не прочитан. Строй отчёт по принципу перевёрнутой пирамиды: <strong>главное вверху, детали внизу</strong>.</p>
        <p><strong>Плохая структура:</strong> 5 страниц описания кампании → метрики в конце → нет выводов<br>
        <strong>Хорошая структура:</strong> Ключевые цифры → Достигнуто vs план → Топ-результаты → Детали → Рекомендации</p>`
      },
      {
        label: 'Структура клиентского отчёта',
        html: `<ol style="padding-left:20px">
          <li style="margin-bottom:10px"><strong>Executive Summary (1 страница)</strong> — 3–5 ключевых цифр, одно предложение вывода: «Кампания достигла 94% плановых KPI, ROI составил 143%»</li>
          <li style="margin-bottom:10px"><strong>KPI: план vs факт</strong> — таблица со светофором (🟢 выполнено, 🟡 частично, 🔴 не выполнено)</li>
          <li style="margin-bottom:10px"><strong>Топ-публикации</strong> — 3–5 лучших постов со скриншотами и метриками</li>
          <li style="margin-bottom:10px"><strong>Охват аудитории</strong> — сколько уникальных людей увидели кампанию</li>
          <li style="margin-bottom:10px"><strong>Финансовые итоги</strong> — освоенный бюджет, CPM, CPE, ROI если можно посчитать</li>
          <li style="margin-bottom:10px"><strong>Инсайты и рекомендации</strong> — 3 вывода + 3 рекомендации для следующей кампании</li>
        </ol>`,
        insight: 'Клиент хочет видеть одно: что получил за свои деньги. Все красивые детали — это для тебя. Для него — только «сколько стоил охват» и «что заработали».'
      },
      {
        label: 'Как подавать плохие результаты',
        html: `<p>Не все кампании будут успешными. Если результат ниже плана — не прячь это в конце отчёта:</p>
        <ul>
          <li>Признай факт прямо: «Достигли 65% от планового охвата»</li>
          <li>Объясни причину: «Инфлюенсер изменил тематику контента в период кампании»</li>
          <li>Предложи решение: «В следующей кампании рекомендуем зафиксировать формат контента в контракте»</li>
        </ul>
        <p>Клиенты принимают ошибки, когда видят честный разбор и конкретный план исправления. Они не принимают замалчивание.</p>`
      }
    ]
  },

  // ════════════ MIDDLE ════════════════════════════════════

  m1: {
    badge: 'Middle · Модуль 4 · Урок 1',
    title: 'Медиапланирование',
    meta: ['⏱ 15 минут', '📋 Стратегия', '🎯 Middle'],
    blocks: [
      {
        label: 'Что такое медиаплан',
        html: `<p>Медиаплан — главный операционный документ кампании. Он описывает <strong>кто, когда, где, за сколько и с каким сообщением</strong> выступает от имени бренда. Хороший медиаплан держит всю команду на одной волне и позволяет клиенту видеть полную картину до старта.</p>
        <p><strong>Медиаплан включает:</strong></p>
        <ul>
          <li>Список инфлюенсеров — платформа, охват, ER, стоимость</li>
          <li>Форматы контента — Reels, Stories, пост, интеграция в видео</li>
          <li>Расписание публикаций — даты и время по каждому инфлюенсеру</li>
          <li>Распределение бюджета — разбивка по инфлюенсерам и форматам</li>
          <li>Плановые KPI — ожидаемый охват, ER, конверсии</li>
        </ul>`,
        insight: 'Медиаплан — живой документ. Обновляй его в процессе кампании, фиксируй отклонения от плана. Это твоя операционная панель.'
      },
      {
        label: 'Распределение бюджета',
        html: `<p>Рекомендуемая структура для сбалансированной кампании:</p>
        <ul>
          <li><strong>60% — основные интеграции</strong>: 2–3 проверенных Macro или 5–10 Micro инфлюенсеров</li>
          <li><strong>25% — тест новых</strong>: Nano/Micro с высоким потенциалом, которых видишь впервые</li>
          <li><strong>10% — усиление</strong>: допубликации, Stories, дополнительные форматы от лучших инфлюенсеров</li>
          <li><strong>5% — резерв</strong>: непредвиденные расходы, срочные замены</li>
        </ul>
        <p>Не клади все яйца в одну корзину. Диверсификация снижает риск провала всей кампании из-за одного инфлюенсера.</p>`
      },
      {
        label: 'Как строить медиаплан на практике',
        html: `<p>Пошаговый процесс:</p>
        <ol style="padding-left:20px">
          <li style="margin-bottom:8px">Определи цель и KPI кампании (охват, конверсии, ROI)</li>
          <li style="margin-bottom:8px">Установи бюджет и разбей его по категориям (60/25/10/5)</li>
          <li style="margin-bottom:8px">Создай шортлист инфлюенсеров — 15–20 кандидатов</li>
          <li style="margin-bottom:8px">Согласуй условия и подтверди участие каждого</li>
          <li style="margin-bottom:8px">Распредели даты публикаций — учитывай события рынка, праздники, активность ЦА</li>
          <li style="margin-bottom:8px">Пропиши плановые KPI по каждому инфлюенсеру</li>
          <li style="margin-bottom:8px">Согласуй план с клиентом до старта</li>
        </ol>`,
        insight: 'Лучшее время публикации для большинства ниш: вт–чт, 18:00–22:00. Пятница и выходные — ниже вовлечённость в большинстве ниш B2B.'
      }
    ]
  },

  m2: {
    badge: 'Middle · Модуль 4 · Урок 2',
    title: 'Контент-стратегия для бренда',
    meta: ['⏱ 13 минут', '🎨 Стратегия', '🎯 Middle'],
    blocks: [
      {
        label: 'Зачем бренду контент-стратегия в influence',
        html: `<p>Без стратегии influence-кампании выглядят как набор случайных постов. С стратегией — каждая публикация работает на единую цель и усиливает предыдущую.</p>
        <p><strong>Контент-стратегия в influence определяет:</strong></p>
        <ul>
          <li>Какие истории рассказывает каждый тип инфлюенсера</li>
          <li>Как контент соотносится с воронкой продаж</li>
          <li>Какие форматы работают на каждом этапе</li>
          <li>Как создаётся синергия между публикациями</li>
        </ul>`
      },
      {
        label: 'Контентная воронка через инфлюенсеров',
        html: `<ul>
          <li><strong>Top of Funnel — Знакомство</strong><br>Кто: Mega + Macro инфлюенсеры<br>Что: широкие охватные коллабы, знакомство с брендом, интрига<br>Цель: Reach, Impressions, Brand Awareness</li>
          <li style="margin-top:12px"><strong>Middle of Funnel — Рассмотрение</strong><br>Кто: Micro с экспертным контентом<br>Что: обзоры, сравнения, «честные» мнения, FAQ<br>Цель: ER, время просмотра, переходы на сайт</li>
          <li style="margin-top:12px"><strong>Bottom of Funnel — Конверсия</strong><br>Кто: Nano с высоким доверием аудитории<br>Что: персональные рекомендации, промокоды, ограниченные офферы<br>Цель: Promo uses, Sales, CPA</li>
        </ul>`,
        insight: 'Не используй только один уровень воронки. Только охватные посты без конверсионных — деньги на ветер. Только конверсионные без охвата — выжигаешь маленькую аудиторию.'
      },
      {
        label: 'Tone of voice и нарратив',
        html: `<p>Один из главных страхов брендов — «потеря контроля над месседжем». Решение — не тотальный контроль, а <strong>чёткий нарратив</strong> в брифе.</p>
        <p>Нарратив — это история, которую рассказывает кампания. Каждый инфлюенсер рассказывает её своими словами, но суть одна.</p>
        <p><strong>Пример нарратива:</strong> «Наш продукт экономит время и даёт свободу для важного»<br>
        Nano-инфлюенсер расскажет это через личную историю. Macro — через сравнение с конкурентами. Мама-блогер — через сценку из жизни с детьми.</p>
        <p>Разные формы, одно послание.</p>`
      }
    ]
  },

  m3: {
    badge: 'Middle · Модуль 4 · Урок 3',
    title: 'Выбор платформ',
    meta: ['⏱ 16 минут', '📱 Стратегия', '🎯 Middle'],
    blocks: [
      {
        label: 'Обзор платформ 2024',
        html: `<table class="mtable">
          <thead><tr><th>Платформа</th><th>Аудитория</th><th>Форматы</th><th>Средний ER</th><th>Лучше всего для</th></tr></thead>
          <tbody>
            <tr><td class="td-n">Instagram</td><td class="td-d">25–45 лет, женщины</td><td class="td-d">Reels, Stories, пост</td><td>1–5%</td><td class="td-d">Fashion, beauty, lifestyle, food</td></tr>
            <tr><td class="td-n">YouTube</td><td class="td-d">18–45 лет, мужчины</td><td class="td-d">Интеграция, обзор, Shorts</td><td>2–8%</td><td class="td-d">Tech, авто, гейминг, финансы</td></tr>
            <tr><td class="td-n">Telegram</td><td class="td-d">25–45 лет, профессионалы</td><td class="td-d">Пост, видео, кружок</td><td>ERR 20–50%</td><td class="td-d">Финансы, IT, маркетинг, новости</td></tr>
            <tr><td class="td-n">TikTok</td><td class="td-d">16–30 лет</td><td class="td-d">Vertical video, тренды</td><td>5–12%</td><td class="td-d">Entertainment, молодёжные бренды</td></tr>
            <tr><td class="td-n">VK / Клипы</td><td class="td-d">Широко, 25–55 лет</td><td class="td-d">Пост, видео, клипы</td><td>1–4%</td><td class="td-d">Массовый рынок, СНГ</td></tr>
          </tbody>
        </table>`,
        insight: 'Не гонись за всеми платформами одновременно. 2–3 хорошо выбранных канала лучше, чем присутствие везде без глубины.'
      },
      {
        label: 'Как выбирать платформы под задачу',
        html: `<ul>
          <li><strong>Нужен охват молодой аудитории?</strong> → TikTok + Instagram Reels</li>
          <li><strong>B2B или профессиональная ниша?</strong> → Telegram. Высокая конверсия, лояльная аудитория</li>
          <li><strong>Нужно долгосрочное доверие?</strong> → YouTube. Видеообзор живёт годами в поиске</li>
          <li><strong>Широкий охват в РФ/СНГ?</strong> → VK + Telegram</li>
          <li><strong>Fashion/beauty/еда?</strong> → Instagram — всё ещё самая визуальная платформа</li>
          <li><strong>Хочешь вирусный эффект?</strong> → TikTok. Алгоритм работает на незнакомцев, а не только на подписчиков</li>
        </ul>`
      },
      {
        label: 'Особенности работы на каждой платформе',
        html: `<p><strong>Instagram:</strong> Reels продвигаются алгоритмом за пределы подписчиков. Stories — только для подписчиков. Сочетание даёт лучший результат.</p>
        <p><strong>YouTube:</strong> интеграция в начале видео (pre-roll) vs в середине (mid-roll) vs отдельный ролик. Самый высокий CPM, самый длинный срок жизни контента.</p>
        <p><strong>Telegram:</strong> пост в канале виден всем подписчикам без алгоритмических ограничений. ERR (просмотры/подписчики) — главная метрика. Норма для активного канала: 30–60%.</p>
        <p><strong>TikTok:</strong> алгоритм показывает контент незнакомцам сразу. Значит, охват может быть огромным даже у маленького блогера. Но конверсия пока ниже, чем у Telegram/YouTube.</p>`
      }
    ]
  },

  m4: {
    badge: 'Middle · Модуль 5 · Урок 4',
    title: 'Мультиканальные кампании',
    meta: ['⏱ 18 минут', '🔗 Стратегия', '🎯 Middle'],
    blocks: [
      {
        label: 'Что такое мультиканальная кампания',
        html: `<p>Мультиканальная кампания — это скоординированный запуск на нескольких платформах одновременно с единым нарративом. Ключевое слово — <strong>скоординированный</strong>. Не просто «постите везде», а единая история с нарастающим эффектом.</p>
        <p><strong>Эффект синергии:</strong> когда пользователь видит публикацию в Telegram, потом Reels в Instagram, потом обзор на YouTube от разных авторов — это создаёт эффект «везде говорят об этом». Доверие и конверсия растут.</p>`,
        insight: 'Принцип «правила 7 касаний»: потребитель должен 7 раз встретить информацию о продукте до покупки. Мультиканальная кампания ускоряет этот процесс.'
      },
      {
        label: 'Архитектура запуска продукта',
        html: `<p>Пример поэтапного мультиканального запуска:</p>
        <ul>
          <li><strong>День 1–2 (Интрига):</strong> Тизеры у топовых Telegram-каналов без раскрытия продукта. «Скоро что-то крутое»</li>
          <li><strong>День 3–4 (Доверие):</strong> Полноценный YouTube-обзор от доверенного эксперта. Детали, плюсы и минусы, честный взгляд</li>
          <li><strong>День 5–7 (Социальное доказательство):</strong> Волна из 10–20 Micro/Nano в Instagram с личными историями и промокодами</li>
          <li><strong>День 8–10 (Вирусность):</strong> TikTok-тренд с хэштегом, UGC-контент, repost лучших публикаций</li>
          <li><strong>День 11–14 (Конверсия):</strong> Напоминания у Nano с ограниченным промокодом «последний шанс»</li>
        </ul>`,
        insight: 'Разрыв между публикациями — 2–3 дня. Если интервал больше 5 дней — эффект накопления теряется, аудитория «остывает».'
      },
      {
        label: 'Операционная координация',
        html: `<p>Управление мультиканальной кампанией — это сложная операционная задача. Как удерживать всё в руках:</p>
        <ul>
          <li><strong>Единый медиаплан</strong> — все инфлюенсеры, платформы и даты в одном документе</li>
          <li><strong>Контент-календарь</strong> — кто публикует в какой день, разбивка по платформам</li>
          <li><strong>Общий чат с инфлюенсерами</strong> — для оперативных правок и вопросов</li>
          <li><strong>Трекинг в реальном времени</strong> — LiveDune или ручной мониторинг первые 24 часа</li>
        </ul>`
      }
    ]
  },

  m5: {
    badge: 'Middle · Модуль 5 · Урок 5',
    title: 'Контракты и юридические аспекты',
    meta: ['⏱ 14 минут', '⚖️ Практика', '🎯 Middle'],
    blocks: [
      {
        label: 'Почему договор обязателен',
        html: `<p>Работа без договора — риск для обеих сторон. Без договора:</p>
        <ul>
          <li>Инфлюенсер может опубликовать что угодно — у тебя нет инструментов требовать правки</li>
          <li>Ты не можешь законно требовать вернуть предоплату при срыве сроков</li>
          <li>Права на контент после публикации не определены — инфлюенсер может запретить тебе его использовать</li>
          <li>Маркировка рекламы не зафиксирована — штраф за нарушение ФЗ о рекламе может упасть на бренд</li>
        </ul>
        <p>Даже 1-страничный договор лучше устного согласия. Для регулярных партнёров используй рамочный договор + приложение на каждую кампанию.</p>`,
        insight: 'С 1 сентября 2023 года в России действует закон об обязательной маркировке и регистрации рекламы в ЕРИР. Штраф — до 500 000 ₽ для юрлиц. Фиксируй маркировку в договоре.'
      },
      {
        label: 'Обязательные пункты контракта',
        html: `<ol style="padding-left:20px">
          <li style="margin-bottom:8px"><strong>Стороны</strong> — ИП/самозанятый статус инфлюенсера, реквизиты</li>
          <li style="margin-bottom:8px"><strong>Объём работ</strong> — количество публикаций, форматы, платформы, точные требования</li>
          <li style="margin-bottom:8px"><strong>Сроки</strong> — дата сдачи черновика, окно согласования, дата публикации</li>
          <li style="margin-bottom:8px"><strong>Порядок согласования</strong> — сколько раундов правок (рекомендую 2), как долго рассматривается черновик</li>
          <li style="margin-bottom:8px"><strong>Оплата</strong> — сумма, форма (предоплата/постоплата/сплит), срок перечисления</li>
          <li style="margin-bottom:8px"><strong>Права на контент</strong> — кому принадлежит после публикации, может ли бренд использовать в своих каналах</li>
          <li style="margin-bottom:8px"><strong>Эксклюзивность</strong> — запрет рекламировать прямых конкурентов N дней до и после публикации</li>
          <li style="margin-bottom:8px"><strong>Маркировка рекламы</strong> — обязательный тег #реклама или #ad, регистрация в ЕРИР</li>
          <li style="margin-bottom:8px"><strong>Ответственность</strong> — что происходит при срыве сроков, некачественном контенте</li>
          <li style="margin-bottom:8px"><strong>Отчётность</strong> — какие данные и когда инфлюенсер обязан предоставить</li>
        </ol>`
      },
      {
        label: 'Работа с самозанятыми',
        html: `<p>Большинство nano и micro-инфлюенсеров — физические лица или самозанятые. Как работать правильно:</p>
        <ul>
          <li>Самозанятый выдаёт чек в приложении «Мой налог» — это закрывающий документ</li>
          <li>Самозанятый платит налог сам — вы не удерживаете НДФЛ</li>
          <li>Лимит для самозанятого — 2.4 млн ₽ в год. При превышении он теряет статус — контролируй</li>
          <li>С физлицом (не ИП и не самозанятый) — сложнее: нужен договор ГПХ и удержание НДФЛ 13%</li>
        </ul>`
      }
    ]
  },

  m6: {
    badge: 'Middle · Модуль 5 · Урок 6',
    title: 'Управление сроками и дедлайнами',
    meta: ['⏱ 11 минут', '⏰ Практика', '🎯 Middle'],
    blocks: [
      {
        label: 'Типичная временная шкала кампании',
        html: `<table class="mtable">
          <thead><tr><th>День</th><th>Событие</th><th>Кто отвечает</th></tr></thead>
          <tbody>
            <tr><td>День 0</td><td>Договор подписан, предоплата выплачена</td><td class="td-d">Менеджер + инфлюенсер</td></tr>
            <tr><td>День 2–5</td><td>Материалы переданы (продукт, доступ, бриф)</td><td class="td-d">Менеджер</td></tr>
            <tr><td>День 7–10</td><td>Черновик контента получен от инфлюенсера</td><td class="td-d">Инфлюенсер</td></tr>
            <tr><td>День 10–12</td><td>Обратная связь по черновику (48 часов)</td><td class="td-d">Менеджер</td></tr>
            <tr><td>День 13–14</td><td>Финальная версия утверждена</td><td class="td-d">Оба</td></tr>
            <tr><td>День 15–16</td><td>Публикация в согласованное время</td><td class="td-d">Инфлюенсер</td></tr>
            <tr><td>День 18–20</td><td>Скриншоты статистики → менеджеру</td><td class="td-d">Инфлюенсер</td></tr>
            <tr><td>День 20+</td><td>Финальный расчёт (если была постоплата)</td><td class="td-d">Менеджер</td></tr>
          </tbody>
        </table>`,
        insight: 'Никогда не планируй публикацию «день в день» с важным событием бренда — запуском, конференцией, анонсом. Закладывай +3–5 дней буфера.'
      },
      {
        label: 'Как не срывать дедлайны',
        html: `<ul>
          <li><strong>Напоминания за 48 часов</strong> — автоматически через n8n или вручную. До дедлайна черновика напомни</li>
          <li><strong>Жёсткое окно согласования</strong> — прояви уважение к инфлюенсеру: давай обратную связь в течение 24–48 часов, не тяни</li>
          <li><strong>Не более 2 раундов правок</strong> — пропиши в договоре. Иначе согласование может идти вечно</li>
          <li><strong>Резервный инфлюенсер</strong> — для важных дат имей запасного, готового выйти в те же сроки</li>
          <li><strong>Трекинг-таблица</strong> — по каждому инфлюенсеру статус: «жду черновик», «на согласовании», «опубликовано»</li>
        </ul>`
      }
    ]
  },

  m7: {
    badge: 'Middle · Модуль 5 · Урок 7',
    title: 'ROI и оптимизация бюджета',
    meta: ['⏱ 16 минут', '💰 Аналитика', '🎯 Middle'],
    blocks: [
      {
        label: 'Как считать ROI кампании',
        html: `<p><strong>ROI (Return on Investment)</strong> = (Доход от кампании − Затраты на кампанию) / Затраты × 100%</p>
        <p><strong>Пример расчёта:</strong><br>
        Бюджет на инфлюенсеров: 200 000 ₽<br>
        Продажи по промокодам: 480 000 ₽<br>
        ROI = (480 000 − 200 000) / 200 000 × 100 = <strong>140%</strong></p>
        <p>Что означают цифры:</p>
        <ul>
          <li>ROI &lt; 0% — убыток</li>
          <li>ROI 0–100% — вернули вложения, минимальная прибыль</li>
          <li>ROI 100–200% — хорошая кампания для большинства ниш</li>
          <li>ROI 200–400% — отличный результат, стоит масштабировать</li>
          <li>ROI 400%+ — исключительный результат, анализируй и повторяй точь-в-точь</li>
        </ul>`,
        insight: 'ROI 100% = «отбили вложения». ROI 200–300% — хорошая кампания. Выше — исключительный результат, найди почему и повтори.'
      },
      {
        label: 'Что включать в «затраты»',
        html: `<p>Ошибка новичков — считать в затратах только гонорар инфлюенсера. Полные затраты:</p>
        <ul>
          <li>Гонорар инфлюенсера</li>
          <li>Продукт / образцы (по себестоимости)</li>
          <li>Время менеджера (часы × ставка)</li>
          <li>Инструменты анализа (HypeAuditor и т.д.)</li>
          <li>Налоги на выплату (если физлицо)</li>
        </ul>
        <p>Неполный учёт затрат завышает ROI и вводит клиента в заблуждение.</p>`
      },
      {
        label: 'Как оптимизировать бюджет',
        html: `<ul>
          <li><strong>После первой кампании</strong> — определи топ-3 инфлюенсера по ROI и увеличь их долю в следующей</li>
          <li><strong>A/B тест форматов</strong> — одинаковый бюджет на Reels vs Stories, сравни CPE</li>
          <li><strong>Бонусная система</strong> — базовый гонорар + бонус за каждые 1000 использований промокода сверх плана</li>
          <li><strong>Долгосрочные контракты</strong> — 6–12 публикаций по сниженной ставке за единицу. Экономит 15–25% бюджета</li>
          <li><strong>Перфоманс-модель</strong> — платить только за реальные конверсии (сложнее в переговорах, но минимизирует риск)</li>
        </ul>`
      }
    ]
  },

  m8: {
    badge: 'Middle · Модуль 6 · Урок 8',
    title: 'Что такое n8n и зачем он нужен',
    meta: ['⏱ 12 минут', '⚡ n8n · Введение', '🎯 Middle'],
    blocks: [
      {
        label: 'Знакомство с n8n',
        html: `<p><strong>n8n</strong> (произносится «n-eight-n») — платформа автоматизации рабочих процессов с открытым кодом. Принцип прост: <em>«Когда происходит X в сервисе A → сделай Y в сервисе B»</em>. И всё это без написания кода.</p>
        <p>В отличие от Zapier или Make (Integromat), n8n можно развернуть на своём сервере бесплатно, что особенно важно для команд с большим объёмом автоматизаций.</p>
        <p><strong>Для influence-маркетинга n8n решает:</strong></p>
        <ul>
          <li>Автоматическая отправка брифа инфлюенсеру после подписания договора в CRM</li>
          <li>Уведомление команды в Telegram, когда инфлюенсер опубликовал пост</li>
          <li>Еженедельный отчёт по метрикам → автоматически в Google Sheets и клиенту</li>
          <li>Напоминание инфлюенсеру за 48 часов до дедлайна</li>
          <li>Автоматическое создание задач в Notion при старте новой кампании</li>
        </ul>`,
        insight: 'n8n экономит команде из 5 человек 8–12 часов рутинной работы в неделю. Это эквивалент половины ставки ассистента — при нулевой стоимости платформы.'
      },
      {
        label: 'Как работает n8n — базовый флоу',
        type: 'n8n_basic'
      },
      {
        label: 'Ключевые концепции n8n',
        html: `<ul>
          <li><strong>Workflow (рабочий процесс)</strong> — цепочка узлов (nodes) от триггера до результата</li>
          <li><strong>Node (узел)</strong> — отдельный шаг: получить данные, обработать, отправить</li>
          <li><strong>Trigger (триггер)</strong> — событие, запускающее workflow: расписание, webhook, новая запись в таблице</li>
          <li><strong>Webhook</strong> — URL, на который внешний сервис отправляет данные для запуска n8n</li>
          <li><strong>Credentials</strong> — сохранённые ключи доступа к сервисам (Google, Telegram Bot, CRM)</li>
        </ul>`
      },
      {
        label: 'Где взять n8n',
        html: `<ul>
          <li><strong>n8n.cloud</strong> — облачная версия от $20/мес. Не нужен сервер, всё настроено. Идеально для старта</li>
          <li><strong>Self-hosted</strong> — бесплатно, нужен VPS-сервер (от 500 ₽/мес на хостинге Timeweb / Hetzner). Установка — 15 минут по документации</li>
          <li><strong>n8n.io/docs</strong> — официальная документация, видеогайды, готовые шаблоны флоу</li>
          <li><strong>n8n Community</strong> — форум, где можно найти готовые workflows под любую задачу</li>
        </ul>`,
        insight: 'Начни с n8n.cloud — это самый быстрый способ попробовать. Когда станет ясно, какие флоу нужны постоянно, переезжай на self-hosted.'
      }
    ]
  },

  m9: {
    badge: 'Middle · Модуль 6 · Урок 9',
    title: 'Автоматизация отчётов и уведомлений',
    meta: ['⏱ 15 минут', '⚡ n8n · Практика', '🎯 Middle'],
    blocks: [
      {
        label: 'Флоу 1: Автоматический отчёт каждую пятницу',
        type: 'n8n_report'
      },
      {
        label: 'Как настроить отчётный флоу',
        html: `<p>Пошаговая логика:</p>
        <ol style="padding-left:20px">
          <li style="margin-bottom:8px"><strong>Schedule Trigger</strong> — настроить на «каждую пятницу в 17:00»</li>
          <li style="margin-bottom:8px"><strong>Google Sheets Node</strong> — читаем строки из таблицы кампании (инфлюенсер, охват, ER, клики, промокод)</li>
          <li style="margin-bottom:8px"><strong>Function Node (JavaScript)</strong> — суммируем данные: итоговый охват, средний ER, CPE, ROI</li>
          <li style="margin-bottom:8px"><strong>Set Node</strong> — форматируем данные в красивый HTML-шаблон отчёта</li>
          <li style="margin-bottom:8px"><strong>Gmail/SMTP Node</strong> — отправляем клиенту с темой «Отчёт по кампании [название] — [дата]»</li>
        </ol>`,
        insight: 'Настрой один раз — и пятничный отчёт уходит клиенту автоматически. Экономия: 1.5–2 часа каждую пятницу на весь период кампании.'
      },
      {
        label: 'Флоу 2: Уведомление при публикации',
        type: 'n8n_monitoring'
      },
      {
        label: 'Флоу 3: Напоминание инфлюенсеру',
        html: `<p>Как автоматизировать напоминания о дедлайнах:</p>
        <ul>
          <li>В Google Sheets есть колонка «Дата сдачи черновика» для каждого инфлюенсера</li>
          <li>n8n Schedule Trigger запускается каждое утро и проверяет: есть ли строки, где дата = «сегодня + 2 дня»</li>
          <li>Если есть — отправляет email или Telegram сообщение инфлюенсеру с напоминанием</li>
          <li>Параллельно — уведомляет менеджера, что скоро ожидается черновик</li>
        </ul>`,
        insight: 'Автоматические напоминания снижают количество срывов дедлайнов на 60–70%. Инфлюенсеры заняты — они забывают, а не саботируют.'
      }
    ]
  },

  m10: {
    badge: 'Middle · Модуль 6 · Урок 10',
    title: 'Интеграция CRM и influence-инструментов',
    meta: ['⏱ 18 минут', '⚡ n8n · Интеграции', '🎯 Middle'],
    blocks: [
      {
        label: 'Экосистема инструментов Middle-специалиста',
        html: `<p>На уровне Middle у тебя уже несколько инструментов, которые нужно связать в единую систему:</p>
        <ul>
          <li><strong>CRM (AmoCRM / Bitrix24)</strong> — база инфлюенсеров, статусы контрактов, история коммуникаций</li>
          <li><strong>Google Sheets</strong> — медиаплан, трекинг метрик, постаналитика</li>
          <li><strong>HypeAuditor</strong> — проверка аудитории (API-доступ)</li>
          <li><strong>Telegram Bot</strong> — уведомления команде и клиентам</li>
          <li><strong>Google Analytics</strong> — трафик и конверсии с UTM-меток</li>
          <li><strong>n8n</strong> — связующее звено между всем выше</li>
        </ul>
        <p>Без n8n ты перекладываешь данные вручную между системами — это 2–4 часа работы в день при активных кампаниях.</p>`
      },
      {
        label: 'Флоу: Автоматический онбординг нового инфлюенсера',
        type: 'n8n_onboarding'
      },
      {
        label: 'Флоу: Автоматическая проверка нового инфлюенсера через CRM',
        type: 'n8n_crm'
      },
      {
        label: 'Что автоматизировать в первую очередь',
        html: `<p>Приоритизируй автоматизации по критерию: <strong>частота × время задачи</strong>. Что делается часто и занимает много времени — автоматизируй первым.</p>
        <ul>
          <li>🥇 <strong>Еженедельный отчёт клиенту</strong> — 2 часа каждую пятницу → 0</li>
          <li>🥇 <strong>Напоминания о дедлайнах</strong> — 30 мин ежедневно → 0</li>
          <li>🥈 <strong>Запись метрик публикаций в таблицу</strong> — 1 час ежедневно при активной кампании → 0</li>
          <li>🥉 <strong>Онбординг нового инфлюенсера</strong> — 30 мин per инфлюенсер → 0</li>
        </ul>`,
        insight: 'Начни с автоматизации отчёта — это самый видимый результат. Клиент замечает, ты получаешь 2 часа свободного пятничного времени.'
      }
    ]
  },

  // ════════════ SENIOR ════════════════════════════════════

  s1: {
    badge: 'Senior · Модуль 7 · Урок 1',
    title: 'Управление influence-командой',
    meta: ['⏱ 20 минут', '👥 Лидерство', '🎯 Senior'],
    blocks: [
      {
        label: 'От исполнителя к лидеру',
        html: `<p>Переход с уровня Middle на Senior — это прежде всего переход от «делаю сам» к «создаю систему, в которой другие делают хорошо». Твоя ценность больше не в личном исполнении задач, а в качестве команды и результатах, которые она выдаёт.</p>
        <p>Главный сдвиг в мышлении: <strong>ты отвечаешь не за свои задачи, а за систему и людей.</strong> Если команда не справляется — это сбой системы, а не некомпетентность людей.</p>`
      },
      {
        label: 'Оптимальная структура influence-команды',
        html: `<ul>
          <li><strong>Influence Manager (1–2 чел.)</strong> — поиск, первичный контакт, переговоры, управление отношениями с инфлюенсерами. Навыки: коммуникация, знание рынка, CRM</li>
          <li><strong>Content Strategist (1 чел.)</strong> — контентная стратегия, написание брифов, согласование материалов. Навыки: копирайтинг, понимание платформ, насмотренность</li>
          <li><strong>Analytics Lead (1 чел.)</strong> — трекинг метрик, постаналитика, отчёты. Навыки: Excel/Sheets, базовый Python/SQL, Google Analytics</li>
          <li><strong>Partnership Manager (1 чел.)</strong> — долгосрочные контракты, амбассадоры, бюджеты. Навыки: переговоры, юридическая грамотность, P&L</li>
          <li><strong>Operations / n8n (0.5–1 чел.)</strong> — автоматизация процессов, технические интеграции. Может совмещать с Analytics Lead</li>
        </ul>`,
        insight: 'Команда из 5 человек с чёткими ролями эффективнее команды из 8 без структуры. Роли создают ответственность — и это важнее численности.'
      },
      {
        label: 'Создание культуры команды',
        html: `<p>Высокоэффективная influence-команда строится на трёх принципах:</p>
        <ul>
          <li><strong>Прозрачность данных</strong> — все видят метрики кампаний, общий прогресс, проблемы. Нет сюрпризов</li>
          <li><strong>Ретроспективы</strong> — после каждой крупной кампании 1-часовая встреча: что сработало, что нет, что меняем</li>
          <li><strong>Обмен контактами</strong> — лучшие инфлюенсеры — ресурс команды, а не личный контакт одного менеджера</li>
        </ul>`
      },
      {
        label: 'Делегирование без потери качества',
        html: `<p>Частая ошибка Senior-специалиста — делегирует, но всё равно переделывает за командой. Это убивает мотивацию и не высвобождает твоё время.</p>
        <p>Правильное делегирование:</p>
        <ol style="padding-left:20px">
          <li style="margin-bottom:6px">Чёткий результат (не «сделай хорошо», а «к пятнице — таблица с топ-10 инфлюенсерами по ROI»)</li>
          <li style="margin-bottom:6px">Ресурсы и доступы (не заставляй людей просить у тебя логины)</li>
          <li style="margin-bottom:6px">Дедлайн и формат сдачи</li>
          <li style="margin-bottom:6px">Промежуточная точка проверки (не «сделай и покажи в конце», а «покажи промежуточный вариант в среду»)</li>
        </ol>`,
        insight: 'Делегируй задачи на 70–80% своего уровня — это развивает команду. Делегируй на 40–50% — это демотивирует и не даёт роста.'
      }
    ]
  },

  s2: {
    badge: 'Senior · Модуль 7 · Урок 2',
    title: 'Найм и онбординг специалистов',
    meta: ['⏱ 14 минут', '👥 Лидерство', '🎯 Senior'],
    blocks: [
      {
        label: 'На что смотреть при найме',
        html: `<p>Резюме в influence-маркетинге стоит недорого — все пишут «успешные кампании» и «рост продаж». Проверяй реальные навыки:</p>
        <ul>
          <li><strong>Портфолио с метриками</strong> — не «делал кампании», а «ER 4.2%, ROI 180%, охват 2.3M»</li>
          <li><strong>Тестовое задание</strong> — дай реальную задачу: найти 5 инфлюенсеров под конкретный бренд с обоснованием + медиаплан на 2 недели</li>
          <li><strong>Навык аналитики</strong> — попроси в прямом эфире посчитать CPE и ROI по заданным данным</li>
          <li><strong>Понимание платформ</strong> — что такое ERR в Telegram, чем Reels отличается от Stories по алгоритму</li>
          <li><strong>Сеть контактов</strong> — знает ли он агентов, работал ли с инфлюенсерами своей ниши</li>
        </ul>`,
        insight: 'Лучший кандидат — тот, кто приносит на собеседование собственные инсайты о рынке, а не просто отвечает на твои вопросы.'
      },
      {
        label: 'Онбординг новичка: первые 30 дней',
        html: `<ul>
          <li><strong>День 1–3:</strong> Знакомство с командой, доступы, инструменты. Прочтение всех брифов и отчётов за последние 3 кампании</li>
          <li><strong>День 4–7:</strong> Теневой режим — наблюдает за переговорами и рабочими процессами без участия</li>
          <li><strong>День 8–14:</strong> Первые самостоятельные задачи: поиск инфлюенсеров под готовое ТЗ, анализ аудитории, написание брифа (с проверкой)</li>
          <li><strong>День 15–30:</strong> Ведение 1–2 инфлюенсеров самостоятельно с менторством. Первый самостоятельный мини-отчёт</li>
        </ul>`,
        insight: 'Быстрый онбординг без структуры = новичок тратит первый месяц на «понять как всё устроено». Структурированный онбординг — он выдаёт результат уже на второй неделе.'
      }
    ]
  },

  s3: {
    badge: 'Senior · Модуль 7 · Урок 3',
    title: 'Постановка KPI для команды',
    meta: ['⏱ 16 минут', '🎯 Лидерство', '🎯 Senior'],
    blocks: [
      {
        label: 'Принципы командных KPI',
        html: `<p>KPI команды — это не просто набор метрик. Это сигнальная система: KPI показывают, движемся ли мы к бизнес-цели, и где возникают проблемы раньше, чем они станут катастрофой.</p>
        <p><strong>Хорошие KPI:</strong> измеримые, влияют на бизнес-результат, в зоне влияния сотрудника<br>
        <strong>Плохие KPI:</strong> размытые, декоративные («быть проактивным»), создающие ложные стимулы</p>`,
        insight: 'KPI «количество инфлюенсеров в базе» без оценки качества — плохой KPI. Менеджер будет добавлять всех подряд ради цифры. Лучше: «инфлюенсеры с AQS > 75, ER > 3%».'
      },
      {
        label: 'KPI по ролям',
        html: `<table class="mtable">
          <thead><tr><th>Роль</th><th>KPI</th><th>Периодичность</th></tr></thead>
          <tbody>
            <tr><td class="td-n">Influence Manager</td><td class="td-d">Новые качественные инфлюенсеры/мес, средний CPE по кампаниям, NPS инфлюенсеров</td><td>Ежемесячно</td></tr>
            <tr><td class="td-n">Content Strategist</td><td class="td-d">% публикаций без третьего раунда правок, время согласования, качество брифов</td><td>Ежемесячно</td></tr>
            <tr><td class="td-n">Analytics Lead</td><td class="td-d">Скорость сдачи постаналитики, точность прогнозов охвата (план vs факт), % клиентов получивших отчёт вовремя</td><td>Ежемесячно</td></tr>
            <tr><td class="td-n">Команда целиком</td><td class="td-d">Квартальный ROI кампаний vs план, удержание клиентов (retention), рост выручки</td><td>Квартально</td></tr>
          </tbody>
        </table>`
      },
      {
        label: 'Как работать с KPI на практике',
        html: `<ul>
          <li><strong>Еженедельный 15-минутный stand-up</strong> — каждый называет: что сделал, что застряло, что нужно</li>
          <li><strong>Ежемесячный 1-on-1</strong> — с каждым сотрудником: KPI, развитие, обратная связь</li>
          <li><strong>Квартальный review</strong> — пересмотр KPI с учётом изменений рынка и приоритетов бизнеса</li>
          <li><strong>Дашборд команды</strong> — общий Google Sheet, где каждый видит свои KPI в реальном времени</li>
        </ul>`
      }
    ]
  },

  s4: {
    badge: 'Senior · Модуль 8 · Урок 4',
    title: 'P&L: бюджеты и рентабельность',
    meta: ['⏱ 22 минуты', '💼 Бизнес', '🎯 Senior'],
    blocks: [
      {
        label: 'Что такое P&L и зачем его знать',
        html: `<p><strong>P&L (Profit & Loss Statement)</strong> — отчёт о прибылях и убытках. На уровне Senior ты отвечаешь за рентабельность своего подразделения или агентства в целом. Понимание P&L — это понимание, зарабатываем ли мы, и почему.</p>
        <p><strong>Базовая структура P&L агентства:</strong></p>
        <ul>
          <li><strong>Выручка (Revenue)</strong> = все поступления от клиентов за период</li>
          <li><strong>Себестоимость (COGS)</strong> = прямые затраты: гонорары инфлюенсеров, инструменты, аутсорс</li>
          <li><strong>Валовая прибыль (Gross Profit)</strong> = Выручка − COGS</li>
          <li><strong>Операционные расходы (OpEx)</strong> = зарплаты команды, офис, SaaS-инструменты</li>
          <li><strong>Операционная прибыль (EBITDA)</strong> = Валовая прибыль − OpEx</li>
        </ul>`,
        insight: 'Маржа здорового influence-агентства — 20–35%. Ниже 15% — тревожный сигнал. Нужно либо поднимать ставки, либо оптимизировать процессы.'
      },
      {
        label: 'Типичная структура доходов',
        html: `<ul>
          <li><strong>Ретейнер (Monthly Retainer)</strong> — ежемесячная фиксированная плата за управление. Составляет 60–70% выручки стабильного агентства. Предсказуемость = основа P&L</li>
          <li><strong>Project Fee</strong> — оплата за разовые кампании. 20–30% выручки. Высокая маржа, но нестабильный поток</li>
          <li><strong>Performance Bonus</strong> — % от перевыполнения KPI. 5–10%. Мотивирует и вас, и клиента на результат</li>
        </ul>`
      },
      {
        label: 'Как контролировать рентабельность',
        html: `<ul>
          <li><strong>Трекинг времени команды</strong> — сколько часов уходит на каждого клиента. Если клиент платит ретейнер, но требует 3x больше времени, чем заложено — ты работаешь в убыток</li>
          <li><strong>Gross Margin по клиентам</strong> — считай маржу по каждому клиенту отдельно. Клиент с большим ретейнером может быть убыточным из-за высоких прямых затрат</li>
          <li><strong>Ежемесячный P&L review</strong> — сравнивай план vs факт, находи отклонения и корректируй</li>
        </ul>`,
        insight: '20% клиентов часто приносят 80% прибыли. Периодически анализируй рентабельность по каждому — иногда правильное решение — отказаться от убыточного клиента.'
      }
    ]
  },

  s5: {
    badge: 'Senior · Модуль 8 · Урок 5',
    title: 'Ценообразование услуг агентства',
    meta: ['⏱ 15 минут', '💼 Бизнес', '🎯 Senior'],
    blocks: [
      {
        label: 'Четыре модели ценообразования',
        html: `<ul>
          <li><strong>Ретейнер (Monthly Retainer)</strong> — фиксированная ежемесячная оплата. Лучшая модель для обеих сторон: предсказуемость для клиента, стабильность для агентства. Типичный диапазон: 100K–500K ₽/мес в зависимости от объёма</li>
          <li style="margin-top:10px"><strong>Fee за проект</strong> — оплата за конкретную кампанию. Обычно 10–20% от бюджета инфлюенсеров + фиксированный fee за управление. Подходит для разовых клиентов</li>
          <li style="margin-top:10px"><strong>Performance-based</strong> — % от достигнутых KPI (продажи, промокоды, лиды). Высокий риск — если кампания провалилась не по вашей вине, вы не зарабатываете. Высокое вознаграждение при успехе</li>
          <li style="margin-top:10px"><strong>Гибрид (Retainer + Performance)</strong> — базовый ретейнер покрывает операционные расходы + бонус за перевыполнение KPI. Оптимальная модель для долгосрочных отношений</li>
        </ul>`
      },
      {
        label: 'Как обосновать свою цену',
        html: `<p>Клиент всегда будет давить на цену. Твои аргументы:</p>
        <ul>
          <li><strong>ROI прошлых кампаний</strong> — «Наши кампании в среднем дают ROI 150–200%. Ваш ретейнер в 200K ₽ при среднем бюджете на инфлюенсеров 500K — это 8–10x возврат при нашем историческом ROI»</li>
          <li><strong>Стоимость альтернатив</strong> — «Нанять in-house специалиста уровня Middle стоит 120–180K ₽ зарплата. Плюс инструменты, плюс обучение. Наша команда из 3 специалистов — за 250K»</li>
          <li><strong>Сеть контактов</strong> — «Наша база включает X проверенных инфлюенсеров с историей ROI. Вы не начинаете с нуля»</li>
        </ul>`,
        insight: 'Никогда не снижай цену без обоснования. Если снижаешь — снижай вместе с объёмом услуг. «Меньше платите — меньше получаете» — это честно и правильно.'
      }
    ]
  },

  s6: {
    badge: 'Senior · Модуль 8 · Урок 6',
    title: 'Переговоры на уровне C-level',
    meta: ['⏱ 18 минут', '🤝 Лидерство', '🎯 Senior'],
    blocks: [
      {
        label: 'Язык C-level',
        html: `<p>CMO и CEO не думают категориями «охват» и «лайки». Они думают категориями: рост рынка, доля рынка, CAC (стоимость привлечения клиента), LTV (пожизненная ценность клиента), рентабельность.</p>
        <p>Твоя задача — переводить язык influence на язык бизнеса:</p>
        <ul>
          <li>«Охват 2 миллиона» → «Охватили 12% нашей ЦА в ключевых регионах»</li>
          <li>«Высокий ER» → «Вовлечённость в 3.2 раза выше среднего по категории»</li>
          <li>«Красивый контент» → «Конверсия 4.2% vs 1.8% по прямой рекламе при CAC на 30% ниже»</li>
          <li>«Работаем с 50 инфлюенсерами» → «Управляем охватом 15M уникальных пользователей ежемесячно»</li>
        </ul>`,
        insight: 'C-level принимает решения о бюджете. Если ты говоришь с ним на его языке — решение принимается на встрече. Если нет — «мы подумаем» и письмо в никуда.'
      },
      {
        label: 'Структура переговоров с C-level',
        html: `<ol style="padding-left:20px">
          <li style="margin-bottom:10px"><strong>Начни с бизнес-проблемы клиента</strong>, а не с описания своих услуг. «Насколько я понимаю, вы хотите выйти в сегмент 25–35 с новым продуктом — правильно?»</li>
          <li style="margin-bottom:10px"><strong>Покажи, как именно ты решишь эту проблему</strong> через influence-механику, с цифрами</li>
          <li style="margin-bottom:10px"><strong>Приведи кейс</strong> из похожей категории с реальными метриками — «Для бренда X в вашей категории мы достигли...»</li>
          <li style="margin-bottom:10px"><strong>Обозначь инвестицию и ожидаемый возврат</strong> — конкретно: «Бюджет 500K ₽, ожидаемый ROI 140–180% по нашим историческим данным в этой нише»</li>
          <li style="margin-bottom:10px"><strong>Предложи следующий шаг</strong> — пилот на 1 месяц, тестовая кампания, или дата следующей встречи с конкретной повесткой</li>
        </ol>`
      },
      {
        label: 'Работа с возражениями',
        html: `<ul>
          <li><strong>«Мы уже пробовали — не сработало»</strong> → «Расскажи подробнее — какие форматы, какие инфлюенсеры, как считали результат?» Часто проблема в реализации, а не в канале</li>
          <li><strong>«Это слишком дорого»</strong> → «Дорого относительно чего? Если CAC у вас сейчас X ₽, наш канал даст Y ₽ при тех же параметрах»</li>
          <li><strong>«Нам нужны гарантии»</strong> → «Мы гарантируем охват и ER по медиаплану. ROI зависит от множества факторов — мы можем показать исторические диапазоны по вашей категории»</li>
        </ul>`
      }
    ]
  },

  s7: {
    badge: 'Senior · Модуль 9 · Урок 7',
    title: 'Brand building через инфлюенсеров',
    meta: ['⏱ 17 минут', '🏆 Стратегия', '🎯 Senior'],
    blocks: [
      {
        label: 'Разовая кампания vs системный brand building',
        html: `<p>Разовые кампании создают краткосрочный всплеск. Системный brand building через инфлюенсеров — долгосрочное восприятие бренда в сознании аудитории.</p>
        <p>Сравнение подходов:</p>
        <table class="mtable">
          <thead><tr><th></th><th>Разовые кампании</th><th>Brand Building</th></tr></thead>
          <tbody>
            <tr><td class="td-n">Горизонт</td><td class="td-d">1–4 недели</td><td class="td-d">6–24 месяца</td></tr>
            <tr><td class="td-n">KPI</td><td class="td-d">Охват, продажи, CPE</td><td class="td-d">Brand Awareness, NPS, LTV</td></tr>
            <tr><td class="td-n">Инфлюенсеры</td><td class="td-d">Разные каждый раз</td><td class="td-d">Постоянные амбассадоры</td></tr>
            <tr><td class="td-n">Стоимость/период</td><td class="td-d">Выше</td><td class="td-d">Ниже (долгосрочные контракты)</td></tr>
          </tbody>
        </table>`
      },
      {
        label: 'Инструменты долгосрочного brand building',
        html: `<ul>
          <li><strong>Амбассадорские программы</strong> — контракты на 6–12+ месяцев. Инфлюенсер становится «лицом бренда» в своей нише. Аудитория привыкает к ассоциации</li>
          <li><strong>Co-creation продуктов</strong> — инфлюенсер участвует в разработке: капсульная коллекция, лимитированный вкус, именной продукт. Создаёт максимальную нативность</li>
          <li><strong>Brand community</strong> — объединение аудиторий нескольких инфлюенсеров в закрытое сообщество вокруг бренда (Telegram-чат, закрытый клуб)</li>
          <li><strong>Events & Experiences</strong> — живые события с инфлюенсерами: закрытые обеды, бренд-трипы, мастер-классы. Создаёт UGC и долгосрочные отношения</li>
        </ul>`,
        insight: 'Амбассадор, который реально верит в продукт и использует его годами, стоит дороже, чем любая звезда с 10M, рекламирующая всё подряд. Искренность считывается аудиторией.'
      },
      {
        label: 'Как выбирать амбассадоров',
        html: `<ul>
          <li>Реально пользуется или может пользоваться продуктом — это не опционально, а обязательно</li>
          <li>Долгосрочная стабильность аккаунта — не скандалит, не прыгает по трендам</li>
          <li>Аудитория растёт органично на протяжении 6–12 месяцев</li>
          <li>Уже упоминал бренд или конкурентов позитивно — значит ниша релевантна</li>
          <li>Готов к эксклюзивности в категории — не рекламирует конкурентов</li>
        </ul>`
      }
    ]
  },

  s8: {
    badge: 'Senior · Модуль 9 · Урок 8',
    title: 'Стратегические альянсы и партнёрства',
    meta: ['⏱ 16 минут', '🤝 Стратегия', '🎯 Senior'],
    blocks: [
      {
        label: 'Что такое стратегический альянс',
        html: `<p>Стратегический альянс — когда два бренда или агентства объединяются для совместной influence-кампании. Каждый приносит свою аудиторию, ресурсы или экспертизу. Стоимость снижается, эффект — растёт.</p>
        <p><strong>Типы альянсов:</strong></p>
        <ul>
          <li><strong>Co-branded кампания</strong> — два бренда + один инфлюенсер, создающий контент для обоих</li>
          <li><strong>Cross-promotion</strong> — аудитории брендов обмениваются: «подписчики бренда A → бренд B и наоборот»</li>
          <li><strong>Агентство + платформа</strong> — партнёрство с HypeAuditor, LiveDune или биржей — эксклюзивные условия и приоритетный доступ</li>
          <li><strong>Агентство + агентство</strong> — объединение для крупных проектов, выход на новые ниши</li>
        </ul>`,
        insight: 'Лучшие альянсы — между брендами с пересекающейся, но не конкурирующей аудиторией. Пример: фитнес-бренд + бренд здорового питания.'
      },
      {
        label: 'Как выстроить partnership pipeline',
        html: `<p>Системный подход к развитию партнёрств:</p>
        <ol style="padding-left:20px">
          <li style="margin-bottom:8px">Составь список брендов с пересекающейся ЦА — не конкуренты</li>
          <li style="margin-bottom:8px">Выйди на маркетинг-директора напрямую (LinkedIn, события отрасли)</li>
          <li style="margin-bottom:8px">Предложи пилотный co-branded проект без больших инвестиций</li>
          <li style="margin-bottom:8px">Подготовь кейс и результаты пилота</li>
          <li style="margin-bottom:8px">Масштабируй в долгосрочное соглашение</li>
        </ol>`
      }
    ]
  },

  s9: {
    badge: 'Senior · Модуль 9 · Урок 9',
    title: 'Масштабирование агентства',
    meta: ['⏱ 20 минут', '🚀 Бизнес', '🎯 Senior'],
    blocks: [
      {
        label: 'От фриланса к агентству',
        html: `<p>Большинство influence-агентств начинались с одного человека, который всё делал сам. Точка перехода к агентству — когда появляется <strong>воспроизводимая система</strong>, работающая без основателя.</p>
        <p>Проверочный вопрос: <em>«Если я уйду в отпуск на 2 недели, что произойдёт с кампаниями клиентов?»</em></p>
        <ul>
          <li>«Всё остановится» — ты фрилансер, а не агентство</li>
          <li>«Команда справится, но могут возникнуть вопросы» — ты на пути к агентству</li>
          <li>«Всё пройдёт нормально по системе» — у тебя агентство</li>
        </ul>`,
        insight: 'Агентство, которое работает без основателя 2 недели — масштабируемое. Если без тебя всё встаёт — это фриланс с наёмными помощниками.'
      },
      {
        label: 'Три рычага масштабирования',
        html: `<ul>
          <li><strong>Стандартизация</strong> — превращай лучшие практики в шаблоны: брифы, контракты, отчёты, онбординг. Новый сотрудник должен разобраться без тебя</li>
          <li><strong>Автоматизация (n8n)</strong> — рутинные задачи уходят из рук людей в автоматизированные флоу. 10 часов рутины в неделю → 0 часов → команда занимается творческими и стратегическими задачами</li>
          <li><strong>Специализация</strong> — команды по нишам (beauty, tech, gaming, финансы) вместо одной общей команды «на всё». Специализация повышает качество и позволяет брать более высокую цену</li>
        </ul>`
      },
      {
        label: 'Узкие места роста',
        html: `<p>При масштабировании агентства возникают предсказуемые узкие места:</p>
        <ul>
          <li><strong>«Бутылочное горлышко» в согласовании</strong> — всё идёт через основателя. Решение: делегируй финальное согласование Content Strategist</li>
          <li><strong>Потеря качества при росте</strong> — новые сотрудники не понимают стандартов. Решение: база знаний + процедуры проверки качества</li>
          <li><strong>Проблема с cash flow</strong> — клиенты платят постфактум, а зарплаты — ежемесячно. Решение: переходи на предоплату или сплит 50/50</li>
          <li><strong>Потеря фокуса при работе «на всех»</strong> — слишком разные клиенты, команда не успевает переключаться. Решение: специализация по нишам или типам клиентов</li>
        </ul>`
      }
    ]
  },

  s10: {
    badge: 'Senior · Модуль 9 · Урок 10',
    title: 'n8n: продвинутая автоматизация агентства',
    meta: ['⏱ 22 минуты', '⚡ n8n · Senior', '🎯 Senior'],
    blocks: [
      {
        label: 'От отдельных флоу к операционной системе',
        html: `<p>На уровне Middle ты строишь отдельные флоу для конкретных задач. На Senior — <strong>единую операционную систему агентства</strong>, где все процессы связаны и работают как механизм.</p>
        <p>Цель: агентство на 10 кампаний одновременно с командой из 5 человек — без хаоса, без ручного переноса данных, без потерянных дедлайнов.</p>`
      },
      {
        label: 'Карта автоматизаций зрелого агентства',
        html: `<ul>
          <li><strong>CRM → Старт кампании</strong>: Подписан контракт → создаётся папка в Google Drive, задачи в Notion, бриф инфлюенсеру, уведомление команды</li>
          <li><strong>Трекинг публикаций</strong>: Пост опубликован → данные в Sheets → уведомление команде → алерт при ER ниже порога</li>
          <li><strong>Еженедельный отчёт</strong>: Каждую пятницу → агрегация метрик → форматирование → отправка клиенту</li>
          <li><strong>Ежемесячный P&L</strong>: Конец месяца → сводка доходов и расходов по клиентам → дашборд для основателя</li>
          <li><strong>Онбординг клиента</strong>: Подписан договор → приветственное письмо → доступ в кабинет → 1-й созвон в календаре</li>
          <li><strong>Скоринг инфлюенсеров</strong>: Новый инфлюенсер в CRM → автопроверка HypeAuditor → расчёт score → присвоение тега</li>
        </ul>`
      },
      {
        label: 'Архитектура продвинутого флоу',
        type: 'n8n_advanced'
      },
      {
        label: 'Экономия от полной автоматизации',
        html: `<table class="mtable">
          <thead><tr><th>Процесс</th><th>До автоматизации</th><th>После</th><th>Экономия/нед</th></tr></thead>
          <tbody>
            <tr><td class="td-n">Еженедельный отчёт</td><td>2 ч × 4 клиента</td><td>0</td><td>8 ч</td></tr>
            <tr><td class="td-n">Трекинг публикаций</td><td>1 ч/день</td><td>0</td><td>7 ч</td></tr>
            <tr><td class="td-n">Онбординг инфлюенсера</td><td>30 мин × 10</td><td>0</td><td>5 ч</td></tr>
            <tr><td class="td-n">Напоминания о дедлайнах</td><td>30 мин/день</td><td>0</td><td>3.5 ч</td></tr>
            <tr><td class="td-n">P&L дашборд</td><td>3 ч/мес</td><td>0</td><td>~1 ч/нед</td></tr>
            <tr><td class="td-n" style="color:var(--green)">Итого</td><td></td><td></td><td style="color:var(--green)">~24.5 ч/нед</td></tr>
          </tbody>
        </table>`,
        insight: '24.5 часа в неделю — это больше половины ставки сотрудника. При зарплате 80K ₽ → экономия 40K ₽/мес → 480K ₽/год. n8n окупается за первый день.'
      }
    ]
  }

}; // end CONTENT

// ─── RENDER ENGINE ─────────────────────────────────────────

function renderBlock(b) {
  let content = '';
  if (b.type === 'concepts') {
    content = CONCEPTS_HTML;
  } else if (b.type === 'table') {
    content = TABLE_METRICS;
  } else if (b.type && b.type.startsWith('n8n_')) {
    const key = b.type.replace('n8n_', '');
    content = N8N[key] || `<p style="color:var(--muted)">Схема в разработке</p>`;
  } else {
    content = `<div class="cblock-text">${b.html || ''}</div>`;
  }

  const insightHtml = b.insight
    ? `<div class="insight" style="margin-top:16px">
        <div class="insight-label">💡 Ключевая мысль</div>
        <div class="insight-text">${b.insight}</div>
       </div>`
    : '';

  return `<div class="cblock">
    <div class="cblock-label">${b.label}</div>
    ${content}
    ${insightHtml}
  </div>`;
}

function loadLesson(id) {
  const u = EL.getCurrentUser();
  if (!EL.isLessonUnlocked(u.id, id)) {
    alert('Сначала завершите предыдущий урок — нажмите «Отметить пройденным».');
    return;
  }
  currentLesson = id;
  renderSidebar();

  const lesson = CONTENT[id];
  const meta = EL.getLessonMeta(id);

  if (!lesson || !meta) {
    document.getElementById('mainArea').innerHTML =
      '<div style="padding:60px;text-align:center;color:var(--muted)">Урок временно недоступен.</div>';
    return;
  }

  const isDone = u.progress && u.progress[id];
  const idx = CURRICULUM_FLAT.findIndex(l => l.id === id);
  const prev = idx > 0 ? CURRICULUM_FLAT[idx - 1] : null;
  const next = idx < CURRICULUM_FLAT.length - 1 ? CURRICULUM_FLAT[idx + 1] : null;

  document.getElementById('mainArea').innerHTML = `
    <div><span class="l-badge">${lesson.badge}</span></div>
    <h1 class="l-title">${lesson.title}</h1>
    <div class="l-meta">${lesson.meta.map(m => `<div class="l-meta-item">${m}</div>`).join('')}</div>

    <div class="ai-strip">
      <div class="ai-strip-l">
        <div class="ai-av">🤖</div>
        <div>
          <strong>AI ассистент готов помочь</strong>
          <span>Задай любой вопрос по этому уроку</span>
          <div class="ai-online"><span class="ai-online-dot"></span> Онлайн · Демо-режим</div>
        </div>
      </div>
      <a href="ai-assistant.html" class="btn btn-accent btn-sm">Спросить AI →</a>
    </div>

    ${lesson.blocks.map(renderBlock).join('')}

    <div class="action-row">
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${prev
          ? `<button class="btn btn-ghost" onclick="loadLesson('${prev.id}')">← ${prev.title}</button>`
          : `<a href="dashboard.html" class="btn btn-ghost">← Кабинет</a>`}
        <a href="test.html?module=${meta.moduleId}" class="btn btn-gold">📝 Тест модуля</a>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <button class="complete-btn${isDone ? ' done' : ''}" id="completeBtn" onclick="markDone('${id}')">
          ${isDone ? '✓ Урок пройден' : 'Отметить пройденным ✓'}
        </button>
        ${next
          ? `<button class="btn btn-accent" onclick="loadLesson('${next.id}')">Следующий урок →</button>`
          : `<div style="font-size:13px;color:var(--green)">🏆 Это последний урок курса!</div>`}
      </div>
    </div>`;

  document.getElementById('mainArea').scrollTop = 0;
}

function markDone(id) {
  EL.completeLesson(user.id, id);
  const btn = document.getElementById('completeBtn');
  if (btn) { btn.textContent = '✓ Урок пройден'; btn.classList.add('done'); }
  // refresh local user and sidebar
  Object.assign(user, EL.getCurrentUser());
  renderSidebar();
}

// ─── INIT ──────────────────────────────────────────────────
const initLesson = params.get('lesson') || CURRICULUM_FLAT[0]?.id;
switchGrade(currentGrade);
if (initLesson) loadLesson(initLesson);
