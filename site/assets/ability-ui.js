const HUE_KEY = 'ability-hue-mode'
const GITHUB_LIBRARY_URL = 'https://github.com/pareeknikhil/emg-ability'

const SEEK_LEAVES = [
  { title: 'Ability', file: 'index.html', blurb: 'Home' },
  { title: 'Docs', file: 'guide/index.html', blurb: 'Guide home' },
  { title: 'Supported Boards', file: 'guide/getting-started.html', blurb: 'Docs' },
  { title: 'Installation Instructions', file: 'guide/installation.html', blurb: 'Docs' },
  { title: 'User API', file: 'guide/compilation.html', blurb: 'Docs' },
  { title: 'Data Format Description', file: 'guide/pipeline.html', blurb: 'Docs' },
  { title: 'Code Samples', file: 'guide/examples.html', blurb: 'Docs' },
  { title: 'Integration with Game Engines', file: 'guide/engines.html', blurb: 'Docs' },
  { title: 'Ability Dev', file: 'guide/develop.html', blurb: 'Docs' },
  { title: 'Ask Help', file: 'guide/help.html', blurb: 'Docs' },
  { title: 'Reference', file: 'reference/index.html', blurb: 'API home' },
  { title: 'API overview', file: 'reference/api-overview.html', blurb: 'Reference' },
  { title: 'Core', file: 'reference/core.html', blurb: 'Reference' },
  { title: 'Processing', file: 'reference/processing.html', blurb: 'Reference' },
  { title: 'Features', file: 'reference/features.html', blurb: 'Reference' },
  { title: 'Visualization', file: 'reference/visualization.html', blurb: 'Reference' },
  { title: 'Blog', file: 'blog/index.html', blurb: 'Ability, in writing' },
  { title: 'A session has a life', file: 'blog/session-lifecycle.html', blurb: 'Blog' },
  { title: 'Presets are maps, not magic', file: 'blog/preset-maps.html', blurb: 'Blog' },
  { title: 'Community', file: 'community/index.html', blurb: 'Field guide' },
  { title: 'About Us', file: 'about/index.html', blurb: 'Workshop and people' },
  { title: 'Supported Platforms', file: 'about/platforms.html', blurb: 'OS and architecture' }
]

const siteRoot = new URL('../', import.meta.url)

function bindAbilityUi() {
  bindGitHubLink()
  bindHueSwitch()
  bindSeek()
  bindCopyChips()
  pinRailToBar()
  bindRailTree()
  bindRailSeek()
  bindRailDrawer()
  spyRailScroll()
  highlightMarginalia()
  pulseAtelierCanvas()
  pulseCommunityCanvas()
  bindCastPhotos()
  bindPlaza()
  playAboutLockup()
}

function pinRailToBar() {
  const bar = document.querySelector('.instrument-bar')
  if (!bar) return
  const apply = () => {
    document.documentElement.style.setProperty('--bar-h', `${Math.round(bar.getBoundingClientRect().height)}px`)
  }
  apply()
  window.addEventListener('resize', apply)
}

function keepRailLinkInView(link) {
  const rail = document.querySelector('.child-rail')
  if (!rail || !link) return
  const railRect = rail.getBoundingClientRect()
  const linkRect = link.getBoundingClientRect()
  const pad = 48
  if (linkRect.top < railRect.top + pad) {
    rail.scrollTop -= railRect.top + pad - linkRect.top
  } else if (linkRect.bottom > railRect.bottom - 16) {
    rail.scrollTop += linkRect.bottom - (railRect.bottom - 16)
  }
}

