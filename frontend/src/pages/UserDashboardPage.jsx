// src/pages/UserDashboardPage.jsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMySubmissions, fetchMyFavourites } from '../slices/toolSlice';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';

function UserDashboardPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { mySubmissions, myFavourites, isLoading } = useSelector((s) => s.tools);

  useEffect(() => {
    dispatch(fetchMySubmissions());
    dispatch(fetchMyFavourites());
  }, [dispatch]);

  const pending  = mySubmissions.filter(t => t.status === 'pending').length;
  const approved = mySubmissions.filter(t => t.status === 'approved').length;
  const rejected = mySubmissions.filter(t => t.status === 'rejected').length;

  return (
    <div className="page-wrapper" style={{ background: '#f8fafc' }}>
      <Container>
        {/* Welcome */}
        <div className="mb-4">
          <h2 className="section-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-muted-sm">Here's an overview of your activity</p>
        </div>

        {/* Stats */}
        <Row className="g-3 mb-5">
          {[
            { label: 'Total Submissions', value: mySubmissions.length, cls: 'purple', icon: '📤' },
            { label: 'Approved',          value: approved,             cls: 'green',  icon: '✅' },
            { label: 'Pending Review',    value: pending,              cls: 'orange', icon: '⏳' },
            { label: 'Favourites',        value: myFavourites.length,  cls: 'blue',   icon: '❤️' },
          ].map((s) => (
            <Col xs={6} lg={3} key={s.label}>
              <div className={`stat-card ${s.cls}`}>
                <div style={{ fontSize: '1.6rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>{isLoading ? '…' : s.value}</div>
                <div style={{ opacity: 0.85, fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* Quick Actions */}
        <Row className="g-3 mb-5">
          {[
            { to: '/submit-tool',    icon: '➕', title: 'Submit a Tool',     desc: 'Share a new AI tool with the community' },
            { to: '/my-submissions', icon: '📋', title: 'My Submissions',    desc: 'Track status of tools you submitted' },
            { to: '/favourites',     icon: '❤️', title: 'My Favourites',     desc: 'View your saved AI tools' },
            { to: '/tools',          icon: '🔍', title: 'Browse Directory',  desc: 'Discover more AI tools' },
          ].map((a) => (
            <Col xs={12} sm={6} key={a.to}>
              <Link to={a.to} style={{ textDecoration: 'none' }}>
                <Card className="h-100 border" style={{ borderRadius: 12, transition: 'box-shadow .2s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,.15)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                >
                  <Card.Body className="d-flex gap-3 align-items-center">
                    <div style={{ fontSize: '1.8rem' }}>{a.icon}</div>
                    <div>
                      <div className="fw-semibold">{a.title}</div>
                      <div className="text-muted" style={{ fontSize: '0.82rem' }}>{a.desc}</div>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>

        {/* Recent Submissions */}
        {mySubmissions.length > 0 && (
          <div>
            <h5 className="fw-bold mb-3">Recent Submissions</h5>
            <div className="bg-white border rounded-3 overflow-hidden">
              <table className="table table-hover mb-0">
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th>Tool Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.slice(0, 5).map((t) => (
                    <tr key={t._id}>
                      <td className="fw-medium">{t.name}</td>
                      <td><small>{t.category?.name}</small></td>
                      <td>
                        <span className={`badge badge-${t.status}`} style={{ padding: '4px 10px', borderRadius: 20 }}>
                          {t.status}
                        </span>
                      </td>
                      <td><small className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default UserDashboardPage;

