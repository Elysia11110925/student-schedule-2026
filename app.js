const SEMESTER_START = new Date(2026, 8, 7);
const TOTAL_WEEKS = 16;
// This seven-day break pauses teaching weeks, but personal items keep their real dates.
const HOLIDAY_START = new Date(2026, 9, 1);
const HOLIDAY_DAYS = 7;

const periods = {
  1: { label: "第1–2节", time: "08:00–09:35" },
  2: { label: "第3–4节", time: "09:55–11:30" },
  3: { label: "第5–6节", time: "13:30–15:05" },
  4: { label: "第7–8节", time: "15:20–16:55" },
  5: { label: "第9–10节", time: "17:10–18:45" },
  6: { label: "第11–12节", time: "19:30–21:05" },
  7: { label: "第13节", time: "21:10–21:55" },
};

const courses = [
  { day: 1, period: 1, name: "离散数学B", teacher: "王卫苹", room: "信息楼B721", from: 1, to: 8 },
  { day: 1, period: 1, name: "概率论与数理统计A", teacher: "赵东红", room: "逸夫楼604", from: 9, to: 16 },
  { day: 2, period: 1, name: "数据结构A", teacher: "宗瓒", room: "信息楼B203", from: 1, to: 12 },
  { day: 2, period: 1, name: "数据结构A", teacher: "宗瓒", room: "待定", from: 13, to: 16 },
  { day: 3, period: 1, name: "离散数学B", teacher: "王卫苹", room: "信息楼B721", from: 1, to: 8 },
  { day: 3, period: 1, name: "概率论与数理统计A", teacher: "赵东红", room: "逸夫楼604", from: 9, to: 16 },
  { day: 4, period: 1, name: "数据结构A", teacher: "宗瓒", room: "信息楼B203", from: 1, to: 12 },
  { day: 4, period: 1, name: "数据结构A", teacher: "宗瓒", room: "待定", from: 13, to: 16 },
  { day: 5, period: 1, name: "概率论与数理统计A", teacher: "赵东红", room: "逸夫楼604", from: 9, to: 16 },
  { day: 1, period: 2, name: "毛泽东思想和中国特色社会主义理论体系概论", teacher: "李芳", room: "逸夫楼706", from: 1, to: 16 },
  { day: 2, period: 2, name: "工科物理BI", teacher: "王凤平", room: "逸夫楼604", from: 1, to: 16 },
  { day: 3, period: 2, name: "体育III", teacher: "宋一涛 · 游泳", room: "游泳馆", from: 1, to: 16 },
  { day: 4, period: 2, name: "工科物理BI", teacher: "王凤平", room: "逸夫楼604", from: 1, to: 16 },
  { day: 5, period: 2, name: "英汉基础笔译", teacher: "卢宁", room: "信息楼B619", from: 1, to: 16 },
  { day: 1, period: 3, name: "人工智能辅助翻译", teacher: "Nick Lambson", room: "信息楼B619", from: 1, to: 16 },
  { day: 4, period: 3, name: "综合英语（三）——社会与个人", teacher: "刘丹", room: "信息楼B721", from: 1, to: 16 },
  { day: 5, period: 3, name: "离散数学B", teacher: "王卫苹", room: "信息楼B721", from: 1, to: 8 },
  { day: 1, period: 4, name: "工科高等代数II", teacher: "赵东红", room: "逸夫楼307", from: 1, to: 8 },
  { day: 2, period: 4, name: "综合英语（三）——社会与个人", teacher: "刘丹", room: "信息楼B721", from: 1, to: 16 },
  { day: 3, period: 4, name: "工科高等代数II", teacher: "赵东红", room: "逸夫楼307", from: 1, to: 8 },
  { day: 5, period: 4, name: "工科高等代数II", teacher: "赵东红", room: "逸夫楼307", from: 1, to: 8 },
  { day: 2, period: 5, name: "英语演讲与辩论", teacher: "leo", room: "信息楼B619", from: 1, to: 16 },
  { day: 4, period: 5, name: "形势与政策3", teacher: "崔晓丹", room: "逸夫楼307", from: 13, to: 16 },
];

const floatingCourses = [
  { name: "从爱因斯坦到霍金的宇宙", weeks: "周次未在原表中注明", note: "MOOC 课程；请登录 mooc.ustb.edu.cn 修读。" },
  { name: "毛泽东思想和中国特色社会主义理论体系概论", weeks: "第1–8周", note: "理论课程，不排固定时间地点。", from: 1, to: 8 },
];