function bindRailDrawer() {
  const bar = document.querySelector('.instrument-bar')
  const lanes = document.querySelector('.lane-cluster')
  if (!bar || !lanes) return

  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.className = 'orb-btn rail-toggle'
  toggle.setAttribute('aria-label', 'Open menu')
  toggle.setAttribute('aria-expanded', 'false')
  toggle.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"></path></svg>'
  bar.prepend(toggle)

  const veil = document.createElement('div')
  veil.className = 'rail-veil'
  document.body.append(veil)

  const rail = document.querySelector('.child-rail')
  let panel = rail
  const laneCopy = document.createElement('div')
  laneCopy.className = 'rail-lanes'
  lanes.querySelectorAll('a').forEach((link) => {
    laneCopy.append(link.cloneNode(true))
  })

  if (rail) {
    rail.prepend(laneCopy)
  } else {
    panel = document.createElement('aside')
    panel.className = 'menu-drawer'
    panel.setAttribute('aria-label', 'Menu')
    panel.append(laneCopy)
    document.body.append(panel)
  }

  const compact = window.matchMedia('(max-width: 980px)')
  const setOpen = (open) => {
    document.body.classList.toggle('rail-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  }

  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('rail-open')))
  veil.addEventListener('click', () => setOpen(false))
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false)
  })
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (compact.matches) setOpen(false)
    })
  })
  compact.addEventListener('change', () => {
    if (!compact.matches) setOpen(false)
  })
}

function bindGitHubLink() {
  const link = document.getElementById('github-orb')
  if (link && GITHUB_LIBRARY_URL) {
    link.href = GITHUB_LIBRARY_URL
  }
}

function bindHueSwitch() {
  const switcher = document.getElementById('hue-switch')
  if (!switcher) return
  switcher.addEventListener('click', () => {
    const dusk = document.documentElement.classList.toggle('dusk-ink')
    localStorage.setItem(HUE_KEY, dusk ? 'dusk' : 'dawn')
  })
}

function bindSeek() {
  const veil = document.getElementById('seek-veil')
  const orb = document.getElementById('seek-orb')
  const field = document.getElementById('seek-field')
  if (!veil || !orb || !field || orb.hidden) return

  const openSeek = (open) => {
    veil.classList.toggle('is-open', open)
    if (open) {
      field.value = ''
      paintSeekHits('')
      field.focus()
    }
  }

  orb.addEventListener('click', () => openSeek(true))
  veil.addEventListener('click', (event) => {
    if (event.target === veil) openSeek(false)
  })
  field.addEventListener('input', (event) => paintSeekHits(event.target.value))
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault()
      openSeek(true)
    }
    if (event.key === 'Escape') openSeek(false)
  })
}

function paintSeekHits(query) {
  const list = document.querySelector('.seek-hits')
  if (!list) return
  const needle = query.trim().toLowerCase()
  const hits = SEEK_LEAVES.filter((leaf) => {
    if (!needle) return true
    return `${leaf.title} ${leaf.blurb} ${leaf.file}`.toLowerCase().includes(needle)
  }).slice(0, 8)

  list.innerHTML = hits
    .map((leaf) => {
      const href = new URL(leaf.file, siteRoot).href
      return `<li><a href="${href}"><strong>${leaf.title}</strong><small>${leaf.blurb}</small></a></li>`
    })
    .join('')
}

const COPY_ICON =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>'

function bindCopyChips() {
  document.querySelectorAll('.well-of-code').forEach((well) => {
    let chip = well.querySelector('.copy-chip')
    if (!chip) {
      chip = document.createElement('button')
      chip.type = 'button'
      chip.className = 'copy-chip'
      well.prepend(chip)
    }

    chip.innerHTML = COPY_ICON
    chip.setAttribute('aria-label', 'Copy')
    chip.setAttribute('title', 'Copy')

    let resetTimer = 0
    chip.addEventListener('click', async () => {
      const snippet = well.querySelector('pre')?.textContent ?? ''
      try {
        await navigator.clipboard.writeText(snippet)
      } catch {
        return
      }
      window.clearTimeout(resetTimer)
      chip.classList.add('is-copied')
      chip.textContent = 'Copied'
      chip.setAttribute('aria-label', 'Copied')
      resetTimer = window.setTimeout(() => {
        chip.classList.remove('is-copied')
        chip.innerHTML = COPY_ICON
        chip.setAttribute('aria-label', 'Copy')
      }, 2000)
    })
  })
}

