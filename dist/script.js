const projects = {
  playbooks: {
    meta: 'ADA / PLAYBOOKS V2 / 2026 / TECHNICAL LEAD', title: 'Faster AI workflows',
    intro: 'Faster, more predictable workflow execution by moving fixed steps into code. I led the architecture, hands-on implementation, and cross-functional delivery through launch.',
    sections: [
      ['The problem', 'Customer-service workflows need both flexibility and precision. An AI agent has to understand what a customer needs while carrying out the right steps reliably.'],
      ['My contribution', 'I led the technical design and implementation of the Playbooks V2 execution engine. I began as the architect and hands-on builder, then led a cross-functional team as the project grew. My work also extended into the workflow editor and production observability.'],
      ['The approach', 'Make explicit workflow steps predictable, and use model reasoning where flexibility adds value. Bring the execution engine, authoring experience, and operational visibility together as one product.'],
      ['What shipped', 'A rebuilt workflow system released to customers, spanning execution, editor capabilities, and monitoring. I built and owned Linked Playbooks end to end, from the hackathon prototype through production launch, enabling businesses to reuse workflows.']
    ]
  },
  reasoner: {
    meta: 'ADA / UNIFIED REASONER V2 / 2026', title: 'More efficient AI decisions',
    intro: 'Lower model costs and better independent resolution in evaluation. I architected the initial rewrite, built the first implementation, and led the team through delivery. Currently rolling out in production.',
    sections: [
      ['The problem', 'As an AI agent takes on more responsibilities, its reasoning system needs to remain understandable, efficient, and adaptable. Changes also have to work alongside the capabilities customers already rely on.'],
      ['My contribution', 'I initiated the architecture and implementation, then led a small engineering team through the rewrite. I remain hands-on as the team rolls the new engine out in production.'],
      ['The approach', 'Move toward focused reasoning components with clearer responsibilities. Balance model cost, response quality, and control, and evaluate behavior against the existing production system.'],
      ['Production scope', 'The engine is currently being rolled out in production. The work includes compatibility with existing agent capabilities, evaluation, and decisions about when the agent should continue helping or hand a conversation to a person.']
    ]
  },
  kabby: {
    "meta": "KABBY / 2023–2025 / COFOUNDER & LEAD ENGINEER",
    "title": "From idea to 3,000+ users.",
    "intro": "I co-founded Kabby and owned engineering across its mobile app and backend, taking a local rideshare product through launch on iOS and Android.",
    "facts": [
        [
            "Users reached",
            "3,000+"
        ],
        [
            "Platforms",
            "iOS & Android"
        ],
        [
            "Ownership",
            "Mobile + backend"
        ]
    ],
    "scope": [
        [
            "Rider experience",
            "React Native mobile app for iOS and Android."
        ],
        [
            "Ride operations",
            "Ride matching, driver allocation, and real-time updates."
        ],
        [
            "Platform & payments",
            "Node.js, GraphQL, MongoDB, Redis, GCP, and Stripe."
        ]
    ],
    "sections": [
        [
            "The opportunity",
            "Build a local rideshare experience for St. John’s, Newfoundland, and take responsibility for the whole product from its first implementation through launch."
        ],
        [
            "What I owned",
            "As cofounder and lead engineer, I built the React Native mobile app and designed and implemented the backend. My scope covered ride matching, driver allocation, payments, and the services needed to support a live ride."
        ],
        [
            "Connecting the experience",
            "The mobile app, matching logic, real-time ride updates, and payments had to work together as one service. I owned the engineering across those boundaries and improved ride matching and driver allocation to help fulfill requests more efficiently."
        ],
        [
            "The result",
            "Kabby launched on the App Store and Google Play and grew to 3,000+ users. This work brought together product decisions, architecture, implementation, and the responsibility of shipping a service for a local market."
        ]
    ],
    "links": [
        [
            "2024 provincial licence announcement",
            "https://www.gov.nl.ca/releases/2024/dgsnl/0509n01/"
        ],
        [
            "Launch coverage in VOCM",
            "https://vocm.com/2024/05/09/kabby-app-ride-share/"
        ]
    ]
},
  answers: {
    meta: 'ADA / 2026 / AI KNOWLEDGE SYSTEMS', title: 'Answer compilation',
    intro: 'Turning help-center content into concise answers an AI agent can use. Currently rolling out in production.',
    sections: [
      ['The problem', 'Help-center articles can be long, even when a customer asks a simple, repeatable question. Retrieving and processing the full article on every request adds response time and inference cost, and can lead to unnecessarily long answers. The agent needs concise, source-grounded answers it can retrieve directly.'],
      ['My contribution', 'I built the compiler that transforms help articles into answer units and worked on the retrieval and evaluation around that process.'],
      ['The approach', 'Pair content transformation with source-grounded quality checks. Evaluate whether the compiled answer is supported by the article, and examine retrieval quality separately from downstream agent outcomes.'],
      ['Rollout status', 'Answer compilation is currently rolling out in the product. The work brings together content transformation, retrieval, and source-grounded evaluation in a production knowledge pipeline.']
    ]
  }
};
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const closingDialogs = new WeakMap();
function closeDialog(target) {
  if (!target.open) return Promise.resolve();
  if (closingDialogs.has(target)) return closingDialogs.get(target);
  if (motionPreference.matches) {
    target.close();
    return Promise.resolve();
  }
  const closing = new Promise(resolve => {
    let finished = false;
    let fallback;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(fallback);
      target.removeEventListener('animationend', onEnd);
      target.classList.remove('is-closing');
      target.close();
      closingDialogs.delete(target);
      resolve();
    };
    const onEnd = event => {
      if (event.target === target && event.animationName === 'dialog-depart') finish();
    };
    target.addEventListener('animationend', onEnd);
    target.classList.add('is-closing');
    fallback = setTimeout(finish, 220);
  });
  closingDialogs.set(target, closing);
  return closing;
}
const dialog = document.querySelector('#project-dialog');
let lastOpener;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const p = projects[button.dataset.project];
  lastOpener = button;
  document.querySelector('#dialog-meta').textContent = p.meta;
  document.querySelector('#dialog-title').textContent = p.title;
  document.querySelector('#dialog-intro').textContent = p.intro;
  const body = document.querySelector('#dialog-body');
  body.replaceChildren(...p.sections.map(([title, copy]) => {
    const section = document.createElement('section');
    const h = document.createElement('h3'); h.textContent = title;
    const paragraph = document.createElement('p'); paragraph.textContent = copy;
    section.append(h, paragraph); return section;
  }));
  if (p.facts) {
    const facts = document.createElement('dl'); facts.className = 'case-facts';
    p.facts.forEach(([label, value]) => {
      const item = document.createElement('div');
      const term = document.createElement('dt'); term.textContent = label;
      const detail = document.createElement('dd'); detail.textContent = value;
      item.append(term, detail); facts.append(item);
    });
    body.prepend(facts);
  }
  if (p.scope) {
    const section = document.createElement('section'); section.className = 'case-scope';
    const heading = document.createElement('h3'); heading.textContent = 'My build scope';
    const items = document.createElement('div'); items.className = 'scope-grid';
    p.scope.forEach(([title, copy]) => {
      const item = document.createElement('div');
      const label = document.createElement('strong'); label.textContent = title;
      const description = document.createElement('p'); description.textContent = copy;
      item.append(label, description); items.append(item);
    });
    section.append(heading, items); body.append(section);
  }
  if (p.links) {
    const section = document.createElement('section'); section.className = 'case-evidence';
    const heading = document.createElement('h3'); heading.textContent = 'Public launch records';
    section.append(heading);
    p.links.forEach(([label, url]) => {
      const link = document.createElement('a'); link.textContent = label;
      link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
      section.append(link);
    });
    body.append(section);
  }
  dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0;
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(dialog));
dialog.addEventListener('click', event => { if (event.target === dialog) { const box=dialog.getBoundingClientRect(); if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) closeDialog(dialog); } });
dialog.addEventListener('close', () => {
  if (document.querySelector('dialog[open]')) return;
  document.body.classList.remove('modal-open');
  lastOpener?.focus();
});

