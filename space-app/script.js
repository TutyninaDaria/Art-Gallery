/* ---------- Hvězdné pozadí ---------- */
(function starfield() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const count = Math.floor((canvas.width * canvas.height) / 3500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      speed: Math.random() * 0.4 + 0.05,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#eef0ff";
    for (const s of stars) {
      const twinkle = 0.5 + 0.5 * Math.sin(t / 900 + s.phase);
      ctx.globalAlpha = 0.25 + twinkle * 0.75;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(draw);
})();

/* ---------- Pomocné funkce ---------- */
const FAV_KEY = "space_app_favorites_v1";

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

function isFavorite(id) {
  return getFavorites().some((f) => f.id === id);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 2200);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Zjistí skutečný obrázek z NASA Image & Video Library pro dané klíčové slovo.
async function fetchNasaImage(query) {
  const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(
    query
  )}&media_type=image`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("NASA API error");
  const data = await res.json();
  const items = data?.collection?.items || [];
  const withLinks = items.filter((it) => it.links && it.links[0]?.href);
  if (!withLinks.length) throw new Error("Žádný obrázek nenalezen");
  // vezmeme jeden z prvních pár výsledků (nejrelevantnější), ne vždy úplně první
  const pick = withLinks[Math.floor(Math.random() * Math.min(3, withLinks.length))];
  return pick.links[0].href;
}

/* ---------- Stav appky ---------- */
let currentItem = null;
let currentImageUrl = null;
let revealed = false;
let usedIds = [];

const els = {
  mainImage: document.getElementById("main-image"),
  blurOverlay: document.getElementById("blur-overlay"),
  revealBtn: document.getElementById("reveal-btn"),
  loading: document.getElementById("loading"),
  quizBox: document.getElementById("quiz-box"),
  quizOptions: document.getElementById("quiz-options"),
  revealContent: document.getElementById("reveal-content"),
  title: document.getElementById("image-title"),
  year: document.getElementById("image-year"),
  hook: document.getElementById("image-hook"),
  fact: document.getElementById("image-fact"),
  explanation: document.getElementById("image-explanation"),
  favBtn: document.getElementById("fav-btn"),
  downloadBtn: document.getElementById("download-btn"),
  nextBtn: document.getElementById("next-btn"),
  favCount: document.getElementById("fav-count"),
  favGrid: document.getElementById("fav-grid"),
  emptyFav: document.getElementById("empty-fav"),
};

function pickNextItem() {
  if (usedIds.length >= SPACE_IMAGES.length) usedIds = [];
  const remaining = SPACE_IMAGES.filter((it) => !usedIds.includes(it.id));
  const item = shuffle(remaining)[0];
  usedIds.push(item.id);
  return item;
}

function buildQuizOptions(item) {
  const options = shuffle([item.title, ...item.decoys]);
  els.quizOptions.innerHTML = "";
  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt";
    btn.textContent = opt;
    btn.addEventListener("click", () => handleQuizAnswer(btn, opt, item.title));
    els.quizOptions.appendChild(btn);
  });
}

function handleQuizAnswer(btn, chosen, correct) {
  const allBtns = els.quizOptions.querySelectorAll(".quiz-opt");
  allBtns.forEach((b) => (b.disabled = true));
  if (chosen === correct) {
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
    allBtns.forEach((b) => {
      if (b.textContent === correct) b.classList.add("correct");
    });
  }
  setTimeout(() => revealImage(), 500);
}

async function loadNewItem() {
  revealed = false;
  currentItem = pickNextItem();
  currentImageUrl = null;

  els.mainImage.src = "";
  els.mainImage.classList.add("blurred");
  els.blurOverlay.classList.remove("hidden");
  els.quizBox.classList.remove("hidden");
  els.revealContent.classList.add("hidden");
  els.loading.classList.add("active");

  buildQuizOptions(currentItem);

  try {
    const imgUrl = await fetchNasaImage(currentItem.searchQuery);
    currentImageUrl = imgUrl;
    els.mainImage.src = imgUrl;
  } catch (e) {
    showToast("Obrázek se nepodařilo načíst, zkouším další…");
    loadNewItem();
    return;
  } finally {
    els.loading.classList.remove("active");
  }
}

function revealImage() {
  revealed = true;
  els.mainImage.classList.remove("blurred");
  els.blurOverlay.classList.add("hidden");
  els.quizBox.classList.add("hidden");
  els.revealContent.classList.remove("hidden");

  els.title.textContent = currentItem.title;
  els.year.textContent = currentItem.year;
  els.hook.textContent = currentItem.hook;
  els.fact.textContent = currentItem.fact;
  els.explanation.textContent = currentItem.explanation;

  updateFavButton();
}

function updateFavButton() {
  const fav = isFavorite(currentItem.id);
  els.favBtn.textContent = fav ? "💜 V oblíbených" : "🤍 Do oblíbených";
  els.favBtn.classList.toggle("active-fav", fav);
}

function toggleFavorite() {
  const list = getFavorites();
  const idx = list.findIndex((f) => f.id === currentItem.id);
  if (idx >= 0) {
    list.splice(idx, 1);
    showToast("Odebráno z oblíbených");
  } else {
    list.push({
      id: currentItem.id,
      title: currentItem.title,
      year: currentItem.year,
      hook: currentItem.hook,
      fact: currentItem.fact,
      explanation: currentItem.explanation,
      imageUrl: currentImageUrl,
    });
    showToast("Přidáno do oblíbených ⭐");
  }
  saveFavorites(list);
  updateFavButton();
  renderFavorites();
}

async function downloadImage(url, filename) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename + ".jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (e) {
    // fallback - otevřít v nové záložce, ať si to uživatel uloží ručně
    window.open(url, "_blank");
    showToast("Stažení se nezdařilo automaticky, obrázek jsem otevřel v nové záložce");
  }
}

/* ---------- Oblíbené – vykreslení ---------- */
function renderFavorites() {
  const list = getFavorites();
  els.favCount.textContent = list.length;
  els.favGrid.innerHTML = "";
  els.emptyFav.style.display = list.length ? "none" : "block";

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "fav-card";
    card.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" />
      <div class="fav-card-title">${item.title}</div>
    `;
    card.addEventListener("click", () => openModal(item));
    els.favGrid.appendChild(card);
  });
}