function currentFileName() {
  const parts = location.pathname.split('/').filter(Boolean)
  const last = parts[parts.length - 1] || 'index.html'
  return last.includes('.') ? last : 'index.html'
}

function linkFile(link) {
  return new URL(link.getAttribute('href'), location.href).pathname.split('/').pop()
}

function linkHash(link) {
  return new URL(link.getAttribute('href'), location.href).hash
}

function closeSiblingLevels(node, kind) {
  const pack = node.parentElement
  if (!pack) return
  ;[...pack.children].forEach((sib) => {
    if (sib === node || !sib.classList.contains(kind)) return
    sib.classList.remove('is-spread')
    sib.querySelectorAll(':scope > .rail-row > .rail-fold').forEach((btn) => {
      btn.setAttribute('aria-expanded', 'false')
    })
    if (kind === 'rail-branch') {
      sib.querySelectorAll('.rail-twig.is-spread').forEach((twig) => twig.classList.remove('is-spread'))
    }
  })
}

function spreadNode(node) {
  if (!node) return
  node.classList.add('is-spread')
  node.querySelector(':scope > .rail-row > .rail-fold')?.setAttribute('aria-expanded', 'true')
}

function toggleBranch(branch, fold) {
  const next = !branch.classList.contains('is-spread')
  closeSiblingLevels(branch, 'rail-branch')
  branch.classList.toggle('is-spread', next)
  fold?.setAttribute('aria-expanded', next ? 'true' : 'false')
  if (!next) {
    branch.querySelectorAll('.rail-twig.is-spread').forEach((twig) => twig.classList.remove('is-spread'))
  }
  return next
}

function bindRailTree() {
  const branches = [...document.querySelectorAll('.rail-branch')]
  if (!branches.length) return

  branches.forEach((branch) => {
    let fold = branch.querySelector(':scope > .rail-row > .rail-fold')
    let title = branch.querySelector(':scope > .rail-row > a, :scope > a')
    if (!title) return

    if (!title.closest('.rail-row')) {
      const row = document.createElement('div')
      row.className = 'rail-row'
      fold = document.createElement('button')
      fold.type = 'button'
      fold.className = 'rail-fold'
      fold.setAttribute('aria-label', `Expand ${title.textContent.trim()}`)
      fold.setAttribute('aria-expanded', 'false')
      title.before(row)
      row.append(fold, title)
    }

    fold?.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      toggleBranch(branch, fold)
    })

    title.addEventListener('click', (event) => {
      event.stopPropagation()
      const url = new URL(title.getAttribute('href'), location.href)
      if (url.pathname.split('/').pop() === currentFileName() && !url.hash) {
        closeSiblingLevels(branch, 'rail-branch')
        spreadNode(branch)
      }
    })
  })

  document.querySelectorAll('.rail-twig').forEach((twig) => {
    const buds = twig.querySelector(':scope > .rail-buds')
    let title = twig.querySelector(':scope > .rail-row > a, :scope > a')
    if (!title || !buds) return

    let fold = twig.querySelector(':scope > .rail-row > .rail-fold')
    if (!title.closest('.rail-row')) {
      const row = document.createElement('div')
      row.className = 'rail-row'
      fold = document.createElement('button')
      fold.type = 'button'
      fold.className = 'rail-fold'
      fold.setAttribute('aria-label', `Expand ${title.textContent.trim()}`)
      fold.setAttribute('aria-expanded', 'false')
      title.before(row)
      row.append(fold, title)
    }

    fold?.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      const next = !twig.classList.contains('is-spread')
      closeSiblingLevels(twig, 'rail-twig')
      twig.classList.toggle('is-spread', next)
      fold.setAttribute('aria-expanded', next ? 'true' : 'false')
    })

    title.addEventListener('click', (event) => {
      event.stopPropagation()
      const url = new URL(title.getAttribute('href'), location.href)
      if (url.pathname.split('/').pop() === currentFileName()) {
        closeSiblingLevels(twig, 'rail-twig')
        spreadNode(twig)
      }
    })
  })

  markRailHere()
  window.addEventListener('hashchange', markRailHere)
}

