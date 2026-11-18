// src/pages/admin/AdminManageToolsPage.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Alert, Badge, Button, Modal } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminManageToolsPage() {
  const [tools,   setTools]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [toast,   setToast]   = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger' };

  const load = () => {
    setLoading(true);
    toolService.adminGetAllTools({ limit: 50 })
      .then((res) => setTools(res.data))
      .catch(() => setError('Failed to load tools'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await toolService.adminDeleteTool(deleteId);
      setToast('Tool deleted');
      setDeleteId(null);
      load();
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setError('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="section-title mb-1">Manage Tools</h2>
            <p className="text-muted-sm">{tools.length} total tools</p>
          </div>
          <Link to="/admin/tools/add" className="btn btn-primary" style={{ background: '#6366f1', border: 'none' }}>
            + Add Tool
          </Link>
        </div>

        {toast && <Alert variant="success">{toast}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}

        {!loading && (
          <div className="bg-white border rounded-3 overflow-hidden">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>#</th>
                  <th>Tool</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tools.map((t, i) => (
                  <tr key={t._id}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <div className="fw-semibold">{t.name}</div>
                      <small><a href={t.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1', fontSize: '0.78rem' }}>Visit ↗</a></small>
                    </td>
                    <td>{t.category?.name || '—'}</td>
                    <td>
                      <Badge bg={statusColors[t.status]} style={{ borderRadius: 20, padding: '3px 10px' }}>
                        {t.status}
                      </Badge>
                    </td>
                    <td>{t.isFeatured ? '⭐' : '—'}</td>
                    <td><small className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</small></td>
                    <td>
                      <div className="d-flex gap-1">
                        <Link to={`/admin/tools/edit/${t._id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                        <Button size="sm" variant="outline-danger" onClick={() => setDeleteId(t._id)}>Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirm Modal */}
        <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
          <Modal.Header closeButton><Modal.Title>Confirm Delete</Modal.Title></Modal.Header>
          <Modal.Body>Are you sure you want to permanently delete this tool? This action cannot be undone.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner size="sm" animation="border" /> : 'Delete Tool'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AdminManageToolsPage;

