import {
  FOLIO_LEAVES,
  LANE_ORDER,
  PASSAGE_TRAILS,
  resolveTravelHref
} from './folioArchive.js'

const HUE_KEY = 'ability-hue-mode'
const assetHref = (fileName) => new URL(fileName, import.meta.url).href

function igniteAbilityLedger() {
  stitchDocumentHead()
  restoreHueMode()
  const hereId = document.body.dataset.passage || 'home'
  weaveInstrumentBar(hereId)
  paintFolioStage(hereId)
  weaveColophon()
  weaveSeekVeil(hereId)
  bindHueSwitch()
  bindLaneTravel(hereId)
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && event.target.tagName !== 'INPUT') {
      event.preventDefault()
      summonSeekVeil(true)
    }
    if (event.key === 'Escape') summonSeekVeil(false)
  })
}

function stitchDocumentHead() {
  const fonts = document.createElement('link')
  fonts.rel = 'stylesheet'
  fonts.href =
    'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,560;9..144,700&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@400;500;600&display=swap'
  document.head.appendChild(fonts)

  const sheet = document.createElement('link')
  sheet.rel = 'stylesheet'
  sheet.href = assetHref('./ability-look.css')
  document.head.appendChild(sheet)

  const mark = document.createElement('link')
  mark.rel = 'icon'
  mark.href = assetHref('./Ability_Logomark.svg')
  document.head.appendChild(mark)
}

function weaveInstrumentBar(hereId) {
  const bar = document.createElement('header')
  bar.className = 'instrument-bar'
  bar.innerHTML = `
    <a class="skip-leap" href="#folio-stage">Skip to folio</a>
    <a class="mark-lockup" data-travel="home" href="${resolveTravelHref(hereId, 'home')}" aria-label="Ability home">
      <img class="word-lock" src="${assetHref('./Ability_Logo.svg')}" alt="Ability">
      <img class="mark-only" src="${assetHref('./Ability_Logomark.svg')}" alt="">
    </a>
    <nav class="lane-cluster" aria-label="Primary lanes"></nav>
    <div class="tool-cluster">
      <button class="orb-btn" id="seek-orb" type="button" aria-label="Seek pages">⌕</button>
      <button class="orb-btn" id="hue-switch" type="button" aria-label="Toggle dusk ink">◐</button>
    </div>
  `
  const cluster = bar.querySelector('.lane-cluster')
  const currentLane = PASSAGE_TRAILS[hereId].lane
  LANE_ORDER.forEach((lane) => {
    const link = document.createElement('a')
    link.className = `lane-pill${lane.id === currentLane ? ' is-awake' : ''}`
    link.dataset.travel = lane.entry
    link.href = resolveTravelHref(hereId, lane.entry)
    link.textContent = lane.label
    cluster.appendChild(link)
  })
  const spine = document.createElement('div')
  spine.className = 'spine-brand'
  spine.setAttribute('aria-hidden', 'true')
  document.body.prepend(bar)
  document.body.prepend(spine)
}

function paintFolioStage(hereId) {
  const leaf = FOLIO_LEAVES[hereId] || FOLIO_LEAVES.missing
  const root = document.getElementById('ledger-root')
  document.title = `${leaf.title} · Ability`

  if (leaf.isAtelier) {
    root.innerHTML = `
      <section class="atelier-wrap">
        <img class="hero-logomark" src="${assetHref('./Ability_Logomark.svg')}" alt="">
        <canvas id="atelier-pulse" aria-hidden="true"></canvas>
        <div class="atelier-copy">${leaf.html}</div>
      </section>
    `
    pulseAtelierCanvas()
    return
  }

  root.innerHTML = `
    <div class="folio-layout">
      <article class="folio-stage" id="folio-stage">
        <div class="sublane-row"></div>
        <p class="eyebrow-tick">${PASSAGE_TRAILS[hereId].lane}</p>
        <h1>${leaf.title}</h1>
        ${leaf.html}
      </article>
      <aside class="marginalia-strip" aria-label="On this leaf"></aside>
    </div>
  `
  stitchLanePills(hereId)
  dressWellsOfCode()
  harvestMarginalia()
}

function stitchLanePills(hereId) {
  const row = document.querySelector('.sublane-row')
  if (!row) return
  const lane = PASSAGE_TRAILS[hereId].lane
  Object.entries(PASSAGE_TRAILS)
    .filter(([, trail]) => trail.lane === lane && trail.file !== '404.html')
    .forEach(([id, trail]) => {
      const link = document.createElement('a')
      link.dataset.travel = id
      link.href = resolveTravelHref(hereId, id)
      link.textContent = trail.title
      if (id === hereId) link.className = 'is-here'
      row.appendChild(link)
    })
}

function harvestMarginalia() {
  const strip = document.querySelector('.marginalia-strip')
  const heads = [...document.querySelectorAll('.folio-stage h2[id], .folio-stage h3[id]')]
  if (!strip || !heads.length) {
    if (strip) strip.hidden = true
    return
  }
  strip.innerHTML = '<p>On this leaf</p>'
  heads.forEach((head) => {
    const link = document.createElement('a')
    link.href = `#${head.id}`
    link.textContent = head.textContent
    strip.appendChild(link)
  })
  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const mark = strip.querySelector(`a[href="#${entry.target.id}"]`)
        if (mark && entry.isIntersecting) {
          strip.querySelectorAll('a').forEach((node) => node.classList.remove('is-in-view'))
          mark.classList.add('is-in-view')
        }
      })
    },
    { rootMargin: '-20% 0px -70% 0px' }
  )
  heads.forEach((head) => watcher.observe(head))
}

