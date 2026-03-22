// ═══════════════════════════════════════════════════════════════
// EL · Influence Academy — общий слой данных (data.js)
// Все страницы подключают этот файл первым
// ═══════════════════════════════════════════════════════════════

const EL = {

  // ─── AUTH ────────────────────────────────────────────────────
  getCurrentUser() {
    const id = localStorage.getItem('el_current_user');
    if (!id) return null;
    return this.getUser(id);
  },
  getUser(id) {
    const data = localStorage.getItem('el_user_' + id);
    return data ? JSON.parse(data) : null;
  },
  getAllUsers() {
    const ids = JSON.parse(localStorage.getItem('el_user_ids') || '[]');
    return ids.map(id => this.getUser(id)).filter(Boolean);
  },
  saveUser(user) {
    localStorage.setItem('el_user_' + user.id, JSON.stringify(user));
    const ids = JSON.parse(localStorage.getItem('el_user_ids') || '[]');
    if (!ids.includes(user.id)) { ids.push(user.id); localStorage.setItem('el_user_ids', JSON.stringify(ids)); }
  },
  login(user) { localStorage.setItem('el_current_user', user.id); },
  logout() { localStorage.removeItem('el_current_user'); window.location.href = 'login.html'; },
  requireAuth() {
    if (!this.getCurrentUser()) { window.location.href = 'login.html'; return false; }
    return true;
  },
  requireAdmin() {
    const u = this.getCurrentUser();
    if (!u || u.role !== 'admin') { window.location.href = 'dashboard.html'; return false; }
    return true;
  },
  register(name, email, password, role) {
    const existing = this.getAllUsers().find(u => u.email === email);
    if (existing) return { error: 'Пользователь с таким email уже существует' };
    const id = 'u_' + Date.now();
    const user = {
      id, name, email,
      password: btoa(password),
      role: role || 'student',
      createdAt: Date.now(),
      avatar: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      progress: {},
      testResults: [],
      streak: 0,
      lastActivity: Date.now(),
      totalMinutes: 0
    };
    this.saveUser(user);
    return { user };
  },
  loginWithCredentials(email, password) {
    const user = this.getAllUsers().find(u => u.email === email && u.password === btoa(password));
    if (!user) return { error: 'Неверный email или пароль' };
    this.login(user);
    return { user };
  },

  // ─── PROGRESS ────────────────────────────────────────────────
  completeLesson(userId, lessonId) {
    const user = this.getUser(userId);
    if (!user) return;
    if (!user.progress[lessonId]) {
      user.progress[lessonId] = { completedAt: Date.now(), status: 'done' };
      user.totalMinutes = (user.totalMinutes || 0) + (this.getLessonMeta(lessonId)?.duration || 10);
      user.lastActivity = Date.now();
      this.updateStreak(user);
    }
    this.saveUser(user);
  },
  saveTestResult(userId, moduleId, score, total, passed) {
    const user = this.getUser(userId);
    if (!user) return;
    user.testResults = user.testResults || [];
    user.testResults.push({ moduleId, score, total, passed, pct: Math.round(score/total*100), date: Date.now() });
    user.lastActivity = Date.now();
    this.saveUser(user);
  },
  updateStreak(user) {
    const last = user.lastStreakDate;
    const today = new Date().toDateString();
    if (last === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    user.streak = (last === yesterday) ? (user.streak || 0) + 1 : 1;
    user.lastStreakDate = today;
  },
  getLessonMeta(id) { return CURRICULUM_FLAT.find(l => l.id === id); },
  getCompletedCount(userId) {
    const user = this.getUser(userId);
    return user ? Object.keys(user.progress).length : 0;
  },
  getGradeProgress(userId, grade) {
    const user = this.getUser(userId);
    if (!user) return 0;
    const lessons = CURRICULUM_FLAT.filter(l => l.grade === grade);
    const done = lessons.filter(l => user.progress[l.id]).length;
    return lessons.length ? Math.round(done / lessons.length * 100) : 0;
  },
  getOverallProgress(userId) {
    const user = this.getUser(userId);
    if (!user) return 0;
    const done = Object.keys(user.progress).length;
    return Math.round(done / CURRICULUM_FLAT.length * 100);
  },
  getBestTestScore(userId, moduleId) {
    const user = this.getUser(userId);
    if (!user || !user.testResults) return null;
    const results = user.testResults.filter(r => r.moduleId === moduleId);
    if (!results.length) return null;
    return results.reduce((best, r) => r.pct > best.pct ? r : best);
  },
  isLessonUnlocked(userId, lessonId) {
    const idx = CURRICULUM_FLAT.findIndex(l => l.id === lessonId);
    if (idx === 0) return true;
    const prev = CURRICULUM_FLAT[idx - 1];
    const user = this.getUser(userId);
    return user && (user.progress[prev.id] || idx === 0);
  },

  // ─── ADMIN ───────────────────────────────────────────────────
  seedAdmin() {
    if (!this.getAllUsers().find(u => u.role === 'admin')) {
      this.register('Администратор', 'admin@el-academy.ru', 'admin123', 'admin');
    }
  }
};

// ─── CURRICULUM ──────────────────────────────────────────────
const CURRICULUM = {
  junior: {
    label: 'Junior', color: '#4ade80',
    modules: [
      { id: 'j_m1', title: 'Основы Influence-маркетинга', lessons: [
        { id: 'j1', title: 'Что такое Influence-маркетинг', duration: 10, grade: 'junior' },
        { id: 'j2', title: 'Типы инфлюенсеров', duration: 8, grade: 'junior' },
        { id: 'j3', title: 'Анализ аудитории', duration: 12, grade: 'junior' },
        { id: 'j4', title: 'Основные метрики: ER, Reach, CPM', duration: 15, grade: 'junior' },
      ]},
      { id: 'j_m2', title: 'Первые коллаборации', lessons: [
        { id: 'j5', title: 'Поиск инфлюенсеров', duration: 10, grade: 'junior' },
        { id: 'j6', title: 'Написание брифа', duration: 14, grade: 'junior' },
        { id: 'j7', title: 'Переговоры для новичков', duration: 11, grade: 'junior' },
        { id: 'j8', title: 'Оценка результатов кампании', duration: 12, grade: 'junior' },
      ]},
      { id: 'j_m3', title: 'Аналитика и отчётность', lessons: [
        { id: 'j9',  title: 'KPI и метрики успеха', duration: 13, grade: 'junior' },
        { id: 'j10', title: 'Постаналитика кампании', duration: 10, grade: 'junior' },
        { id: 'j11', title: 'Первый отчёт для клиента', duration: 9,  grade: 'junior' },
      ]},
    ]
  },
  middle: {
    label: 'Middle', color: '#D4A843',
    modules: [
      { id: 'm_m1', title: 'Стратегия и планирование', lessons: [
        { id: 'm1', title: 'Медиапланирование', duration: 15, grade: 'middle' },
        { id: 'm2', title: 'Контент-стратегия для бренда', duration: 13, grade: 'middle' },
        { id: 'm3', title: 'Выбор платформ: Instagram, YouTube, Telegram, TikTok', duration: 16, grade: 'middle' },
      ]},
      { id: 'm_m2', title: 'Управление кампаниями', lessons: [
        { id: 'm4', title: 'Мультиканальные кампании', duration: 18, grade: 'middle' },
        { id: 'm5', title: 'Контракты и юридические аспекты', duration: 14, grade: 'middle' },
        { id: 'm6', title: 'Управление сроками и дедлайнами', duration: 11, grade: 'middle' },
        { id: 'm7', title: 'ROI и оптимизация бюджета', duration: 16, grade: 'middle' },
      ]},
      { id: 'm_m3', title: 'Автоматизация с n8n', lessons: [
        { id: 'm8', title: 'Что такое n8n и зачем он нужен', duration: 12, grade: 'middle' },
        { id: 'm9', title: 'Автоматизация отчётов и уведомлений', duration: 15, grade: 'middle' },
        { id: 'm10', title: 'Интеграция CRM и influence-инструментов', duration: 18, grade: 'middle' },
      ]},
    ]
  },
  senior: {
    label: 'Senior', color: '#E8530A',
    modules: [
      { id: 's_m1', title: 'Лидерство и команда', lessons: [
        { id: 's1', title: 'Управление influence-командой', duration: 20, grade: 'senior' },
        { id: 's2', title: 'Найм и онбординг специалистов', duration: 14, grade: 'senior' },
        { id: 's3', title: 'Постановка KPI для команды', duration: 16, grade: 'senior' },
      ]},
      { id: 's_m2', title: 'Бизнес и финансы', lessons: [
        { id: 's4', title: 'P&L: бюджеты и рентабельность', duration: 22, grade: 'senior' },
        { id: 's5', title: 'Ценообразование услуг агентства', duration: 15, grade: 'senior' },
        { id: 's6', title: 'Переговоры на уровне C-level', duration: 18, grade: 'senior' },
      ]},
      { id: 's_m3', title: 'Масштабирование и бренд', lessons: [
        { id: 's7', title: 'Brand building через инфлюенсеров', duration: 17, grade: 'senior' },
        { id: 's8', title: 'Стратегические альянсы и партнёрства', duration: 16, grade: 'senior' },
        { id: 's9', title: 'Масштабирование агентства', duration: 20, grade: 'senior' },
        { id: 's10', title: 'n8n: продвинутая автоматизация агентства', duration: 22, grade: 'senior' },
      ]},
    ]
  }
};

// Flat list for progress tracking
const CURRICULUM_FLAT = [];
Object.entries(CURRICULUM).forEach(([grade, gradeData]) => {
  gradeData.modules.forEach(mod => {
    mod.lessons.forEach(l => { l.grade = grade; l.moduleId = mod.id; l.moduleTitle = mod.title; CURRICULUM_FLAT.push(l); });
  });
});

// Seed admin on every load
EL.seedAdmin();
