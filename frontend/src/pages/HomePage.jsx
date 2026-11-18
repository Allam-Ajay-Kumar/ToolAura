// src/pages/HomePage.jsx
// Landing page with hero, search, featured tools, and categories.
// Browse and search are public. Tool details & Visit link require login.

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTools, fetchCategories } from '../slices/toolSlice';
import { Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import ToolCard from '../components/ToolCard';

function HomePage() {
  const dispatch = useDispatch();
  const navigate  = useNavigate();
  const { tools, categories, isLoading } = useSelector((s) => s.tools);
  const { user } = useSelector((s) => s.auth);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTools({ limit: 8 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/tools?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="hero-section">
        <Container>
          <h1>Welcome to Tool Aura ✨</h1>
          <p>Discover and explore hundreds of AI tools — from coding assistants to image generators — all in one place.</p>

          <Form onSubmit={handleSearch} className="d-flex gap-2 justify-content-center" style={{ maxWidth: 520, margin: '0 auto' }}>
            <Form.Control
              size="lg"
              placeholder="Search AI tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 10 }}
            />
            <Button type="submit" size="lg" variant="light" style={{ borderRadius: 10, fontWeight: 600 }}>
              Search
            </Button>
          </Form>
        </Container>
      </section>

      {/* ── Categories ────────────────────────────────────── */}
      <section className="py-4 bg-white border-bottom">
        <Container>
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {categories.slice(0, 10).map((cat) => (
              <Link
                key={cat._id}
                to={`/tools?category=${cat.slug}`}
                className="category-pill"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Featured Tools ────────────────────────────────── */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="section-title">Featured AI Tools</h2>
              <p className="text-muted-sm">Handpicked tools to boost your productivity</p>
            </div>
            <Link to="/tools" className="btn btn-outline-primary" style={{ borderColor: '#6366f1', color: '#6366f1' }}>
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-5"><Spinner animation="border" style={{ color: '#6366f1' }} /></div>
          ) : (
            <Row xs={1} sm={2} lg={4} className="g-3">
              {tools.map((tool) => (
                <Col key={tool._id}><ToolCard tool={tool} /></Col>
              ))}
            </Row>
          )}

          {tools.length === 0 && !isLoading && (
            <div className="text-center py-5 text-muted">
              <p>No tools in the directory yet. <Link to="/submit-tool">Be the first to submit one!</Link></p>
            </div>
          )}
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="py-5 bg-white border-top">
        <Container className="text-center">
          <h3 className="fw-bold mb-2">Know an AI tool that's missing?</h3>
          <p className="text-muted mb-3">Submit it and help others discover it!</p>
          <Link to="/submit-tool" className="btn btn-primary" style={{ background: '#6366f1', border: 'none', padding: '10px 28px' }}>
            + Submit an AI Tool
          </Link>
        </Container>
      </section>
    </div>
  );
}

export default HomePage;

