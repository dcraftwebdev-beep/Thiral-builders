import Reveal from '../../../../components/Reveal/Reveal.jsx';
import DimensionRule from '../../../../components/DimensionRule/DimensionRule.jsx';
import styles from './Process.module.css';

const STEPS = [
  {
    n: '01',
    name: 'Listen & measure',
    copy: 'Site visits, surveys and a long conversation about how you live, work and move.',
  },
  {
    n: '02',
    name: 'Sketch & test',
    copy: 'Concept options on paper and in model — light studies, massing and material trials.',
  },
  {
    n: '03',
    name: 'Draw & detail',
    copy: 'Technical drawings, joinery details and specifications ready for tender and approval.',
  },
  {
    n: '04',
    name: 'Build & refine',
    copy: 'On-site supervision through to handover, with snagging and a one-year review.',
  },
];

export default function Process() {
  return (
    <section className={styles.process} id="process">
      <div className="container">
        <DimensionRule label="05 — Process" />
        <Reveal>
          <h2 className={styles.title}>Four steps, in order</h2>
        </Reveal>
        <div className={styles.grid}>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <article className={styles.step}>
                <span className={styles.num}>{s.n}</span>
                <h3 className={styles.name}>{s.name}</h3>
                <p className={styles.copy}>{s.copy}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
