import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Heart, Mail, Music2, Pencil, Sparkles, VolumeX, X } from 'lucide-react';
import { BunnyScene, Envelope, Flower } from './Illustrations';
import { DEFAULT_CONTENT, makeShareUrl, normalizeContent, readContent } from './content';
import type { ProposalContent } from './content';

type ModalKind = 'letter' | 'customize' | 'celebrate' | 'time' | 'secret' | null;

function Dialog({ children, onClose, className = '', title }: { children: ReactNode; onClose: () => void; className?: string; title: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
      dialog?.close();
      previouslyFocused?.focus();
    };
  }, []);
  return <dialog ref={ref} aria-label={title} className={`modal ${className}`} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <button className="modal-close icon-button" aria-label="Close" onClick={onClose}><X size={20} /></button>
    {children}
  </dialog>;
}

function useMusic(onError: (message: string) => void) {
  const [playing, setPlaying] = useState(false);
  const context = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const switching = useRef(false);
  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    void context.current?.close();
    context.current = null;
    setPlaying(false);
  }, []);
  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
    void context.current?.close();
  }, []);
  const toggle = async () => {
    if (switching.current) return;
    if (playing) { stop(); return; }
    switching.current = true;
    try {
      const audio = new AudioContext();
      context.current = audio;
      await audio.resume();
      const melody = () => {
        [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66].forEach((frequency, i) => {
          const oscillator = audio.createOscillator();
          const gain = audio.createGain();
          const start = audio.currentTime + i * .6;
          oscillator.type = 'sine';
          oscillator.frequency.value = frequency;
          gain.gain.setValueAtTime(0, start);
          gain.gain.linearRampToValueAtTime(.028, start + .08);
          gain.gain.exponentialRampToValueAtTime(.0001, start + 1.65);
          oscillator.connect(gain);
          gain.connect(audio.destination);
          oscillator.start(start);
          oscillator.stop(start + 1.7);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      };
      melody();
      timer.current = setInterval(melody, 6100);
      setPlaying(true);
    } catch {
      stop();
      onError('Music isn’t available in this browser. The magic still is.');
    } finally { switching.current = false; }
  };
  return { playing, toggle };
}

function Customize({ content, onSave, onClose }: { content: ProposalContent; onSave: (value: ProposalContent) => void; onClose: () => void }) {
  const [draft, setDraft] = useState(content);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copyError, setCopyError] = useState(false);
  const update = <K extends keyof ProposalContent,>(key: K, value: ProposalContent[K]) => {
    setDraft(previous => ({ ...previous, [key]: value }));
    setSaved(false);
    setCopied(false);
    setShareUrl('');
  };
  const save = () => {
    const normalized = normalizeContent(draft);
    onSave(normalized);
    setDraft(normalized);
    setSaved(true);
    return normalized;
  };
  const copy = async () => {
    const normalized = save();
    const url = makeShareUrl(window.location.href, normalized);
    setShareUrl(url);
    try { await navigator.clipboard.writeText(url); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  };
  return <Dialog title="Make this little website yours" onClose={onClose} className="customize-modal">
    <span className="eyebrow"><Pencil size={14} /> A LITTLE MORE PERSONAL</span>
    <h2>Make it <em>yours.</em></h2>
    <p className="modal-intro">Your words. Your person. Your little moment.</p>
    <form onSubmit={e => { e.preventDefault(); save(); }}>
      <div className="form-pair">
        <label>Their name<input value={draft.to} maxLength={60} onChange={e => update('to', e.target.value)} placeholder="Your favorite person" /></label>
        <label>Your name<input value={draft.from} maxLength={60} onChange={e => update('from', e.target.value)} placeholder="With love, …" /></label>
      </div>
      <label>Your little question<input value={draft.question} maxLength={120} onChange={e => update('question', e.target.value)} /></label>
      <div className="question-presets" aria-label="Question ideas">{['Will you be mine?', 'Will you marry me?', 'A date, just us two?'].map(question => <button type="button" key={question} className={draft.question === question ? 'selected' : ''} onClick={() => update('question', question)}>{question}</button>)}</div>
      <label>Your letter<textarea value={draft.letter} maxLength={4000} rows={6} onChange={e => update('letter', e.target.value)} /></label>
      <details className="note-editor"><summary>Edit the three little notes <Heart size={13} /></summary>{draft.reasons.map((reason, i) => <label key={i}>Little note {i + 1}<textarea rows={2} maxLength={400} value={reason} onChange={e => { const reasons = [...draft.reasons] as ProposalContent['reasons']; reasons[i] = e.target.value; update('reasons', reasons); }} /></label>)}</details>
      <div className="editor-actions"><button className="button primary" type="submit">{saved ? <Check size={17} /> : <Heart size={17} />} {saved ? 'Saved with love' : 'Save my words'}</button><button className="button secondary" type="button" onClick={copy}>{copied ? <Check size={17} /> : <Copy size={17} />} {copied ? 'Link copied!' : 'Copy personal link'}</button></div>
      {shareUrl && <label className="share-url">{copyError ? 'Select and copy your link below' : 'Your personal link'}<input readOnly value={shareUrl} onFocus={e => e.target.select()} /></label>}
      <p className="editor-help">Saved in this browser. The personal link carries your words with it; anyone with it can read them. Use your personal link when sharing so your words go with it.</p>
      {saved && <button type="button" className="text-button preview-link" onClick={onClose}>See your little masterpiece <ArrowRight size={16} /></button>}
    </form>
  </Dialog>;
}

const REASON_TITLES = ['Your little magic', 'Our endless talks', 'The thought of us'];
const SECRET_NOTES = ["If I could send you a hug through a website, this would be it.", "You found a tiny secret: this little heart is doing a happy dance for you.", "This corner of the universe is better because you're in it."];

function Confetti() {
  return <div className="confetti" aria-hidden="true">{Array.from({ length: 46 }, (_, i) => <span key={i} className={i % 3 === 0 ? 'confetti-heart' : ''} style={{ '--x': `${(i * 67 + 9) % 100}%`, '--delay': `${(i % 9) * -.42}s`, '--duration': `${3 + i % 4 * .6}s`, '--turn': `${i % 2 ? 1 : -1}`, '--color': ['#d27687', '#e6b772', '#a2ae83', '#e8a993', '#bf99b0'][i % 5] } as CSSProperties}>{i % 3 === 0 ? '♥' : ''}</span>)}</div>;
}

export default function App() {
  const [content, setContent] = useState<ProposalContent>(DEFAULT_CONTENT);
  const [modal, setModal] = useState<ModalKind>(null);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [letterOpened, setLetterOpened] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [toast, setToast] = useState('');
  const [secretIndex, setSecretIndex] = useState(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastMessage = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 5000);
  }, []);
  const music = useMusic(toastMessage);
  useEffect(() => {
    const refresh = () => {
      let storage: Storage | undefined;
      try { storage = window.localStorage; } catch { /* private browser mode */ }
      setContent(readContent(window.location, storage));
      setAccepted(false);
      setFlipped([]);
    };
    const onHashChange = () => { if (window.location.hash.startsWith('#love=')) refresh(); };
    refresh();
    window.addEventListener('hashchange', onHashChange);
    return () => { window.removeEventListener('hashchange', onHashChange); if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);
  const saveContent = (value: ProposalContent) => {
    setContent(value);
    setAccepted(false);
    try { window.localStorage.setItem('little-us-content-v1', JSON.stringify(value)); }
    catch { toastMessage('Your words are ready. Copy your personal link to keep them.'); }
    if (window.location.hash.startsWith('#love=')) history.replaceState(null, '', makeShareUrl(window.location.href, value));
  };
  const openLetter = () => { setLetterOpened(true); setModal('letter'); };
  const sayYes = () => { setAccepted(true); setModal('celebrate'); };
  const goToQuestion = () => {
    setModal(null);
    requestAnimationFrame(() => {
      const target = document.getElementById('question');
      target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      target?.focus({ preventScroll: true });
    });
  };
  const showSecret = () => { setSecretIndex(previous => (previous + 1) % SECRET_NOTES.length); setModal('secret'); };
  const navigate = (event: MouseEvent<HTMLElement>) => {
    const anchor = (event.target as Element).closest('a[href^="#"]');
    if (!anchor || !event.currentTarget.contains(anchor)) return;
    const target = document.getElementById(anchor.getAttribute('href')!.slice(1));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    target.focus({ preventScroll: true });
  };

  return <>
    <header className="site-header" onClick={navigate}>
      <a className="brand" href="#home" aria-label="Little Us home"><span className="brand-heart"><Heart size={22} strokeWidth={1.7} /></span>little us<span className="brand-period">.</span></a>
      <nav aria-label="Main navigation"><a href="#little-things">The little things</a><a href="#letter">A letter for you</a><a href="#question" className="nav-question">One little question <ArrowUpRight size={14} /></a></nav>
      <button className="personalize-button" onClick={() => setModal('customize')}><Pencil size={14} /><span>Make it yours</span></button>
    </header>

    <main>
      <section id="home" tabIndex={-1} className="hero section-shell" onClick={navigate}>
        <div className="hero-copy">
          <div className="hero-kicker"><span className="tiny-star">✦</span> A LITTLE WEBSITE. A VERY BIG FEELING.</div>
          <p className="greeting">Hey, {content.to}<span className="greeting-heart"> ♡</span></p>
          <h1>My favorite<br />place is<br /><span className="title-last">next to <em>you.</em><svg viewBox="0 0 246 18" aria-hidden="true"><path d="M4 12Q117-1 237 9M34 17q99-7 165-1" fill="none" stroke="#d7918d" strokeWidth="3" strokeLinecap="round"/></svg></span></h1>
          <p className="hero-description">Some things are hard to put into words.<br className="desktop-break" /> So I made a little something, just for you.</p>
          <button className="button primary hero-button" onClick={openLetter}><Mail size={17} /> I made you something <ArrowRight size={17} /></button>
          <div className="hero-footnote"><span className="scribble-arrow">↳</span> a tiny adventure. a whole lot of butterflies.</div>
        </div>
        <div className="hero-visual">
          <div className="little-label"><span className="tiny-heart">♥</span> YOU + ME + A LITTLE MAGIC</div>
          <button className="scene-button" onClick={showSecret} aria-label="Find a secret note in our little universe"><BunnyScene /></button>
          <span className="art-caption">our little universe</span>
          <div className="love-stamp"><Heart size={15} /><span>100%<br />heart-made</span></div>
          <span className="hero-doodle">✧</span>
          <p className="secret-hint">psst… tap the bunnies <span>↗</span></p>
        </div>
        <a href="#little-things" className="scroll-invitation"><span>THERE’S A LITTLE MORE</span><ArrowDown size={16} /></a>
      </section>

      <div className="love-ribbon" aria-hidden="true"><span>the little things</span><Heart size={15}/><span>the big feelings</span><Heart size={15}/><span>the almosts & the always</span><Heart size={15}/><span>you, in every version</span><Heart size={15}/><span>the little things</span><Heart size={15}/></div>

      <section id="little-things" tabIndex={-1} className="little-things section-shell">
        <div className="section-heading"><span className="eyebrow">01 / THE LITTLE THINGS</span><h2>It’s never just <em>one thing.</em></h2><p>It’s all the tiny things that add up to you.<br />Here are a few that make my heart do its thing.</p></div>
        <div className="notes-grid">{content.reasons.map((reason, i) => {
          const isFlipped = flipped.includes(i);
          return <button key={i} className={`note-card note-${i + 1} ${isFlipped ? 'flipped' : ''}`} aria-pressed={isFlipped} aria-label={`${isFlipped ? 'Close' : 'Open'} little note ${i + 1}: ${REASON_TITLES[i]}`} onClick={() => setFlipped(previous => previous.includes(i) ? previous.filter(n => n !== i) : [...previous, i])}>
            <span className="paper-tape" aria-hidden="true"/><span className="note-number">0{i + 1}</span>
            {isFlipped ? <div className="note-message"><Heart size={20} /><p>{reason}</p><span className="note-link">Keep this little thought <Heart size={12} /></span></div> : <><div className="note-drawing">{i === 0 ? <Flower /> : i === 1 ? <svg viewBox="0 0 110 100" aria-hidden="true"><path d="M12 18h69q10 0 10 10v30q0 10-10 10H45L26 83V68H22q-10 0-10-10V28q0-10 10-10Z" fill="#f9edbb" stroke="#a89562" strokeWidth="2"/><path d="M44 39h45q9 0 9 9v26q0 9-9 9h-2v13L72 83H44q-9 0-9-9V48q0-9 9-9Z" fill="#e7bea8" stroke="#ab806c" strokeWidth="2"/><path d="M66 68q-16-9-9-16q5-4 9 1q5-6 10-1q6 7-10 16Z" fill="#b46975"/><circle cx="30" cy="36" r="2" fill="#a89562"/><circle cx="43" cy="36" r="2" fill="#a89562"/><circle cx="56" cy="36" r="2" fill="#a89562"/></svg> : <svg viewBox="0 0 110 100" aria-hidden="true"><path d="M31 68q-30-36-7-46q13-5 20 7q11-21 27-7q16 15-25 53Z" fill="#e3a6b2" stroke="#a86575" strokeWidth="2"/><path d="M67 87q-37-34-13-48q15-7 21 7q9-16 21-6q18 17-29 47Z" fill="#f8dac8" stroke="#b78b72" strokeWidth="2"/><path d="M85 15v12m-6-6h12M12 80v9m-4-4h8" stroke="#a69b7c" strokeWidth="2" strokeLinecap="round"/></svg>}</div><h3>{REASON_TITLES[i]}</h3><span className="note-link">A little note for you <ArrowUpRight size={14} /></span></>}
          </button>;
        })}</div>
        <p className="notes-caption">Like little love notes, minus the risk of losing them in your pocket.</p>
      </section>

      <section id="letter" tabIndex={-1} className="letter-section section-shell">
        <div className="letter-copy"><span className="eyebrow">02 / SEALED WITH A LITTLE COURAGE</span><h2>Some words.<br /><em>All my heart.</em></h2><p>I wrote you a letter. It’s not perfect.<br />But every word is meant for you.</p><button className="button secondary" onClick={openLetter}>{letterOpened ? 'Read your letter again' : 'Open your letter'} <ArrowUpRight size={17} /></button><span className="letter-signoff">Love, {content.from} ♡</span></div>
        <div className="envelope-scene"><div className="envelope-tag">SPECIAL DELIVERY FOR {content.to.toUpperCase()}</div><button className="envelope-button" onClick={openLetter} aria-label="Open your sealed love letter"><Envelope open={letterOpened}/></button><span className="envelope-caption">a few butterflies went into this one.</span><Flower className="letter-flower"/></div>
      </section>

      <section id="question" tabIndex={-1} className="question-section section-shell">
        <div className="question-panel"><span className="question-sparkle left" aria-hidden="true">✧</span><span className="question-sparkle right" aria-hidden="true">✦</span><div className="question-heart"><Heart size={29} strokeWidth={1.5}/></div><span className="eyebrow">03 / OKAY, HERE GOES…</span><p className="question-preface">One tiny question.<br />A very hopeful heart.</p><h2>{accepted ? 'My favorite answer is you.' : content.question}</h2><p className="question-description">No grand speech. Just me, choosing you.</p><div className="answer-buttons"><button className="button primary yes-button" onClick={sayYes}><Heart size={17}/>{accepted ? 'Celebrate again' : 'Yes, a thousand times'}</button>{!accepted && <button className="time-button" onClick={() => setModal('time')}>I need a little time</button>}</div><p className="question-note">{accepted ? 'A little yes. A beautiful beginning. ♡' : 'Whatever your answer, I’m glad I got to tell you. ♡'}</p></div>
      </section>

      <section className="last-note"><Sparkles size={18}/><p>Of all the people, in all the places,<br /><em>I’m happy the universe led me to you.</em></p><span>♡</span></section>
    </main>

    <footer className="site-footer" onClick={navigate}><a className="brand footer-brand" href="#home">little us<span className="brand-period">.</span></a><p>Made with a little courage & a lot of love.</p><span>FOR {content.to.toUpperCase()}, FROM {content.from.toUpperCase()} <Heart size={11}/></span></footer>
    <button className="music-toggle" onClick={() => void music.toggle()} aria-pressed={music.playing} aria-label={music.playing ? 'Turn background music off' : 'Turn gentle background music on'}>{music.playing ? <Music2 size={15}/> : <VolumeX size={15}/>}<span>{music.playing ? 'A little melody' : 'Add a little melody'}</span><span className={`music-dot ${music.playing ? 'on' : ''}`}/></button>
    {toast && <div className="toast" role="status">{toast}</div>}

    {modal === 'customize' && <Customize content={content} onSave={saveContent} onClose={() => setModal(null)}/>}
    {modal === 'letter' && <Dialog title={`A letter for ${content.to}`} onClose={() => setModal(null)} className="love-letter-modal"><span className="letter-modal-decoration"><Flower/></span><span className="eyebrow">A LETTER, JUST FOR YOU</span><h2>Dear {content.to},</h2><div className="letter-body">{content.letter.split(/\n\s*\n/).map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div><p className="letter-modal-signoff">With a very full heart,<br /><em>{content.from} ♡</em></p><button className="button primary" onClick={goToQuestion}>There’s one more thing <ArrowRight size={17}/></button></Dialog>}
    {modal === 'celebrate' && <Dialog title="A little yes, a beautiful beginning" onClose={() => setModal(null)} className="celebrate-modal"><Confetti/><div className="celebration-content"><span className="eyebrow">THIS IS MY NEW FAVORITE MOMENT</span><BunnyScene celebration/><h2>Us? <em>Us!</em></h2><p>Turns out, my favorite word is <strong>yes.</strong><br />Here’s to all the little things ahead.</p><span className="couple-signature">{content.from} + {content.to} ♡</span><button className="button primary" onClick={() => setModal(null)}>Let our little story begin <Heart size={17}/></button><p className="response-note">This moment stays in this visit. It doesn’t send a message.</p></div></Dialog>}
    {modal === 'time' && <Dialog title="Take all the time you need" onClose={() => setModal(null)} className="small-modal"><span className="comfort-icon"><Heart size={36}/></span><h2>A little time.<br /><em>A lot of care.</em></h2><p>Take all the time you need. There’s no countdown and no pressure. I’m just happy you’re here.</p><button className="button secondary" onClick={() => setModal(null)}>Stay a little longer <ArrowRight size={16}/></button></Dialog>}
    {modal === 'secret' && <Dialog title="You found a little secret" onClose={() => setModal(null)} className="small-modal secret-modal"><span className="eyebrow">PSST… YOU FOUND ME</span><span className="comfort-icon"><Sparkles size={39}/></span><h2>A tiny <em>secret.</em></h2><p>{SECRET_NOTES[secretIndex]}</p><button className="button secondary" onClick={() => setModal(null)}>Keep it close <Heart size={16}/></button></Dialog>}
  </>;
}
