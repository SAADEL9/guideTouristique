import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Avatar, Button, TextField, Collapse,
  IconButton, CircularProgress, Alert
} from '@mui/material';
import { QuestionAnswer, Person, ExpandMore, ExpandLess, Send, Delete, LockOutlined, Add } from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';
import { useAuth } from '../../context/AuthContext';

const CORAL = '#FF6B35';
const ACCENT_LIGHT = '#FFE8DF';
const TEXT = '#1A1A1A';
const MUTED = '#888888';
const BORDER = '#EEEEEE';
const WHITE = '#FFFFFF';
const HERO_BG = '#FFF8F5';

const AnswerItem = ({ answer, currentUserId, isAdmin, questionId, onDelete }) => {
  const canDelete = isAdmin || currentUserId === answer.userId;
  const handleDelete = async () => {
    try { await ReviewService.deleteAnswer(questionId, answer.id); onDelete(answer.id); } catch (err) { console.error(err); }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.2, py: 1.2, pl: 1.5, borderLeft: `2px solid ${ACCENT_LIGHT}` }}>
      <Avatar sx={{ bgcolor: ACCENT_LIGHT, color: CORAL, width: 28, height: 28, fontSize: 11, fontWeight: 500, flexShrink: 0 }}>
        {answer.username?.[0]?.toUpperCase() || <Person sx={{ fontSize: 13 }} />}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 500, color: CORAL }}>{answer.username}</Typography>
            <Typography variant="caption" sx={{ color: MUTED }}>{answer.date ? new Date(answer.date).toLocaleDateString() : ''}</Typography>
          </Box>
          {canDelete && (
            <IconButton size="small" onClick={handleDelete} sx={{ color: '#CCCCCC', '&:hover': { color: '#ef4444' } }}>
              <Delete sx={{ fontSize: 13 }} />
            </IconButton>
          )}
        </Box>
        <Typography sx={{ fontSize: 13, color: '#555', lineHeight: 1.65 }}>{answer.answerText}</Typography>
      </Box>
    </Box>
  );
};

const QuestionItem = ({ question, currentUserId, isAuthenticated, isAdmin, onDelete, onAnswerAdded }) => {
  const [expanded, setExpanded] = useState(false);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState(question.answers || []);

  const canDelete = isAdmin || currentUserId === question.userId;

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const res = await ReviewService.addAnswer(question.id, { answerText: answerText.trim() });
      setAnswers(res.data.answers || []);
      setAnswerText(''); setAnswerOpen(false); setExpanded(true);
      onAnswerAdded?.(res.data);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <Box sx={{ mb: 1.5, borderRadius: '12px', border: `0.5px solid ${BORDER}`, overflow: 'hidden' }}>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1.2 }}>
          <Avatar sx={{ bgcolor: ACCENT_LIGHT, color: CORAL, width: 34, height: 34, fontSize: 13, fontWeight: 500, flexShrink: 0 }}>
            {question.username?.[0]?.toUpperCase() || <Person />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 500, color: CORAL }}>{question.username}</Typography>
                <Typography variant="caption" sx={{ color: MUTED, ml: 1 }}>{question.date ? new Date(question.date).toLocaleDateString() : ''}</Typography>
              </Box>
              {canDelete && (
                <IconButton size="small" onClick={() => { ReviewService.deleteQuestion(question.id).then(() => onDelete(question.id)).catch(console.error); }}
                  sx={{ color: '#CCCCCC', '&:hover': { color: '#ef4444' } }}>
                  <Delete sx={{ fontSize: 14 }} />
                </IconButton>
              )}
            </Box>
            <Typography sx={{ fontSize: 14, color: TEXT, fontWeight: 500, mt: 0.3, lineHeight: 1.55 }}>{question.questionText}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.2, gap: 0.5 }}>
          <Button size="small" endIcon={expanded ? <ExpandLess /> : <ExpandMore />} onClick={() => setExpanded(!expanded)}
            sx={{ color: CORAL, fontSize: '0.75rem', borderRadius: '20px', px: 1.2 }}>
            {answers.length === 0 ? 'No answers' : `${answers.length} answer${answers.length > 1 ? 's' : ''}`}
          </Button>
          {isAuthenticated && (
            <Button size="small" startIcon={<Send sx={{ fontSize: '11px !important' }} />}
              onClick={() => { setAnswerOpen(!answerOpen); setExpanded(true); }}
              sx={{ color: MUTED, fontSize: '0.75rem', borderRadius: '20px', px: 1.2 }}>
              Answer
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={expanded || answerOpen}>
        <Box sx={{ background: '#FAFAFA', px: 2, pb: 1.5, pt: 0.5 }}>
          {answers.map((a) => (
            <AnswerItem key={a.id} answer={a} currentUserId={currentUserId} isAdmin={isAdmin} questionId={question.id}
              onDelete={(id) => setAnswers((prev) => prev.filter((x) => x.id !== id))} />
          ))}
          <Collapse in={answerOpen}>
            <Box sx={{ mt: 1.5 }}>
              <TextField fullWidth size="small" multiline rows={2} placeholder="Write your answer..." value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: 13, background: WHITE } }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="contained" onClick={handleSubmitAnswer} disabled={submitting || !answerText.trim()}
                  sx={{ borderRadius: '20px', background: CORAL, fontSize: '0.75rem', '&:hover': { background: '#E85A25' } }}>
                  {submitting ? 'Posting...' : 'Post answer'}
                </Button>
                <Button size="small" onClick={() => setAnswerOpen(false)} sx={{ borderRadius: '20px', fontSize: '0.75rem', color: MUTED }}>Cancel</Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Collapse>
    </Box>
  );
};

