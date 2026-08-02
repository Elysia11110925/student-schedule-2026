const SEMESTER_START = new Date(2026, 8, 7);
const TOTAL_WEEKS = 16;

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
const colors = ["#5b5bd6", "#e86a92", "#168f8c", "#e68a2e", "#4d79d8", "#8b5fc7", "#d65f50"];

const $ = (selector) => document.querySelector(selector);
const weekSelect = $("#weekSelect");
const schedule = $("#schedule");
const dayNav = $("#dayNav");
const statusCard = $("#statusCard");
const floatingCourseList = $("#floatingCourseList");

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

function calendarWeek(date = new Date()) {
  const diffDays = Math.floor((atMidnight(date) - SEMESTER_START) / 86400000);
  return Math.floor(diffDays / 7) + 1;
}

function initialWeek() {
  const current = calendarWeek();
  const saved = Number(localStorage.getItem("schedule-week"));
  if (current >= 1 && current <= TOTAL_WEEKS) return current;
  if (saved >= 1 && saved <= TOTAL_WEEKS) return saved;
  return current < 1 ? 1 : TOTAL_WEEKS;
}

function weekStart(week) { return addDays(SEMESTER_START, (week - 1) * 7); }

function createCourseCard(course) {
  const period = periods[course.period];
  const color = colors[Math.abs(course.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length];
  const article = document.createElement("article");
  article.className = "course-card";
  article.style.setProperty("--course-color", color);
  article.innerHTML = `
    <div class="course-time"><strong>${period.label}</strong>${period.time}</div>
    <div class="course-info">
      <h3>${course.name}</h3>
      <div class="course-meta">
        <span>👤 ${course.teacher}</span>
        <span class="room">⌖ ${course.room}</span>
        <span>第${course.from}–${course.to}周</span>
      </div>
    </div>`;
  return article;
}

function renderStatus(selectedWeek) {
  const nowWeek = calendarWeek();
  let text = "";
  if (nowWeek < 1) text = `距离开学还有 ${Math.ceil((SEMESTER_START - atMidnight(new Date())) / 86400000)} 天，当前先展示第 1 周。`;
  else if (nowWeek > TOTAL_WEEKS) text = "本学期课程周已经结束，你仍可切换查看历史周次。";
  else if (selectedWeek !== nowWeek) text = `当前是第 ${nowWeek} 周，正在查看第 ${selectedWeek} 周。`;
  statusCard.textContent = text;
  statusCard.hidden = !text;
}

function renderFloatingCourses(week) {
  floatingCourseList.replaceChildren();
  const visible = floatingCourses.filter((course) => !course.from || (week >= course.from && week <= course.to));
  if (!visible.length) {
    const empty = document.createElement("div");
    empty.className = "empty-day";
    empty.textContent = "本周没有不排时间地点的课程";
    floatingCourseList.append(empty);
    return;
  }
  visible.forEach((course) => {
    const card = document.createElement("article");
    card.className = "floating-card";
    card.innerHTML = `<h3>${course.name}</h3><p>${course.weeks} · ${course.note}</p>`;
    floatingCourseList.append(card);
  });
}

function render(week) {
  localStorage.setItem("schedule-week", String(week));
  const start = weekStart(week);
  const end = addDays(start, 6);
  $("#weekDates").textContent = `${start.getFullYear()}年 ${formatDate(start)} – ${formatDate(end)}`;
  renderStatus(week);
  schedule.replaceChildren();
  dayNav.replaceChildren();

  weekdays.forEach((weekday, index) => {
    const day = index + 1;
    const date = addDays(start, index);
    const isToday = sameDay(date, new Date());

    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `day-chip${isToday ? " today" : ""}`;
    chip.innerHTML = `<span>周${shortWeekdays[index]}</span><strong>${date.getDate()}</strong>`;
    chip.addEventListener("click", () => document.querySelector(`#day-${day}`).scrollIntoView({ behavior: "smooth" }));
    dayNav.append(chip);

    const section = document.createElement("section");
    section.id = `day-${day}`;
    section.className = `day-section${isToday ? " is-today" : ""}`;
    section.innerHTML = `<div class="day-header"><h2>${weekday}</h2><time datetime="${isoDate(date)}">${formatDate(date)}</time></div>`;
    const list = document.createElement("div");
    list.className = "course-list";
    const dailyCourses = courses
      .filter((course) => course.day === day && week >= course.from && week <= course.to)
      .sort((a, b) => a.period - b.period);
    if (dailyCourses.length) dailyCourses.forEach((course) => list.append(createCourseCard(course)));
    else {
      const empty = document.createElement("div");
      empty.className = "empty-day";
      empty.textContent = "这一天没有课程";
      list.append(empty);
    }
    section.append(list);
    schedule.append(section);
  });

  renderFloatingCourses(week);
}

for (let week = 1; week <= TOTAL_WEEKS; week += 1) {
  const option = document.createElement("option");
  option.value = week;
  option.textContent = `第 ${week} 周`;
  weekSelect.append(option);
}

weekSelect.value = String(initialWeek());
weekSelect.addEventListener("change", () => render(Number(weekSelect.value)));
$("#previousWeek").addEventListener("click", () => {
  weekSelect.value = String(Math.max(1, Number(weekSelect.value) - 1));
  render(Number(weekSelect.value));
  window.scrollTo({ top: 0, behavior: "smooth" });
});
$("#nextWeek").addEventListener("click", () => {
  weekSelect.value = String(Math.min(TOTAL_WEEKS, Number(weekSelect.value) + 1));
  render(Number(weekSelect.value));
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const installDialog = $("#installDialog");
$("#installButton").addEventListener("click", () => installDialog.showModal());
installDialog.addEventListener("click", (event) => {
  if (event.target === installDialog) installDialog.close();
});

render(Number(weekSelect.value));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js"));
}
