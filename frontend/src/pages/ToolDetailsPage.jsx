// src/pages/ToolDetailsPage.jsx
// Only accessible to logged-in users (route is wrapped in ProtectedRoute in App.jsx).

import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchToolById,
  clearTool,
  addFavourite,
  removeFavourite,
  resetToolState,
} from '../slices/toolSlice';
import { Container, Badge, Button, Spinner, Alert } from 'react-bootstrap';

function ToolDetailsPage() {
  const { id }     = useParams();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const { tool, myFavourites, isLoading, isError, message } = useSelector((s) => s.tools);
  const { user } = useSelector((s) => s.auth);

  const isFav = myFavourites?.some((f) => f._id === tool?._id);

  useEffect(() => {
    // Clear any stale error from a previous page before fetching
    dispatch(resetToolState());
    dispatch(fetchToolById(id));
    return () => dispatch(clearTool());
  }, [id, dispatch]);

  // ── Loading ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" style={{ color: '#6366f1' }} />
        <p className="text-muted mt-3">Loading tool details...</p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────
  if (isError) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{message || 'Tool not found'}</Alert>
        <Link to="/tools" style={{ color: '#6366f1' }}>← Back to Directory</Link>
      </Container>
    );
  }

  if (!tool) return null;

  return (
    <div className="page-wrapper">
      <Container style={{ maxWidth: 760 }}>

        {/* Back link */}
        <Link to="/tools" className="text-muted text-decoration-none mb-4 d-inline-block">
          ← Back to Directory
        </Link>

        {/* ── Tool Header ──────────────────────────────────────── */}
        <div className="bg-white border rounded-3 p-4 mb-4">
          <div className="d-flex gap-3 align-items-start">
            {tool.logoUrl ? (
              <img
                src={tool.logoUrl}
                alt={tool.name}
                style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 14, background: '#f1f5f9', padding: 8 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="tool-logo-placeholder" style={{ width: 80, height: 80, fontSize: '1.8rem', flexShrink: 0 }}>
                {tool.name?.charAt(0)}
              </div>
            )}

            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <h1 className="h3 fw-bold mb-1">{tool.name}</h1>
                  {tool.category && (
                    <Badge bg="primary" style={{ background: '#6366f1' }}>
                      {tool.category.name}
                    </Badge>
                  )}
                </div>
                {tool.isFeatured && (
                  <Badge bg="warning" text="dark" style={{ height: 'fit-content' }}>
                    ⭐ Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Description ──────────────────────────────────────── */}
        <div className="bg-white border rounded-3 p-4 mb-4">
          <h5 className="fw-semibold mb-3">About this tool</h5>
          <p style={{ lineHeight: 1.8, color: '#374151' }}>{tool.description}</p>

          {/* Website URL preview (non-clickable, just informational) */}
          <div className="mt-3 p-2 bg-light rounded d-flex align-items-center gap-2">
            <span className="text-muted" style={{ fontSize: '0.82rem' }}>🌐</span>
            <span className="text-muted" style={{ fontSize: '0.82rem', wordBreak: 'break-all' }}>
              {tool.websiteUrl}
            </span>
          </div>
        </div>

        {/* ── Action Buttons ────────────────────────────────────── */}
        <div className="d-flex gap-3 flex-wrap">
          {/*
            Visit Website button:
            - Only shown to logged-in users (route is already protected,
              but we guard again here as best practice).
            - Opens the external site safely in a new tab with rel="noopener noreferrer"
              so the external site cannot access window.opener.
          */}
          {user ? (
            <a
              href={tool.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg"
              style={{ background: '#6366f1', border: 'none', flex: 1 }}
            >
              🌐 Visit Website ↗
            </a>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              style={{ flex: 1 }}
              onClick={() => navigate('/login')}
            >
              🔒 Login to Visit Website
            </Button>
          )}

          {/* Favourite toggle – only for logged-in users */}
          {user && (
            <Button
              variant={isFav ? 'danger' : 'outline-danger'}
              size="lg"
              style={{ flex: 1 }}
              onClick={() =>
                isFav
                  ? dispatch(removeFavourite(tool._id))
                  : dispatch(addFavourite(tool._id))
              }
            >
              {isFav ? '❤️ Remove Favourite' : '🤍 Add to Favourites'}
            </Button>
          )}
        </div>

        {/* Meta info */}
        {(tool.submittedBy || tool.createdAt) && (
          <p className="text-muted mt-4" style={{ fontSize: '0.8rem' }}>
            {tool.submittedBy && <>Submitted by <strong>{tool.submittedBy.name}</strong> · </>}
            Added {new Date(tool.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        )}
      </Container>
    </div>
  );
}

export default ToolDetailsPage;