const contactDialog = document.querySelector('#contact-dialog');
let contactOpener;
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', async () => {
  if (contactDialog.open) return;
  const opener = dialog.contains(button) ? lastOpener : button;
  if (dialog.open) await closeDialog(dialog);
  if (contactDialog.open) return;
  contactOpener = opener;
  contactDialog.showModal();
  document.body.classList.add('modal-open');
}));
contactDialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(contactDialog));
contactDialog.addEventListener('click', event => {
  if (event.target !== contactDialog) return;
  const box = contactDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(contactDialog);
});
contactDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  contactOpener?.focus();
});

[dialog, contactDialog].forEach(panel => panel.addEventListener('cancel', event => {
  event.preventDefault();
  closeDialog(panel);
}));

// Enhance entrances without hiding content when scripts or motion are unavailable.
if ('IntersectionObserver' in window && !motionPreference.matches) {
  const entranceObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (!motionPreference.matches && !entry.target.contains(document.activeElement)) {
        entry.target.classList.add('motion-in');
      }
      entranceObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll([
    '.hero h1', '.hero-bottom', '.section-heading', '.project', '.more-work',
    '.about-grid > div', '.timeline-row', '.toolbox', '.contact-top',
    '.contact h2', '.contact-bottom'
  ].join(',')).forEach(element => entranceObserver.observe(element));
}

