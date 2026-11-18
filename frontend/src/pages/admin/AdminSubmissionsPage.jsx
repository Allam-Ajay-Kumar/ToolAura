// src/pages/admin/AdminSubmissionsPage.jsx
// Review pending tool submissions – approve or reject with reason

import { useEffect, useState } from 'react';
import { Spinner, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterStatus, setFilter]     = useState('pending');
  const [error, setError]             = useState('');
  const [toast, setToast]             = useState('');

  // Modal state
  const [modal, setModal]       = useState(false);
  const [selected, setSelected] = useState(null);
  const [reason, setReason]     = useState('');
  const [action, setAction]     = useState('');
  const [reviewing, setReviewing] = useState(false);

  const load = (s = filterStatus) => {
    setLoading(true);
    setError('');
    toolService.adminGetSubmissions(s)
      .then(setSubmissions)
      .catch(() => setError('Failed to load submissions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(filterStatus); }, [filterStatus]);

  const openModal = (sub, act) => {
    setSelected(sub);
    setAction(act);
    setReason('');
    setModal(true);
  };

  const handleReview = async () => {
    if (action === 'rejected' && !reason.trim()) return;
    setReviewing(true);
    try {
      await toolService.adminReviewSubmission(selected._id, { status: action, rejectionReason: reason });
      setToast(`Tool ${action} successfully`);
      setModal(false);
      load(filterStatus);
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || 'Action failed');
    } finally {
      setReviewing(false);
    }
  };

  const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger' };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1">
        <h2 className="section-title mb-1">Manage Submissions</h2>
        <p className="text-muted-sm mb-4">Review user-submitted AI tools</p>

        {toast && <Alert variant="success">{toast}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Filter tabs */}
        <div className="d-flex gap-2 mb-4">
          {['pending', 'approved', 'rejected'].map((s) => (
            <Button key={s} size="sm" variant={filterStatus === s ? 'primary' : 'outline-secondary'}
              style={filterStatus === s ? { background: '#6366f1', border: 'none' } : {}}
              onClick={() => setFilter(s)}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Button>
          ))}
        </div>

        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}

        {!loading && submissions.length === 0 && (
          <div className="text-center py-5 bg-white border rounded-3">
            <p className="text-muted">No {filterStatus} submissions</p>
          </div>
        )}

        {!loading && submissions.length > 0 && (
          <div className="bg-white border rounded-3 overflow-hidden">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>Tool</th>
                  <th>Category</th>
                  <th>Submitted By</th>
                  <th>Website</th>
                  <th>Status</th>
                  {filterStatus === 'pending' && <th>Actions</th>}
                  {filterStatus === 'rejected' && <th>Reason</th>}
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <div className="fw-semibold">{s.name}</div>
                      <small className="text-muted">{s.description?.substring(0, 60)}…</small>
                    </td>
                    <td>{s.category?.name}</td>
                    <td>{s.submittedBy?.name || 'Admin'}<br /><small className="text-muted">{s.submittedBy?.email}</small></td>
                    <td>
                      <a href={s.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.82rem', color: '#6366f1' }}>
                        Visit ↗
                      </a>
                    </td>
                    <td>
                      <Badge bg={statusColors[s.status]} style={{ padding: '4px 10px', borderRadius: 20 }}>
                        {s.status}
                      </Badge>
                    </td>
                    {filterStatus === 'pending' && (
                      <td>
                        <div className="d-flex gap-1">
                          <Button size="sm" variant="success" onClick={() => openModal(s, 'approved')}>Approve</Button>
                          <Button size="sm" variant="danger"  onClick={() => openModal(s, 'rejected')}>Reject</Button>
                        </div>
                      </td>
                    )}
                    {filterStatus === 'rejected' && (
                      <td><small className="text-danger">{s.rejectionReason || '—'}</small></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Review Modal */}
        <Modal show={modal} onHide={() => setModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {action === 'approved' ? '✅ Approve' : '❌ Reject'} Tool
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You are about to <strong>{action}</strong> the submission: <strong>{selected?.name}</strong>
            </p>
            {action === 'rejected' && (
              <Form.Group>
                <Form.Label>Rejection Reason <span className="text-danger">*</span></Form.Label>
                <Form.Control as="textarea" rows={3} value={reason} onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why this tool is being rejected..." />
              </Form.Group>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button>
            <Button
              variant={action === 'approved' ? 'success' : 'danger'}
              onClick={handleReview}
              disabled={reviewing || (action === 'rejected' && !reason.trim())}
            >
              {reviewing ? <Spinner size="sm" animation="border" /> : `Confirm ${action}`}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AdminSubmissionsPage;

