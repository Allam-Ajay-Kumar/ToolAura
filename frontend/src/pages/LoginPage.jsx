// src/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../slices/authSlice';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess || user) {
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
    return () => dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="page-wrapper d-flex align-items-center justify-content-center" style={{ background: '#f8fafc' }}>
      <div className="form-card w-100">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Welcome back 👋</h2>
          <p className="text-muted">Log in to your Tool Aura account</p>
        </div>

        {isError && <Alert variant="danger">{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" name="email" value={email} onChange={handleChange} placeholder="you@example.com" required />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={password} onChange={handleChange} placeholder="Enter password" required />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={isLoading}
            style={{ background: '#6366f1', border: 'none', padding: '10px' }}>
            {isLoading ? <Spinner size="sm" animation="border" /> : 'Log In'}
          </Button>
        </Form>

        <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#6366f1' }}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

