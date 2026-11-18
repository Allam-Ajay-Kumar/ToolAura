// src/components/Navbar.jsx
// Adapts to three auth states:
//   • Guest  → Login + Register
//   • User   → Browse, Submit Tool, My Submissions, ❤️ Favourites, Profile, Logout
//   • Admin  → 🛡️ Admin Panel badge, Dashboard, Logout (no Favourites/Submit)

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { Navbar as BSNav, Nav, Container, Button, Badge, NavDropdown } from 'react-bootstrap';

function Navbar() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth);

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <BSNav bg="white" expand="lg" className="border-bottom shadow-sm" style={{ height: 60 }}>
      <Container>
        {/* ── Brand ───────────────────────────────────────────── */}
        <BSNav.Brand as={Link} to="/" className="navbar-brand">
          ✨ <span style={{ color: '#6366f1' }}>Tool</span> Aura
        </BSNav.Brand>

        <BSNav.Toggle aria-controls="main-nav" />
        <BSNav.Collapse id="main-nav">

          {/* Left side */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/tools">Browse Tools</Nav.Link>
          </Nav>

          {/* Right side */}
          <Nav className="align-items-center gap-1">

            {/* ── GUEST ──────────────────────────────────────── */}
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Link to="/register">
                  <Button size="sm" style={{ background: '#6366f1', border: 'none' }}>
                    Register
                  </Button>
                </Link>
              </>
            )}

            {/* ── ADMIN ──────────────────────────────────────── */}
            {user && isAdmin && (
              <>
                <Link to="/admin/dashboard" className="me-1">
                  <Badge bg="danger" style={{ padding: '6px 14px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    🛡️ Admin Panel
                  </Badge>
                </Link>

                {/* Admin dropdown */}
                <NavDropdown
                  title={`Hi, ${user.name?.split(' ')[0]}`}
                  id="admin-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/admin/dashboard">📊 Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/submissions">📥 Submissions</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/tools">🛠️ Manage Tools</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/admin/users">👥 Users</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

            {/* ── REGULAR USER ───────────────────────────────── */}
            {user && !isAdmin && (
              <>
                {/* Submit Tool — primary CTA for regular users */}
                <Link to="/submit-tool">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="me-1"
                    style={{ borderColor: '#6366f1', color: '#6366f1', fontSize: '0.82rem' }}
                  >
                    + Submit Tool
                  </Button>
                </Link>

                {/* Favourites */}
                <Nav.Link as={Link} to="/favourites" className="px-2">❤️</Nav.Link>

                {/* User dropdown */}
                <NavDropdown
                  title={`Hi, ${user.name?.split(' ')[0]}`}
                  id="user-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.Item as={Link} to="/dashboard">📊 Dashboard</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-submissions">📋 My Submissions</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/favourites">❤️ Favourites</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/profile">👤 My Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}

          </Nav>
        </BSNav.Collapse>
      </Container>
    </BSNav>
  );
}

export default Navbar;
