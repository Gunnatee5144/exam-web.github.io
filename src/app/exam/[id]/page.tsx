'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Skeleton,
  Fade
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

interface Choice {
  [key: string]: string;
}

interface Question {
  id: number;
  question: string;
  choices: Choice;
  explanation: string;
  answer: string;
}

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  
  // New States for Features
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'info' | 'warning' | 'error' });
  const [transitioning, setTransitioning] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  const storageKey = `exam_progress_${params.id}`;

  useEffect(() => {
    fetch(`/exam_${params.id}.json`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        
        // Load saved state
        try {
          const saved = localStorage.getItem(storageKey);
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed.currentIndex === 'number') {
              setAnswers(parsed.answers || {});
              setCurrentIndex(parsed.currentIndex);
              if (parsed.started && !parsed.submitted) {
                setHasSavedProgress(true);
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse local storage', e);
        }
        
        setTimeout(() => setLoading(false), 800); // Add a slight delay to show the nice skeleton
      })
      .catch((err) => {
        console.error('Error fetching exam data', err);
        setLoading(false);
      });
  }, [params.id, storageKey]);

  const saveProgress = (newAnswers: any, newIndex: number, isStarted: boolean, isSubmitted: boolean) => {
    localStorage.setItem(storageKey, JSON.stringify({
      answers: newAnswers,
      currentIndex: newIndex,
      started: isStarted,
      submitted: isSubmitted
    }));
  };

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const handleStart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    saveProgress({}, 0, true, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('เริ่มทำแบบทดสอบ ขอให้โชคดีครับ!', 'success');
  };

  const handleResume = () => {
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('ระบบโหลดความคืบหน้าที่บันทึกไว้เรียบร้อยแล้ว', 'info');
  };

  const handleRestart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    saveProgress({}, 0, true, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('เริ่มทำแบบทดสอบใหม่', 'info');
  };

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    const newAnswers = { ...answers, [currentIndex]: val };
    setAnswers(newAnswers);
    saveProgress(newAnswers, currentIndex, true, false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        saveProgress(answers, nextIdx, true, false);
        setTransitioning(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setTransitioning(true);
      setTimeout(() => {
        const prevIdx = currentIndex - 1;
        setCurrentIndex(prevIdx);
        saveProgress(answers, prevIdx, true, false);
        setTransitioning(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    saveProgress(answers, currentIndex, true, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('ส่งคำตอบเรียบร้อยแล้ว!', 'success');
  };

  const handleExit = () => {
    router.push('/');
    showToast('บันทึกความคืบหน้าอัตโนมัติ', 'success');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', pt: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
           <Skeleton variant="rounded" width="100%" height={200} sx={{ borderRadius: 6, mb: 4, bgcolor: 'rgba(255,255,255,0.6)' }} />
           <Skeleton variant="rounded" width="100%" height={80} sx={{ borderRadius: 4, mb: 2, bgcolor: 'rgba(255,255,255,0.6)' }} />
           <Skeleton variant="rounded" width="100%" height={80} sx={{ borderRadius: 4, mb: 2, bgcolor: 'rgba(255,255,255,0.6)' }} />
           <Skeleton variant="rounded" width="100%" height={80} sx={{ borderRadius: 4, mb: 2, bgcolor: 'rgba(255,255,255,0.6)' }} />
           <Skeleton variant="rounded" width="100%" height={80} sx={{ borderRadius: 4, mb: 2, bgcolor: 'rgba(255,255,255,0.6)' }} />
           <Skeleton variant="rounded" width="200px" height={50} sx={{ borderRadius: 30, mx: 'auto', mt: 4, bgcolor: 'rgba(255,255,255,0.6)' }} />
        </Container>
      </Box>
    );
  }

  if (!started && !submitted) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '120%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper elevation={0} sx={{ p: { xs: 4, md: 8 }, textAlign: 'center', borderRadius: 6, bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)' }}>
            <Box sx={{ mb: 4, display: 'inline-flex', p: 2, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', color: 'white', boxShadow: '0 10px 15px -3px rgba(99,102,241,0.3)' }}>
               <FactCheckIcon sx={{ fontSize: 48 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {params.id === '2566_nuclear' ? 'แบบทดสอบ เวชศาสตร์นิวเคลียร์ 2566' : 'แบบทดสอบ รังสีวินิจฉัย 2566'}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 6, maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}>
              ข้อสอบจำนวน {questions.length} ข้อ พร้อมเฉลยและคำอธิบายอย่างละเอียด เพื่อทบทวนความรู้ของคุณ
            </Typography>
            
            {hasSavedProgress ? (
              <Box sx={{ p: 4, mb: 4, bgcolor: 'primary.50', borderRadius: 4, border: '1px solid', borderColor: 'primary.200' }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 800, mb: 2 }}>
                  คุณทำข้อสอบค้างไว้ที่ข้อ {currentIndex + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button variant="contained" color="primary" size="large" onClick={handleResume} sx={{ px: 4, py: 1.5, borderRadius: 30, boxShadow: '0 8px 16px -4px rgba(99,102,241,0.4)' }}>
                    ทำต่อจากเดิม
                  </Button>
                  <Button variant="outlined" color="error" size="large" onClick={handleRestart} startIcon={<RestartAltIcon />} sx={{ px: 4, py: 1.5, borderRadius: 30, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                    เริ่มทำใหม่ทั้งหมด
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button variant="outlined" size="large" onClick={() => router.push('/')} sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 30, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
                  กลับหน้าแรก
                </Button>
                <Button variant="contained" color="primary" size="large" onClick={handleStart} sx={{ px: 5, py: 1.5, fontSize: '1.1rem', borderRadius: 30, boxShadow: '0 8px 16px -4px rgba(99,102,241,0.4)' }}>
                  เริ่มทำแบบทดสอบ
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', pb: 10, pt: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: 6, bgcolor: 'white', mb: 6, textAlign: 'center', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 8, background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)' }} />
            <EmojiObjectsRoundedIcon sx={{ fontSize: 60, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
              ผลการทดสอบ
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
              ระบบได้บันทึกคำตอบของคุณแล้ว เลื่อนลงเพื่อตรวจคำตอบของคุณเปรียบเทียบกับคำอธิบายแบบละเอียดได้เลย
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" onClick={() => router.push('/')} sx={{ px: 4, borderRadius: 30 }}>กลับหน้าคลังข้อสอบ</Button>
              <Button variant="contained" onClick={handleRestart} sx={{ px: 4, borderRadius: 30 }}>ทำแบบทดสอบอีกครั้ง</Button>
            </Box>
          </Paper>

          {questions.map((q, index) => (
            <Card key={q.id} sx={{ mb: 4, borderRadius: 4, overflow: 'visible', '&:hover': { transform: 'none' } }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mr: 2, minWidth: '40px' }}>
                    {index + 1}.
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.5 }}>
                    {q.question}
                  </Typography>
                </Box>
                <Box sx={{ mb: 4, ml: { xs: 0, md: 7 } }}>
                  {Object.entries(q.choices).map(([key, text]) => {
                    const isSelected = answers[index] === key;
                    return (
                      <Paper key={key} elevation={0} sx={{ p: 2, mb: 1.5, borderRadius: 3, bgcolor: isSelected ? 'primary.50' : 'grey.50', border: '1px solid', borderColor: isSelected ? 'primary.200' : 'transparent', display: 'flex', alignItems: 'center' }}>
                         <Typography variant="body1" sx={{ fontWeight: 700, color: isSelected ? 'primary.700' : 'text.secondary', mr: 2, minWidth: '24px' }}>{key}.</Typography>
                         <Typography variant="body1" sx={{ color: isSelected ? 'primary.900' : 'text.primary', fontWeight: isSelected ? 600 : 400 }}>{text}</Typography>
                         {isSelected && <CheckCircleRoundedIcon color="primary" sx={{ ml: 'auto' }} />}
                      </Paper>
                    );
                  })}
                </Box>
                
                <Box sx={{ ml: { xs: 0, md: 7 }, p: 3, borderRadius: 4, background: 'linear-gradient(135deg, rgba(236,72,153,0.05) 0%, rgba(99,102,241,0.05) 100%)', border: '1px solid rgba(99,102,241,0.1)' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.700', mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
                    คำตอบที่คุณเลือก: {answers[index] ? `${answers[index]}. ${q.choices[answers[index]]}` : 'ไม่ได้ตอบ'}
                  </Typography>
                  {q.explanation && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(0,0,0,0.05)' }} />
                      <Typography variant="subtitle1" color="secondary.main" sx={{ fontWeight: 800, mb: 1 }}>
                        คำอธิบาย / เฉลยแบบละเอียด
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', lineHeight: 1.7 }}>
                        {q.explanation}
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button variant="contained" size="large" onClick={() => router.push('/')} sx={{ px: 6, py: 1.5, fontSize: '1.2rem', borderRadius: 30 }}>
              กลับสู่หน้าหลัก
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', pt: 4, pb: 10 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 4, backdropFilter: 'blur(10px)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <Button variant="outlined" onClick={handleExit} color="error" startIcon={<ArrowBackIcon />} sx={{ fontWeight: 'bold', borderRadius: 30, borderWidth: 2, '&:hover': { borderWidth: 2 } }}>
            บันทึกและออก
          </Button>
          <Box sx={{ flexGrow: 1, mx: { xs: 2, md: 4 }, position: 'relative' }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(99,102,241,0.1)' }} />
            <Typography variant="caption" sx={{ position: 'absolute', top: -22, right: 0, fontWeight: 'bold', color: 'primary.main' }}>
              ทำไปแล้ว {currentIndex} จาก {questions.length}
            </Typography>
          </Box>
        </Box>

        <Card sx={{ borderRadius: 6, overflow: 'hidden', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}>
          <Box sx={{ height: 6, background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 100%)' }} />
          <Fade in={!transitioning} timeout={300}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 6, lineHeight: 1.5, color: 'text.primary' }}>
                <Box component="span" sx={{ color: 'primary.main', mr: 2 }}>{currentIndex + 1}.</Box>
                {currentQ?.question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={answers[currentIndex] || ''}
                  onChange={handleAnswerChange}
                >
                  {currentQ && Object.entries(currentQ.choices).map(([key, text]) => {
                    const isSelected = answers[currentIndex] === key;
                    return (
                      <Paper
                        key={key}
                        elevation={isSelected ? 3 : 0}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 4,
                          border: '2px solid',
                          borderColor: isSelected ? 'primary.main' : 'grey.200',
                          bgcolor: isSelected ? 'primary.50' : 'transparent',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': { 
                            bgcolor: isSelected ? 'primary.50' : 'grey.50',
                            transform: 'translateY(-2px)',
                            borderColor: isSelected ? 'primary.main' : 'primary.200',
                            boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)'
                          }
                        }}
                        onClick={() => {
                           const newAnswers = { ...answers, [currentIndex]: key };
                           setAnswers(newAnswers);
                           saveProgress(newAnswers, currentIndex, true, false);
                        }}
                      >
                        <FormControlLabel
                          value={key}
                          control={<Radio color="primary" size="medium" sx={{ p: 1, mr: 1 }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="h6" sx={{ fontWeight: 800, color: isSelected ? 'primary.main' : 'text.secondary', mr: 2 }}>
                                {key}.
                              </Typography>
                              <Typography variant="h6" sx={{ color: isSelected ? 'primary.900' : 'text.secondary', fontWeight: isSelected ? 700 : 500, lineHeight: 1.5 }}>
                                {text}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0, '.MuiFormControlLabel-label': { width: '100%' } }}
                        />
                      </Paper>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Fade>
          
          <Box sx={{ p: 4, bgcolor: 'rgba(248, 250, 252, 0.8)', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid', borderColor: 'grey.100' }}>
            <Button 
              variant="outlined" 
              onClick={handlePrev} 
              disabled={currentIndex === 0} 
              size="large"
              startIcon={<ArrowBackIcon />}
              sx={{ borderRadius: 30, px: { xs: 2, sm: 4 }, py: 1.5, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
            >
              ย้อนกลับ
            </Button>
            
            {currentIndex === questions.length - 1 ? (
              <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleSubmit} 
                size="large"
                endIcon={<FactCheckIcon />}
                sx={{ borderRadius: 30, px: { xs: 3, sm: 6 }, py: 1.5, fontSize: { xs: '1rem', sm: '1.1rem' }, boxShadow: '0 10px 15px -3px rgba(236,72,153,0.4)', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' }}
              >
                ส่งคำตอบและดูผลลัพธ์
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext} 
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 30, px: { xs: 4, sm: 5 }, py: 1.5, boxShadow: '0 10px 15px -3px rgba(99,102,241,0.4)' }}
              >
                ถัดไป
              </Button>
            )}
          </Box>
        </Card>
      </Container>
      
      {/* Toast Notification */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={3000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setToast({ ...toast, open: false })} severity={toast.severity} sx={{ width: '100%', borderRadius: 3, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}