function currentSection() {
  const path = location.pathname
  if (path.includes('/guide/')) return 'guide'
  if (path.includes('/reference/')) return 'reference'
  return null
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

let sectionSeekCatalog = null

async function loadSectionSeek() {
  if (sectionSeekCatalog) return sectionSeekCatalog
  const response = await fetch(new URL('section-seek.json', import.meta.url))
  if (!response.ok) throw new Error('search index missing')
  sectionSeekCatalog = await response.json()
  return sectionSeekCatalog
}

function normalizeSeek(value) {
  return String(value || '')
    .replaceAll('\u2019', "'")
    .replaceAll('\u2018', "'")
    .replaceAll('\u201c', '"')
    .replaceAll('\u201d', '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function seekHay(item) {
  return normalizeSeek(item.text || `${item.title} ${item.page} ${item.hay || ''}`).toLowerCase()
}

function scoreSeekHit(item, needle) {
  const title = normalizeSeek(item.title).toLowerCase()
  const page = normalizeSeek(item.page).toLowerCase()
  const hay = seekHay(item)
  const words = needle.split(' ').filter(Boolean)
  if (!words.length) return 0
  const phrase = hay.includes(needle)
  if (!phrase && !words.every((word) => hay.includes(word))) return 0
  if (title === needle) return 120
  if (title.startsWith(needle)) return 90
  if (title.includes(needle)) return 75
  if (phrase && needle.length > 16) return item.kind === 'heading' ? 68 : 48
  if (phrase) return item.kind === 'heading' ? 55 : 40
  if (page.includes(needle)) return 36
  return 16
}

function seekSnippet(item, needle) {
  const source = normalizeSeek(item.text || item.title || '')
  if (!source) return ''
  const hay = source.toLowerCase()
  let at = hay.indexOf(needle)
  if (at < 0) {
    const first = needle.split(' ').find((word) => word.length > 2) || needle.split(' ')[0]
    at = first ? hay.indexOf(first) : -1
  }
  if (at < 0) return ''
  const start = Math.max(0, at - 28)
  const end = Math.min(source.length, at + Math.max(needle.length, 24) + 36)
  let slice = source.slice(start, end).trim()
  if (start > 0) slice = `…${slice}`
  if (end < source.length) slice = `${slice}…`
  return slice
}

function seekHref(item) {
  const path = item.id ? `${item.file}#${item.id}` : item.file
  return new URL(path, siteRoot).href
}

function bindRailSeek() {
  const rail = document.querySelector('.child-rail')
  const nav = rail?.querySelector(':scope > nav')
  const section = currentSection()
  if (!rail || !nav || !section) return
  if (rail.querySelector('.rail-seek')) return

  const box = document.createElement('div')
  box.className = 'rail-seek'
  const field = document.createElement('input')
  field.type = 'search'
  field.placeholder = section === 'guide' ? 'Search docs…' : 'Search reference…'
  field.autocomplete = 'off'
  field.spellcheck = false
  field.setAttribute('aria-label', field.placeholder)
  field.setAttribute('aria-autocomplete', 'list')
  field.setAttribute('aria-expanded', 'false')
  field.setAttribute('aria-controls', 'rail-seek-menu')
  field.setAttribute('role', 'combobox')

  const menu = document.createElement('ul')
  menu.id = 'rail-seek-menu'
  menu.className = 'rail-seek-menu'
  menu.hidden = true
  menu.setAttribute('role', 'listbox')

  box.append(field, menu)

  const home = rail.querySelector(':scope > .rail-home')
  if (home) home.after(box)
  else nav.before(box)

  let hits = []
  let active = -1

  const closeMenu = () => {
    menu.hidden = true
    menu.innerHTML = ''
    hits = []
    active = -1
    field.setAttribute('aria-expanded', 'false')
    field.removeAttribute('aria-activedescendant')
  }

  const go = (item) => {
    if (!item) return
    closeMenu()
    field.value = ''
    location.href = seekHref(item)
  }

  const paintActive = () => {
    ;[...menu.children].forEach((node, index) => {
      node.classList.toggle('is-active', index === active)
      if (index === active) field.setAttribute('aria-activedescendant', node.id)
    })
  }

  const paintMenu = (query) => {
    const needle = normalizeSeek(query).toLowerCase()
    if (!needle) {
      closeMenu()
      return
    }

    const catalog = (sectionSeekCatalog || []).filter((item) => item.section === section)
    hits = catalog
      .map((item) => ({ item, score: scoreSeekHit(item, needle) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 10)
      .map((entry) => entry.item)

    if (!hits.length) {
      menu.hidden = false
      menu.innerHTML = '<li class="rail-seek-empty" role="presentation">No matching pages</li>'
      field.setAttribute('aria-expanded', 'true')
      active = -1
      return
    }

    menu.hidden = false
    field.setAttribute('aria-expanded', 'true')
    menu.innerHTML = hits
      .map((item, index) => {
        const snippet = seekSnippet(item, needle)
        const hint = snippet || (item.kind === 'page' ? 'Page' : item.page)
        return `<li id="rail-seek-opt-${index}" role="option"><a href="${seekHref(item)}"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(hint)}</small></a></li>`
      })
      .join('')
    active = 0
    paintActive()
  }

  const indexFromRail = () =>
    [...rail.querySelectorAll('a[href]')].map((link) => {
      const url = new URL(link.getAttribute('href'), location.href)
      const file = `${section}/${url.pathname.split('/').pop()}`
      const title = link.textContent.trim()
      return {
        section,
        file,
        id: url.hash.replace('#', ''),
        title,
        page: title,
        kind: url.hash ? 'heading' : 'page',
        text: title
      }
    })

  loadSectionSeek()
    .then(() => {
      if (field.value.trim()) paintMenu(field.value)
    })
    .catch(() => {
      sectionSeekCatalog = indexFromRail()
      if (field.value.trim()) paintMenu(field.value)
    })

  field.addEventListener('input', () => {
    if (!sectionSeekCatalog) return
    paintMenu(field.value)
  })
  field.addEventListener('focus', () => {
    if (sectionSeekCatalog && field.value.trim()) paintMenu(field.value)
  })
  field.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu()
      field.blur()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!hits.length) return
      active = (active + 1) % hits.length
      paintActive()
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!hits.length) return
      active = (active - 1 + hits.length) % hits.length
      paintActive()
      return
    }
    if (event.key === 'Enter') {
      if (menu.hidden || active < 0) return
      event.preventDefault()
      go(hits[active])
    }
  })

  menu.addEventListener('mousedown', (event) => {
    const option = event.target.closest('[role="option"]')
    if (!option) return
    event.preventDefault()
    const index = [...menu.children].indexOf(option)
    go(hits[index])
  })

  document.addEventListener('click', (event) => {
    if (!box.contains(event.target)) closeMenu()
  })
}

