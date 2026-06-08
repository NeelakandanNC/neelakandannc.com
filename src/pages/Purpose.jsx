import Reveal from '../components/Reveal.jsx';
import RevealText from '../components/RevealText.jsx';
import './pages.css';

const ventures = [
  { name: 'Agentronics', status: 'active', label: 'Active', desc: 'Autonomous AI agents meet electronics — agentic systems that reason about hardware, sensors, and the physical world.', lesson: 'The next frontier is agents that touch atoms, not just bits.' },
  { name: 'repoforthat.dev', status: 'closed', label: 'Closed', link: 'https://repoforthat.dev', desc: 'A platform to discover the right repo for any problem. Shipped the curation engine and dev tooling, then sunset to refocus.', lesson: 'Build what you wish existed — and know when to close the chapter.' },
  { name: 'Ween', status: 'paused', label: 'Stopped', desc: 'MVP ready, launch planned. The product was taking shape but is currently stopped.', lesson: "Ship it. Iterate. Don't wait for perfect." },
  { name: 'Arthhive', status: 'paused', label: 'Stopped · 9 mo', desc: 'Worked on it for nine months. Paused due to time and competing priorities.', lesson: 'Time is the scarcest resource. Choose your battles wisely.' },
  { name: 'LumoScript', status: 'paused', label: 'Early', desc: 'A new venture in its earliest stages. No clients yet — but the foundation is being laid.', lesson: 'Every big thing starts small. The key is to start.' },
  { name: 'Flaura', status: 'paused', label: 'Paused', desc: 'Beta tested and built a deck. Stopped due to lack of funds and an innovation gap I could not bridge then.', lesson: 'Timing and capital matter as much as the idea.' },
  { name: 'MediPro Solutions', status: 'learned', label: 'NABH Agency', link: 'https://1mediprosolutions.wixsite.com/medi-pro-solutions', desc: 'An agency helping hospitals obtain NABH certification. Built operations, outreach, and the service model from scratch.', lesson: 'B2B services need deep domain expertise and trust built over time.' },
  { name: 'ModernClother', status: 'learned', label: 'Lesson', desc: 'First e-commerce venture selling apparel online. Pricing was too high and I had no grasp of sales and marketing yet.', lesson: 'Distribution and pricing beat the product itself.' },
  { name: 'SciTech Knowledge', status: 'learned', label: 'Foundation', desc: 'Self-taught across science and technology through YouTube — the base of knowledge that fuels everything after.', lesson: 'Self-education is the most powerful investment you can make.' },
];

export default function Purpose() {
  return (
    <div className="page container">
      <header className="page-head">
        <span className="eyebrow">Purpose — Builder Log · 9 ventures · 1 active</span>
        <RevealText as="h1" className="display display--xl" text="Built on purpose." />
        <Reveal delay={0.2}>
          <p className="lede page-head__lede">
            Every venture is a lesson. Every failure is data. A working log of what I've built and
            why — the journey, unredacted.
          </p>
        </Reveal>
      </header>

      <div className="venture-list">
        {ventures.map((v, i) => (
          <Reveal key={v.name} delay={(i % 3) * 0.05}>
            <article className="venture">
              <span className="venture__idx">{String(i + 1).padStart(2, '0')}</span>
              <div className="venture__head">
                <span className={`chip chip--${v.status}`}>{v.label}</span>
                <h3 className="venture__name">
                  {v.link ? (
                    <a href={v.link} target="_blank" rel="noopener noreferrer">
                      {v.name} <span className="venture__ext">↗</span>
                    </a>
                  ) : (
                    v.name
                  )}
                </h3>
              </div>
              <div className="venture__detail">
                <p className="venture__desc text-dim">{v.desc}</p>
                <p className="venture__lesson">{v.lesson}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
