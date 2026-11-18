// src/pages/admin/AdminDashboardPage.jsx

import { useEffect, useState } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    toolService.adminGetDashboard()
      .then(setStats)
      .catch((e) => setError(e.response?.data?.message || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1">
        <h2 className="section-title mb-1">Admin Dashboard</h2>
        <p className="text-muted-sm mb-4">Platform overview</p>

        {loading && <div className="text-center py-5"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}

        {stats && (
          <>
            <Row className="g-3 mb-4">
              {[
                { label: 'Total Users',    value: stats.totalUsers,    cls: 'blue',   icon: '👥' },
                { label: 'Total Tools',    value: stats.totalTools,    cls: 'purple', icon: '🛠️' },
                { label: 'Approved Tools', value: stats.approvedCount, cls: 'green',  icon: '✅' },
                { label: 'Pending Review', value: stats.pendingCount,  cls: 'orange', icon: '⏳' },
                { label: 'Rejected',       value: stats.rejectedCount, cls: 'red',    icon: '❌' },
              ].map((s) => (
                <Col xs={6} lg={4} key={s.label}>
                  <div className={`stat-card ${s.cls}`}>
                    <div style={{ fontSize: '1.6rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>{s.value}</div>
                    <div style={{ opacity: 0.85, fontSize: '0.85rem' }}>{s.label}</div>
                  </div>
                </Col>
              ))}
            </Row>

            {/* Recent pending */}
            {stats.recentSubmissions?.length > 0 && (
              <div>
                <h5 className="fw-bold mb-3">Recent Pending Submissions</h5>
                <div className="bg-white border rounded-3 overflow-hidden">
                  <table className="table table-hover mb-0">
                    <thead style={{ background: '#f8fafc' }}>
                      <tr>
                        <th>Tool</th>
                        <th>Category</th>
                        <th>Submitted By</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSubmissions.map((t) => (
                        <tr key={t._id}>
                          <td className="fw-medium">{t.name}</td>
                          <td>{t.category?.name}</td>
                          <td>{t.submittedBy?.name || '—'}</td>
                          <td><small className="text-muted">{new Date(t.createdAt).toLocaleDateString()}</small></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;

