import React, { useEffect, useRef, useState } from 'react';
import CustomerLayout from '../Layouts/CustomerLayout';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  alpha,
} from '@mui/material';
import { Sparkles, MessageSquare, ShieldCheck, Zap, ArrowUpRight, ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ─── Design Tokens ─────────────────────────────────────────── */
const C = {
  ink: '#07090f',
  deep: '#0d1424',
  mid: '#131d30',
  accent: '#3b82f6',
  accentGlow: '#60a5fa',
  gold: '#f59e0b',
  muted: 'rgba(255,255,255,0.45)',
  line: 'rgba(255,255,255,0.07)',
};

/* ─── Floating Orb Background ───────────────────────────────── */
function OrbField() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Large primary orb */}
      <Box sx={{
        position: 'absolute', top: '-15%', right: '-10%',
        width: 700, height: 700, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)`,
        animation: 'orbFloat1 14s ease-in-out infinite',
      }} />
      {/* Secondary orb */}
      <Box sx={{
        position: 'absolute', bottom: '10%', left: '-8%',
        width: 500, height: 500, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)`,
        animation: 'orbFloat2 18s ease-in-out infinite',
      }} />
      {/* Small accent orb */}
      <Box sx={{
        position: 'absolute', top: '40%', left: '30%',
        width: 300, height: 300, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)`,
        animation: 'orbFloat3 11s ease-in-out infinite',
      }} />
      {/* Grid texture */}
      <Box sx={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }} />
      <style>{`
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,40px) scale(1.08)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(50px,-30px) scale(1.05)} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }
      `}</style>
    </Box>
  );
}

/* ─── Animated counter ───────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = to / 60;
        const t = setInterval(() => {
          start += step;
          if (start >= to) { setVal(to); clearInterval(t); }
          else setVal(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

/* ─── Chat preview ───────────────────────────────────────────── */
const messages = [
  { role: 'user', text: 'أريد استرداد كلمة المرور' },
  { role: 'ai', text: 'بالتأكيد! أرسل لك رابط الاسترداد الآن. تحقق من بريدك الإلكتروني.' },
  { role: 'user', text: 'شكراً، وصل الرابط بسرعة!' },
  { role: 'ai', text: 'أنا هنا دائماً إذا احتجت أي مساعدة أخرى 🙌' },
];

function ChatPreview() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (visible < messages.length) {
      const t = setTimeout(() => setVisible(v => v + 1), 1100);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <Box sx={{
      bgcolor: C.deep, borderRadius: 4, overflow: 'hidden',
      border: `1px solid ${C.line}`,
      boxShadow: `0 0 80px rgba(59,130,246,0.12), 0 40px 80px rgba(0,0,0,0.5)`,
    }}>
      {/* Window chrome */}
      <Box sx={{ px: 3, py: 2, bgcolor: C.mid, borderBottom: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
          <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
        ))}
        <Typography sx={{ ml: 2, color: C.muted, fontSize: 13, fontFamily: 'monospace' }}>
          nexus-ai · محادثة مباشرة
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#27c93f', boxShadow: '0 0 6px #27c93f' }} />
          <Typography sx={{ color: '#27c93f', fontSize: 11 }}>متصل</Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ p: 3, minHeight: 260, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <AnimatePresence>
          {messages.slice(0, visible).map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
            >
              <Box sx={{
                maxWidth: '78%', px: 2.5, py: 1.5, borderRadius: m.role === 'user'
                  ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                bgcolor: m.role === 'user'
                  ? `linear-gradient(135deg, ${C.accent}, #1d4ed8)`
                  : 'rgba(255,255,255,0.06)',
                background: m.role === 'user'
                  ? `linear-gradient(135deg, ${C.accent}, #1d4ed8)` : undefined,
                border: m.role === 'ai' ? `1px solid ${C.line}` : 'none',
              }}>
                <Typography sx={{ color: 'white', fontSize: 13.5, lineHeight: 1.6 }}>{m.text}</Typography>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {visible < messages.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex' }}>
            <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '20px 20px 20px 4px', border: `1px solid ${C.line}` }}>
              <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                {[0, 1, 2].map(d => (
                  <Box key={d} sx={{
                    width: 6, height: 6, borderRadius: '50%', bgcolor: C.accentGlow,
                    animation: 'typingDot 1.2s ease-in-out infinite',
                    animationDelay: `${d * 0.2}s`,
                  }} />
                ))}
              </Box>
            </Box>
          </motion.div>
        )}
      </Box>

      {/* Input bar */}
      <Box sx={{ px: 3, py: 2.5, borderTop: `1px solid ${C.line}`, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Box sx={{ flex: 1, bgcolor: 'rgba(255,255,255,0.04)', borderRadius: 3, px: 2.5, py: 1.5, border: `1px solid ${C.line}` }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>اكتب رسالتك...</Typography>
        </Box>
        <Box sx={{
          width: 42, height: 42, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `linear-gradient(135deg, ${C.accent}, #1d4ed8)`,
          cursor: 'pointer', boxShadow: `0 0 20px rgba(59,130,246,0.4)`,
        }}>
          <ArrowUpRight size={18} color="white" />
        </Box>
      </Box>

      <style>{`
        @keyframes typingDot { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-4px);opacity:1} }
      `}</style>
    </Box>
  );
}

/* ─── Feature Card ───────────────────────────────────────────── */
function FeatureCard({ icon, title, description, delay }: {
  icon: React.ReactNode; title: string; description: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <Box sx={{
        p: 4, height: '100%',
        bgcolor: C.mid,
        borderRadius: 4,
        border: `1px solid ${C.line}`,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.35s ease',
        '&:hover': {
          border: `1px solid rgba(59,130,246,0.3)`,
          boxShadow: `0 0 40px rgba(59,130,246,0.08)`,
          transform: 'translateY(-4px)',
        },
        '&::before': {
          content: '""', position: 'absolute', inset: 0,
          background: `radial-gradient(circle at top left, rgba(59,130,246,0.06) 0%, transparent 60%)`,
          opacity: 0, transition: 'opacity 0.35s',
        },
        '&:hover::before': { opacity: 1 },
      }}>
        <Box sx={{
          width: 52, height: 52, borderRadius: 3,
          bgcolor: 'rgba(59,130,246,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 3,
          border: `1px solid rgba(59,130,246,0.2)`,
        }}>
          {icon}
        </Box>
        <Typography sx={{ color: 'white', fontWeight: 700, fontSize: 17, mb: 1.5 }}>{title}</Typography>
        <Typography sx={{ color: C.muted, fontSize: 14, lineHeight: 1.75 }}>{description}</Typography>
      </Box>
    </motion.div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ num, suffix, label }: { num: number; suffix?: string; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', p: 4 }}>
      <Typography sx={{
        fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 900, color: 'white',
        background: `linear-gradient(135deg, white 0%, ${C.accentGlow} 100%)`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        fontFamily: '"DM Mono", monospace',
      }}>
        <Counter to={num} suffix={suffix} />
      </Typography>
      <Typography sx={{ color: C.muted, fontSize: 14, mt: 1 }}>{label}</Typography>
    </Box>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function Home() {
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <CustomerLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Cairo:wght@400;600;700;800;900&display=swap');
        * { font-family: 'Cairo', sans-serif !important; }
        code, .mono { font-family: 'DM Mono', monospace !important; }
        html { background: ${C.ink}; }
      `}</style>

      <OrbField />

      {/* ── HERO ── */}
      <Box sx={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="lg" sx={{ pt: 14 }}>
          <motion.div style={{ opacity: heroOpacity, y: heroY }}>
            <Grid container spacing={6} alignItems="center">
              {/* Left */}
              <Grid item xs={12} md={6}>
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9 }}>
                  {/* Badge */}
                  <Box sx={{
                    display: 'inline-flex', alignItems: 'center', gap: 1,
                    px: 2.5, py: 1, borderRadius: 99,
                    bgcolor: 'rgba(59,130,246,0.1)',
                    border: `1px solid rgba(59,130,246,0.25)`,
                    mb: 4,
                  }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#27c93f', boxShadow: '0 0 8px #27c93f', animation: 'pulse 2s infinite' }} />
                    <Typography sx={{ color: C.accentGlow, fontSize: 13, fontWeight: 600 }}>مشغّل الآن · 24/7</Typography>
                    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
                  </Box>

                  <Typography sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.6rem', md: '3.8rem' },
                    lineHeight: 1.15, mb: 3, color: 'white',
                    textShadow: '0 0 80px rgba(59,130,246,0.2)',
                  }}>
                    مستقبل الدعم الفني
                    <Box component="span" sx={{
                      display: 'block',
                      background: `linear-gradient(90deg, ${C.accent}, ${C.accentGlow}, ${C.gold})`,
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                      يبدأ هنا
                    </Box>
                  </Typography>

                  <Typography sx={{ color: C.muted, fontSize: 17, lineHeight: 1.85, mb: 5, maxWidth: 500 }}>
                    Nexus AI يتعامل مع كل استفسار على الفور — بذكاء حقيقي، لا ردود معلّبة.
                    دعم حقيقي على مدار الساعة بلا انتظار.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowUpRight size={18} />}
                      onClick={() => { window.location.href = route('customer.chat'); }}
                      sx={{
                        py: 1.8, px: 4.5, borderRadius: 3,
                        fontSize: 15, fontWeight: 700,
                        background: `linear-gradient(135deg, ${C.accent} 0%, #1d4ed8 100%)`,
                        boxShadow: `0 0 30px rgba(59,130,246,0.35)`,
                        transition: 'all 0.3s',
                        '&:hover': { boxShadow: `0 0 50px rgba(59,130,246,0.55)`, transform: 'translateY(-2px)' },
                      }}
                    >
                      ابدأ المحادثة الآن
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        py: 1.8, px: 4.5, borderRadius: 3,
                        fontSize: 15, fontWeight: 700,
                        color: 'white',
                        borderColor: C.line,
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s',
                        '&:hover': { borderColor: C.accent, bgcolor: 'rgba(59,130,246,0.08)' },
                      }}
                    >
                      اعرف المزيد
                    </Button>
                  </Box>
                </motion.div>
              </Grid>

              {/* Right — Chat Preview */}
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2 }}
                >
                  <ChatPreview />
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>

          {/* Scroll hint */}
          <Box sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', animation: 'scrollBounce 2s ease-in-out infinite' }}>
            <ChevronDown size={24} color={C.muted} />
            <style>{`@keyframes scrollBounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(8px)}}`}</style>
          </Box>
        </Container>
      </Box>

      {/* ── STATS STRIP ── */}
      <Box sx={{ position: 'relative', zIndex: 1, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, bgcolor: C.mid }}>
        <Container maxWidth="lg">
          <Grid container>
            {[
              { num: 98, suffix: '%', label: 'معدل رضا العملاء' },
              { num: 250000, suffix: '+', label: 'محادثة ناجحة' },
              { num: 2, suffix: 'ث', label: 'متوسط وقت الرد' },
              { num: 99.9, suffix: '%', label: 'وقت تشغيل الخدمة' },
            ].map((s, i) => (
              <Grid key={i} item xs={6} md={3} sx={{ borderLeft: i > 0 ? `1px solid ${C.line}` : 'none' }}>
                <StatCard {...s} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── FEATURES ── */}
      <Box sx={{ position: 'relative', zIndex: 1, py: 14 }}>
        <Container maxWidth="lg">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Box sx={{ textAlign: 'center', mb: 10 }}>
              <Typography sx={{
                color: C.accentGlow, fontSize: 13, fontWeight: 700,
                letterSpacing: 3, textTransform: 'uppercase', mb: 2,
              }}>
                لماذا Nexus AI؟
              </Typography>
              <Typography sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' }, lineHeight: 1.2 }}>
                مصمم للسرعة.
                <Box component="span" sx={{ color: C.muted }}> مبني للثقة.</Box>
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={3}>
            {[
              { icon: <Zap size={24} color={C.accentGlow} />, title: 'سرعة فائقة', description: 'ردود فورية خلال ثوانٍ — بدون طوابير انتظار أو توجيه للأقسام.', delay: 0 },
              { icon: <MessageSquare size={24} color={C.accentGlow} />, title: 'محادثة ذكية', description: 'يفهم السياق ويتذكر تفاصيل محادثتك لتقديم حلول دقيقة ومخصصة.', delay: 0.1 },
              { icon: <ShieldCheck size={24} color={C.accentGlow} />, title: 'خصوصية محمية', description: 'بياناتك مشفّرة بأعلى معايير الأمن العالمية — لا تتنازل عن خصوصيتك.', delay: 0.2 },
              { icon: <Sparkles size={24} color={C.accentGlow} />, title: 'متوفر 24/7', description: 'لا إجازات، لا تأخيرات. المساعد الذكي جاهز في أي وقت ومن أي مكان.', delay: 0.3 },
            ].map((f, i) => (
              <Grid key={i} item xs={12} sm={6} md={3}>
                <FeatureCard {...f} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── CTA SECTION ── */}
      <Box sx={{ position: 'relative', zIndex: 1, pb: 16 }}>
        <Container maxWidth="md">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Box sx={{
              textAlign: 'center', p: { xs: 5, md: 9 },
              borderRadius: 6,
              background: `linear-gradient(135deg, ${C.mid} 0%, rgba(59,130,246,0.08) 100%)`,
              border: `1px solid rgba(59,130,246,0.2)`,
              boxShadow: `0 0 100px rgba(59,130,246,0.07), inset 0 0 80px rgba(59,130,246,0.03)`,
              position: 'relative', overflow: 'hidden',
              '&::before': {
                content: '""', position: 'absolute', top: -100, right: -100,
                width: 300, height: 300, borderRadius: '50%',
                background: `radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)`,
              },
            }}>
              <Typography sx={{ color: C.accentGlow, fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', mb: 2 }}>
                ابدأ الآن مجاناً
              </Typography>
              <Typography sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.3, mb: 2 }}>
                جرب الفرق بنفسك
              </Typography>
              <Typography sx={{ color: C.muted, fontSize: 16, mb: 5, maxWidth: 480, mx: 'auto' }}>
                لا تحتاج إلى بطاقة ائتمانية — ابدأ محادثتك الأولى مع Nexus AI الآن.
              </Typography>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowUpRight size={20} />}
                onClick={() => { window.location.href = route('customer.chat'); }}
                sx={{
                  py: 2.2, px: 6, borderRadius: 3,
                  fontSize: 16, fontWeight: 800,
                  background: `linear-gradient(135deg, ${C.accent} 0%, #1d4ed8 100%)`,
                  boxShadow: `0 0 40px rgba(59,130,246,0.4)`,
                  '&:hover': { boxShadow: `0 0 60px rgba(59,130,246,0.6)`, transform: 'translateY(-2px)' },
                  transition: 'all 0.3s',
                }}
              >
                تحدث مع المساعد الآن
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </CustomerLayout>
  );
}