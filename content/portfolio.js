export const portfolioFilters = [
  ['all', 'All'],
  ['websites', 'Websites'],
  ['seo', 'SEO'],
  ['paid-ads', 'Paid Ads'],
  ['social-creative', 'Social & Creative']
];

export const projects = [
  {
    slug: 'connected-digital-home',
    title: 'A clearer digital home',
    client: 'Independent design concept',
    status: 'concept',
    category: 'websites',
    categoryLabel: 'Websites',
    description: 'A service-led website concept that turns a broad offer into a calmer, more useful decision path.',
    brief: 'Design a digital home for a considered service with several audiences and no single obvious starting point.',
    audience: 'People comparing specialist services and looking for enough clarity to begin a conversation.',
    role: 'Independent concept: information architecture, messaging direction, visual design and responsive front-end direction.',
    approach: ['Start with the questions a visitor needs answered.', 'Give each service a distinct role in the journey.', 'Use typography, contrast and spacing to make the next step visible.'],
    deliverables: ['Page hierarchy and visitor journey', 'Editorial visual direction', 'Responsive interface concept', 'Enquiry-path and accessibility considerations'],
    service: 'website-design-development',
    artClass: 'project-art-cobalt'
  },
  {
    slug: 'search-with-purpose',
    title: 'Search with purpose',
    client: 'Independent search concept',
    status: 'concept',
    category: 'seo',
    categoryLabel: 'SEO',
    description: 'A search planning concept connecting customer questions, useful pages and an honest measurement plan.',
    brief: 'Show how organic search work can be framed around relevance and useful destinations rather than a list of tactics.',
    audience: 'Teams deciding which search opportunities are worth building into their website and content plan.',
    role: 'Independent concept: search-intent mapping, page planning, content structure and measurement narrative.',
    approach: ['Map a real customer question to a useful page.', 'Make internal links support the next decision.', 'Separate visibility signals from business feedback.'],
    deliverables: ['Search opportunity map', 'Service-page content outline', 'Internal linking direction', 'Measurement definitions and review prompts'],
    service: 'search-engine-optimisation',
    artClass: 'project-art-ink'
  },
  {
    slug: 'campaign-worth-noticing',
    title: 'A campaign worth noticing',
    client: 'Independent creative concept',
    status: 'concept',
    category: 'social-creative',
    categoryLabel: 'Social & Creative',
    description: 'A paid-social concept built around one offer, two creative questions and a destination that keeps its promise.',
    brief: 'Create a campaign system that gives each visual and message variation a clear reason to exist.',
    audience: 'Marketing teams preparing a focused launch or testing a new offer across social channels.',
    role: 'Independent concept: campaign idea, message system, creative directions and landing-page considerations.',
    approach: ['Define the offer before choosing the format.', 'Create variations around a testable question.', 'Carry the strongest message into the destination experience.'],
    deliverables: ['Creative test matrix', 'Message and visual directions', 'Channel adaptation notes', 'Conversion-event checklist'],
    service: 'meta-ads',
    artClass: 'project-art-peach'
  }
];

export const testimonials = [];

export const faqGroups = [
  ['Getting started', [
    ['What should I include in an enquiry?', 'Share what your business does, the priority you are considering, what is currently difficult and any useful timing or budget context. You do not need a finished brief.'],
    ['Can we start with a single service?', 'Yes. A focused project can be the right first step. We will discuss the business priority and confirm what is in scope before work begins.']
  ]],
  ['Services and scope', [
    ['Do you combine services?', 'Often, when the customer journey needs it. The service pages explain the role of each discipline; the proposal sets the exact combination and deliverables.'],
    ['Do you guarantee rankings or advertising results?', 'No. Search visibility, media performance and enquiries depend on the offer, market, budget, website, competition and many other factors.']
  ]],
  ['Pricing and advertising budgets', [
    ['How are projects priced?', 'Pricing follows the agreed scope, complexity, deliverables, review stages and support needs. Advertising budgets and third-party costs are identified separately.'],
    ['Do management fees include ad spend?', 'No. Media spend is paid to the advertising platform and is separate from the work described in a proposal.']
  ]],
  ['Communication and reporting', [
    ['How will we communicate?', 'The proposal names the main contact, review rhythm, approval route and any working sessions needed for the scope.'],
    ['What will reporting include?', 'Reporting should explain what happened, what it means in context and what decision or next action is recommended.']
  ]],
  ['Websites and access', [
    ['Can you work with our current website?', 'Yes. We can review the existing structure, content, technical setup and enquiry path before recommending what to retain or change.'],
    ['Who provides content and access?', 'Responsibilities are confirmed before delivery. This can include website access, brand assets, approved claims, analytics accounts and a named approver.']
  ]],
  ['Measurement and outcomes', [
    ['What does success look like?', 'It depends on the objective. We agree useful signals and business feedback, while documenting limitations instead of treating every click or form submission as an outcome.'],
    ['Can you measure every customer journey?', 'No. Consent choices, browser restrictions, offline activity and multiple devices can create gaps. Measurement should explain those limits.']
  ]]
];
