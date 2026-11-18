// src/pages/BrowseToolsPage.jsx
// Full directory with search + category filter + pagination

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTools, fetchCategories, fetchMyFavourites, resetToolState } from '../slices/toolSlice';
import { Container, Row, Col, Form, Button, Spinner, Pagination, Alert } from 'react-bootstrap';
import ToolCard from '../components/ToolCard';

function BrowseToolsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const { tools, categories, total, totalPages, currentPage, isLoading, isError, message } =
    useSelector((s) => s.tools);
  const { user } = useSelector((s) => s.auth);

  const [search, setSearch]     = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage]         = useState(1);

  // Load favourites so heart icons reflect the user's saved tools
  useEffect(() => {
    dispatch(resetToolState());          // clear any stale error from previous page
    if (user) dispatch(fetchMyFavourites());
    dispatch(fetchCategories());
  }, [dispatch, user]);

  // Re-fetch whenever filters or page change
  useEffect(() => {
    const params = { page, limit: 12 };
    if (search.trim()) params.search = search.trim();
    if (category)      params.category = category;
    dispatch(fetchTools(params));
  }, [dispatch, page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(fetchTools({ search: search.trim(), category, page: 1, limit: 12 }));
  };

  const handleCategoryClick = (slug) => {
    const next = slug === category ? '' : slug;
    setCategory(next);
    setPage(1);
  };

  const handleClear = () => {
    setSearch('');
    setCategory('');
    setPage(1);
    dispatch(fetchTools({ page: 1, limit: 12 }));
  };

  return (
    <div className="page-wrapper">
      <Container>
        <div className="mb-4">
          <h1 className="section-title">Browse AI Tools</h1>
          <p className="text-muted-sm">{total} tools in the directory</p>
        </div>

        {/* Error state */}
        {isError && (
          <Alert variant="danger" dismissible onClose={() => dispatch(resetToolState())}>
            {message}
          </Alert>
        )}

        {/* Search bar */}
        <Form onSubmit={handleSearch} className="d-flex gap-2 mb-4" style={{ maxWidth: 520 }}>
          <Form.Control
            placeholder="Search by name or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button type="submit" style={{ background: '#6366f1', border: 'none' }}>
            Search
          </Button>
          {(search || category) && (
            <Button variant="outline-secondary" onClick={handleClear}>
              Clear
            </Button>
          )}
        </Form>

        {/* Category pills */}
        <div className="d-flex flex-wrap gap-2 mb-4">
          <span
            className={`category-pill ${!category ? 'active' : ''}`}
            onClick={() => handleCategoryClick('')}
          >
            All
          </span>
          {categories.map((cat) => (
            <span
              key={cat._id}
              className={`category-pill ${category === cat.slug ? 'active' : ''}`}
              onClick={() => handleCategoryClick(cat.slug)}
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Tools grid */}
        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: '#6366f1' }} />
          </div>
        ) : tools.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No tools found</h5>
            <p>Try a different search term or category</p>
          </div>
        ) : (
          <>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3 mb-4">
              {tools.map((tool) => (
                <Col key={tool._id}>
                  <ToolCard tool={tool} />
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  />
                  {[...Array(totalPages)].map((_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={page === i + 1}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  />
                </Pagination>
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default BrowseToolsPage;