function markRailHere() {
  const file = currentFileName()
  const home = document.querySelector('.rail-home')
  const links = [...document.querySelectorAll('.child-rail a[href]')]
  document.querySelectorAll('.rail-branch').forEach((branch) => {
    branch.classList.remove('is-current')
  })
  links.forEach((node) => node.classList.remove('is-here', 'is-open'))
  home?.classList.remove('is-current')

  if (home && linkFile(home) === file) {
    home.classList.add('is-current')
    keepRailLinkInView(home)
    return
  }

  const samePage = links.filter((link) => linkFile(link) === file)
  const pageLink = samePage.find((link) => !linkHash(link)) || samePage[0]
  if (!pageLink) return

  const branch = pageLink.closest('.rail-branch')
  if (!branch) return
  branch.classList.add('is-current')
  pageLink.classList.add('is-open')
  closeSiblingLevels(branch, 'rail-branch')
  spreadNode(branch)

  const hash = location.hash
  const hashLink = hash ? samePage.find((link) => linkHash(link) === hash) : null
  const twig = hashLink?.closest('.rail-twig')
  if (twig) {
    closeSiblingLevels(twig, 'rail-twig')
    spreadNode(twig)
    hashLink.classList.add('is-here')
  }
  keepRailLinkInView(hashLink || pageLink)
}

