// src/pages/admin/AdminAddToolPage.jsx
// Admin direct-add tool form (bypasses pending review)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminAddToolPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [form, setForm] = useState({
    name: '', description: '', category: '', websiteUrl: '', logoUrl: '', isFeatured: false,
  });

  useEffect(() => {
    toolService.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await toolService.adminCreateTool(form);
      navigate('/admin/tools');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tool');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1" style={{ maxWidth: 640 }}>
        <h2 className="section-title mb-1">Add New Tool</h2>
        <p className="text-muted-sm mb-4">Tool will be published immediately (approved status)</p>

        {error && <Alert variant="danger">{error}</Alert>}

        <div className="bg-white border rounded-3 p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Tool Name <span className="text-danger">*</span></Form.Label>
              <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="e.g. Midjourney" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description <span className="text-danger">*</span></Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange}
                placeholder="What does this tool do?" required maxLength={1000} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Category <span className="text-danger">*</span></Form.Label>
              <Form.Select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Website URL <span className="text-danger">*</span></Form.Label>
              <Form.Control type="url" name="websiteUrl" value={form.websiteUrl} onChange={handleChange}
                placeholder="https://..." required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Logo URL</Form.Label>
              <Form.Control type="url" name="logoUrl" value={form.logoUrl} onChange={handleChange}
                placeholder="https://...logo.png" />
            </Form.Group>

            <Form.Check type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange}
              label="Mark as Featured tool (shown prominently)" className="mb-4" />

            <div className="d-flex gap-2">
              <Button type="submit" disabled={loading} style={{ background: '#6366f1', border: 'none', flex: 1 }}>
                {loading ? <Spinner size="sm" animation="border" /> : 'Add to Directory'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate('/admin/tools')}>Cancel</Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AdminAddToolPage;

