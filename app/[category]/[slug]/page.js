"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { todoService, taskService, questionService } from '@/lib/api';
import { getTopicUrl } from '@/lib/slug';

const getDisplayDifficulty = (difficulty) => {
  if (!difficulty) return 'Easy';
  const d = String(difficulty).toLowerCase();
  if (d.includes('beg') || d.includes('easy')) return 'Easy';
  if (d.includes('int') || d.includes('mid') || d.includes('med')) return 'Medium';
  if (d.includes('adv') || d.includes('hard')) return 'Hard';
  return 'Easy';
};

const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };

function ModuleDetailContent() {
  const params = useParams();
  const { category: categorySlug, slug: topicSlug, id: topicIdRaw } = params || {};
  const topicId = topicIdRaw ? parseInt(topicIdRaw, 10) : null;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authorized, setAuthorized] = useState(false);

  // Form states
  const [activeForm, setActiveForm] = useState(null);
  const [editingTopic, setEditingTopic] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionFormTab, setQuestionFormTab] = useState('general');
  const [expandedTab, setExpandedTab] = useState('explanation');
  const [newQuestionForm, setNewQuestionForm] = useState({
    title: '',
    difficulty: 'Easy',
    tags: '',
    description: '',
    code: '',
    explanation: ''
  });
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [questionFilter, setQuestionFilter] = useState('all');
  const [questionPage, setQuestionPage] = useState(0);

  // Excel upload states
  const [questionUploadMode, setQuestionUploadMode] = useState('manual');
  const [selectedFileForUpload, setSelectedFileForUpload] = useState(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.replace('/login');
    } else {
      try {
        const u = JSON.parse(localStorage.getItem('currentUser'));
        setUser(u);
        setAuthorized(true);
        loadModuleData(u);
      } catch (e) {
        localStorage.clear();
        router.replace('/login');
      }
    }
  }, [categorySlug, topicSlug, topicId, router]);

  const loadModuleData = async (u) => {
    setLoading(true);
    setError('');
    try {
      let topicDetail;
      if (categorySlug && topicSlug) {
        topicDetail = await todoService.getModuleBySlug(categorySlug, topicSlug);
      } else if (topicId) {
        topicDetail = await todoService.getTodo(topicId);
      }

      if (!topicDetail || !topicDetail.id) {
        setError('Module not found.');
        setLoading(false);
        return;
      }

      const tasks = await taskService.getUserTasks();
      setTopic(topicDetail);
      setQuestions(topicDetail.questions || []);
      setUserTasks(tasks || []);
    } catch (err) {
      console.error('Error loading module data:', err);
      setError('Could not retrieve module details.');
    } finally {
      setLoading(false);
    }
  };

  const currentTopicId = topic?.id;

  const handleEditTopicSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!currentTopicId) return;
    try {
      await todoService.updateTodo(currentTopicId, {
        title: editingTopic.title,
        category: editingTopic.category,
        difficulty: editingTopic.difficulty,
        estimatedTime: editingTopic.estimated_time || editingTopic.estimatedTime
      });
      setSuccess('Topic updated successfully!');
      setActiveForm(null);
      loadModuleData(user);
    } catch (err) {
      setError(err.message || 'Failed to update topic.');
    }
  };

  const handleDeleteTopic = async () => {
    if (!currentTopicId) return;
    if (!window.confirm('Are you sure you want to delete this topic and all its questions? This cannot be undone.')) return;
    setError('');
    setSuccess('');
    try {
      await todoService.deleteTodo(currentTopicId);
      setSuccess('Topic deleted successfully!');
      router.push('/?filter=all');
    } catch (err) {
      setError('Failed to delete topic.');
    }
  };

  const handleToggleTopicSelection = async () => {
    if (!currentTopicId) return;
    if (user && !user.approved && user.role !== 'admin') {
      setError('Your account is pending admin approval.');
      return;
    }
    setError('');
    setSuccess('');

    const existingTask = userTasks.find(t => t.item_type === 'topic' && t.item_id === currentTopicId);
    const backupTasks = [...userTasks];

    if (existingTask) {
      setUserTasks(prev => prev.filter(t => t.id !== existingTask.id));
      setSuccess('Topic removed from progress.');
    } else {
      const tempTask = {
        id: -Date.now(),
        item_type: 'topic',
        item_id: currentTopicId,
        status: 'In Progress',
        user_id: user.id
      };
      setUserTasks(prev => [...prev, tempTask]);
      setSuccess('Topic added to progress.');
    }

    try {
      const res = await taskService.toggleTopicSelection(currentTopicId);
      if (res && res.task) {
        setUserTasks(prev => prev.map(t => t.item_type === 'topic' && t.item_id === currentTopicId ? res.task : t));
      }
    } catch (err) {
      setUserTasks(backupTasks);
      setError(err.message || 'Failed to update topic progress state.');
    }
  };

  const handleCreateQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!currentTopicId) return;
    setError('');
    setSuccess('');
    try {
      await questionService.createQuestion({
        todo_id: currentTopicId,
        title: newQuestionForm.title,
        difficulty: newQuestionForm.difficulty,
        tags: newQuestionForm.tags,
        description: newQuestionForm.description,
        code: newQuestionForm.code,
        explanation: newQuestionForm.explanation
      });
      setSuccess('Question added successfully!');
      setNewQuestionForm({
        title: '',
        difficulty: 'Easy',
        tags: '',
        description: '',
        code: '',
        explanation: ''
      });
      setActiveForm(null);
      loadModuleData(user);
    } catch (err) {
      setError(err.message || 'Failed to add question.');
    }
  };

  const handleEditQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!editingQuestion) return;
    setError('');
    setSuccess('');
    try {
      await questionService.updateQuestion(editingQuestion.id, {
        title: editingQuestion.title,
        difficulty: editingQuestion.difficulty,
        tags: editingQuestion.tags,
        description: editingQuestion.description,
        code: editingQuestion.code,
        explanation: editingQuestion.explanation
      });
      setSuccess('Question updated successfully!');
      setActiveForm(null);
      setEditingQuestion(null);
      loadModuleData(user);
    } catch (err) {
      setError(err.message || 'Failed to update question.');
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    setError('');
    setSuccess('');
    try {
      await questionService.deleteQuestion(qId);
      setSuccess('Question deleted successfully!');
      loadModuleData(user);
    } catch (err) {
      setError('Failed to delete question.');
    }
  };

  const handleToggleQuestionTask = async (qId, newStatus) => {
    if (user && !user.approved && user.role !== 'admin') {
      setError('Your account is pending admin approval.');
      return;
    }
    setError('');

    const existingIndex = userTasks.findIndex(t => t.item_type === 'question' && t.item_id === qId);
    const backupTasks = [...userTasks];

    if (existingIndex >= 0) {
      const existingTask = userTasks[existingIndex];
      if (existingTask.status === newStatus) {
        setUserTasks(prev => prev.filter(t => !(t.item_type === 'question' && t.item_id === qId)));
      } else {
        const updated = { ...existingTask, status: newStatus };
        setUserTasks(prev => prev.map(t => (t.item_type === 'question' && t.item_id === qId ? updated : t)));
      }
    } else {
      const newTask = {
        id: -Date.now(),
        item_type: 'question',
        item_id: qId,
        status: newStatus,
        user_id: user.id
      };
      setUserTasks(prev => [...prev, newTask]);
    }

    try {
      await taskService.updateTask('question', qId, newStatus);
    } catch (err) {
      setUserTasks(backupTasks);
      setError(err.message || 'Failed to update question status.');
    }
  };

  const filteredQuestions = useMemo(() => {
    if (questionFilter === 'all') return questions;
    return questions.filter(q => {
      const task = userTasks.find(t => t.item_type === 'question' && t.item_id === q.id);
      const status = task ? task.status : 'Pending';
      return status.toLowerCase() === questionFilter.toLowerCase();
    });
  }, [questions, userTasks, questionFilter]);

  const questionsCount = questions.length;
  const completedQuestionsCount = useMemo(() => {
    return questions.filter(q => {
      const task = userTasks.find(t => t.item_type === 'question' && t.item_id === q.id);
      return task && task.status === 'Completed';
    }).length;
  }, [questions, userTasks]);

  const progressPercentage = questionsCount > 0 ? Math.round((completedQuestionsCount / questionsCount) * 100) : 0;
  const isTopicSelected = useMemo(() => {
    if (!currentTopicId) return false;
    return userTasks.some(t => t.item_type === 'topic' && t.item_id === currentTopicId);
  }, [userTasks, currentTopicId]);

  if (!authorized) return null;

  return (
    <div className="todo-detail-container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          {error}
          <button onClick={() => setError('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {success && (
        <div className="alert alert-success" style={{ marginBottom: '16px' }}>
          {success}
          <button onClick={() => setSuccess('')} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
          Loading module workspace...
        </div>
      ) : !topic ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <h3>Module Not Found</h3>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => router.push('/')}>
            Back to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Header Card */}
          <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span className="badge badge-category">{topic.category}</span>
                  <span className={`badge badge-difficulty badge-${getDisplayDifficulty(topic.difficulty).toLowerCase()}`}>
                    {getDisplayDifficulty(topic.difficulty)}
                  </span>
                  <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                    ⏱ {topic.estimated_time || topic.estimatedTime || '1 hour'}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '8px 0', color: 'var(--text-heading)' }}>
                  {topic.title}
                </h1>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  className={`btn ${isTopicSelected ? 'btn-success' : 'btn-secondary'}`}
                  onClick={handleToggleTopicSelection}
                >
                  {isTopicSelected ? '✓ Tracked in Dashboard' : '+ Track in Dashboard'}
                </button>

                {(user?.role === 'admin' || user?.can_edit) && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditingTopic({ ...topic });
                      setActiveForm('editTopic');
                    }}
                  >
                    Edit Module
                  </button>
                )}

                {(user?.role === 'admin' || user?.can_delete) && (
                  <button className="btn btn-danger" onClick={handleDeleteTopic}>
                    Delete Module
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-muted)' }}>
                <span>Module Completion</span>
                <span>{completedQuestionsCount} of {questionsCount} questions ({progressPercentage}%)</span>
              </div>
              <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progressPercentage}%`, backgroundColor: 'var(--success-color)', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'pending', 'in progress', 'completed'].map(f => (
                <button
                  key={f}
                  className={`btn btn-sm ${questionFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setQuestionFilter(f)}
                  style={{ textTransform: 'capitalize' }}
                >
                  {f}
                </button>
              ))}
            </div>

            {(user?.role === 'admin' || user?.can_edit) && (
              <button className="btn btn-primary" onClick={() => setActiveForm('createQuestion')}>
                + Add Question
              </button>
            )}
          </div>

          {/* Create Question Modal / Form */}
          {activeForm === 'createQuestion' && (
            <div className="modal-backdrop">
              <div className="modal-content" style={{ maxWidth: '600px', padding: '24px' }}>
                <h3 style={{ marginTop: 0 }}>Add New Question to {topic.title}</h3>
                <form onSubmit={handleCreateQuestionSubmit}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Question Title</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newQuestionForm.title}
                      onChange={e => setNewQuestionForm({ ...newQuestionForm, title: e.target.value })}
                      style={{ marginTop: '4px', width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Difficulty</label>
                      <select
                        className="form-input"
                        value={newQuestionForm.difficulty}
                        onChange={e => setNewQuestionForm({ ...newQuestionForm, difficulty: e.target.value })}
                        style={{ marginTop: '4px', width: '100%' }}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Tags (comma separated)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. array, pointer"
                        value={newQuestionForm.tags}
                        onChange={e => setNewQuestionForm({ ...newQuestionForm, tags: e.target.value })}
                        style={{ marginTop: '4px', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Code Template</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={newQuestionForm.code}
                      onChange={e => setNewQuestionForm({ ...newQuestionForm, code: e.target.value })}
                      style={{ marginTop: '4px', fontFamily: 'monospace', width: '100%' }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Explanation & Answer</label>
                    <textarea
                      className="form-input"
                      rows={4}
                      value={newQuestionForm.explanation}
                      onChange={e => setNewQuestionForm({ ...newQuestionForm, explanation: e.target.value })}
                      style={{ marginTop: '4px', width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Question</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Topic Modal */}
          {activeForm === 'editTopic' && editingTopic && (
            <div className="modal-backdrop">
              <div className="modal-content" style={{ maxWidth: '500px', padding: '24px' }}>
                <h3 style={{ marginTop: 0 }}>Edit Module</h3>
                <form onSubmit={handleEditTopicSubmit}>
                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Module Title</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingTopic.title}
                      onChange={e => setEditingTopic({ ...editingTopic, title: e.target.value })}
                      style={{ marginTop: '4px', width: '100%' }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Category</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={editingTopic.category}
                      onChange={e => setEditingTopic({ ...editingTopic, category: e.target.value })}
                      style={{ marginTop: '4px', width: '100%' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Difficulty</label>
                      <select
                        className="form-input"
                        value={editingTopic.difficulty}
                        onChange={e => setEditingTopic({ ...editingTopic, difficulty: e.target.value })}
                        style={{ marginTop: '4px', width: '100%' }}
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Est. Time</label>
                      <input
                        type="text"
                        className="form-input"
                        value={editingTopic.estimated_time || editingTopic.estimatedTime || '1 hour'}
                        onChange={e => setEditingTopic({ ...editingTopic, estimated_time: e.target.value })}
                        style={{ marginTop: '4px', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveForm(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredQuestions.length === 0 ? (
              <div className="card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No questions found under this filter.
              </div>
            ) : (
              filteredQuestions.map(q => {
                const task = userTasks.find(t => t.item_type === 'question' && t.item_id === q.id);
                const qStatus = task ? task.status : 'Pending';
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div key={q.id} className="card" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={qStatus === 'Completed'}
                          onChange={() => handleToggleQuestionTask(q.id, qStatus === 'Completed' ? 'Pending' : 'Completed')}
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', cursor: 'pointer', color: 'var(--text-heading)' }} onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}>
                            {q.title}
                          </h4>
                          <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                            <span className={`badge badge-difficulty badge-${getDisplayDifficulty(q.difficulty).toLowerCase()}`}>
                              {getDisplayDifficulty(q.difficulty)}
                            </span>
                            {q.tags && (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                🏷 {q.tags}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        >
                          {isExpanded ? 'Hide Solution' : 'View Solution'}
                        </button>
                        {(user?.role === 'admin' || user?.can_edit) && (
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => {
                              setEditingQuestion({ ...q });
                              setActiveForm('editQuestion');
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {(user?.role === 'admin' || user?.can_delete) && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Content: Code and Explanation */}
                    {isExpanded && (
                      <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
                        {q.description && (
                          <p style={{ color: 'var(--text-color)', marginBottom: '12px' }}>{q.description}</p>
                        )}

                        {q.code && (
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px' }}>Code Template</div>
                            <pre style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', overflowX: 'auto', fontFamily: 'monospace' }}>
                              <code>{q.code}</code>
                            </pre>
                          </div>
                        )}

                        {(q.explanation || q.answer) && (
                          <div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '4px' }}>Explanation & Answer</div>
                            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '6px', lineHeight: '1.6' }}>
                              {q.explanation || q.answer}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ModulePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Suspense fallback={<div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>}>
      <Layout searchQuery={searchQuery} setSearchQuery={setSearchQuery}>
        <ModuleDetailContent />
      </Layout>
    </Suspense>
  );
}
