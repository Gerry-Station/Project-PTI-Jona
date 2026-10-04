const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ====== PENGATURAN VIDEO (isi sendiri) ====== */
const VIDEO_ID = ""; // contoh: bagian setelah v= pada link YouTube
const VIDEO_TITLE = "[judul video] – [nama channel]";
if (VIDEO_ID) {
  $("#yt").src = "https://www.youtube.com/embed/" + VIDEO_ID;
  const a = $("#ytlink");
  a.href = "https://www.youtube.com/watch?v=" + VIDEO_ID;
  a.textContent = VIDEO_TITLE;
}

/* ====== Tema gelap/terang ====== */
const root = document.documentElement;
try {
  root.dataset.theme = localStorage.getItem("tema") || "dark";
} catch (e) {}
$("#theme").onclick = () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("tema", root.dataset.theme);
  } catch (e) {}
};

/* ====== Efek mengetik ====== */
const words = ["Sistem", "Informasi", "Pengetahuan", "Sistem Pakar"];
let wi = 0,
  ci = 0,
  del = false;
(function type() {
  const w = words[wi];
  $("#typed").textContent = w.slice(0, ci);
  if (!del && ci < w.length) ci++;
  else if (!del) {
    del = true;
    return setTimeout(type, 1200);
  } else if (ci > 0) ci--;
  else {
    del = false;
    wi = (wi + 1) % words.length;
  }
  setTimeout(type, del ? 45 : 90);
})();

/* ====== Jaringan node di hero (analogi "sistem") ====== */
const cv = $("#net"),
  cx = cv.getContext("2d");
let pts = [],
  mouse = { x: -999, y: -999 };
function size() {
  cv.width = cv.offsetWidth;
  cv.height = cv.offsetHeight;
  pts = Array.from({ length: Math.min(70, cv.width / 14) }, () => ({
    x: Math.random() * cv.width,
    y: Math.random() * cv.height,
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
  }));
}
addEventListener("resize", size);
size();
cv.parentElement.addEventListener("mousemove", (e) => {
  const r = cv.getBoundingClientRect();
  mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
});
(function draw() {
  cx.clearRect(0, 0, cv.width, cv.height);
  const col = getComputedStyle(root).getPropertyValue("--a").trim();
  cx.fillStyle = col;
  pts.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > cv.width) p.vx *= -1;
    if (p.y < 0 || p.y > cv.height) p.vy *= -1;
    cx.beginPath();
    cx.arc(p.x, p.y, 2, 0, 7);
    cx.fill();
    for (let j = i + 1; j < pts.length; j++) link(p, pts[j], 110, col);
    link(p, mouse, 160, col);
  });
  requestAnimationFrame(draw);
})();
function link(a, b, d, col) {
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  if (dist < d) {
    cx.globalAlpha = 1 - dist / d;
    cx.strokeStyle = col;
    cx.beginPath();
    cx.moveTo(a.x, a.y);
    cx.lineTo(b.x, b.y);
    cx.stroke();
    cx.globalAlpha = 1;
  }
}

/* ====== Progress bar, menu aktif, reveal ====== */
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#bar").style.width =
    (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
});
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        $$("#menu a").forEach((l) =>
          l.classList.toggle("on", l.hash === "#" + e.target.id),
        );
      }
    }),
  { threshold: 0.2 },
);
$$("section").forEach((s) => io.observe(s));

/* ====== Tombol tab generik (IPO & POAC) ====== */
function tabs(sel, out) {
  $$(sel + " .chip").forEach(
    (b) =>
      (b.onclick = () => {
        $$(sel + " .chip").forEach((x) => x.classList.remove("on"));
        b.classList.add("on");
        const o = $(out);
        o.textContent = b.dataset.t;
        o.style.animation = "none";
        o.offsetHeight;
        o.style.animation = "";
      }),
  );
}
tabs(".ipo", "#ipoText");
tabs("#poac", "#poacText");

/* ====== Data → Informasi → Pengetahuan ====== */
const dik = [
  "<b>DATA</b> (fakta mentah): <code>75, 60, 90, 85, 40</code>",
  "<b>INFORMASI</b> (data diolah): nilai rata-rata kelas = <b>70</b>; 1 dari 5 mahasiswa di bawah 50.",
  "<b>PENGETAHUAN</b> (dipahami & dipakai): rata-rata sudah cukup, tetapi 1 mahasiswa butuh bimbingan, jadi dosen mengadakan remedial.",
];
const showDik = () => {
  const o = $("#dikOut");
  o.innerHTML = dik[$("#dik").value];
  o.style.animation = "none";
  o.offsetHeight;
  o.style.animation = "";
};
$("#dik").oninput = showDik;
showDik();