const weekdays = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const shortWeekdays = ["一", "二", "三", "四", "五", "六", "日"];
const CUSTOM_ITEMS_KEY = "schedule-custom-items-v1";

const $ = (selector) => document.querySelector(selector);
const schedule = $("#schedule");
const floatingCourseList = $("#floatingCourseList");
const weekSelect = $("#weekSelect");
const weekDialog = $("#weekDialog");
const itemDialog = $("#itemDialog");
const itemForm = $("#itemForm");

const atMidnight = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const formatDate = (date) => `${date.getMonth() + 1}月${date.getDate()}日`;
const isoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const sameDay = (a, b) => a && b && isoDate(a) === isoDate(b);
const dayIndex = (date) => Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
const HOLIDAY_END = addDays(HOLIDAY_START, HOLIDAY_DAYS);

function isHoliday(date) {
  return dayIndex(date) >= dayIndex(HOLIDAY_START) && dayIndex(date) < dayIndex(HOLIDAY_END);
}

function teachingWeek(date = new Date()) {
  if (isHoliday(date)) return null;
  const elapsedDays = dayIndex(date) - dayIndex(SEMESTER_START);
  const excludedDays = dayIndex(date) >= dayIndex(HOLIDAY_END) ? HOLIDAY_DAYS : 0;
  return Math.floor((elapsedDays - excludedDays) / 7) + 1;
}

function teachingDate(week, day = 1) {
  const date = addDays(SEMESTER_START, (week - 1) * 7 + day - 1);
  return date >= HOLIDAY_START ? addDays(date, HOLIDAY_DAYS) : date;
}

const SEMESTER_END = teachingDate(TOTAL_WEEKS, 7);
const menuPeriods = Array.from({ length: TOTAL_WEEKS }, (_, index) => ({
  id: String(index + 1),
  label: `第 ${index + 1} 教学周`,
  dates: Array.from({ length: 7 }, (_, day) => teachingDate(index + 1, day + 1)),
}));
menuPeriods.push({
  id: "holiday",
  label: "国庆假期 · 不计教学周",
  dates: Array.from({ length: HOLIDAY_DAYS }, (_, day) => addDays(HOLIDAY_START, day)),
});
menuPeriods.sort((a, b) => a.dates[0] - b.dates[0]);

function dayNumber(date) {
  return ((date.getDay() + 6) % 7) + 1;
}

function initialSelection() {
  const today = atMidnight(new Date());
  if (today >= SEMESTER_START && today <= SEMESTER_END) return today;

  const savedDateText = localStorage.getItem("schedule-date");
  if (/^\d{4}-\d{2}-\d{2}$/.test(savedDateText || "")) {
    const [year, month, day] = savedDateText.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    if (isoDate(date) === savedDateText && date >= SEMESTER_START && date <= SEMESTER_END) return date;
  }

  // Older versions saved a calendar week. Migrate it without shifting the real date.
  const savedWeek = Number(localStorage.getItem("schedule-week"));
  const savedDay = Number(localStorage.getItem("schedule-day"));
  if (Number.isInteger(savedWeek) && savedWeek >= 1 && savedWeek <= TOTAL_WEEKS &&
      Number.isInteger(savedDay) && savedDay >= 1 && savedDay <= 7) {
    return addDays(SEMESTER_START, (savedWeek - 1) * 7 + savedDay - 1);
  }
  return today < SEMESTER_START ? SEMESTER_START : SEMESTER_END;
}

let selectedDayDate = initialSelection();
let menuWeek = isHoliday(selectedDayDate) ? "holiday" : String(teachingWeek(selectedDayDate));
let itemDateBeingEdited = "";

function loadCustomItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_ITEMS_KEY) || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item && item.id && item.date && item.title && item.start && item.end) : [];
  } catch (error) {
    console.warn("临时事项读取失败", error);
    return [];
  }
}

let customItems = loadCustomItems();

function saveCustomItems() {
  localStorage.setItem(CUSTOM_ITEMS_KEY, JSON.stringify(customItems));
}

function selectedDate() {
  return selectedDayDate;
}

function coursesFor(week, day) {
  if (week === null || week < 1 || week > TOTAL_WEEKS) return [];
  return courses
    .filter((course) => course.day === day && week >= course.from && week <= course.to)
    .sort((a, b) => a.period - b.period);
}

function customItemsFor(date) {
  const dateKey = isoDate(date);
  return customItems.filter((item) => item.date === dateKey);
}

function dateAtTime(date, time) {
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
}

