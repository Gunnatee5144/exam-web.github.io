'use client';

import React from 'react';
import { Container, Typography, Box, Card, CardContent, CardActionArea, Chip, Button, Grid, Backdrop, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import HourglassEmptyRoundedIcon from '@mui/icons-material/HourglassEmptyRounded';

export default function Dashboard() {
  const router = useRouter();

  const exams = [
    { id: '2566_diagnostic', title: 'รังสีวินิจฉัย 2566', questions: 640, status: 'ready', color: '#6366f1' },
    { id: '2566_nuclear', title: 'เวชศาสตร์นิวเคลียร์ 2566', questions: 346, status: 'ready', color: '#10b981' }
  ];

  const [navigatingTo, setNavigatingTo] = React.useState<string | null>(null);

  const handleNavigation = (id: string) => {
    setNavigatingTo(id);
    router.push(`/exam/${id}`);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Decorative Hero Section */}
      <Box 
        sx={{ 
          pt: { xs: 8, md: 12 }, 
          pb: { xs: 10, md: 14 }, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background blobs */}
        <Box sx={{ position: 'absolute', top: '-10%', left: '-5%', width: '40%', height: '100%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '120%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 800, 
              mb: 3, 
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            คลังข้อสอบรังสีวินิจฉัย
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6, mb: 4 }}>
            เตรียมความพร้อมสู่ความสำเร็จ ด้วยแบบทดสอบที่ครอบคลุม พร้อมระบบตรวจคำตอบและคำอธิบายอย่างละเอียดในทุกๆ ข้อ
          </Typography>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 2, pb: 10, flexGrow: 1 }}>
        <Grid container spacing={4}>
          {exams.map((exam) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={exam.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    transform: exam.status === 'ready' ? 'translateY(-8px)' : 'none',
                    boxShadow: exam.status === 'ready' ? '0 20px 40px -5px rgba(99,102,241,0.15)' : 'auto',
                  }
                }}
              >
                <CardActionArea 
                  sx={{ height: '100%', p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }} 
                  onClick={() => exam.status === 'ready' && handleNavigation(exam.id)}
                  disabled={exam.status !== 'ready'}
                >
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                      <Box 
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: 3, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          background: `linear-gradient(135deg, ${exam.color}22 0%, ${exam.color}44 100%)`,
                          color: exam.color
                        }}
                      >
                        {exam.status === 'ready' ? <LibraryBooksIcon fontSize="large" /> : <HourglassEmptyRoundedIcon fontSize="large" />}
                      </Box>
                      {exam.status === 'ready' ? (
                        <Chip label="พร้อมทำ" color="success" size="small" sx={{ fontWeight: 'bold' }} />
                      ) : (
                        <Chip label="เร็วๆ นี้" size="small" sx={{ fontWeight: 'bold', bgcolor: 'grey.200', color: 'grey.600' }} />
                      )}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                      {exam.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {exam.status === 'ready' ? `ทบทวนความรู้ด้วยข้อสอบจำนวน ${exam.questions} ข้อ` : 'ข้อสอบกำลังอยู่ระหว่างการจัดเตรียมและอัปเดต'}
                    </Typography>
                  </Box>
                  
                  {exam.status === 'ready' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, color: exam.color, fontWeight: 'bold' }}>
                      เริ่มทำแบบทดสอบ <ArrowForwardRoundedIcon sx={{ ml: 1, fontSize: 20 }} />
                    </Box>
                  )}
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Full-screen Preloader */}
      <Backdrop 
        open={navigatingTo !== null} 
        sx={{ 
          zIndex: 9999, 
          color: '#fff', 
          flexDirection: 'column',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)'
        }}
      >
        <CircularProgress color="primary" size={60} thickness={4} sx={{ mb: 3 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          กำลังเตรียมข้อสอบ...
        </Typography>
      </Backdrop>
    </Box>
  );
}