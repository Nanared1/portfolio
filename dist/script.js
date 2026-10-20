const projects = {
  playbooks: {
    meta: 'ADA / 2026 / TECHNICAL LEAD', title: 'Playbooks V2',
    intro: 'A ground-up rebuild of how an AI agent executes business workflows.',
    sections: [
      ['The problem', 'Customer-service workflows need both flexibility and precision. An AI agent has to understand what a customer needs while carrying out the right steps reliably.'],
      ['My contribution', 'I led the technical design and implementation of the Playbooks V2 execution engine. I began as the architect and hands-on builder, then led a cross-functional team as the project grew. My work also extended into the workflow editor and production observability.'],
      ['The approach', 'Make explicit workflow steps predictable, and use model reasoning where flexibility adds value. Bring the execution engine, authoring experience, and operational visibility together as one product.'],
      ['What shipped', 'A rebuilt workflow system released to customers, spanning execution, editor capabilities, and monitoring. I built and owned Linked Playbooks end to end, from the hackathon prototype through production launch, enabling businesses to reuse workflows.']
    ]
  },
  reasoner: {
    meta: 'ADA / 2026 / ARCHITECTURE & TECHNICAL LEADERSHIP', title: 'Unified Reasoner V2',
    intro: 'Architected and led a rewrite of the engine that decides what an AI customer-service agent says and does. Currently rolling out in production.',
    sections: [
      ['The problem', 'As an AI agent takes on more responsibilities, its reasoning system needs to remain understandable, efficient, and adaptable. Changes also have to work alongside the capabilities customers already rely on.'],
      ['My contribution', 'I initiated the architecture and implementation, then led a small engineering team through the rewrite. I remain hands-on as the team rolls the new engine out in production.'],
      ['The approach', 'Move toward focused reasoning components with clearer responsibilities. Balance model cost, response quality, and control, and evaluate behavior against the existing production system.'],
      ['Production scope', 'The engine is currently being rolled out in production. The work includes compatibility with existing agent capabilities, evaluation, and decisions about when the agent should continue helping or hand a conversation to a person.']
    ]
  },
  kabby: {
    meta: 'KABBY / 2023—2025 / COFOUNDER & LEAD ENGINEER', title: 'A product for a city.',
    intro: 'Co-founding and building a rideshare platform in St. John’s, Newfoundland.',
    sections: [
      ['The opportunity', 'Build a rideshare experience for a local market, and take responsibility for the whole product rather than a single feature.'],
      ['My contribution', 'As cofounder and lead engineer, I built the React Native mobile app and designed the backend. The platform brought together ride matching, driver allocation, payments, and the infrastructure needed to run the service.'],
      ['The stack', 'React Native, Node.js, TypeScript, GraphQL, MongoDB, Redis, GCP, and Stripe.'],
      ['What shipped', 'A product launched on the App Store and Google Play. The work gave me direct experience with the technical and product decisions involved in taking a company from idea to a live service.']
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
  dialog.showModal(); document.body.classList.add('modal-open'); dialog.scrollTop = 0;
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const box=dialog.getBoundingClientRect(); if(event.clientX<box.left || event.clientX>box.right || event.clientY<box.top || event.clientY>box.bottom) dialog.close(); } });
dialog.addEventListener('close', () => {
  if (document.querySelector('dialog[open]')) return;
  document.body.classList.remove('modal-open');
  lastOpener?.focus();
});

const contactDialog = document.querySelector('#contact-dialog');
let contactOpener;
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
  contactOpener = dialog.contains(button) ? lastOpener : button;
  if (dialog.open) dialog.close();
  contactDialog.showModal();
  document.body.classList.add('modal-open');
}));
contactDialog.querySelector('.dialog-close').addEventListener('click', () => contactDialog.close());
contactDialog.addEventListener('click', event => {
  if (event.target !== contactDialog) return;
  const box = contactDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) contactDialog.close();
});
contactDialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  contactOpener?.focus();
});

// Enhance entrances without hiding content when scripts or motion are unavailable.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
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
