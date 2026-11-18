// src/pages/admin/AdminCategoriesPage.jsx

import { useState, useEffect } from 'react';
import { Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [toast, setToast]           = useState('');
  const [name, setName]             = useState('');
  const [description, setDesc]      = useState('');
  const [adding, setAdding]         = useState(false);
  const [deleteId, setDeleteId]     = useState(null);
  const [deleting, setDeleting]     = useState(false);

  const load = () => {
    setLoading(true);
    toolService.getCategories()
      .then(setCategories)
      .catch(() => setError('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError('');
    try {
      await toolService.adminCreateCategory({ name, description });
      setName(''); setDesc('');
      notify('Category created!');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await toolService.adminDeleteCategory(deleteId);
      setDeleteId(null);
      notify('Category deleted');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1">
        <h2 className="section-title mb-1">Manage Categories</h2>
        <p className="text-muted-sm mb-4">Organise AI tools into categories</p>

        {toast && <Alert variant="success">{toast}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        <div className="row g-4">
          {/* Add Category Form */}
          <div className="col-12 col-lg-5">
            <div className="bg-white border rounded-3 p-4">
              <h5 className="fw-bold mb-3">Add New Category</h5>
              <Form onSubmit={handleAdd}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Image Generation" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium">Description</Form.Label>
                  <Form.Control as="textarea" rows={2} value={description} onChange={(e) => setDesc(e.target.value)}
                    placeholder="Short description (optional)" />
                </Form.Group>
                <Button type="submit" disabled={adding} style={{ background: '#6366f1', border: 'none', width: '100%' }}>
                  {adding ? <Spinner size="sm" animation="border" /> : '+ Add Category'}
                </Button>
              </Form>
            </div>
          </div>

          {/* Category List */}
          <div className="col-12 col-lg-7">
            {loading ? <div className="text-center pt-5"><Spinner animation="border" /></div> : (
              <div className="bg-white border rounded-3 overflow-hidden">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c, i) => (
                      <tr key={c._id}>
                        <td className="text-muted">{i + 1}</td>
                        <td className="fw-medium">{c.name}</td>
                        <td><code style={{ fontSize: '0.78rem' }}>{c.slug}</code></td>
                        <td>
                          <Button size="sm" variant="outline-danger" onClick={() => setDeleteId(c._id)}>Delete</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {categories.length === 0 && (
                  <p className="text-center text-muted py-4">No categories yet. Add one!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirm */}
        <Modal show={!!deleteId} onHide={() => setDeleteId(null)} centered>
          <Modal.Header closeButton><Modal.Title>Delete Category</Modal.Title></Modal.Header>
          <Modal.Body>Are you sure? This will fail if any tools are using this category.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? <Spinner size="sm" animation="border" /> : 'Delete'}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default AdminCategoriesPage;

