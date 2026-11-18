// src/pages/RegisterPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../slices/authSlice';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [clientError, setClientError] = useState('');

  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { user, isLoading, isError, isSuccess, message } = useSelector((s) => s.auth);

  useEffect(() => {
    if (isSuccess || user) navigate('/dashboard');
    return () => dispatch(reset());
  }, [user, isSuccess, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setClientError('');
    if (formData.password !== formData.confirmPassword) {
      return setClientError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setClientError('Password must be at least 6 characters');
    }
    dispatch(register({ name: formData.name, email: formData.email, password: formData.password }));
  };

  return (
    <div className="page-wrapper d-flex align-items-center justify-content-center" style={{ background: '#f8fafc' }}>
      <div className="form-card w-100">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Create account 🚀</h2>
          <p className="text-muted">Join the Tool Aura community</p>
        </div>

        {(isError || clientError) && <Alert variant="danger">{clientError || message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control name="name" value={formData.name} onChange={handleChange} placeholder="Nandini Sharma" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min. 6 characters" required />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat password" required />
          </Form.Group>

          <Button type="submit" className="w-100" disabled={isLoading}
            style={{ background: '#6366f1', border: 'none', padding: '10px' }}>
            {isLoading ? <Spinner size="sm" animation="border" /> : 'Create Account'}
          </Button>
        </Form>

        <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#6366f1' }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