const QASection = ({ establishmentId, establishmentType }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!establishmentId) return;
    setLoading(true);
    ReviewService.getQuestions(establishmentId, establishmentType)
      .then((res) => setQuestions(res.data))
      .catch(() => setError('Failed to load questions'))
      .finally(() => setLoading(false));
  }, [establishmentId, establishmentType]);

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) return;
    setSubmitting(true);
    try {
      const res = await ReviewService.createQuestion({ establishmentId, establishmentType, questionText: newQuestion.trim() });
      setQuestions((prev) => [res.data, ...prev]);
      setNewQuestion(''); setFormOpen(false);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <QuestionAnswer sx={{ color: CORAL, fontSize: 20 }} />
          <Typography sx={{ fontWeight: 500, fontSize: 17, color: TEXT }}>Questions & Answers</Typography>
        </Box>
        {isAuthenticated && (
          <Button startIcon={<Add />} variant="outlined" size="small" onClick={() => setFormOpen(!formOpen)}
            sx={{ borderRadius: '20px', fontSize: 12, color: CORAL, borderColor: CORAL, '&:hover': { background: ACCENT_LIGHT, borderColor: CORAL } }}>
            Ask a question
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Collapse in={formOpen}>
        <Box sx={{ p: 2.5, mb: 2, borderRadius: '12px', border: `0.5px solid ${BORDER}`, background: WHITE }}>
          <Typography variant="caption" sx={{ color: MUTED, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 1.2, display: 'block' }}>Your question</Typography>
          <TextField fullWidth multiline rows={3} placeholder="What would you like to know about this tour?" value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: '10px', fontSize: 14 } }} />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmitQuestion} disabled={submitting || !newQuestion.trim()}
              sx={{ borderRadius: '20px', fontWeight: 500, px: 3, background: CORAL, '&:hover': { background: '#E85A25' } }}>
              {submitting ? 'Posting...' : 'Post question'}
            </Button>
            <Button onClick={() => setFormOpen(false)} sx={{ borderRadius: '20px', color: MUTED }}>Cancel</Button>
          </Box>
        </Box>
      </Collapse>

      {!isAuthenticated && (
        <Box sx={{ p: 2, mb: 2, borderRadius: '12px', border: `0.5px dashed ${BORDER}`, background: '#FAFAFA', textAlign: 'center' }}>
          <LockOutlined sx={{ fontSize: 24, color: '#CCCCCC', mb: 0.5 }} />
          <Typography variant="body2" sx={{ color: MUTED, fontSize: 13 }}>
            <strong style={{ color: TEXT }}>Sign in</strong> to ask a question or post an answer.
          </Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} sx={{ color: CORAL }} />
        </Box>
      ) : questions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, background: '#FAFAFA', borderRadius: '12px', border: `0.5px solid ${BORDER}` }}>
          <QuestionAnswer sx={{ fontSize: 40, color: '#DDDDDD', mb: 1 }} />
          <Typography sx={{ color: MUTED, fontSize: 14 }}>No questions yet. Have something to ask?</Typography>
        </Box>
      ) : (
        questions.map((q) => (
          <QuestionItem key={q.id} question={q} currentUserId={user?.id} isAuthenticated={isAuthenticated} isAdmin={isAdmin?.()} onDelete={(id) => setQuestions((prev) => prev.filter((x) => x.id !== id))} onAnswerAdded={() => {}} />
        ))
      )}
    </Box>
  );
};

export default QASection;
