// src/pages/MySubmissionsPage.jsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySubmissions } from '../slices/toolSlice';
import { Container, Spinner, Alert, Badge } from 'react-bootstrap';

const statusColors = { pending: 'warning', approved: 'success', rejected: 'danger' };

function MySubmissionsPage() {
  const dispatch = useDispatch();
  const { mySubmissions, isLoading, isError, message } = useSelector((s) => s.tools);

  useEffect(() => { dispatch(fetchMySubmissions()); }, [dispatch]);

  return (
    <div className="page-wrapper" style={{ background: '#f8fafc' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="section-title">My Submissions</h2>
            <p className="text-muted-sm">Track the status of AI tools you submitted</p>
          </div>
          <Link to="/submit-tool" className="btn btn-primary" style={{ background: '#6366f1', border: 'none' }}>
            + Submit New Tool
          </Link>
        </div>

        {isLoading && <div className="text-center py-5"><Spinner animation="border" style={{ color: '#6366f1' }} /></div>}
        {isError && <Alert variant="danger">{message}</Alert>}

        {!isLoading && mySubmissions.length === 0 && (
          <div className="text-center py-5 bg-white border rounded-3">
            <div style={{ fontSize: '3rem' }}>📤</div>
            <h5 className="mt-3">No submissions yet</h5>
            <p className="text-muted">Be the first to submit an AI tool!</p>
            <Link to="/submit-tool" className="btn btn-primary mt-2" style={{ background: '#6366f1', border: 'none' }}>Submit a Tool</Link>
          </div>
        )}

        {mySubmissions.length > 0 && (
          <div className="bg-white border rounded-3 overflow-hidden">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th style={{ width: 40 }}>#</th>
                  <th>Tool Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Reason / Note</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {mySubmissions.map((tool, i) => (
                  <tr key={tool._id}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <div className="fw-semibold">{tool.name}</div>
                      <small className="text-muted">{tool.websiteUrl}</small>
                    </td>
                    <td>{tool.category?.name || '—'}</td>
                    <td>
                      <Badge bg={statusColors[tool.status]} style={{ padding: '5px 12px', borderRadius: 20, fontSize: '0.78rem' }}>
                        {tool.status === 'pending'  && '⏳ '}
                        {tool.status === 'approved' && '✅ '}
                        {tool.status === 'rejected' && '❌ '}
                        {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      {tool.status === 'rejected' && tool.rejectionReason ? (
                        <small className="text-danger">{tool.rejectionReason}</small>
                      ) : tool.status === 'approved' ? (
                        <Link to={`/tools/${tool._id}`} style={{ color: '#6366f1', fontSize: '0.82rem' }}>View in directory →</Link>
                      ) : (
                        <small className="text-muted">Under review</small>
                      )}
                    </td>
                    <td><small className="text-muted">{new Date(tool.createdAt).toLocaleDateString()}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default MySubmissionsPage;

