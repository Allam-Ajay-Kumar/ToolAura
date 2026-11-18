// src/pages/admin/AdminUsersPage.jsx

import { useState, useEffect } from 'react';
import { Spinner, Alert, Badge, Button } from 'react-bootstrap';
import AdminSidebar from '../../components/AdminSidebar';
import toolService from '../../services/toolService';

function AdminUsersPage() {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [toast, setToast]     = useState('');

  const load = () => {
    setLoading(true);
    toolService.adminGetUsers()
      .then(setUsers)
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleToggle = async (id) => {
    try {
      const updated = await toolService.adminToggleUserStatus(id);
      setToast(`User ${updated.isActive ? 'activated' : 'deactivated'}`);
      load();
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setError('Action failed');
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="admin-content flex-grow-1">
        <h2 className="section-title mb-1">Manage Users</h2>
        <p className="text-muted-sm mb-4">{users.length} registered users</p>

        {toast && <Alert variant="success">{toast}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="text-center py-5"><Spinner animation="border" /></div>
        ) : (
          <div className="bg-white border rounded-3 overflow-hidden">
            <table className="table table-hover mb-0">
              <thead style={{ background: '#f8fafc' }}>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}>
                    <td className="text-muted">{i + 1}</td>
                    <td className="fw-medium">{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge bg={u.isActive ? 'success' : 'secondary'} style={{ padding: '4px 10px', borderRadius: 20 }}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td><small className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</small></td>
                    <td>
                      <Button size="sm" variant={u.isActive ? 'outline-danger' : 'outline-success'}
                        onClick={() => handleToggle(u._id)}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="text-center text-muted py-4">No registered users yet</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;

