import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CircleSwitch, PopAlert, Slider, SmoothButton, TopAlert } from '../src';
import '../src/styles.css';
import './styles.css';

const palette = { orange: '#ff8600', blue: '#00c1ff', pink: '#ff00ba', green: '#1e9f46' };

function App() {
  const [color, setColor] = useState(palette.orange);
  const [enabled, setEnabled] = useState(true);
  const [value, setValue] = useState(.1);
  const [notice, setNotice] = useState(false);
  const [noticeKey, setNoticeKey] = useState(0);
  const [modal, setModal] = useState(false);
  const [presses, setPresses] = useState(0);
  const showNotice = () => { setNoticeKey(key => key + 1); setNotice(true); };

  return <>
    <header className="site-header">
      <a className="wordmark" href="#"><span className="brand-mark" />GritUI<span className="version">02</span></a>
      <nav><a href="#components">Components</a><a href="#story">The story</a><a href="https://github.com/soulwinter/GritUI">GitHub <span aria-hidden="true">↗</span></a></nav>
    </header>
    <main>
      <section className="hero">
        <p className="eyebrow"><span className="status-dot" /> FROM CODEA TO REACT</p>
        <h1>A little grit.<br />A lot of <span>play.</span></h1>
        <div className="hero-bottom"><p>Five little components. The same playful motion.<br />A 2018 learning project, finding a new home on the web.</p>
          <a className="text-link" href="#components">Meet the components <span aria-hidden="true">↓</span></a></div>
      </section>
      <section id="components" className="playground">
        <div className="section-heading"><div><p className="eyebrow">THE PLAYGROUND</p><h2>Small details. Big personality.</h2></div>
          <fieldset className="palette"><legend>Accent color</legend>{Object.entries(palette).map(([name, hex]) =>
            <button key={name} aria-label={`Use ${name} accent`} aria-pressed={color === hex} onClick={() => setColor(hex)}
              style={{ background: hex }}><span className="swatch-check">{color === hex ? '✓' : ''}</span></button>)}</fieldset>
        </div>
        <div className="component-grid">
          <article className="component-card button-card">
            <div className="card-caption"><span>01 / SmoothButton</span><span className="tag">PRESS & HOLD</span></div>
            <div className="component-stage"><SmoothButton color={color} onClick={() => setPresses(count => count + 1)}>Hello, world!</SmoothButton></div>
            <div className="card-bottom"><p>A soft pill. A splash of light.</p><output aria-live="polite">{String(presses).padStart(2, '0')} presses</output></div>
          </article>
          <article className="component-card">
            <div className="card-caption"><span>02 / CircleSwitch</span><span className="tag">GIVE IT A TAP</span></div>
            <div className="component-stage"><CircleSwitch checked={enabled} onCheckedChange={setEnabled} color={color} size={45} aria-label="Playground switch" /><span className="switch-label">{enabled ? 'A little more bounce.' : 'Taking a little break.'}</span></div>
            <div className="card-bottom"><p>One circle. Three beats.</p><output>{enabled ? 'ON' : 'OFF'}</output></div>
          </article>
          <article className="component-card slider-card">
            <div className="card-caption"><span>03 / Slider</span><span className="tag">DRAG TO EXPLORE</span></div>
            <div className="component-stage"><Slider aria-label="Playground value" color={color} value={value} onValueChange={setValue} /></div>
            <div className="card-bottom"><p>A track that moves with you.</p><output>{value.toFixed(2)}</output></div>
          </article>
          <article className="component-card alert-card">
            <div className="card-caption"><span>04 / TopAlert</span><span className="tag">LOOK UP</span></div>
            <div className="component-stage"><SmoothButton color={color} fontSize={16} onClick={showNotice}>Say hello ↑</SmoothButton></div>
            <div className="card-bottom"><p>Slides in. Settles down. Slips away.</p><span>400 ms</span></div>
          </article>
          <article className="component-card alert-card">
            <div className="card-caption"><span>05 / PopAlert</span><span className="tag">TAKE CENTER STAGE</span></div>
            <div className="component-stage"><SmoothButton color={color} fontSize={16} onClick={() => setModal(true)}>Open a little window</SmoothButton></div>
            <div className="card-bottom"><p>A familiar entrance, with a tiny bounce.</p><span>500 ms</span></div>
          </article>
          <article className="code-card"><div className="card-caption"><span>THEN → NOW</span><span>Lua / React</span></div>
            <pre><span className="code-comment">-- 2018, on an iPad</span>{'\n'}button = gSmoothButton(...){'\n\n'}<span className="code-comment">// Today, in your browser</span>{'\n'}<span className="code-accent">{'<SmoothButton>'}</span>{'\n  Hello, world!\n'}<span className="code-accent">{'</SmoothButton>'}</span></pre></article>
        </div>
      </section>
      <section className="story" id="story"><p className="eyebrow">A NOTE FROM THE BEGINNING</p><div><h2>Made in 2018.<br />With curiosity, and an iPad.</h2><p>I built GritUI in 2018, when I was first learning to program. I wanted buttons, sliders, and little windows in Codea, so I made my own.</p><p>This React edition carries those first experiments forward: the same shapes, colors, and small animated gestures, in components you can use on the web.</p><a className="text-link" href="https://github.com/soulwinter/GritUI/tree/master/legacy/codea">Explore the Codea roots <span aria-hidden="true">↗</span></a></div></section>
    </main>
    <footer><a className="wordmark" href="#"><span className="brand-mark" />GritUI</a><p>Built with curiosity. Rebuilt with React.</p><span>2018 → today</span></footer>
    <TopAlert key={noticeKey} open={notice} onOpenChange={setNotice} color={color} title="Hello from GritUI!">Same playful entrance. A whole new home.</TopAlert>
    <PopAlert open={modal} onOpenChange={setModal} color={color} title="A little window into 2018"
      actions={[{ label: 'Close' }, { label: 'Say hello', onClick: showNotice }]}>
      It started with a few lines of Lua on an iPad. Some things are worth bringing along.
    </PopAlert>
  </>;
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
