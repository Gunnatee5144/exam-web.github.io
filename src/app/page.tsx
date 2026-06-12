'use client';

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Card, CardActionArea, Chip, Backdrop, keyframes, IconButton, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseSoft = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const slideRight = keyframes`
  0% { transform: translateX(0); }
  50% { transform: translateX(6px); }
  100% { transform: translateX(0); }
`;

// Mascot Animations
const walkContainer = keyframes`
  0% { transform: translateX(-200px); }
  49.9% { transform: translateX(calc(100vw + 100px)); }
  50% { transform: translateX(calc(100vw + 100px)); }
  99.9% { transform: translateX(-200px); }
  100% { transform: translateX(-200px); }
`;

const flipCharacter = keyframes`
  0%, 49.9% { transform: scaleX(1); }
  50%, 99.9% { transform: scaleX(-1); }
  100% { transform: scaleX(1); }
`;

const hop = keyframes`
  0%, 100% { transform: translateY(0) scaleY(0.95) scaleX(1.05); }
  15% { transform: translateY(-25px) scaleY(1.05) scaleX(0.95); }
  30% { transform: translateY(0) scaleY(0.9) scaleX(1.1); }
  45% { transform: translateY(-15px) scaleY(1.02) scaleX(0.98); }
  60% { transform: translateY(0) scaleY(0.95) scaleX(1.05); }
`;

const earTwitch = keyframes`
  0%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(15deg); }
  20%, 40% { transform: rotate(-5deg); }
  50% { transform: rotate(0deg); }
`;

const blink = keyframes`
  0%, 92%, 98% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
`;

const floatMessage = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(2deg); }
`;

const sparkleAnim = keyframes`
  0% { transform: scale(0) rotate(0deg); opacity: 0; }
  50% { transform: scale(1) rotate(180deg); opacity: 1; }
  100% { transform: scale(0) rotate(360deg); opacity: 0; }
`;

const pulseHeart = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
`;

