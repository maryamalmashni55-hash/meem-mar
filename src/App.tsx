import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, X, Feather, Mail, Check, Send, Edit3, Shield } from 'lucide-react';

export type SealId = 'emblem' | 'falcon' | 'flag';

export interface SavedEnvelope {
  id: string;
  studentName: string;
  messageEn: string;
  sealId: SealId;
  likes: number;
  isLiked: boolean;
  timestamp: string;
}

export interface SealConfig {
  id: SealId;
  title: string;
  subtitle: string;
  description: string;
  waxColor: string;
  waxDark: string;
  waxDeep: string;
  goldAccent: string;
}

export const WAX_SEALS_CONFIG: SealConfig[] = [
  {
    id: 'emblem',
    title: 'ختم السيفين والنخلة',
    subtitle: 'الشعار الوطني الملكي',
    description: 'شمع أخضر زمردي بنقش السيفين والنخلة المذهبة',
    waxColor: '#107c41',
    waxDark: '#084824',
    waxDeep: '#032612',
    goldAccent: '#fbbf24',
  },
  {
    id: 'falcon',
    title: 'ختم صقر الوطن',
    subtitle: 'رمز العزة والقوة والشموخ',
    description: 'شمع أحمر قرمزي ملكي بنقش صقر الوطن المذهب',
    waxColor: '#a81c1c',
    waxDark: '#6b0d0d',
    waxDeep: '#3b0505',
    goldAccent: '#fef08a',
  },
  {
    id: 'flag',
    title: 'ختم راية الفخر',
    subtitle: 'سيف العز وراية المجد',
    description: 'شمع ذهبي ملوكي لامع بنقش السيف وراية التوحيد',
    waxColor: '#d97706',
    waxDark: '#92400e',
    waxDeep: '#451a03',
    goldAccent: '#fef3c7',
  },
];

// Synthesized audio feedback via Web Audio API
const playTactileAudio = (type: 'open_envelope' | 'fold' | 'box_open' | 'stamp' | 'heart') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') ctx.resume();

    if (type === 'open_envelope') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.22);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'fold') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    } else if (type === 'box_open') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'stamp') {
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(120, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.18);
      gain1.gain.setValueAtTime(0.42, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.18);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(784, ctx.currentTime + 0.03);
      gain2.gain.setValueAtTime(0.16, ctx.currentTime + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.03);
      osc2.stop(ctx.currentTime + 0.35);
    } else if (type === 'heart') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch {}
};