function spyRailScroll() {
  const rail = document.querySelector('.child-rail')
  if (!rail) return
  const file = currentFileName()
  const hashLinks = [...rail.querySelectorAll('a[href]')].filter(
    (link) => linkFile(link) === file && linkHash(link)
  )
  const pairs = hashLinks
    .map((link) => {
      const id = decodeURIComponent(linkHash(link).slice(1))
      const head = document.getElementById(id)
      return head ? { link, head } : null
    })
    .filter(Boolean)
  if (!pairs.length) return

  let active = null
  const update = () => {
    const line = window.scrollY + 130
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8
    let current = atBottom ? pairs[pairs.length - 1] : pairs[0]
    if (!atBottom) {
      for (const pair of pairs) {
        if (pair.head.getBoundingClientRect().top + window.scrollY <= line) current = pair
      }
    }
    const twig = current.link.closest('.rail-twig')
    const visible =
      twig && !twig.classList.contains('is-spread') && current.link.closest('.rail-buds')
        ? twig.querySelector(':scope > .rail-row > a, :scope > a')
        : current.link
    if (visible === active) return
    active = visible
    hashLinks.forEach((node) => node.classList.remove('is-here'))
    visible?.classList.add('is-here')
    keepRailLinkInView(visible)
  }

  let frame = 0
  window.addEventListener(
    'scroll',
    () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        update()
      })
    },
    { passive: true }
  )
  update()
}

function highlightMarginalia() {
  const aboutLinks = [...document.querySelectorAll('.marginalia-strip a[href^="#"]')]
  if (!aboutLinks.length) return
  const heads = aboutLinks
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter(Boolean)
  const watcher = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        aboutLinks.forEach((node) => node.classList.remove('is-here'))
        const active = aboutLinks.find((link) => link.hash.slice(1) === entry.target.id)
        active?.classList.add('is-here')
      })
    },
    { rootMargin: '-20% 0px -70% 0px' }
  )
  heads.forEach((head) => watcher.observe(head))
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
    tick += 0.012
    window.requestAnimationFrame(draw)
  }
  draw()
}

function pulseCommunityCanvas() {
  const canvas = document.getElementById('community-pulse')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const nodes = [
    { a: 0.08, r: 0.34 },
    { a: 0.26, r: 0.4 },
    { a: 0.47, r: 0.3 },
    { a: 0.66, r: 0.38 },
    { a: 0.84, r: 0.28 },
    { a: 0.97, r: 0.36 }
  ]
  const links = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 0],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 5]
  ]
  let tick = 0
  const draw = () => {
    const box = canvas.parentElement.getBoundingClientRect()
    const width = Math.max(1, box.width)
    const height = Math.max(240, box.height)
    const ratio = window.devicePixelRatio || 1
    canvas.width = width * ratio
    canvas.height = height * ratio
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.clearRect(0, 0, width, height)
    const cx = width * 0.5
    const cy = height * 0.52
    const scale = Math.min(width, height) * 0.4
    const pts = nodes.map((node, i) => {
      const drift = quiet ? 0 : Math.sin(tick * 0.9 + i * 0.8) * 7
      const ang = node.a * Math.PI * 2 + (quiet ? 0 : tick * 0.11)
      return {
        x: cx + Math.cos(ang) * (node.r * scale * 2.15 + drift),
        y: cy + Math.sin(ang) * (node.r * scale * 1.55 + drift * 0.55)
      }
    })
    ctx.lineCap = 'round'
    links.forEach(([a, b], i) => {
      const g = ctx.createLinearGradient(pts[a].x, pts[a].y, pts[b].x, pts[b].y)
      g.addColorStop(0, 'rgba(24, 228, 225, 0.7)')
      g.addColorStop(1, 'rgba(121, 133, 230, 0.7)')
      ctx.strokeStyle = g
      ctx.globalAlpha = 0.35 + Math.sin(tick * 1.1 + i) * 0.12
      ctx.lineWidth = 1.4
      ctx.beginPath()
      ctx.moveTo(pts[a].x, pts[a].y)
      ctx.lineTo(pts[b].x, pts[b].y)
      ctx.stroke()
    })
    ctx.globalAlpha = 1
    pts.forEach((pt, i) => {
      const pulse = quiet ? 5 : 4.2 + Math.sin(tick * 1.6 + i) * 1.5
      ctx.beginPath()
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.arc(pt.x, pt.y, pulse + 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.fillStyle = i % 2 ? '#7985e6' : '#18e4e1'
      ctx.arc(pt.x, pt.y, pulse, 0, Math.PI * 2)
      ctx.fill()
    })
    if (!quiet) {
      tick += 0.016
      window.requestAnimationFrame(draw)
    }
  }
  draw()
}

