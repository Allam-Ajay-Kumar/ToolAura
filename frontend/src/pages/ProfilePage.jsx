// src/pages/ProfilePage.jsx
// Displays the logged-in user's account information.

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import toolService from '../services/toolService';

function ProfilePage() {
  const { user } = useSelector((s) => s.auth);

  const [stats, setStats]     = useState({ submissions: 0, approved: 0, pending: 0, rejected: 0, favourites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [subs, favs] = await Promise.all([
          toolService.getMySubmissions(),
          toolService.getMyFavourites(),
        ]);
        setStats({
          submissions: subs.length,
          approved:    subs.filter((t) => t.status === 'approved').length,
          pending:     subs.filter((t) => t.status === 'pending').length,
          rejected:    subs.filter((t) => t.status === 'rejected').length,
          favourites:  favs.length,
        });
      } catch (e) {
        // non-critical – just show zeros
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  // Avatar initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="page-wrapper" style={{ background: '#f8fafc' }}>
      <Container style={{ maxWidth: 760 }}>

        {/* ── Profile Header Card ───────────────────────────── */}
        <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 16 }}>
          <Card.Body className="p-4">
            <div className="d-flex gap-4 align-items-center flex-wrap">

              {/* Avatar circle */}
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '1.6rem', fontWeight: 700, flexShrink: 0,
                }}
              >
                {initials}
              </div>

              <div className="flex-grow-1">
                <h3 className="fw-bold mb-1">{user?.name}</h3>
                <p className="text-muted mb-1" style={{ fontSize: '0.9rem' }}>
                  📧 {user?.email}
                </p>
                <div className="d-flex gap-2 align-items-center flex-wrap">
                  <Badge
                    bg={user?.role === 'admin' ? 'danger' : 'primary'}
                    style={{ background: user?.role === 'admin' ? undefined : '#6366f1', fontSize: '0.75rem' }}
                  >
                    {user?.role === 'admin' ? '🛡️ Administrator' : '👤 Member'}
                  </Badge>
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Joined {joinedDate}
                  </span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* ── Stats Row ─────────────────────────────────────── */}
        {loading ? (
          <div className="text-center py-4"><Spinner animation="border" style={{ color: '#6366f1' }} /></div>
        ) : (
          <Row className="g-3 mb-4">
            {[
              { label: 'Submissions',  value: stats.submissions, cls: 'purple', icon: '📤' },
              { label: 'Approved',     value: stats.approved,    cls: 'green',  icon: '✅' },
              { label: 'Pending',      value: stats.pending,     cls: 'orange', icon: '⏳' },
              { label: 'Favourites',   value: stats.favourites,  cls: 'blue',   icon: '❤️' },
            ].map((s) => (
              <Col xs={6} sm={3} key={s.label}>
                <div className={`stat-card ${s.cls} text-center`}>
                  <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.2 }}>{s.value}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        {/* ── Account Details ───────────────────────────────── */}
        <Card className="border shadow-sm mb-4" style={{ borderRadius: 12 }}>
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Account Details</h5>

            <table className="table table-borderless mb-0" style={{ fontSize: '0.9rem' }}>
              <tbody>
                <tr>
                  <td className="text-muted fw-medium" style={{ width: 160 }}>Full Name</td>
                  <td className="fw-semibold">{user?.name}</td>
                </tr>
                <tr>
                  <td className="text-muted fw-medium">Email Address</td>
                  <td>{user?.email}</td>
                </tr>
                <tr>
                  <td className="text-muted fw-medium">Account Type</td>
                  <td>
                    <Badge
                      bg={user?.role === 'admin' ? 'danger' : 'primary'}
                      style={{ background: user?.role === 'admin' ? undefined : '#6366f1' }}
                    >
                      {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                    </Badge>
                  </td>
                </tr>
                <tr>
                  <td className="text-muted fw-medium">Member Since</td>
                  <td>{joinedDate}</td>
                </tr>
              </tbody>
            </table>
          </Card.Body>
        </Card>

        {/* ── Quick Actions ─────────────────────────────────── */}
        <Card className="border shadow-sm" style={{ borderRadius: 12 }}>
          <Card.Body className="p-4">
            <h5 className="fw-bold mb-3">Quick Actions</h5>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/submit-tool" className="btn btn-primary" style={{ background: '#6366f1', border: 'none' }}>
                + Submit a Tool
              </Link>
              <Link to="/my-submissions" className="btn btn-outline-primary" style={{ borderColor: '#6366f1', color: '#6366f1' }}>
                My Submissions
              </Link>
              <Link to="/favourites" className="btn btn-outline-danger">
                ❤️ Favourites
              </Link>
              <Link to="/tools" className="btn btn-outline-secondary">
                Browse Tools
              </Link>
            </div>
          </Card.Body>
        </Card>

      </Container>
    </div>
  );
}

export default ProfilePage;

