import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Avatar, Button, TextField, Collapse,
  IconButton, CircularProgress, Alert, Divider
} from '@mui/material';
import {
  QuestionAnswer, Person, ExpandMore, ExpandLess, Send,
  Delete, LockOutlined, Add
} from '@mui/icons-material';
import ReviewService from '../../api/ReviewService';
import { useAuth } from '../../context/AuthContext';

const AnswerItem = ({ answer, currentUserId, isAdmin, questionId, onDelete }) => {
  const canDelete = isAdmin || currentUserId === answer.userId;

  const handleDelete = async () => {
    try {
      await ReviewService.deleteAnswer(questionId, answer.id);
      onDelete(answer.id);
    } catch (err) {
      console.error('Delete answer error', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, pl: 2, borderLeft: '2px solid #e0e7ff' }}>
      <Avatar sx={{ bgcolor: '#7c3aed', width: 32, height: 32, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
        {answer.username?.[0]?.toUpperCase() || <Person sx={{ fontSize: 16 }} />}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" fontWeight={700} color="secondary.main">{answer.username}</Typography>
            <Typography variant="caption" color="text.secondary">
              {answer.date ? new Date(answer.date).toLocaleDateString() : ''}
            </Typography>
          </Box>
          {canDelete && (
            <IconButton size="small" onClick={handleDelete} sx={{ color: '#9ca3af', '&:hover': { color: '#dc2626' } }}>
              <Delete sx={{ fontSize: 14 }} />
            </IconButton>
          )}
        </Box>
        <Typography variant="body2" sx={{ color: '#374151', lineHeight: 1.7 }}>{answer.answerText}</Typography>
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
  const answerCount = answers.length;

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      const res = await ReviewService.addAnswer(question.id, { answerText: answerText.trim() });
      setAnswers(res.data.answers || []);
      setAnswerText('');
      setAnswerOpen(false);
      setExpanded(true);
      onAnswerAdded?.(res.data);
    } catch (err) {
      console.error('Answer error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnswer = (answerId) => {
    setAnswers((prev) => prev.filter((a) => a.id !== answerId));
  };

  const handleDeleteQuestion = async () => {
    try {
      await ReviewService.deleteQuestion(question.id);
      onDelete(question.id);
    } catch (err) {
      console.error('Delete question error', err);
    }
  };

  return (
    <Paper elevation={0} sx={{ mb: 2, borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#2563eb', width: 38, height: 38, fontWeight: 700, flexShrink: 0 }}>
            {question.username?.[0]?.toUpperCase() || <Person />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="caption" fontWeight={700} color="primary.main">{question.username}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {question.date ? new Date(question.date).toLocaleDateString() : ''}
                </Typography>
              </Box>
              {canDelete && (
                <IconButton size="small" onClick={handleDeleteQuestion} sx={{ color: '#9ca3af', '&:hover': { color: '#dc2626' } }}>
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </Box>
            <Typography variant="body1" sx={{ color: '#111827', fontWeight: 500, mt: 0.5, lineHeight: 1.6 }}>
              {question.questionText}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5, gap: 1 }}>
          <Button
            size="small"
            endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
            sx={{ color: '#2563eb', fontWeight: 600, fontSize: '0.78rem', borderRadius: 2 }}
          >
            {answerCount === 0 ? 'No answers yet' : `${answerCount} answer${answerCount > 1 ? 's' : ''}`}
          </Button>
          {isAuthenticated && (
            <Button
              size="small"
              startIcon={<Send sx={{ fontSize: '12px !important' }} />}
              onClick={() => { setAnswerOpen(!answerOpen); setExpanded(true); }}
              sx={{ color: '#6b7280', fontSize: '0.78rem', borderRadius: 2 }}
            >
              Answer
            </Button>
          )}
        </Box>
      </Box>

      <Collapse in={expanded || answerOpen}>
        <Box sx={{ background: '#f8fafc', px: 2.5, pb: 2, pt: 1 }}>
          {answers.length > 0 && (
            <Box sx={{ mb: answerOpen ? 2 : 0 }}>
              {answers.map((answer) => (
                <AnswerItem
                  key={answer.id}
                  answer={answer}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  questionId={question.id}
                  onDelete={handleDeleteAnswer}
                />
              ))}
            </Box>
          )}

          <Collapse in={answerOpen}>
            <Box sx={{ mt: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={2}
                placeholder="Write your answer..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 2, background: 'white' } }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSubmitAnswer}
                  disabled={submitting || !answerText.trim()}
                  sx={{ borderRadius: 2, fontSize: '0.78rem', fontWeight: 700 }}
                >
                  {submitting ? 'Posting...' : 'Post Answer'}
                </Button>
                <Button size="small" onClick={() => setAnswerOpen(false)} sx={{ borderRadius: 2, fontSize: '0.78rem' }}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Box>
      </Collapse>
    </Paper>
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
      const res = await ReviewService.createQuestion({
        establishmentId,
        establishmentType,
        questionText: newQuestion.trim(),
      });
      setQuestions((prev) => [res.data, ...prev]);
      setNewQuestion('');
      setFormOpen(false);
    } catch (err) {
      console.error('Question error', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <QuestionAnswer color="primary" />
          <Typography variant="h5" fontWeight={700}>Questions & Answers</Typography>
        </Box>
        {isAuthenticated && (
          <Button
            startIcon={<Add />}
            variant="outlined"
            size="small"
            onClick={() => setFormOpen(!formOpen)}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Ask a Question
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

      <Collapse in={formOpen}>
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, color: '#374151' }}>
            Your Question
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="What would you like to know about this tour?"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSubmitQuestion}
              disabled={submitting || !newQuestion.trim()}
              sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
            >
              {submitting ? 'Posting...' : 'Post Question'}
            </Button>
            <Button onClick={() => setFormOpen(false)} sx={{ borderRadius: 2 }}>Cancel</Button>
          </Box>
        </Paper>
      </Collapse>

      {!isAuthenticated && (
        <Paper elevation={0} sx={{ p: 2.5, mb: 3, borderRadius: 3, border: '1px dashed #cbd5e1', background: '#f8fafc', textAlign: 'center' }}>
          <LockOutlined sx={{ fontSize: 32, color: '#9ca3af', mb: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Sign in</strong> to ask a question or post an answer.
          </Typography>
        </Paper>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} sx={{ color: '#3b82f6' }} />
        </Box>
      ) : questions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, background: '#f8fafc', borderRadius: 3 }}>
          <QuestionAnswer sx={{ fontSize: 48, color: '#cbd5e1', mb: 1 }} />
          <Typography color="text.secondary">No questions yet. Have something to ask?</Typography>
        </Box>
      ) : (
        questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            currentUserId={user?.id}
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin?.()}
            onDelete={handleDeleteQuestion}
            onAnswerAdded={() => {}}
          />
        ))
      )}
    </Box>
  );
};

export default QASection;