function playAboutLockup() {
  const lockup = document.querySelector('.about-lockup')
  const wrap = document.querySelector('.about-mark-wrap')
  const mark = document.querySelector('.about-mark-face')
  const tracer = document.querySelector('.about-tracer')
  const clip = document.querySelector('.about-word-clip')
  const word = document.querySelector('.about-word-mark')
  const letterNodes = [...document.querySelectorAll('.about-letter')]
  const caret = document.querySelector('.about-caret-bar')
  if (!lockup || !wrap || !mark || !tracer || !clip || !word || !letterNodes.length) return

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))
  const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (quiet) {
    lockup.classList.add('is-rest')
    return
  }

  letterNodes.forEach((node) => node.classList.add('is-on'))
  clip.style.transition = 'none'
  clip.style.width = `${word.getBoundingClientRect().width}px`
  const clipLeft = clip.getBoundingClientRect().left
  const stops = letterNodes.map((node) => node.getBoundingClientRect().right - clipLeft + 18)
  letterNodes.forEach((node) => node.classList.remove('is-on'))
  clip.style.width = '0px'
  void clip.offsetWidth
  clip.style.transition = ''

  const showLetters = (count) => {
    letterNodes.forEach((node, i) => node.classList.toggle('is-on', i < count))
    clip.style.width = count <= 0 ? '0px' : `${stops[count - 1]}px`
    if (!caret) return
    if (count <= 0) {
      const first = letterNodes[0].getBBox()
      caret.setAttribute('x', String(first.x - 10))
      caret.setAttribute('y', String(first.y))
      caret.setAttribute('height', String(first.height))
      return
    }
    const box = letterNodes[count - 1].getBBox()
    caret.setAttribute('x', String(box.x + box.width + 8))
    caret.setAttribute('y', String(box.y))
    caret.setAttribute('height', String(box.height))
  }

  const sparkMark = async () => {
    const spark = wrap.querySelector('.about-mark-spark')
    showLetters(0)
    clip.style.width = `${stops[0]}px`
    if (caret) {
      caret.style.animation = 'none'
      caret.style.opacity = '1'
    }
    void clip.offsetWidth
    const caretBox = caret.getBoundingClientRect()
    const wrapBox = wrap.getBoundingClientRect()
    const markBox = mark.getBoundingClientRect()
    const barW = Math.max(3, caretBox.width)
    const barH = Math.max(18, caretBox.height)
    const caretCx = caretBox.left + caretBox.width / 2
    const caretCy = caretBox.top + caretBox.height / 2
    const ease = 'cubic-bezier(0.22, 1, 0.36, 1)'
    const dot = 10

    tracer.style.transition = 'none'
    tracer.style.width = `${barW}px`
    tracer.style.height = `${barH}px`
    tracer.style.borderRadius = '1px'
    tracer.style.transform = 'none'
    tracer.style.left = `${caretCx - wrapBox.left - barW / 2}px`
    tracer.style.top = `${caretCy - wrapBox.top - barH / 2}px`
    tracer.style.opacity = '1'
    tracer.classList.add('is-on')
    void tracer.offsetWidth
    lockup.classList.add('is-orbiting')
    lockup.classList.remove('is-typing', 'is-erasing')
    clip.style.width = '0px'

    tracer.style.transition = `width 0.32s ${ease}, height 0.32s ${ease}, border-radius 0.32s ${ease}, left 0.32s ${ease}, top 0.32s ${ease}`
    tracer.classList.add('is-round')
    tracer.style.borderRadius = '50%'
    tracer.style.width = `${dot}px`
    tracer.style.height = `${dot}px`
    tracer.style.left = `${caretCx - wrapBox.left - dot / 2}px`
    tracer.style.top = `${caretCy - wrapBox.top - dot / 2}px`
    await wait(340)

    const node = 6
    const rootX = markBox.left - wrapBox.left + markBox.width * 0.495 - node / 2
    const rootY = markBox.top - wrapBox.top + markBox.height * 0.893 - node / 2
    tracer.style.transition = `left 0.55s ${ease}, top 0.55s ${ease}, width 0.55s ${ease}, height 0.55s ${ease}`
    tracer.style.width = `${node}px`
    tracer.style.height = `${node}px`
    tracer.style.left = `${rootX}px`
    tracer.style.top = `${rootY}px`
    await wait(560)

    tracer.style.transition = `transform 0.28s ${ease}, opacity 0.28s ease`
    tracer.style.transform = 'scale(0.2)'
    tracer.style.opacity = '0'
    await wait(220)
    if (spark) {
      spark.classList.remove('is-lit')
      void spark.offsetWidth
      spark.classList.add('is-lit')
    }
    await wait(1150)
    tracer.classList.remove('is-on', 'is-round')
    tracer.style.transform = ''
    tracer.style.opacity = ''
    tracer.style.borderRadius = ''
    if (spark) spark.classList.remove('is-lit')
    lockup.classList.remove('is-orbiting')
    lockup.classList.add('is-rest')
  }

  const run = async () => {
    lockup.classList.add('is-typing')
    showLetters(0)
    void clip.offsetWidth
    for (let i = 1; i <= letterNodes.length; i += 1) {
      showLetters(i)
      await wait(150)
    }
    await wait(640)
    lockup.classList.add('is-erasing')
    for (let i = letterNodes.length - 1; i >= 1; i -= 1) {
      showLetters(i)
      await wait(150)
    }
    await wait(120)
    await sparkMark()
  }
  run()
}