function dressWellsOfCode() {
  document.querySelectorAll('.folio-stage pre').forEach((block) => {
    const well = document.createElement('div')
    well.className = 'well-of-code'
    const copy = document.createElement('button')
    copy.className = 'copy-chip'
    copy.type = 'button'
    copy.textContent = 'copy'
    copy.addEventListener('click', () => {
      navigator.clipboard.writeText(block.textContent)
      copy.textContent = 'kept'
      window.setTimeout(() => {
        copy.textContent = 'copy'
      }, 1200)
    })
    block.replaceWith(well)
    well.append(copy, block)
  })
}

function weaveColophon() {
  const band = document.createElement('footer')
  band.className = 'colophon-band'
  band.innerHTML = `
    <div class="colophon-legal">
      <img src="${assetHref('./Ability_Logomark.svg')}" alt="" width="36" height="36">
      <p>© Copyright 2026, Ability</p>
    </div>
    <div class="colophon-copy">
                  <p>Site created by <a class="footer-link" target="_blank" href="https://www.linkedin.com/in/pareeknikhil/">Nikhil Pareek</a> and <a class="footer-link" target="_blank" href="https://www.linkedin.com/in/prnvkhndlwl/">Dr. Pranav Khandelwal</a></p>

      <p>Site developed by Titiksha Bhardwaj</p>
    </div>
  `
  document.body.appendChild(band)
}

function weaveSeekVeil(hereId) {
  const veil = document.createElement('div')
  veil.className = 'seek-veil'
  veil.id = 'seek-veil'
  veil.innerHTML = `
    <div class="seek-panel" role="dialog" aria-label="Seek">
      <input id="seek-field" type="search" placeholder="Seek a leaf…" autocomplete="off">
      <ul class="seek-hits"></ul>
    </div>
  `
  document.body.appendChild(veil)
  veil.addEventListener('click', (event) => {
    if (event.target === veil) summonSeekVeil(false)
  })
  document.getElementById('seek-orb').addEventListener('click', () => summonSeekVeil(true))
  document.getElementById('seek-field').addEventListener('input', (event) => {
    paintSeekHits(hereId, event.target.value)
  })
}

function summonSeekVeil(open) {
  const veil = document.getElementById('seek-veil')
  veil.classList.toggle('is-open', open)
  if (open) {
    const field = document.getElementById('seek-field')
    field.value = ''
    paintSeekHits(document.body.dataset.passage, '')
    field.focus()
  }
}

function paintSeekHits(hereId, query) {
  const needle = query.trim().toLowerCase()
  const list = document.querySelector('.seek-hits')
  const hits = Object.entries(FOLIO_LEAVES)
    .filter(([id]) => id !== 'missing')
    .filter(([, leaf]) => {
      if (!needle) return true
      const hay = `${leaf.title} ${leaf.html}`.toLowerCase()
      return hay.includes(needle)
    })
    .slice(0, 8)
  list.innerHTML = hits
    .map(([id, leaf]) => {
      const href = resolveTravelHref(hereId, id)
      return `<li><a href="${href}"><strong>${leaf.title}</strong><small>${PASSAGE_TRAILS[id].file}</small></a></li>`
    })
    .join('')
}

function bindHueSwitch() {
  document.getElementById('hue-switch').addEventListener('click', () => {
    const dusk = document.documentElement.classList.toggle('dusk-ink')
    localStorage.setItem(HUE_KEY, dusk ? 'dusk' : 'dawn')
  })
}

function restoreHueMode() {
  if (localStorage.getItem(HUE_KEY) === 'dusk') {
    document.documentElement.classList.add('dusk-ink')
  }
}

function bindLaneTravel() {
  document.body.addEventListener('click', (event) => {
    const link = event.target.closest('[data-travel]')
    if (!link) return
    // Native href already resolved; this only keeps keyboard users on the same tab.
    link.blur()
  })
}

function pulseAtelierCanvas() {
  const canvas = document.getElementById('atelier-pulse')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let tick = 0
  const draw = () => {
    const { width, height } = canvas.parentElement.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    canvas.width = width * ratio
    canvas.height = height * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.lineWidth = 2
    const stroke = ctx.createLinearGradient(0, 0, width, 0)
    stroke.addColorStop(0, 'rgba(24, 228, 225, 0.7)')
    stroke.addColorStop(1, 'rgba(121, 133, 230, 0.7)')
    ctx.strokeStyle = stroke
    ctx.beginPath()
    for (let x = 0; x <= width; x += 3) {
      const y =
        height * 0.42 +
        Math.sin(x * 0.018 + tick) * 42 +
        Math.sin(x * 0.07 + tick * 1.7) * 18 +
        Math.cos(x * 0.11 - tick) * 9
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
    tick += 0.035
    window.requestAnimationFrame(draw)
  }
  draw()
}

igniteAbilityLedger()
