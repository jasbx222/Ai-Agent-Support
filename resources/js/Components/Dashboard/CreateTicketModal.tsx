import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ open, onClose }: Props) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!subject || !description) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Since it's a stateless API we could use axios, but Inertia router 
      // or standard Laravel session might be easier. Using axios to hit the API route:
      // Note: the API route requires auth:sanctum.
      // If we don't have token, we can use Inertia if we make a web route.
      // For simplicity let's use router.post if we create a web route, 
      // or axios to a newly created web store endpoint.
      // Wait! The user asked to link the frontend with the backend. 
      // Let's use Inertia.post to a specific endpoint. 
      
      router.post(
        '/tickets', 
        { subject, description },
        { 
          onSuccess: () => {
            setSubject('');
            setDescription('');
            onClose();
          },
          onError: (errors) => {
            console.error(errors);
            setError('حدث خطأ أثناء إضافة التذكرة.');
          },
          onFinish: () => setLoading(false)
        }
      );

    } catch (err) {
      setError('حدث خطأ بالاتصال.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" fontWeight={800}>تذكرة دعم جديدة</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && (
            <Typography variant="body2" color="error">{error}</Typography>
          )}
          <TextField
            label="موضوع التذكرة"
            fullWidth
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <TextField
            label="وصف المشكلة"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} color="inherit" disabled={loading}>
          إلغاء
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'جاري الإرسال...' : 'إنشاء التذكرة'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