/* ====== Kartu flip ====== */
$$(".flip").forEach((c) => (c.onclick = () => c.classList.toggle("on")));

/* ====== Mini database ====== */
const mhs = [
  ["0701001", "Aisyah Putri", "Sistem Informasi"],
  ["0701002", "Budi Santoso", "Sistem Informasi"],
  ["0702003", "Citra Lestari", "Ilmu Komputer"],
  ["0702004", "Dimas Pratama", "Ilmu Komputer"],
  ["0703005", "Eka Wulandari", "Teknologi Informasi"],
  ["0701006", "Fajar Nugroho", "Sistem Informasi"],
];
function renderDB() {
  const q = $("#q").value.trim().toLowerCase();
  const rows = mhs.filter((r) => r.join(" ").toLowerCase().includes(q));
  $("#db tbody").innerHTML =
    rows
      .map(
        (r) => "<tr>" + r.map((c) => "<td>" + c + "</td>").join("") + "</tr>",
      )
      .join("") || "<tr><td colspan=3>Data tidak ditemukan</td></tr>";
  $("#sql").textContent = q
    ? `SELECT * FROM mahasiswa WHERE data LIKE '%${q.replace(/[<>&]/g, "")}%';`
    : "SELECT * FROM mahasiswa;";
}
$("#q").oninput = renderDB;
renderDB();

/* ====== Sistem pakar mini (forward chaining) ====== */
const G = {
  g1: "Daun menguning",
  g2: "Bercak coklat pada daun",
  g3: "Batang membusuk",
  g4: "Bulir padi hampa",
  g5: "Daun menggulung",
};
const RULES = [
  { id: "R1", if: ["g2", "g4"], then: "Penyakit Blas" },
  { id: "R2", if: ["g1", "g5"], then: "Penyakit Tungro" },
  { id: "R3", if: ["g1", "g2"], then: "Hawar Daun Bakteri" },
  { id: "R4", if: ["g3", "g1"], then: "Busuk Batang" },
];
$("#gejala").innerHTML = Object.entries(G)
  .map(([k, v]) => `<label><input type="checkbox" value="${k}"> ${v}</label>`)
  .join("");
$("#gejala").onchange = () => {
  const f = $$("#gejala input:checked").map((i) => i.value);
  const hit = RULES.filter((r) => r.if.every((x) => f.includes(x)));
  $("#hasil").innerHTML = !f.length
    ? "Pilih minimal satu gejala…"
    : hit.length
      ? "Kemungkinan: " +
        hit.map((h) => `<span class="ok">${h.then}</span>`).join(", ")
      : "Belum ada aturan yang cocok. Tambahkan gejala lain.";
  $("#trace").innerHTML = RULES.map(
    (r) =>
      `<li>${r.id}: IF ${r.if.map((x) => G[x]).join(" AND ")} THEN ${r.then} ${r.if.every((x) => f.includes(x)) ? "✅" : "❌"}</li>`,
  ).join("");
};

/* ====== Kuis ====== */
const Q = [
  [
    "Sistem terdiri dari…",
    [
      "Satu komponen tunggal",
      "Elemen yang saling berhubungan untuk satu tujuan",
      "Data mentah saja",
    ],
    1,
  ],
  [
    "Data yang sudah diolah dan bermakna disebut…",
    ["Informasi", "Basis data", "Aturan"],
    0,
  ],
  ["Contoh DBMS adalah…", ["HTML", "MySQL", "YouTube"], 1],
  [
    "Mana yang lebih luas cakupannya?",
    ["Sistem pakar", "Sistem berbasis pengetahuan", "Sama saja"],
    1,
  ],
];
let skor = 0,
  qi = 0;
function showQ() {
  const box = $("#quiz");
  if (qi >= Q.length) {
    box.innerHTML = `<div class="box big">🎉 Skor kamu: <b>${skor}/${Q.length}</b></div><button class="chip" id="ulang">Ulangi</button>`;
    $("#ulang").onclick = () => {
      skor = qi = 0;
      showQ();
    };
    return;
  }
  const [t, o, k] = Q[qi];
  box.innerHTML =
    `<p><b>${qi + 1}/${Q.length}.</b> ${t}</p>` +
    o.map((x, i) => `<button class="opt" data-i="${i}">${x}</button>`).join("");
  $$(".opt").forEach(
    (b) =>
      (b.onclick = () => {
        const ok = +b.dataset.i === k;
        if (ok) skor++;
        b.classList.add(ok ? "right" : "wrong");
        $$(".opt")[k].classList.add("right");
        $$(".opt").forEach((x) => (x.onclick = null));
        setTimeout(() => {
          qi++;
          showQ();
        }, 1000);
      }),
  );
}
showQ();