function timingStateForTimes(startText, endText, date, now = new Date()) {
  const today = atMidnight(now);
  const target = atMidnight(date);
  if (target < today) return "done";
  if (target > today) return "upcoming";
  if (now >= dateAtTime(date, endText)) return "done";
  if (now >= dateAtTime(date, startText)) return "active";
  return "upcoming";
}

function timingState(course, date, now = new Date()) {
  const [startText, endText] = periods[course.period].time.split("–");
  return timingStateForTimes(startText, endText, date, now);
}

function customItemTimingState(item, date, now = new Date()) {
  return timingStateForTimes(item.start, item.end, date, now);
}

function stateLabel(state) {
  if (state === "done") return "已结束";
  if (state === "active") return "进行中";
  return "待开始";
}

function createCourseTask(course, date) {
  const period = periods[course.period];
  const state = timingState(course, date);
  const article = document.createElement("article");
  article.className = `course-task is-${state}`;
  article.dataset.startTime = period.time.split("–")[0];
  article.dataset.kind = "course";
  article.innerHTML = `
    <div class="task-check" aria-hidden="true">${state === "done" ? "✓" : ""}</div>
    <div class="task-content">
      <div class="task-topline">
        <time>${period.time}</time>
        <span class="task-state">${stateLabel(state)}</span>
      </div>
      <h3>${course.name}</h3>
      <p class="task-period">${period.label}</p>
      <div class="task-meta">
        <span>${course.teacher}</span>
        <span class="task-room">${course.room}</span>
      </div>
    </div>`;
  return article;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[character]));
}

function createCustomTask(item, date) {
  const state = customItemTimingState(item, date);
  const article = document.createElement("article");
  article.className = `course-task custom-task is-${state}`;
  article.dataset.startTime = item.start;
  article.dataset.kind = "custom";
  article.innerHTML = `
    <div class="task-check" aria-hidden="true">${state === "done" ? "✓" : ""}</div>
    <div class="task-content">
      <div class="task-topline">
        <time>${escapeHTML(item.start)}–${escapeHTML(item.end)}</time>
        <div class="task-actions">
          <span class="task-state">${stateLabel(state)}</span>
          <button class="task-delete" type="button" aria-label="删除${escapeHTML(item.title)}" title="删除事项">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" /></svg>
          </button>
        </div>
      </div>
      <h3>${escapeHTML(item.title)}</h3>
      <p class="task-period">临时事项</p>
      <div class="task-meta">
        <span>${item.note ? escapeHTML(item.note) : "个人安排"}</span>
      </div>
    </div>`;
  article.querySelector(".task-delete").addEventListener("click", () => deleteCustomItem(item));
  return article;
}

function dailyEntries(date) {
  const courseEntries = coursesFor(teachingWeek(date), dayNumber(date)).map((course) => {
    const [start, end] = periods[course.period].time.split("–");
    return { kind: "course", course, start, end };
  });
  const itemEntries = customItemsFor(date).map((item) => ({
    kind: "custom",
    item,
    start: item.start,
    end: item.end,
  }));
  return [...courseEntries, ...itemEntries].sort((a, b) =>
    a.start.localeCompare(b.start) || a.end.localeCompare(b.end) || a.kind.localeCompare(b.kind));
}

function relativeDayLabel(date) {
  const offset = dayIndex(date) - dayIndex(new Date());
  if (offset === 0) return "今天";
  if (offset === -1) return "昨天";
  if (offset === 1) return "明天";
  return "";
}

function renderFloatingCourses(week) {
  floatingCourseList.replaceChildren();
  const visible = week === null ? [] : floatingCourses.filter((course) => !course.from || (week >= course.from && week <= course.to));
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.textContent = week === null ? "国庆假期不计入教学周" : "本周没有自主安排课程";
    floatingCourseList.append(empty);
    return;
  }
  visible.forEach((course) => {
    const card = document.createElement("article");
    card.className = "floating-card";
    card.innerHTML = `<div class="flex-dot"></div><div><h3>${course.name}</h3><p>${course.weeks} · ${course.note}</p></div>`;
    floatingCourseList.append(card);
  });
}

function updateDayControls() {
  $("#previousDay").disabled = sameDay(selectedDate(), SEMESTER_START);
  $("#nextDay").disabled = sameDay(selectedDate(), SEMESTER_END);
}

