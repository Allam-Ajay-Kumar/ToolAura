// src/pages/admin/AdminEditToolPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminEditToolPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [fetching, setFetching]     = useState(true);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    name: '', description: '', category: '', websiteUrl: '', logoUrl: '', status: 'approved', isFeatured: false,
  });

  useEffect(() => {
    Promise.all([toolService.getCategories(), toolService.adminGetAllTools({ limit: 100 })])
      .then(([cats, toolsRes]) => {
        setCategories(cats);
        const tool = toolsRes.data.find((t) => t._id === id);
        if (tool) {
          setForm({
            name: tool.name, description: tool.description,
            category: tool.category?._id || '',
            websiteUrl: tool.websiteUrl, logoUrl: tool.logoUrl || '',
            status: tool.status, isFeatured: tool.isFeatured || false,
          });
        }
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await toolService.adminUpdateTool(id, form);
      navigate('/admin/tools');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1 text-center pt-5"><Spinner animation="border" /></div>
    </div>
  );

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1" style={{ maxWidth: 640 }}>
        <h2 className="section-title mb-1">Edit Tool</h2>
        <p className="text-muted-sm mb-4">Update tool details</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="bg-white border rounded-3 p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Tool Name</Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description</Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Category</Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Website URL</Form.Label>
              <Form.Control type="url" name="websiteUrl" value={form.websiteUrl} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Logo URL</Form.Label>
              <Form.Control type="url" name="logoUrl" value={form.logoUrl} onChange={handleChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Status</Form.Label>
              <Form.Select name="status" value={form.status} onChange={handleChange}>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>

            <Form.Check type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
              label="Featured tool" className="mb-4" />

            <div className="d-flex gap-2">
              <Button type="submit" disabled={loading} style={{ background: '#6366f1', border: 'none', flex: 1 }}>
                {loading ? <Spinner size="sm" animation="border" /> : 'Save Changes'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/admin/tools')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AdminEditToolPage;

