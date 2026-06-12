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
  Fade,
  keyframes
} from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import NoteAltOutlinedIcon from '@mui/icons-material/NoteAltOutlined';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseSoft = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

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
  
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' as 'success' | 'info' | 'warning' | 'error' });
  const [transitioning, setTransitioning] = useState(false);
  const [hasSavedProgress, setHasSavedProgress] = useState(false);

  const storageKey = `exam_progress_${params.id}`;

  useEffect(() => {
    if (!params?.id) return;
    
    fetch(`/exam_${params.id}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setQuestions(data);
        
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
        
        setTimeout(() => setLoading(false), 600);
      })
      .catch((err) => {
        console.error('Error fetching exam data', err);
        setLoading(false);
      });
  }, [params?.id, storageKey]);

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
    showToast('เริ่มการทำแบบทดสอบ', 'success');
  };

  const handleResume = () => {
    setStarted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('โหลดข้อมูลที่บันทึกไว้', 'info');
  };

  const handleRestart = () => {
    setStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setSubmitted(false);
    saveProgress({}, 0, true, false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('เริ่มทำข้อสอบใหม่', 'info');
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
      }, 250);
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
      }, 250);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    saveProgress(answers, currentIndex, true, true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('ส่งคำตอบเรียบร้อย', 'success');
  };

  const handleExit = () => {
    router.push('/');
    showToast('บันทึกความคืบหน้าแล้ว', 'success');
  };

  const getExamTitle = () => {
    switch(params.id) {
      case '2566_nuclear': return 'เวชศาสตร์นิวเคลียร์ 2566';
      case '2566_diagnostic': return 'รังสีวินิจฉัย 2566';
      case '2566_law': return 'กฎหมายและจรรยาบรรณ 2566';
      case '2566_patient_care': return 'การดูแลผู้ป่วย รังสีฟิสิกส์ 2566';
      default: return 'แบบทดสอบ';
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA', pt: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
           <Skeleton variant="rounded" width="100%" height={200} sx={{ borderRadius: 4, mb: 4, bgcolor: '#EEEEEE' }} />
           <Skeleton variant="rounded" width="100%" height={70} sx={{ borderRadius: 2, mb: 2, bgcolor: '#EEEEEE' }} />
           <Skeleton variant="rounded" width="100%" height={70} sx={{ borderRadius: 2, mb: 2, bgcolor: '#EEEEEE' }} />
           <Skeleton variant="rounded" width="100%" height={70} sx={{ borderRadius: 2, mb: 2, bgcolor: '#EEEEEE' }} />
        </Container>
      </Box>
    );
  }

  if (!started && !submitted) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#FAFAFA' }}>
        <Container maxWidth="md">
          <Box sx={{ 
            p: { xs: 4, md: 8 }, 
            textAlign: 'center', 
            borderRadius: 4, 
            bgcolor: '#FFFFFF',
            border: '1px solid #EAEAEA', 
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)',
            animation: `${fadeInUp} 0.6s ease-out`
          }}>
            <Box sx={{ 
              mb: 4, 
              display: 'inline-flex', 
              p: 2, 
              borderRadius: '50%', 
              bgcolor: '#F5F5F5', 
              color: '#111',
            }}>
               <NoteAltOutlinedIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              mb: 2, 
              color: '#111', 
              letterSpacing: '-0.02em',
            }}>
              {getExamTitle()}
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', mb: 6, maxWidth: '500px', mx: 'auto', lineHeight: 1.6, fontWeight: 400 }}>
              ชุดข้อสอบประกอบด้วย {questions.length} ข้อ เมื่อส่งคำตอบแล้ว ระบบจะแสดงเฉลยและคำอธิบายโดยละเอียด
            </Typography>
            
            {hasSavedProgress ? (
              <Box sx={{ p: 4, mb: 4, bgcolor: '#F9F9F9', borderRadius: 3, border: '1px solid #EAEAEA' }}>
                <Typography variant="h6" sx={{ color: '#111', fontWeight: 600, mb: 3 }}>
                  คุณทำค้างไว้ที่ข้อ {currentIndex + 1}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button variant="contained" size="large" onClick={handleResume} sx={{ px: 4, py: 1.5, borderRadius: 30, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, fontWeight: 600 }}>
                    ทำต่อ
                  </Button>
                  <Button variant="outlined" size="large" onClick={handleRestart} startIcon={<RestartAltIcon />} sx={{ px: 4, py: 1.5, borderRadius: 30, borderColor: '#DDD', color: '#666', '&:hover': { borderColor: '#999', bgcolor: 'transparent' }, fontWeight: 600 }}>
                    เริ่มใหม่
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button variant="outlined" size="large" onClick={() => router.push('/')} sx={{ px: 5, py: 1.5, borderRadius: 30, borderColor: '#DDD', color: '#666', '&:hover': { borderColor: '#999', bgcolor: 'transparent' }, fontWeight: 600 }}>
                  กลับหน้าแรก
                </Button>
                <Button variant="contained" size="large" onClick={handleStart} sx={{ px: 6, py: 1.5, borderRadius: 30, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, fontWeight: 600 }}>
                  เริ่มทำข้อสอบ
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    );
  }

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA', pb: 10, pt: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4, 
            bgcolor: '#FFFFFF',
            border: '1px solid #EAEAEA',
            mb: 6, 
            textAlign: 'center', 
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)', 
            animation: `${fadeInUp} 0.6s ease-out`
          }}>
            <FactCheckIcon sx={{ fontSize: 48, color: '#111', mb: 2 }} />
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, color: '#111', letterSpacing: '-0.02em' }}>
              สิ้นสุดการทดสอบ
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', mb: 5, lineHeight: 1.6, fontWeight: 400 }}>
              ระบบบันทึกคำตอบของคุณแล้ว <br/>สามารถเลื่อนดูเฉลยและคำอธิบายอย่างละเอียดได้ด้านล่าง
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button variant="outlined" onClick={() => router.push('/')} sx={{ px: 4, py: 1.5, borderRadius: 30, borderColor: '#DDD', color: '#333', fontWeight: 600 }}>หน้าหลัก</Button>
              <Button variant="contained" onClick={handleRestart} sx={{ px: 4, py: 1.5, borderRadius: 30, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, fontWeight: 600 }}>ทำใหม่</Button>
            </Box>
          </Box>

          {questions.map((q, index) => (
            <Card key={q.id} elevation={0} sx={{ 
              mb: 4, 
              borderRadius: 4, 
              bgcolor: '#FFFFFF',
              border: '1px solid #EAEAEA',
              animation: `${fadeInUp} 0.5s ease-out forwards`,
              animationDelay: `${Math.min(index * 0.05, 1)}s`,
              opacity: 0
            }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#999', mr: 2, minWidth: '35px' }}>
                    {index + 1}.
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 600, lineHeight: 1.6, color: '#111' }}>
                    {q.question}
                  </Typography>
                </Box>
                <Box sx={{ mb: 4, ml: { xs: 0, md: 6 } }}>
                  {Object.entries(q.choices).map(([key, text]) => {
                    const isSelected = answers[index] === key;
                    return (
                      <Box key={key} sx={{ 
                        p: 2, 
                        mb: 1.5, 
                        borderRadius: 2, 
                        bgcolor: isSelected ? '#F5F5F5' : '#FFFFFF', 
                        border: '1px solid', 
                        borderColor: isSelected ? '#111' : '#EAEAEA', 
                        display: 'flex', 
                        alignItems: 'center' 
                      }}>
                         <Typography variant="body1" sx={{ fontWeight: 700, color: isSelected ? '#111' : '#888', mr: 2, minWidth: '24px' }}>{key}.</Typography>
                         <Typography variant="body1" sx={{ color: isSelected ? '#111' : '#444', fontWeight: isSelected ? 500 : 400 }}>{text}</Typography>
                         {isSelected && <CheckCircleRoundedIcon sx={{ ml: 'auto', color: '#111', fontSize: 20 }} />}
                      </Box>
                    );
                  })}
                </Box>
                
                <Box sx={{ 
                  ml: { xs: 0, md: 6 }, 
                  p: 3, 
                  borderRadius: 3, 
                  bgcolor: '#FAFAFA', 
                  border: '1px solid #EEEEEE',
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#111', mb: q.explanation ? 2 : 0 }}>
                    คำตอบที่คุณเลือก: {answers[index] ? `${answers[index]}. ${q.choices[answers[index]]}` : 'ไม่ได้ตอบ'}
                  </Typography>
                  {q.explanation && (
                    <>
                      <Divider sx={{ my: 2, borderColor: '#EAEAEA' }} />
                      <Typography variant="subtitle2" sx={{ color: '#666', fontWeight: 700, mb: 1, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                        คำอธิบาย
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#333', lineHeight: 1.8 }}>
                        {q.explanation}
                      </Typography>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <Button variant="outlined" size="large" onClick={() => router.push('/')} sx={{ px: 6, py: 1.5, borderRadius: 30, borderColor: '#111', color: '#111', fontWeight: 600, '&:hover': { bgcolor: '#111', color: '#fff' } }}>
              กลับหน้าหลัก
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA', pt: 6, pb: 12 }}>
      <Container maxWidth="md">
        
        {/* Top Header */}
        <Box sx={{ 
          mb: 4, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          bgcolor: '#FFFFFF', 
          borderRadius: 30, 
          border: '1px solid #EAEAEA',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <Button variant="text" onClick={handleExit} startIcon={<ArrowBackIcon />} sx={{ color: '#666', fontWeight: 600, borderRadius: 30, '&:hover': { bgcolor: '#F5F5F5' } }}>
            ออก
          </Button>
          <Box sx={{ flexGrow: 1, mx: { xs: 2, md: 4 }, display: 'flex', alignItems: 'center', gap: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1, height: 4, borderRadius: 2, bgcolor: '#EEEEEE', '& .MuiLinearProgress-bar': { bgcolor: '#111' } }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#666', minWidth: '40px', textAlign: 'right' }}>
              {currentIndex + 1}/{questions.length}
            </Typography>
          </Box>
        </Box>

        {/* Question Card */}
        <Card elevation={0} sx={{ 
          borderRadius: 4, 
          bgcolor: '#FFFFFF',
          border: '1px solid #EAEAEA',
          boxShadow: '0 10px 30px -10px rgba(0,0,0,0.03)',
          overflow: 'hidden'
        }}>
          <Fade in={!transitioning} timeout={250}>
            <CardContent sx={{ p: { xs: 4, md: 6 } }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 5, lineHeight: 1.6, color: '#111' }}>
                <Box component="span" sx={{ color: '#999', mr: 2 }}>{currentIndex + 1}.</Box>
                {currentQ?.question}
              </Typography>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  name="quiz"
                  value={answers[currentIndex] || ''}
                  onChange={handleAnswerChange}
                >
                  {currentQ && Object.entries(currentQ.choices).map(([key, text]) => {
                    const isSelected = answers[currentIndex] === key;
                    return (
                      <Box
                        key={key}
                        sx={{
                          mb: 2,
                          p: 2,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: isSelected ? '#111' : '#EAEAEA',
                          bgcolor: isSelected ? '#FAFAFA' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': { 
                            borderColor: isSelected ? '#111' : '#CCC',
                            bgcolor: isSelected ? '#FAFAFA' : '#F9F9F9'
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
                          control={<Radio sx={{ color: '#CCC', '&.Mui-checked': { color: '#111' }, p: 1, mr: 1 }} />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: isSelected ? '#111' : '#888', mr: 3 }}>
                                {key}.
                              </Typography>
                              <Typography variant="body1" sx={{ color: isSelected ? '#111' : '#444', fontWeight: isSelected ? 500 : 400, lineHeight: 1.5 }}>
                                {text}
                              </Typography>
                            </Box>
                          }
                          sx={{ width: '100%', m: 0, '.MuiFormControlLabel-label': { width: '100%' } }}
                        />
                      </Box>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Fade>
          
          {/* Navigation Footer */}
          <Box sx={{ p: 3, borderTop: '1px solid #EAEAEA', display: 'flex', justifyContent: 'space-between', bgcolor: '#FAFAFA' }}>
            <Button 
              variant="text" 
              onClick={handlePrev} 
              disabled={currentIndex === 0} 
              startIcon={<ArrowBackIcon />}
              sx={{ color: '#666', fontWeight: 600, px: 3, '&.Mui-disabled': { color: '#CCC' } }}
            >
              ย้อนกลับ
            </Button>
            
            {currentIndex === questions.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                endIcon={<FactCheckIcon />}
                sx={{ borderRadius: 30, px: 4, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, fontWeight: 600 }}
              >
                ส่งคำตอบ
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext} 
                endIcon={<ArrowForwardIcon />}
                sx={{ borderRadius: 30, px: 4, bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' }, fontWeight: 600 }}
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
        autoHideDuration={2000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity} 
          sx={{ borderRadius: 2, fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}