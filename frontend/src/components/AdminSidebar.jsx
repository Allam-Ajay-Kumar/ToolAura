// src/components/AdminSidebar.jsx
// Sidebar navigation for admin panel

import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard',    label: '📊 Dashboard' },
  { to: '/admin/submissions',  label: '📥 Submissions' },
  { to: '/admin/tools',        label: '🛠️ Manage Tools' },
  { to: '/admin/categories',   label: '🏷️ Categories' },
  { to: '/admin/users',        label: '👥 Users' },
];

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="px-3 mb-3">
        <small className="text-uppercase" style={{ color: '#64748b', fontSize: '0.7rem', letterSpacing: 1 }}>
          Admin Panel
        </small>
      </div>
      <nav>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AdminSidebar;

