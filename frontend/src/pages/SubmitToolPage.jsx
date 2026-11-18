// src/pages/SubmitToolPage.jsx

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitTool, fetchCategories, resetToolState } from '../slices/toolSlice';
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function SubmitToolPage() {
  const dispatch = useDispatch();
  const { categories, isLoading, isSuccess, isError, message } = useSelector((s) => s.tools);

  const [formData, setFormData] = useState({
    name: '', description: '', category: '', websiteUrl: '', logoUrl: '',
  });

  useEffect(() => {
    dispatch(fetchCategories());
    return () => dispatch(resetToolState());
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitTool(formData));
  };

  if (isSuccess) {
    return (
      <div className="page-wrapper d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div style={{ fontSize: '4rem' }}>🎉</div>
          <h3 className="fw-bold mt-3">Tool Submitted!</h3>
          <p className="text-muted">Your submission is under review. We'll publish it once approved.</p>
          <div className="d-flex gap-2 justify-content-center mt-3">
            <Link to="/my-submissions" className="btn btn-primary" style={{ background: '#6366f1', border: 'none' }}>View My Submissions</Link>
            <Button variant="outline-secondary" onClick={() => { dispatch(resetToolState()); setFormData({ name:'',description:'',category:'',websiteUrl:'',logoUrl:'' }); }}>
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ background: '#f8fafc' }}>
      <Container style={{ maxWidth: 640 }}>
        <div className="mb-4">
          <h2 className="section-title">Submit an AI Tool</h2>
          <p className="text-muted-sm">Know a great AI tool? Share it with the community.</p>
        </div>

        {isError && <Alert variant="danger">{message}</Alert>}

        <div className="bg-white border rounded-3 p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Tool Name <span className="text-danger">*</span></Form.Label>
              <Form.Control name="name" value={formData.name} onChange={handleChange} placeholder="e.g. ChatGPT" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Description <span className="text-danger">*</span></Form.Label>
              <Form.Control as="textarea" rows={4} name="description" value={formData.description} onChange={handleChange}
                placeholder="Describe what this tool does and who it helps..." required maxLength={1000} />
              <Form.Text className="text-muted">{formData.description.length}/1000 characters</Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Category <span className="text-danger">*</span></Form.Label>
              <Form.Select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select a category...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium">Official Website URL <span className="text-danger">*</span></Form.Label>
              <Form.Control type="url" name="websiteUrl" value={formData.websiteUrl} onChange={handleChange}
                placeholder="https://example.com" required />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-medium">Logo URL <span className="text-muted">(optional)</span></Form.Label>
              <Form.Control type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange}
                placeholder="https://example.com/logo.png" />
              {formData.logoUrl && (
                <div className="mt-2">
                  <img src={formData.logoUrl} alt="Preview" style={{ height: 40, borderRadius: 8 }}
                    onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" disabled={isLoading} style={{ background: '#6366f1', border: 'none', flex: 1, padding: '10px' }}>
                {isLoading ? <Spinner size="sm" animation="border" /> : 'Submit Tool for Review'}
              </Button>
            </div>
          </Form>
        </div>

        <p className="text-muted text-center mt-3" style={{ fontSize: '0.82rem' }}>
          All submissions are reviewed by our team before appearing in the directory.
        </p>
      </Container>
    </div>
  );
}

export default SubmitToolPage;

