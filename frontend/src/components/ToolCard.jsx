// src/components/ToolCard.jsx
// Reusable card for displaying a single AI tool.
// Tool details and Visit Website are only accessible after login.

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavourite, removeFavourite } from '../slices/toolSlice';
import { Card, Badge } from 'react-bootstrap';

function ToolCard({ tool }) {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user }  = useSelector((state) => state.auth);
  const { myFavourites } = useSelector((state) => state.tools);

  const isFav = myFavourites?.some((f) => f._id === tool._id);

  // Toggle favourite (only logged-in users reach here, but guard anyway)
  const handleFavToggle = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (isFav) {
      dispatch(removeFavourite(tool._id));
    } else {
      dispatch(addFavourite(tool._id));
    }
  };

  // Guests clicking "Visit" are redirected to login with a message
  const handleVisitClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate('/login');
    }
    // If logged in, the <a> tag's normal href behaviour opens the external URL
  };

  return (
    <Card className="tool-card h-100">
      <Card.Body className="d-flex flex-column p-3">

        {/* ── Header: logo + fav button ───────────────────────── */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex align-items-center gap-2">
            {tool.logoUrl ? (
              <img
                src={tool.logoUrl}
                alt={tool.name}
                className="tool-logo"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="tool-logo-placeholder">
                {tool.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h6 className="mb-0 fw-semibold" style={{ fontSize: '0.95rem' }}>
                {tool.name}
              </h6>
              {tool.category && (
                <Badge bg="light" text="dark" style={{ fontSize: '0.7rem' }}>
                  {tool.category.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Heart button – only visible after login */}
          {user && (
            <button
              className={`btn-fav ${isFav ? 'active' : ''}`}
              onClick={handleFavToggle}
              title={isFav ? 'Remove from favourites' : 'Add to favourites'}
            >
              {isFav ? '❤️' : '🤍'}
            </button>
          )}
        </div>

        {/* ── Description ─────────────────────────────────────── */}
        <p className="text-muted mb-3 flex-grow-1" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
          {tool.description?.length > 110
            ? tool.description.substring(0, 110) + '...'
            : tool.description}
        </p>

        {/* ── Action buttons ──────────────────────────────────── */}
        <div className="d-flex gap-2">
          {/* View Details – route is protected, guests are redirected to /login automatically */}
          <Link
            to={`/tools/${tool._id}`}
            className="btn btn-sm btn-outline-primary flex-grow-1"
            style={{ borderColor: '#6366f1', color: '#6366f1' }}
          >
            View Details
          </Link>

          {user ? (
            /* Logged-in: open external site in a new secure tab */
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary flex-grow-1"
              style={{ background: '#6366f1', border: 'none' }}
            >
              Visit ↗
            </a>
          ) : (
            /* Guest: show lock icon, clicking redirects to login */
            <button
              onClick={handleVisitClick}
              className="btn btn-sm btn-secondary flex-grow-1"
              title="Login required to visit this tool"
              style={{ fontSize: '0.82rem' }}
            >
              🔒 Login to Visit
            </button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ToolCard;