const WalkingMascot = () => {
  const messages = [
    "สู้ๆ นะครับ! 💖", 
    "อ่านโจทย์ให้ดีๆ น้า 🐰", 
    "คุณทำได้แน่นอน! ✨", 
    "พักจิบน้ำบ้างก็ได้นะ 🥤",
    "ความพยายามไม่เคยทรยศใคร! ⭐",
    "เก่งมากแล้ว ไปลุยกันต่อ! 🚀"
  ];
  
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 6000);
    return () => clearInterval(interval);
  }, [messages]);

  return (
    <Box sx={{
      position: 'fixed',
      bottom: { xs: 20, md: 30 },
      left: 0,
      zIndex: 50,
      animation: `${walkContainer} 25s linear infinite`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'auto'
    }}>
      {/* Speech Bubble (Does not flip) */}
      <Box sx={{
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        px: 2.5,
        py: 1.5,
        borderRadius: '24px',
        boxShadow: '0 10px 25px rgba(255,182,193,0.4)',
        mb: 1.5,
        border: '2px solid rgba(255,182,193,0.3)',
        animation: `${floatMessage} 3s ease-in-out infinite`,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '8px 8px 0',
          borderStyle: 'solid',
          borderColor: 'rgba(255, 255, 255, 0.95) transparent transparent transparent',
        }
      }}>
        <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#FF758C', whiteSpace: 'nowrap' }}>
          {message}
        </Typography>
      </Box>

      {/* SVG Character Container (Flips direction) */}
      <Box sx={{ animation: `${flipCharacter} 25s steps(1) infinite` }}>
        <Box sx={{ 
          width: 90, 
          height: 90, 
          animation: `${hop} 2s cubic-bezier(0.28, 0.84, 0.42, 1) infinite`,
          cursor: 'pointer',
          transition: 'transform 0.2s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          '&:active': { transform: 'scale(0.9)' }
        }}
        onClick={() => setMessage("งู้ยยยยย! สู้ๆ! 💖💖")}
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
            {/* Sparkles & Hearts */}
            <path d="M 10 30 Q 15 25 20 30 Q 15 35 10 30 Z" fill="#FFD166" style={{ transformOrigin: '15px 30px', animation: `${sparkleAnim} 3s ease-in-out infinite` }} />
            <path d="M 90 25 Q 95 20 100 25 Q 95 30 90 25 Z" fill="#4facfe" style={{ transformOrigin: '95px 25px', animation: `${sparkleAnim} 3s ease-in-out infinite 1.5s` }} />
            <path d="M 85 60 C 85 55, 95 55, 95 60 C 95 65, 90 70, 90 70 C 90 70, 85 65, 85 60 Z" fill="#FF758C" style={{ transformOrigin: '90px 60px', animation: `${pulseHeart} 2s ease-in-out infinite` }} />

            {/* Back Ear */}
            <g style={{ transformOrigin: '35px 40px', animation: `${earTwitch} 6s infinite 0.5s` }}>
              <ellipse cx="35" cy="30" rx="8" ry="22" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="3" />
              <ellipse cx="35" cy="30" rx="3" ry="14" fill="#FFD1DC" />
            </g>

            {/* Front Ear */}
            <g style={{ transformOrigin: '65px 40px', animation: `${earTwitch} 6s infinite` }}>
              <ellipse cx="65" cy="30" rx="8" ry="22" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="3" />
              <ellipse cx="65" cy="30" rx="3" ry="14" fill="#FFD1DC" />
            </g>
            
            {/* Tail */}
            <circle cx="15" cy="75" r="10" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="3" />

            {/* Body */}
            <path d="M 20 65 C 20 40, 80 40, 80 65 C 80 95, 20 95, 20 65 Z" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="3" />
            
            {/* Paws (Feet) */}
            <circle cx="35" cy="88" r="7" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="3" />
            <circle cx="65" cy="88" r="7" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="3" />

            {/* Face */}
            <g style={{ transformOrigin: '50px 65px', animation: `${blink} 5s infinite` }}>
              {/* Eyes */}
              <circle cx="38" cy="62" r="4.5" fill="#4A4A4A" />
              <circle cx="39.5" cy="60.5" r="1.5" fill="#FFFFFF" />
              
              <circle cx="62" cy="62" r="4.5" fill="#4A4A4A" />
              <circle cx="63.5" cy="60.5" r="1.5" fill="#FFFFFF" />
            </g>

            {/* Blush */}
            <ellipse cx="28" cy="68" rx="6" ry="3.5" fill="#FFB6C1" opacity="0.7" />
            <ellipse cx="72" cy="68" rx="6" ry="3.5" fill="#FFB6C1" opacity="0.7" />
            
            {/* Cute Cat/Bunny Mouth :3 */}
            <path d="M 45 66 Q 50 72 50 66 Q 50 72 55 66" fill="none" stroke="#4A4A4A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Little front paws */}
            <circle cx="43" cy="78" r="4.5" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="2.5" />
            <circle cx="57" cy="78" r="4.5" fill="#FFFFFF" stroke="#FFB6C1" strokeWidth="2.5" />
          </svg>
        </Box>
      </Box>
    </Box>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [navigatingTo, setNavigatingTo] = React.useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const exams = [
    { id: '2566_anatomy', title: 'กายวิภาคศาสตร์และสรีรวิทยา 2566', questions: 247, status: 'ready', color: '#4facfe', subtitle: 'Anatomy & Physiology' },
    { id: '2566_diagnostic', title: 'รังสีวินิจฉัย 2566', questions: 640, status: 'ready', color: '#00f2fe', subtitle: 'Diagnostic Radiology' },
    { id: '2566_nuclear', title: 'เวชศาสตร์นิวเคลียร์ 2566', questions: 346, status: 'ready', color: '#fa709a', subtitle: 'Nuclear Medicine' },
    { id: '2566_law', title: 'กฎหมายและจรรยาบรรณ 2566', questions: 314, status: 'ready', color: '#fee140', subtitle: 'Law & Ethics' },
    { id: '2566_patient_care', title: 'การดูแลผู้ป่วย รังสีฟิสิกส์ ฯ', questions: 706, status: 'ready', color: '#43e97b', subtitle: 'Patient Care & Physics' }
  ];

  const handleNavigation = (id: string) => {
    setNavigatingTo(id);
    router.push(`/exam/${id}`);
  };

  if (!mounted) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#FCFCFC', 
      color: '#1A1A1A',
      fontFamily: 'inherit',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* Decorative Background grid and glows */}
      <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(#EAEAEA 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5, zIndex: 0 }} />
      <Box sx={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(79,172,254,0.06) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', top: '20%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(250,112,154,0.05) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />

      {/* Mascot */}
      <WalkingMascot />

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: { xs: 12, md: 18 }, pb: { xs: 8, md: 10 }, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <Box sx={{ animation: `${fadeInUp} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both` }}>
          <Chip 
            label="Radiologic Technology Platform" 
            sx={{ 
              mb: 4, 
              bgcolor: '#111', 
              color: '#fff', 
              fontWeight: 600, 
              letterSpacing: 1.2, 
              textTransform: 'uppercase', 
              fontSize: '0.75rem',
              px: 1,
              py: 2,
              borderRadius: '100px'
            }} 
          />
        </Box>
        <Box sx={{ animation: `${fadeInUp} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s both` }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
              mb: 3, 
              background: 'linear-gradient(135deg, #111 0%, #555 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.04em',
              lineHeight: 1.1
            }}
          >
            คลังข้อสอบรังสีเทคนิค
          </Typography>
        </Box>
        <Box sx={{ animation: `${fadeInUp} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s both` }}>
          <Typography variant="h6" sx={{ color: '#666', maxWidth: '650px', mx: 'auto', lineHeight: 1.8, fontWeight: 400, fontSize: { xs: '1rem', md: '1.2rem' } }}>
            เตรียมความพร้อมสู่ความสำเร็จด้วยระบบจำลองการทำข้อสอบที่ออกแบบมาอย่างพิถีพิถัน เรียบง่าย และตอบโจทย์การเรียนรู้
          </Typography>
        </Box>
      </Container>

      {/* Exams Grid */}
      <Container maxWidth="lg" sx={{ pb: 24, flexGrow: 1, position: 'relative', zIndex: 10 }}>
        <Grid container spacing={4}>
          {exams.map((exam, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={exam.id}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%', 
                  bgcolor: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.06)',
                  overflow: 'visible',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  animation: `${fadeInUp} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both`,
                  animationDelay: `${0.3 + index * 0.1}s`,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: '10%', right: '10%', height: '4px',
                    background: `linear-gradient(90deg, transparent, ${exam.color}, transparent)`,
                    opacity: 0,
                    transition: 'opacity 0.4s, transform 0.4s',
                    transform: 'translateY(-2px)'
                  },
                  '&:hover': {
                    transform: exam.status === 'ready' ? 'translateY(-8px)' : 'none',
                    borderColor: 'rgba(0,0,0,0.12)',
                    boxShadow: exam.status === 'ready' ? '0 24px 48px -12px rgba(0,0,0,0.06)' : 'none',
                    bgcolor: '#FFFFFF',
                    '&::before': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%', p: { xs: 4, md: 5 }, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', borderRadius: '24px' }} 
                  onClick={() => exam.status === 'ready' && handleNavigation(exam.id)}
                  disabled={exam.status !== 'ready'}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '16px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          bgcolor: `${exam.color}15`, // 15 is hex for ~8% opacity
                          color: exam.color,
                          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background 0.4s, color 0.4s',
                          '.MuiCardActionArea-root:hover &': {
                            transform: 'scale(1.08) rotate(-5deg)',
                            bgcolor: exam.color,
                            color: '#fff',
                            boxShadow: `0 8px 20px -5px ${exam.color}50`
                          }
                        }}
                      >
                        <NoteAltOutlinedIcon fontSize="medium" />
                      </Box>
                      {exam.status === 'ready' ? (
                        <Chip label="READY" size="small" sx={{ fontWeight: 700, bgcolor: 'transparent', color: '#111', border: '1.5px solid #111', letterSpacing: 1, borderRadius: '8px', fontSize: '0.7rem' }} />
                      ) : (
                        <Chip label="COMING SOON" size="small" sx={{ fontWeight: 700, bgcolor: '#F5F5F5', color: '#999', border: 'none', letterSpacing: 1, borderRadius: '8px', fontSize: '0.7rem' }} />
                      )}
                    </Box>
                    <Typography variant="overline" sx={{ color: exam.color, fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 1 }}>
                      {exam.subtitle}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: '#111', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                      {exam.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#666', fontSize: '1.05rem', lineHeight: 1.7, fontWeight: 400 }}>
                      {exam.status === 'ready' ? `ทบทวนความรู้กับข้อสอบจำนวน ${exam.questions} ข้อ พร้อมระบบประเมินผลการเรียนรู้แบบเรียลไทม์` : 'กำลังจัดเตรียมเนื้อหาเพื่อประสบการณ์ที่ดีที่สุด'}
                    </Typography>
                  </Box>
                  
                  {exam.status === 'ready' && (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 5, 
                      color: '#111', 
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      letterSpacing: 1.2,
                      textTransform: 'uppercase',
                      borderBottom: '2px solid transparent',
                      pb: 0.5,
                      transition: 'border-color 0.3s',
                      '.MuiCardActionArea-root:hover &': {
                        borderColor: '#111'
                      }
                    }}>
                      Start Practice 
                      <Box component="span" sx={{ display: 'inline-flex', ml: 1.5, '.MuiCardActionArea-root:hover &': { animation: `${slideRight} 1s ease-in-out infinite` } }}>
                        <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
                      </Box>
                    </Box>
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Loading Backdrop */}
      <Backdrop 
        open={navigatingTo !== null} 
        sx={{ 
          zIndex: 9999, 
          bgcolor: '#FCFCFC', 
          flexDirection: 'column',
          color: '#111'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: `${pulseSoft} 2s infinite` }}>
          <NoteAltOutlinedIcon sx={{ fontSize: 48, mb: 3, color: '#111' }} />
          <Typography variant="body1" sx={{ fontWeight: 700, letterSpacing: 4, textTransform: 'uppercase', color: '#111' }}>
            Preparing...
          </Typography>
        </Box>
      </Backdrop>
    </Box>
  );
}