function renderDaily() {
  const date = selectedDate();
  localStorage.setItem("schedule-date", isoDate(date));
  const week = teachingWeek(date);
  const entries = dailyEntries(date);
  const completed = entries.filter((entry) => (entry.kind === "course"
    ? timingState(entry.course, date)
    : customItemTimingState(entry.item, date)) === "done").length;
  const active = entries.some((entry) => (entry.kind === "course"
    ? timingState(entry.course, date)
    : customItemTimingState(entry.item, date)) === "active");

  const weekLabel = week === null ? "国庆假期 · 不计教学周" : `第 ${week} 教学周`;
  $("#dayDate").textContent = [ `${date.getFullYear()}年 ${formatDate(date)}`, relativeDayLabel(date), weekLabel ].filter(Boolean).join(" · ");
  $("#dayTitle").textContent = weekdays[dayNumber(date) - 1];
  $("#dayContext").textContent = active ? "现在有安排正在进行" : entries.length ? "按时间自动更新完成状态" : "给自己留一点自由时间";
  $("#progressValue").textContent = `${completed}/${entries.length}`;
  $("#progressBar").style.width = `${entries.length ? (completed / entries.length) * 100 : 0}%`;
  $("#courseCount").textContent = `${entries.length} 项`;

  schedule.replaceChildren();
  if (entries.length) {
    entries.forEach((entry) => schedule.append(entry.kind === "course"
      ? createCourseTask(entry.course, date)
      : createCustomTask(entry.item, date)));
  } else {
    const empty = document.createElement("div");
    empty.className = "empty-card";
    empty.innerHTML = week === null
      ? `<span>○</span><h3>国庆假期</h3><p>10月1–7日不计教学周，仍可添加个人事项。</p>`
      : `<span>○</span><h3>今天没有安排</h3><p>可以休息，也可以添加一件临时事项。</p>`;
    schedule.append(empty);
  }

  renderFloatingCourses(week);
  updateDayControls();
}