function bindCastPhotos() {
  document.querySelectorAll('.cast-photo img').forEach((img) => {
    const frame = img.closest('.cast-photo')
    if (!frame) return
    const show = () => frame.classList.add('has-pic')
    const miss = () => {
      img.remove()
      frame.classList.add('is-empty')
    }
    if (img.complete) {
      if (img.naturalWidth > 0) show()
      else miss()
    }
    img.addEventListener('load', show)
    img.addEventListener('error', miss)
  })
}

function bindPlaza() {
  const chips = [...document.querySelectorAll('[data-plaza-filter]')]
  const cards = [...document.querySelectorAll('[data-plaza-tag]')]
  const empty = document.querySelector('[data-plaza-empty]')
  if (!chips.length || !cards.length) return

  const apply = (key) => {
    chips.forEach((node) => {
      const on = node.getAttribute('data-plaza-filter') === key
      node.classList.toggle('is-awake', on)
      node.setAttribute('aria-pressed', String(on))
    })
    cards.forEach((card) => {
      const show = key === 'all' || card.getAttribute('data-plaza-tag') === key
      card.classList.toggle('is-away', !show)
      if (show) card.removeAttribute('aria-hidden')
      else card.setAttribute('aria-hidden', 'true')
    })
    if (empty) {
      empty.hidden = cards.some((card) => !card.classList.contains('is-away'))
    }
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      apply(chip.getAttribute('data-plaza-filter') || 'all')
    })
  })
}

bindAbilityUi()
