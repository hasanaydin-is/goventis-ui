# Goventis UI

Linear tarzı bir issue tracker workspace prototipi. Vanilla HTML/CSS/JS — build adımı yok.

---

## Çalıştırma

`<script type="module">` ve `fetch()` kullanıldığı için **dev server** üzerinden açılmalı (file:// CORS'a takılır).

VS Code'da repo köküne attach edilmiş launch config mevcut; alternatif olarak:

```bash
# Python
python3 -m http.server 5500

# veya Node
npx serve .
```

---

## Yapı

```
goventis-ui/
├── index.html              # Shell: CSS link + partial placeholder'ları + module script
│
├── styles/                 # Paylaşılan CSS
│   ├── tokens.css          # Design token'lar (renk, radius, spacing)
│   ├── base.css            # Reset + tipografi
│   ├── layout.css          # App grid (sidebar / topbar / iframe)
│   └── components.css      # Buton, chip, table row, modal, chat, timeline…
│
├── partials/               # Shell HTML parçaları (fetch ile yüklenir)
│   ├── tabbar.html         # Pencere tab'leri + add-tab popover
│   ├── sidebar.html        # Workspace switcher + nav
│   ├── topbar.html         # Timer / Calendar / More
│   ├── timer-popover.html  # Time tracking popover
│   ├── calendar-popover.html  # Ay grid + günün etkinlikleri
│   └── modal.html          # Issue detay modal + AI chat panel
│
├── scripts/                # ES modülleri
│   ├── main.js             # Bootstrap: partial'ları yükler, modülleri init eder
│   ├── partials.js         # loadPartials(pairs) helper
│   ├── tabs.js             # Tab router, sidebar nav, add popover
│   ├── timer.js            # Timer state + topbar popover
│   ├── calendar.js         # Ay grid + popover
│   ├── modal.js            # Issue modal + iframe postMessage listener
│   └── chat.js             # AI chat input + quick actions
│
└── pages/                  # iframe içinde yüklenen sayfalar
    ├── deck.html           # Home dashboard
    ├── inbox.html
    ├── my-issues.html
    ├── projects.html
    ├── workflows.html      # (empty state)
    ├── skills.html
    ├── calendar.html       # (empty state)
    └── add-ons.html        # (empty state)
```

---

## Mimari

**Shell + iframe.** `index.html` sabit shell'i (sidebar / topbar / tabbar) tutar. İçerik `<iframe id="contentFrame">` içinde değişir; sayfalar arası geçiş `tabs.js` üzerinden iframe `src`'sini değiştirerek yapılır.

**Partial loading.** `index.html` çok büyüktü (1100+ satır); markup'ı `partials/` altına taşıdık. `main.js` boot'ta tüm partial'ları paralel fetch'leyip placeholder'ların `outerHTML`'ine yazar. Sonra modülleri sırayla init eder.

**iframe ↔ shell iletişimi.** Sayfa içindeki bir issue row'a tıklanınca iframe `postMessage({type:'openIssue', issue})` gönderir; `modal.js` dinleyip full-viewport modal açar (sidebar/topbar üstüne biner). Escape veya `closeIssue` mesajı modal'ı kapatır.

---

## Yeni sayfa eklemek

1. `pages/<slug>.html` oluştur (mevcut empty state sayfalarını şablon olarak kullanabilirsin).
2. `partials/sidebar.html` ve `partials/tabbar.html`'e `data-page="<slug>"` butonları ekle.
3. `scripts/tabs.js` içindeki `PAGE_ICONS` map'ine SVG ikon ekle.

---

## Yeni partial eklemek

1. `partials/<name>.html` oluştur.
2. `index.html` shell'ine `<div data-partial="<name>"></div>` placeholder koy.
3. `scripts/main.js` içindeki `loadPartials([...])` listesine satır ekle.
4. (Gerekirse) yeni bir modül yazıp `main.js`'te init et.

---

## Notlar

- `script.type === "module"` olduğu için varsayılan olarak deferred — DOM hazır olmadan çalışmaz.
- Modüller arası state paylaşımı yok; popover senkronizasyonu (modal açılınca diğerlerini kapatma) sadece DOM query ile yapılıyor.
- Tüm partial'lar paralel fetch'lenir; ağ gecikmesi varsa kısa bir flash görülebilir. İleride preload veya inline-on-build düşünülebilir.