// Hyper-realistic 3D Melted Wax Seal SVG Component (No emojis)
export const RealisticWaxSeal: React.FC<{
  sealId: SealId;
  size?: number;
  className?: string;
  showShine?: boolean;
}> = ({ sealId, size = 68, className = '', showShine = true }) => {
  const conf = WAX_SEALS_CONFIG.find(s => s.id === sealId) || WAX_SEALS_CONFIG[0];
  const uid = `${sealId}-${size}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-[0_7px_14px_rgba(0,0,0,0.7)]"
      >
        <defs>
          <radialGradient id={`waxBody-${uid}`} cx="35%" cy="30%" r="68%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.48" />
            <stop offset="20%" stopColor={conf.waxColor} />
            <stop offset="75%" stopColor={conf.waxDark} />
            <stop offset="100%" stopColor={conf.waxDeep} />
          </radialGradient>

          <radialGradient id={`innerBevel-${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="transparent" />
            <stop offset="95%" stopColor="rgba(0,0,0,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.25)" />
          </radialGradient>

          <linearGradient id={`goldEmboss-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="35%" stopColor="#fde047" />
            <stop offset="70%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>

          <filter id={`dropletGlow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
            <feOffset dx="0" dy="1.5" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M 50,3
             C 64,2 76,7 86,16
             C 96,25 99,38 98,52
             C 97,67 92,79 82,88
             C 72,97 58,99 47,98
             C 33,97 21,93 12,83
             C 3,73 2,59 3,46
             C 4,32 11,19 22,11
             C 31,3 41,3 50,3 Z"
          fill={`url(#waxBody-${uid})`}
        />

        <circle cx="84" cy="22" r="4" fill={conf.waxDark} opacity="0.75" />
        <circle cx="16" cy="74" r="3.5" fill={conf.waxDark} opacity="0.75" />
        <circle cx="50" cy="94" r="3" fill={conf.waxDark} opacity="0.65" />

        <circle cx="50" cy="50" r="37" fill={conf.waxDark} opacity="0.85" />
        <circle cx="50" cy="50" r="37" fill={`url(#innerBevel-${uid})`} />
        
        <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="3" />
        <circle cx="50" cy="50" r="33.5" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />

        {sealId === 'emblem' && (
          <g filter={`url(#dropletGlow-${uid})`}>
            <path d="M48 38 L47 62 L53 62 L52 38 Z" fill={`url(#goldEmboss-${uid})`} />
            <path d="M50 20 C42 12 30 18 26 24 C33 25 43 28 47 32 Z" fill={`url(#goldEmboss-${uid})`} />
            <path d="M50 20 C58 12 70 18 74 24 C67 25 57 28 53 32 Z" fill={`url(#goldEmboss-${uid})`} />
            <path d="M50 26 C36 24 24 33 22 41 C30 39 42 38 46 40 Z" fill={`url(#goldEmboss-${uid})`} />
            <path d="M50 26 C64 24 76 33 78 41 C70 39 58 38 54 40 Z" fill={`url(#goldEmboss-${uid})`} />
            <circle cx="50" cy="22" r="3.2" fill={`url(#goldEmboss-${uid})`} />
            <path d="M22 55 L75 84 L72 86 L19 57 Z" fill={`url(#goldEmboss-${uid})`} />
            <circle cx="21" cy="56" r="3" fill="#b45309" />
            <path d="M78 55 L25 84 L28 86 L81 57 Z" fill={`url(#goldEmboss-${uid})`} />
            <circle cx="79" cy="56" r="3" fill="#b45309" />
          </g>
        )}

        {sealId === 'falcon' && (
          <g filter={`url(#dropletGlow-${uid})`}>
            <path d="M50 22 C46 22 43 25 43 29 C43 32 46 34 50 34 C54 34 57 32 57 29 C57 25 54 22 50 22 Z" fill={`url(#goldEmboss-${uid})`} />
            <path d="M43 28 L37 31 L43 33 Z" fill="#fde047" />
            <path
              d="M 50 34 
                 C 38 30 24 34 18 45 
                 C 25 48 34 46 42 45 
                 C 32 50 22 56 20 66 
                 C 28 64 38 58 45 53 
                 C 40 60 35 68 36 76 
                 C 42 72 47 64 50 56 
                 C 53 64 58 72 64 76 
                 C 65 68 60 60 55 53 
                 C 62 58 72 64 80 66 
                 C 78 56 68 50 58 45 
                 C 66 46 75 48 82 45 
                 C 76 34 62 30 50 34 Z"
              fill={`url(#goldEmboss-${uid})`}
            />
            <path d="M47 46 L53 46 L54 58 L50 63 L46 58 Z" fill="#991b1b" stroke="#fde047" strokeWidth="1" />
            <circle cx="50" cy="52" r="2" fill="#fef08a" />
          </g>
        )}

        {sealId === 'flag' && (
          <g filter={`url(#dropletGlow-${uid})`}>
            <rect x="25" y="28" width="50" height="30" rx="4" fill="#065f46" stroke="#fde047" strokeWidth="1.5" />
            <path d="M 31,37 Q 50,32 69,37" stroke="#fef08a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 35,43 Q 50,40 65,43" stroke="#fef08a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            <path d="M 31,50 L 69,50" stroke="#fde047" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="31" cy="50" r="2.2" fill="#b45309" />
            <path d="M 69,48 L 72,50 L 69,52 Z" fill="#fde047" />
            <path d="M 30,68 Q 50,78 70,68" stroke="#fde047" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
          </g>
        )}

        {showShine && (
          <path
            d="M 28,16 C 35,9 55,9 70,16 C 62,20 42,20 28,16 Z"
            fill="#ffffff"
            opacity="0.32"
          />
        )}
      </svg>
    </div>
  );
};

export default function App() {
  // Modal for selecting wax seal
  const [isSealModalOpen, setIsSealModalOpen] = useState(false);

  // Simulation Stage:
  // 'closed_initial' -> envelope is closed on desk
  // 'writing' -> paper extracted on desk for writing
  // 'folded' -> paper put back in envelope, ready to stamp
  // 'stamping' -> pressing seal animation
  // 'sealed_ready' -> sealed with wax, ready to deliver
  const [simulationStage, setSimulationStage] = useState<
    'closed_initial' | 'writing' | 'folded' | 'stamping' | 'sealed_ready'
  >('closed_initial');

  // Selected Wax Seal
  const [selectedSeal, setSelectedSeal] = useState<SealId>('emblem');

  // Input states
  const [studentName, setStudentName] = useState('');
  const [messageEn, setMessageEn] = useState('');

  const [savedEnvelopes, setSavedEnvelopes] = useState<SavedEnvelope[]>([]);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch('/api/messages')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('load failed')))
      .then((rows: Array<{id: string; student_name: string; message_en: string; seal_id: SealId; likes: number; created_at: string}>) => {
        setSavedEnvelopes(rows.map(row => ({
          id: row.id,
          studentName: row.student_name,
          messageEn: row.message_en,
          sealId: row.seal_id,
          likes: row.likes,
          isLiked: false,
          timestamp: new Date(row.created_at).toLocaleString('ar-SA'),
        })));
      })
      .catch(() => setSavedEnvelopes([]));
  }, []);

  // Modal for reading any student envelope from gallery
  const [inspectingLetter, setInspectingLetter] = useState<SavedEnvelope | null>(null);

  // 1. Open the closed envelope and extract paper smoothly
  const handleOpenEnvelope = () => {
    playTactileAudio('open_envelope');
    setSimulationStage('writing');
  };

  // 2. Fold the letter paper back into the envelope
  const handleFoldLetter = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    playTactileAudio('fold');
    setSimulationStage('folded');
  };

  // 3. Stamp the hot wax onto the envelope flap
  const handleStampWaxOnEnvelope = () => {
    if (simulationStage !== 'folded') return;
    playTactileAudio('stamp');
    setSimulationStage('stamping');

    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#006c35', '#10b981', '#f59e0b', '#fbbf24', '#ffffff'],
    });

    setTimeout(() => {
      setSimulationStage('sealed_ready');
    }, 750);
  };

  // 4. Deliver the sealed letter to the heroes wall
  const handleDeliverToHeroes = async () => {
    playTactileAudio('stamp');
    setSubmitError('');

    const newLetter: SavedEnvelope = {
      id: `env-${Date.now()}`,
      studentName: studentName.trim() || 'طالبة مجهولة',
      messageEn: messageEn.trim() || 'Thank you for everything you do.',
      sealId: selectedSeal || 'emblem',
      likes: 0,
      isLiked: false,
      timestamp: 'الآن',
    };

    // Update the wall immediately so a slow or unavailable API never traps the student.
    setSavedEnvelopes(prev => [newLetter, ...prev.filter(item => item.id !== newLetter.id)]);
    setStudentName('');
    setMessageEn('');
    setSimulationStage('closed_initial');

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 8000);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: newLetter.id, student_name: newLetter.studentName, message_en: newLetter.messageEn, seal_id: newLetter.sealId, likes: 0}),
        signal: controller.signal,
      });
      window.clearTimeout(timeout);
      if (!response.ok) throw new Error('save failed');
    } catch {
      setSubmitError('تم عرض الرسالة على الجدار، لكن تعذر حفظها سحابياً حالياً. يرجى المحاولة لاحقاً.');
    }

    setTimeout(() => {
      document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  // Toggle Like on letters
  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playTactileAudio('heart');
    setSavedEnvelopes(prev =>
      prev.map(item => {
        if (item.id === id) {
          const isLiked = !item.isLiked;
          const updated = {
            ...item,
            isLiked,
            likes: isLiked ? item.likes + 1 : Math.max(0, item.likes - 1),
          };
          if (inspectingLetter && inspectingLetter.id === id) {
            setInspectingLetter(updated);
          }
          fetch('/api/messages', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id, likes: updated.likes}),
          }).catch(() => undefined);
          return updated;
        }
        return item;
      })
    );
  };

  const currentSealConfig = WAX_SEALS_CONFIG.find(s => s.id === selectedSeal) || WAX_SEALS_CONFIG[0];

  return (
    <div className="min-h-screen royal-emerald-gold-bg text-[#fcf8ec] flex flex-col font-cairo selection:bg-emerald-900 selection:text-amber-100 relative overflow-x-hidden">
      
      {/* =========================================================================
          1. أول شيء: ترويسة المبادرة والمشرفين (اسم المبادرة والمشرفين أول شيء في المقدمة)
          ========================================================================= */}
      <header className="pt-8 pb-4 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* اسم المبادرة الرئيسي أول شيء في المقدمة بارز بتدرج ذهبي راقٍ وخفيف */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fff6d6] via-[#e5c97d] to-[#d4af37] tracking-tight leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.85)] font-amiri">
            مبادرة: شكراً حماة الوطن
          </h1>

          {/* الهدف باللغة الإنجليزية بلمسة ذهبية ناعمة */}
          <p
            className="text-[#edd9a3]/90 font-en text-sm sm:text-base md:text-lg font-medium tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow-sm italic"
            dir="ltr"
          >
            "Write a message of thank and appreciation to the soldiers in English"
          </p>

          {/* بطاقة المشرفين الرسمية وإحصائية عدد الأظرف بارزة في المقدمة بالأخضر الزمردي والذهب الخفيف */}
          <div className="max-w-3xl mx-auto p-4 rounded-2xl bg-[#061f14]/85 border border-[#c5a059]/40 shadow-2xl backdrop-blur-md flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm text-[#ecdab2]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#dfc484]">المدرسة:</span>
              <strong className="text-[#fdfaf1] font-bold">المتوسطة الأولى بالراكة</strong>
            </div>
            <div className="hidden sm:block text-[#876e39]">•</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#dfc484]">مديرة المدرسة:</span>
              <strong className="text-[#fdfaf1] font-bold">أريج الحماد</strong>
            </div>
            <div className="hidden sm:block text-[#876e39]">•</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#dfc484]">معلمة المادة:</span>
              <strong className="text-[#fdfaf1] font-bold">مها آل غرير</strong>
            </div>
            <div className="hidden sm:block text-[#876e39]">•</div>
            <button
              type="button"
              onClick={() => {
                document.getElementById('gallery-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#072a19] to-[#0c3922] border border-[#c5a059]/50 hover:border-[#dfc484] px-3.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer group"
              title="الانتقال إلى جدار الأظرف"
            >
              <Mail className="w-4 h-4 text-[#e5c97d] group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-[#dfc484]">عدد الأظرف:</span>
              <strong className="text-[#fdfaf1] font-bold font-mono text-sm bg-[#041a0f] px-2 py-0.5 rounded-md border border-[#c5a059]/40">
                {savedEnvelopes.length} {savedEnvelopes.length === 1 ? 'ظرف' : savedEnvelopes.length > 2 && savedEnvelopes.length < 11 ? 'أظرف' : 'ظرف'}
              </strong>
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. مساحة المحاكاة: اكتب رسالتك ويبين الظرف مباشرة على سطح المكتب
          ========================================================================= */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 space-y-14">
        
        {/* عنوان مساحة كتابة الرسالة وإحصائية عدد الأظرف */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#062416]/90 border border-[#c5a059]/45 text-xs sm:text-sm text-[#edd9a3] shadow-lg">
            <Mail className="w-4 h-4 text-[#e5c97d]" />
            <span className="font-semibold text-[#dfc484]">عدد الأظرف في جدار الفخر:</span>
            <span className="bg-[#03170e]/95 text-[#fbf3d8] font-bold px-2.5 py-0.5 rounded-lg border border-[#c5a059]/50 font-mono text-sm">
              {savedEnvelopes.length} {savedEnvelopes.length === 1 ? 'ظرف' : savedEnvelopes.length > 2 && savedEnvelopes.length < 11 ? 'أظرف' : 'ظرف'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#f5e6be] font-amiri">
            اكتبي رسالتكِ لحماة الوطن
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80">
            الظرف مستقر على سطح المكتب، انقري لفتحه وكتابة كلمات الشكر باللغة الإنجليزية
          </p>
        </div>

        <div className="flex flex-col items-center justify-center">

          {/* مجسم الظرف والورقة على سطح المكتب */}
          <div className="w-full max-w-2xl flex flex-col items-center">
            
            {/* الحالة 1: الظرف مسكر في البداية وتفتحه الطالبة فتخرج الورقة بمشهد واقعي */}
            {simulationStage === 'closed_initial' && (
              <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-500">
                <div
                  onClick={handleOpenEnvelope}
                  className="group relative w-full royal-envelope-paper rounded-3xl p-8 sm:p-14 border-2 border-[#c5a059]/70 shadow-2xl flex flex-col items-center text-center overflow-hidden min-h-[340px] cursor-pointer hover:border-[#dfc484] transition-all"
                >
                  
                  {/* لسان الظرف المسكر لأسفل مع حافة ذهبية رقيقة */}
                  <div
                    className="absolute top-0 left-0 right-0 h-40 pointer-events-none border-b-2 border-[#b38f46] shadow-md group-hover:brightness-105 transition-all"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      background: 'linear-gradient(180deg, #ebdcb9 0%, #d8caa4 100%)',
                    }}
                  />

                  {/* نص التوجيه فوق الظرف */}
                  <div className="relative z-10 text-xs font-bold text-[#143922] mt-2 font-amiri">
                    المتوسطة الأولى بالراكة • ظرف رسالة فخر واعتزاز لحماة الوطن
                  </div>

                  {/* زر النقر لفتح الظرف وإخراج الورقة */}
                  <div className="relative z-10 my-auto pt-10 pb-4 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-[#dfd0b5]/80 border-2 border-[#b38f46] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Mail className="w-10 h-10 text-[#143922]" />
                    </div>

                    <span className="mt-5 px-7 py-3 rounded-2xl bg-[#093520] text-[#fbf5e2] font-bold text-sm shadow-xl group-hover:bg-[#0e482c] transition-all flex items-center gap-2 border border-[#c5a059]/60">
                      <span>انقري لفتح الظرف وإخراج الورقة</span>
                      <Feather className="w-4 h-4 text-[#e5c97d]" />
                    </span>
                  </div>

                  <p className="relative z-10 text-xs text-[#2b4c37] font-semibold">
                    انقري هنا ليفتح الظرف وتنزلق الورقة لكتابة رسالتكِ
                  </p>

                </div>
              </div>
            )}

            {/* الحالة 2: ورقة الرسالة مفتوحة على سطح المكتب للكتابة */}
            {simulationStage === 'writing' && (
              <div className="w-full official-letter-paper rounded-3xl p-6 sm:p-10 text-[#11311f] shadow-2xl border border-[#c5a059] animate-paper-extract">
                
                {/* ترويسة الورقة الرسمية */}
                <div className="flex items-center justify-between border-b border-[#295c3e]/30 pb-3 mb-6 text-xs font-semibold">
                  <div className="text-right">
                    <p className="font-bold text-[#0c311c] text-sm font-amiri">المملكة العربية السعودية</p>
                    <p className="text-[#205234]">المتوسطة الأولى بالراكة</p>
                  </div>
                  <div className="text-left font-en italic" dir="ltr">
                    <p className="font-bold text-[#0c311c]">To Our Brave Soldiers</p>
                  </div>
                </div>

                  <form onSubmit={handleFoldLetter} className="space-y-6 text-right">
                    {submitError && (
                      <p role="alert" className="rounded-xl border border-amber-700/40 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
                        {submitError}
                      </p>
                    )}

                    {/* اسم الطالبة */}
                  <div className="space-y-1">
                    <label htmlFor="student-name-field" className="block text-xs sm:text-sm font-bold text-[#0c311c]">
                      اسم الطالبة (Student Name) <span className="text-[#c5a059]">*</span>
                    </label>
                    <input
                      id="student-name-field"
                      type="text"
                      required
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder="اكتبي اسمكِ الكريم هنا..."
                      className="w-full bg-transparent border-b-2 border-[#295c3e]/40 focus:border-[#0c311c] text-[#072414] font-semibold text-sm sm:text-base px-1 py-2 outline-none transition-colors placeholder-[#4b7a5e]"
                    />
                  </div>

                  {/* رسالة الشكر بالإنجليزية */}
                  <div className="space-y-1">
                    <label htmlFor="message-field" className="block text-xs sm:text-sm font-bold text-[#0c311c]">
                      رسالة الشكر باللغة الإنجليزية (Message to soldiers in English) <span className="text-[#c5a059]">*</span>
                    </label>
                    <textarea
                      id="message-field"
                      required
                      rows={5}
                      dir="ltr"
                      value={messageEn}
                      onChange={e => setMessageEn(e.target.value)}
                      placeholder="Write your words of gratitude to the soldiers in English here..."
                      className="w-full bg-transparent border border-[#295c3e]/30 focus:border-[#0c311c] rounded-xl p-3 text-[#072414] font-en text-sm sm:text-base outline-none transition-colors leading-relaxed placeholder-[#4b7a5e] italic shadow-inner"
                    />
                  </div>

                  {/* زر طي الرسالة وإعادتها إلى الظرف */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#295c3e]/25">
                    <span className="text-xs text-[#205234] font-medium text-center sm:text-right">
                      اكتبي رسالتكِ ثم انقري لإغلاق الظرف واختيار الختم
                    </span>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-[#fcf6e8] bg-[#0a3821] hover:bg-[#0f4a2c] active:scale-95 transition-all shadow-xl shadow-black/40 border border-[#c5a059]/60 cursor-pointer text-sm"
                    >
                      <span>طي الورقة وإعادتها إلى الظرف</span>
                      <span>←</span>
                    </button>
                  </div>

                </form>

              </div>
            )}

            {/* الحالة 3: الظرف مسكر على الطاولة بانتظار اختيار الختم من النافذة وطبعه */}
            {(simulationStage === 'folded' || simulationStage === 'stamping' || simulationStage === 'sealed_ready') && (
              <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-500 space-y-6">
                
                {/* شريط التحكم: زر نافذة الختم وزر تعديل الرسالة */}
                <div className="w-full flex flex-wrap items-center justify-between gap-3 px-2">
                  {simulationStage === 'folded' && (
                    <button
                      onClick={() => {
                        playTactileAudio('open_envelope');
                        setSimulationStage('writing');
                      }}
                      className="text-xs text-[#dfc484] hover:text-[#fef6dc] bg-[#072517] hover:bg-[#0c3521] px-4 py-2 rounded-xl border border-[#c5a059]/40 cursor-pointer shadow-md transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#e5c97d]" />
                      <span>إعادة فتح الورقة للتعديل</span>
                    </button>
                  )}

                  {simulationStage === 'folded' && (
                    <button
                      onClick={() => {
                        playTactileAudio('box_open');
                        setIsSealModalOpen(true);
                      }}
                      className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c5a059] to-[#dfc484] hover:from-[#dfc484] hover:to-[#ebd69c] text-[#072013] font-bold text-xs sm:text-sm shadow-xl cursor-pointer active:scale-95 transition-all border border-[#dfc484]/70"
                    >
                      <Shield className="w-4 h-4 text-[#072013]" />
                      <span>اختيار الختم الشمعي</span>
                    </button>
                  )}
                </div>

                {/* مجسم الظرف المسكر على سطح المكتب */}
                <div className="relative w-full royal-envelope-paper rounded-3xl p-8 sm:p-12 border-2 border-[#c5a059]/70 shadow-2xl flex flex-col items-center text-center overflow-hidden min-h-[340px]">
                  
                  {/* لسان الظرف المطوي لأسفل */}
                  <div
                    className="absolute top-0 left-0 right-0 h-40 pointer-events-none border-b-2 border-[#b38f46] shadow-md"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      background: 'linear-gradient(180deg, #ebdcb9 0%, #d8caa4 100%)',
                    }}
                  />

                  {/* اسم الطالبة مكتوب على الظرف */}
                  <div className="relative z-10 text-xs font-bold text-[#143922] mt-2 font-amiri">
                    رسالة مقدمة من الطالبة: <strong className="text-base text-[#072413]">{studentName}</strong>
                  </div>

                  {/* مكان الختم الحقيقي في منتصف الظرف: تكبس عليه الطالبة لطبع الختم */}
                  <div className="relative z-10 my-auto pt-8 pb-3 flex flex-col items-center">
                    
                    {simulationStage === 'folded' && (
                      <button
                        onClick={handleStampWaxOnEnvelope}
                        className="group relative flex flex-col items-center cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
                        title="انقري هنا لطبع الختم الشمعي على الظرف"
                      >
                        <div className="absolute -inset-4 rounded-full bg-[#dfc484]/35 blur-md group-hover:bg-[#dfc484]/60 animate-pulse pointer-events-none" />

                        {/* بقعة مكان الختم المسبقة في المنتصف */}
                        <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#b38f46] bg-[#dfd0b5]/70 flex items-center justify-center text-xs text-[#143922] font-bold shadow-inner transition-transform">
                          <RealisticWaxSeal
                            sealId={selectedSeal}
                            size={76}
                            className="opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md"
                          />
                        </div>

                        <span className="mt-4 px-6 py-2.5 rounded-xl bg-[#093520] text-[#fbf5e2] font-bold text-xs sm:text-sm shadow-lg group-hover:bg-[#0e482c] transition-all flex items-center gap-2 border border-[#c5a059]/60">
                          <span>انقري هنا لطبع الختم على الظرف</span>
                        </span>
                      </button>
                    )}

                    {simulationStage === 'stamping' && (
                      <div className="animate-stamp-press flex flex-col items-center">
                        <RealisticWaxSeal sealId={selectedSeal} size={92} />
                        <span className="mt-3 text-[#dfc484] font-bold text-xs bg-[#041a0f]/90 px-4 py-1.5 rounded-full border border-[#c5a059]/50 shadow-lg">
                          جاري طبع الختم الشمعي...
                        </span>
                      </div>
                    )}

                    {simulationStage === 'sealed_ready' && (
                      <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-400">
                        <div className="wax-seal-3d">
                          <RealisticWaxSeal sealId={selectedSeal} size={94} />
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-[#0c311c] bg-[#e6ddc8] px-4 py-1 rounded-full border border-[#c5a059]/40 flex items-center justify-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-800 inline" />
                            <span>تم طبع {currentSealConfig.title} بنجاح</span>
                          </p>

                          <button
                            onClick={handleDeliverToHeroes}
                            className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#0d4a2b] via-[#105c36] to-[#0d4a2b] hover:from-[#105c36] hover:to-[#146e40] active:scale-95 text-[#fcf6e8] font-bold text-sm shadow-xl shadow-black/50 border border-[#dfc484]/60 flex items-center gap-2 cursor-pointer transition-all"
                          >
                            <span>إرسال الرسالة إلى جدار الأبطال</span>
                            <Send className="w-4 h-4 text-[#e5c97d]" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  <div className="relative z-10 flex items-center gap-2 text-xs text-[#205234] font-medium">
                    <span>الختم المختار: <strong>{currentSealConfig.title}</strong></span>
                    {simulationStage === 'folded' && (
                      <button
                        onClick={() => {
                          playTactileAudio('box_open');
                          setIsSealModalOpen(true);
                        }}
                        className="underline text-[#0c311c] font-bold hover:text-black cursor-pointer"
                      >
                        (تغيير الختم)
                      </button>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* =========================================================================
            3. جدار الرسائل المختومة للأبطال (GALLERY - يبدأ فارغاً تماماً)
            ========================================================================= */}
        <section id="gallery-section" className="pt-8 border-t border-[#c5a059]/25 space-y-6">
          
          <div className="flex items-center justify-between pb-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#f5e6be] font-amiri flex items-center gap-2">
                <span>جدار الرسائل المختومة للأبطال</span>
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80">
                انقري على أي ظرف مصغر لفتحه وقراءة رسالة الشكر
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#062416] px-4 py-2 rounded-xl border border-[#c5a059]/50 shadow-sm">
              <span className="text-xs sm:text-sm text-[#dfc484] font-semibold">عدد الأظرف:</span>
              <strong className="text-xs sm:text-sm text-[#fdfaf1] font-bold bg-[#03170e] px-2.5 py-0.5 rounded-lg border border-[#c5a059]/40 font-mono">
                {savedEnvelopes.length} {savedEnvelopes.length === 1 ? 'ظرف' : savedEnvelopes.length > 2 && savedEnvelopes.length < 11 ? 'أظرف' : 'ظرف'}
              </strong>
            </div>
          </div>

          {/* Clean Slate: يبدأ فارغاً تماماً */}
          {savedEnvelopes.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-emerald-800/40 bg-[#041a10]/75 text-emerald-300/80 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#072819] border border-[#c5a059]/40 flex items-center justify-center">
                <Mail className="w-7 h-7 text-[#e5c97d]" />
              </div>
              <p className="text-base font-bold text-[#f5e6be] font-amiri">
                جدار الرسائل خالٍ تماماً بانتظار مشاركتكِ الأولى
              </p>
              <p className="text-xs text-emerald-200/75 max-w-md mx-auto">
                انقري على الظرف بالأعلى لفتحه وإخراج الورقة، واكتبي رسالتكِ باللغة الإنجليزية واختاري ختمكِ المفضل لتنضم إلى رسائل الفخر.
              </p>
            </div>
          ) : (
            /* شبكة الأظرف المختومة المنشورة بتأثير حركي انسيابي (Float Animation) */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {savedEnvelopes.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => {
                    playTactileAudio('open_envelope');
                    setInspectingLetter(item);
                  }}
                  className="group relative cursor-pointer animate-envelope-float"
                  style={{
                    animationDelay: `${(index % 4) * 0.9}s`,
                    animationDuration: `${3.8 + (index % 3) * 0.6}s`,
                  }}
                >
                  <div className="relative royal-envelope-paper rounded-2xl p-5 border border-[#c5a059]/70 shadow-xl flex flex-col justify-between min-h-[185px] overflow-hidden">
                    
                    {/* ثنية لسان الظرف */}
                    <div
                      className="absolute top-0 left-0 right-0 h-16 pointer-events-none border-b border-[#b38f46]"
                      style={{
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                        background: 'linear-gradient(180deg, #ebdcb9 0%, #d8caa4 100%)',
                      }}
                    />

                    {/* اسم الطالبة ورقم الظرف */}
                    <div className="relative z-10 flex items-center justify-between border-b border-[#295c3e]/20 pb-1.5 gap-2">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] text-[#0a2918] bg-[#dfd0b5] font-mono px-1.5 py-0.5 rounded border border-[#b38f46] font-bold shrink-0">
                          ظرف #{savedEnvelopes.length - index}
                        </span>
                        <span className="font-bold text-[#0a2918] text-sm truncate font-amiri">
                          {item.studentName}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#1e442c] bg-[#e8dcbf] px-2 py-0.5 rounded-full border border-[#c5a059]/50 shrink-0">
                        المتوسطة الأولى بالراكة
                      </span>
                    </div>

                    {/* الختم الشمعي الحقيقي في المنتصف */}
                    <div className="relative z-10 my-auto py-2 flex items-center justify-center">
                      <div className="wax-seal-3d group-hover:scale-110 transition-transform">
                        <RealisticWaxSeal sealId={item.sealId} size={58} />
                      </div>
                    </div>

                    {/* زر فض الختم وقراءة الرسالة + الإعجاب */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-[#295c3e]/20 text-xs">
                      <span className="text-[11px] text-[#18462b] group-hover:text-[#0b6335] group-hover:underline font-semibold">
                        انقري لفتح وقراءة الرسالة ←
                      </span>

                      <button
                        onClick={(e) => handleToggleLike(item.id, e)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          item.isLiked
                            ? 'bg-rose-950/70 text-rose-300 border border-rose-500/50'
                            : 'bg-[#03170e]/70 text-[#18462b] hover:text-rose-600'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{item.likes}</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

      </main>

      {/* =========================================================================
          4. نافذة اختيار الختم الشمعي المنبثقة (Popup Modal)
          ========================================================================= */}
      {isSealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-[#041910] border-2 border-[#c5a059]/50 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(0,0,0,0.95)] space-y-6">
            
            {/* زر إغلاق النافذة */}
            <button
              onClick={() => {
                playTactileAudio('box_open');
                setIsSealModalOpen(false);
              }}
              className="absolute top-4 left-4 p-2 rounded-full bg-[#072617] hover:bg-[#0c3922] text-[#fbf3d8] transition-colors cursor-pointer border border-[#c5a059]/30"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ترويسة نافذة اختيار الختم */}
            <div className="space-y-1.5 pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#072819] border border-[#c5a059]/40 text-[#dfc484] text-xs font-bold">
                <Shield className="w-3.5 h-3.5 text-[#e5c97d]" />
                <span>الأختام الشمعية الملكية</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#fef6dc] font-amiri">
                اختاري الختم لطبعه على الظرف
              </h3>
              <p className="text-xs text-emerald-200/80 max-w-md mx-auto">
                انقري على الختم المفضل لديكِ ثم اضغطي تأكيد ليتم تجهيزه للطبع على الظرف.
              </p>
            </div>

            {/* قائمة خيارات الأختام الشمعية الواقعية */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto px-1">
              {WAX_SEALS_CONFIG.map(seal => {
                const isSelected = selectedSeal === seal.id;
                return (
                  <div
                    key={seal.id}
                    onClick={() => {
                      playTactileAudio('stamp');
                      setSelectedSeal(seal.id);
                    }}
                    className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all cursor-pointer text-right ${
                      isSelected
                        ? 'bg-[#093520] border-[#dfc484] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.02]'
                        : 'bg-[#03140c] border-[#c5a059]/25 hover:border-[#c5a059]/60 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <RealisticWaxSeal sealId={seal.id} size={58} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-bold text-sm sm:text-base ${isSelected ? 'text-[#fef6dc]' : 'text-emerald-100'}`}>
                          {seal.title}
                        </p>
                        {isSelected && (
                          <span className="text-[#dfc484] text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#051c11] border border-[#c5a059]/60 flex items-center gap-1">
                            <Check className="w-3 h-3 text-[#dfc484] inline" />
                            <span>مُختار</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-300/90 font-medium">{seal.subtitle}</p>
                      <p className="text-[11px] text-[#c5a059]/80 pt-0.5">{seal.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* زر تأكيد الاختيار وإغلاق النافذة */}
            <div className="pt-2">
              <button
                onClick={() => {
                  playTactileAudio('stamp');
                  setIsSealModalOpen(false);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#c5a059] via-[#dfc484] to-[#c5a059] hover:from-[#dfc484] hover:to-[#ebd69c] text-[#072013] font-black text-sm sm:text-base shadow-xl active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 border border-[#fef08a]/60"
              >
                <span>تأكيد اختيار الختم والعودة للظرف</span>
                <Check className="w-4 h-4 text-[#072013]" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          5. نافذة قراءة الرسالة عند النقر عليها في الجدار
          ========================================================================= */}
      {inspectingLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl official-letter-paper rounded-3xl p-6 sm:p-8 border-2 border-[#c5a059] shadow-2xl text-[#11311f] space-y-6">
            
            <button
              onClick={() => {
                playTactileAudio('open_envelope');
                setInspectingLetter(null);
              }}
              className="absolute top-4 left-4 p-2 rounded-full bg-[#dfd0b5]/70 hover:bg-[#cfbe9f] text-[#0c311c] transition-colors cursor-pointer border border-[#c5a059]/40"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-[#295c3e]/25 pb-4 text-xs font-semibold">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] text-[#0a2918] bg-[#dfd0b5] font-mono px-2 py-0.5 rounded border border-[#b38f46] font-bold">
                    ظرف #{savedEnvelopes.findIndex(e => e.id === inspectingLetter.id) >= 0 ? savedEnvelopes.length - savedEnvelopes.findIndex(e => e.id === inspectingLetter.id) : 1}
                  </span>
                  <p className="font-bold text-[#0c311c] text-lg font-amiri">{inspectingLetter.studentName}</p>
                </div>
                <p className="text-[#205234]">المتوسطة الأولى بالراكة</p>
              </div>
              <div className="flex items-center gap-2">
                <RealisticWaxSeal sealId={inspectingLetter.sealId} size={48} />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-[#1f4e32] uppercase tracking-wider block">
                Message of appreciation to our brave soldiers:
              </span>
              <div
                className="bg-transparent p-4 rounded-xl border border-[#295c3e]/25 text-base sm:text-lg font-en text-[#072414] leading-relaxed italic shadow-inner"
                dir="ltr"
              >
                "{inspectingLetter.messageEn}"
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#295c3e]/25">
              <button
                onClick={() => handleToggleLike(inspectingLetter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  inspectingLetter.isLiked
                    ? 'bg-rose-700 text-white shadow-md'
                    : 'bg-[#dfd0b5] hover:bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                }`}
              >
                <Heart className={`w-4 h-4 ${inspectingLetter.isLiked ? 'fill-current' : ''}`} />
                <span>إعجاب بالرسالة ({inspectingLetter.likes})</span>
              </button>

              <button
                onClick={() => {
                  playTactileAudio('open_envelope');
                  setInspectingLetter(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#093520] text-[#fcf6e8] font-bold text-xs hover:bg-[#0e482c] border border-[#c5a059]/50 transition-colors cursor-pointer"
              >
                إعادة إغلاق الرسالة
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          6. التوثيق المدرسي في التذييل (Footer)
          ========================================================================= */}
      <footer className="mt-16 bg-[#020b06] border-t border-[#c5a059]/25 py-8 text-center text-xs sm:text-sm text-emerald-300/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#f5e6be] text-base font-amiri">
            المتوسطة الأولى بالراكة
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-emerald-200/75">
            <span>مديرة المدرسة: <strong className="text-[#dfc484]">أريج الحماد</strong></span>
            <span className="hidden sm:inline text-[#876e39]">•</span>
            <span>معلمة المادة: <strong className="text-[#dfc484]">مها آل غرير</strong></span>
          </div>
          <p className="text-[11px] text-[#c5a059]/80 pt-1">
            مبادرة شكراً حماة الوطن • نظام رسائل الفخر والأختام الشمعية
          </p>
        </div>
      </footer>

    </div>
  );
}