// One short illustration sequence per hover or keyboard-focus entry.
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.project-open').forEach(button => {
  if (!button.querySelector('.flow-art, .kabby-art')) return;
  const activateArtwork = () => {
    if (motionPreference.matches || button.classList.contains('artwork-active')) return;
    button.classList.add('artwork-active');
    const marker = button.querySelector('.route-marker');
    const journey = marker?.querySelector('animateMotion');
    if (typeof journey?.beginElement === 'function') {
      marker.classList.add('marker-running');
      journey.beginElement();
    }
    setTimeout(() => {
      button.classList.remove('artwork-active');
      marker?.classList.remove('marker-running');
    }, 1500);
  };
  button.addEventListener('pointerenter', () => {
    if (finePointer.matches) activateArtwork();
  });
  button.addEventListener('focusin', () => {
    if (button.matches(':focus-visible')) activateArtwork();
  });
});

// Tie only decorative artwork to scrolling; text and layout remain stationary.
const readingProgress = document.querySelector('.reading-progress');
const mobileViewport = window.matchMedia('(max-width: 700px)');
const scrollingArtwork = [...document.querySelectorAll('.flow-art, .orbit-art, .kabby-art > svg')]
  .map(illustration => ({ illustration, frame: illustration.closest('.project-art, .kabby-art') }));
let scrollFrame = 0;
function updateScrollEffects() {
  scrollFrame = 0;
  if (motionPreference.matches) return;
  const viewportHeight = window.innerHeight;
  const scrollableHeight = document.documentElement.scrollHeight - viewportHeight;
  const progress = scrollableHeight > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollableHeight)) : 0;
  readingProgress.style.transform = `scaleX(${progress})`;
  const maxDrift = mobileViewport.matches ? 8 : 12;
  const positions = scrollingArtwork.map(({ illustration, frame }) => {
    const box = frame.getBoundingClientRect();
    if (box.bottom < 0 || box.top > viewportHeight) return null;
    const travel = (viewportHeight / 2 - box.top - box.height / 2) / ((viewportHeight + box.height) / 2);
    return { illustration, drift: Math.max(-1, Math.min(1, travel)) * maxDrift };
  });
  positions.forEach(position => {
    if (position) position.illustration.style.setProperty('--scroll-drift', `${position.drift.toFixed(2)}px`);
  });
}
function requestScrollUpdate() {
  if (!motionPreference.matches && !scrollFrame) scrollFrame = requestAnimationFrame(updateScrollEffects);
}
window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate, { passive: true });
window.addEventListener('load', requestScrollUpdate, { once: true });
document.fonts?.ready.then(requestScrollUpdate);
motionPreference.addEventListener('change', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = 0;
  if (motionPreference.matches) {
    readingProgress.style.transform = 'scaleX(0)';
    scrollingArtwork.forEach(({ illustration }) => illustration.style.removeProperty('--scroll-drift'));
  } else requestScrollUpdate();
});
requestScrollUpdate();