/* ---------- Modal detailu ---------- */
const modal = {
  backdrop: document.getElementById("modal-backdrop"),
  image: document.getElementById("modal-image"),
  title: document.getElementById("modal-title"),
  year: document.getElementById("modal-year"),
  hook: document.getElementById("modal-hook"),
  fact: document.getElementById("modal-fact"),
  explanation: document.getElementById("modal-explanation"),
  downloadBtn: document.getElementById("modal-download-btn"),
  removeBtn: document.getElementById("modal-remove-btn"),
  closeBtn: document.getElementById("modal-close"),
};

let modalItem = null;

function openModal(item) {
  modalItem = item;
  modal.image.src = item.imageUrl;
  modal.title.textContent = item.title;
  modal.year.textContent = item.year;
  modal.hook.textContent = item.hook;
  modal.fact.textContent = item.fact;
  modal.explanation.textContent = item.explanation;
  modal.backdrop.classList.remove("hidden");
}

function closeModal() {
  modal.backdrop.classList.add("hidden");
  modalItem = null;
}

modal.closeBtn.addEventListener("click", closeModal);
modal.backdrop.addEventListener("click", (e) => {
  if (e.target === modal.backdrop) closeModal();
});
modal.downloadBtn.addEventListener("click", () => {
  if (modalItem) downloadImage(modalItem.imageUrl, modalItem.title.replace(/\s+/g, "_"));
});
modal.removeBtn.addEventListener("click", () => {
  if (!modalItem) return;
  const list = getFavorites().filter((f) => f.id !== modalItem.id);
  saveFavorites(list);
  showToast("Odebráno z oblíbených");
  renderFavorites();
  if (currentItem && currentItem.id === modalItem.id) updateFavButton();
  closeModal();
});

/* ---------- Taby ---------- */
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    if (btn.dataset.tab === "favorites") renderFavorites();
  });
});

/* ---------- Event listenery ---------- */
els.revealBtn.addEventListener("click", revealImage);
els.favBtn.addEventListener("click", toggleFavorite);
els.nextBtn.addEventListener("click", loadNewItem);
els.downloadBtn.addEventListener("click", () => {
  if (currentImageUrl) {
    downloadImage(currentImageUrl, currentItem.title.replace(/\s+/g, "_"));
  }
});

/* ---------- Start ---------- */
renderFavorites();
loadNewItem();