function renderWeekMenu() {
  weekSelect.value = menuWeek;
  const period = menuPeriods.find((entry) => entry.id === menuWeek);
  const start = period.dates[0];
  const end = period.dates[period.dates.length - 1];
  const isSplitWeek = dayIndex(end) - dayIndex(start) > 6;
  $("#weekDates").textContent = `${start.getFullYear()}年 ${formatDate(start)} – ${formatDate(end)}` +
    (isSplitWeek ? "（跳过10月1–7日）" : period.id === "holiday" ? "（不计教学周）" : "");
  const list = $("#weekMenuDays");
  list.replaceChildren();

  period.dates.forEach((date) => {
    const day = dayNumber(date);
    const weekday = weekdays[day - 1];
    const dailyCourses = coursesFor(teachingWeek(date), day);
    const dailyItems = customItemsFor(date);
    const totalEntries = dailyCourses.length + dailyItems.length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `week-day-option${sameDay(date, selectedDate()) ? " is-selected" : ""}`;
    const summaryParts = [
      ...dailyCourses.map((course) => course.name),
      ...dailyItems.map((item) => item.title),
    ];
    const summary = summaryParts.length ? summaryParts.join(" · ") : "无安排";
    button.innerHTML = `
      <span class="week-day-date"><small>周${shortWeekdays[day - 1]}</small><strong>${date.getDate()}</strong></span>
      <span class="week-day-summary"><strong>${weekday} · ${formatDate(date)}</strong><small>${escapeHTML(summary)}</small></span>
      <span class="week-day-count">${totalEntries}</span>`;
    button.addEventListener("click", () => {
      selectedDayDate = date;
      renderDaily();
      weekDialog.close();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    list.append(button);
  });

  $("#previousWeek").disabled = menuWeek === menuPeriods[0].id;
  $("#nextWeek").disabled = menuWeek === menuPeriods[menuPeriods.length - 1].id;
}

function goAdjacentDay(offset) {
  const date = addDays(selectedDate(), offset);
  selectedDayDate = date < SEMESTER_START ? SEMESTER_START : date > SEMESTER_END ? SEMESTER_END : date;
  renderDaily();
}

for (const period of menuPeriods) {
  const option = document.createElement("option");
  option.value = period.id;
  option.textContent = period.label;
  weekSelect.append(option);
}

$("#previousDay").addEventListener("click", () => goAdjacentDay(-1));
$("#nextDay").addEventListener("click", () => goAdjacentDay(1));
$("#goToday").addEventListener("click", () => {
  const today = atMidnight(new Date());
  selectedDayDate = today < SEMESTER_START ? SEMESTER_START : today > SEMESTER_END ? SEMESTER_END : today;
  renderDaily();
});

$("#openWeekMenu").addEventListener("click", () => {
  menuWeek = isHoliday(selectedDate()) ? "holiday" : String(teachingWeek(selectedDate()));
  renderWeekMenu();
  weekDialog.showModal();
});
weekSelect.addEventListener("change", () => {
  menuWeek = weekSelect.value;
  renderWeekMenu();
});
$("#previousWeek").addEventListener("click", () => {
  const index = menuPeriods.findIndex((period) => period.id === menuWeek);
  menuWeek = menuPeriods[Math.max(0, index - 1)].id;
  renderWeekMenu();
});
$("#nextWeek").addEventListener("click", () => {
  const index = menuPeriods.findIndex((period) => period.id === menuWeek);
  menuWeek = menuPeriods[Math.min(menuPeriods.length - 1, index + 1)].id;
  renderWeekMenu();
});

function timeValue(totalMinutes) {
  const safeMinutes = Math.max(0, Math.min(1439, totalMinutes));
  const hours = String(Math.floor(safeMinutes / 60)).padStart(2, "0");
  const minutes = String(safeMinutes % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function defaultItemTimes(date) {
  if (!sameDay(date, new Date())) return { start: "09:00", end: "10:00" };
  const now = new Date();
  const rounded = Math.ceil((now.getHours() * 60 + now.getMinutes()) / 15) * 15;
  const startMinutes = Math.min(rounded, 22 * 60 + 45);
  return { start: timeValue(startMinutes), end: timeValue(startMinutes + 60) };
}

function openItemDialog() {
  const date = selectedDate();
  const defaults = defaultItemTimes(date);
  itemDateBeingEdited = isoDate(date);
  itemForm.reset();
  $("#itemDateLabel").textContent = `${date.getFullYear()}年${formatDate(date)} · ${weekdays[dayNumber(date) - 1]}`;
  $("#itemStart").value = defaults.start;
  $("#itemEnd").value = defaults.end;
  $("#itemFormError").textContent = "";
  itemDialog.showModal();
  window.setTimeout(() => $("#itemTitle").focus(), 80);
}

function deleteCustomItem(item) {
  if (!window.confirm(`删除“${item.title}”？`)) return;
  customItems = customItems.filter((savedItem) => savedItem.id !== item.id);
  saveCustomItems();
  renderDaily();
}

$("#addItemButton").addEventListener("click", openItemDialog);
$("#closeItemDialog").addEventListener("click", () => itemDialog.close());
itemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = $("#itemTitle").value.trim();
  const start = $("#itemStart").value;
  const end = $("#itemEnd").value;
  const note = $("#itemNote").value.trim();
  const error = $("#itemFormError");

  if (!title || !start || !end) {
    error.textContent = "请填写事项名称和时间。";
    return;
  }
  if (end <= start) {
    error.textContent = "结束时间需要晚于开始时间。";
    $("#itemEnd").focus();
    return;
  }

  customItems.push({
    id: globalThis.crypto?.randomUUID?.() || `item-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: itemDateBeingEdited,
    title,
    start,
    end,
    note,
    createdAt: new Date().toISOString(),
  });
  saveCustomItems();
  itemDialog.close();
  renderDaily();
});
[$("#itemTitle"), $("#itemStart"), $("#itemEnd")].forEach((field) => field.addEventListener("input", () => {
  $("#itemFormError").textContent = "";
}));

const installDialog = $("#installDialog");
$("#installButton").addEventListener("click", () => installDialog.showModal());
[weekDialog, itemDialog, installDialog].forEach((dialog) => dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
}));

renderDaily();
window.setInterval(() => {
  if (sameDay(selectedDate(), new Date())) renderDaily();
}, 30000);

const offlineStatus = $("#offlineStatus");

function setOfflineStatus(text, state) {
  offlineStatus.textContent = text;
  offlineStatus.className = `offline-status ${state}`;
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("service-worker.js", { scope: "./", updateViaCache: "none" });
      await navigator.serviceWorker.ready;

      if (!navigator.serviceWorker.controller) {
        await Promise.race([
          new Promise((resolve) => navigator.serviceWorker.addEventListener("controllerchange", resolve, { once: true })),
          new Promise((resolve) => window.setTimeout(resolve, 3000)),
        ]);
      }

      setOfflineStatus("✓ 离线可用", "is-ready");
    } catch (error) {
      console.error("离线缓存准备失败", error);
      setOfflineStatus("离线缓存未完成，请联网刷新", "is-error");
    }
  });
} else {
  setOfflineStatus("此浏览器不支持离线使用", "is-error");
}
