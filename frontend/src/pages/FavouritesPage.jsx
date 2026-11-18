// src/pages/FavouritesPage.jsx

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyFavourites, removeFavourite } from '../slices/toolSlice';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';

function FavouritesPage() {
  const dispatch = useDispatch();
  const { myFavourites, isLoading } = useSelector((s) => s.tools);

  useEffect(() => { dispatch(fetchMyFavourites()); }, [dispatch]);

  return (
    <div className="page-wrapper" style={{ background: '#f8fafc' }}>
      <Container>
        <div className="mb-4">
          <h2 className="section-title">❤️ My Favourites</h2>
          <p className="text-muted-sm">{myFavourites.length} saved tool{myFavourites.length !== 1 ? 's' : ''}</p>
        </div>

        {isLoading && <div className="text-center py-5"><Spinner animation="border" style={{ color: '#6366f1' }} /></div>}

        {!isLoading && myFavourites.length === 0 && (
          <div className="text-center py-5 bg-white border rounded-3">
            <div style={{ fontSize: '3rem' }}>🤍</div>
            <h5 className="mt-3">No favourites yet</h5>
            <p className="text-muted">Browse the directory and click the heart icon to save tools</p>
            <Link to="/tools" className="btn btn-primary mt-2" style={{ background: '#6366f1', border: 'none' }}>Browse Tools</Link>
          </div>
        )}

        <Row xs={1} sm={2} lg={3} className="g-3">
          {myFavourites.map((tool) => (
            <Col key={tool._id}>
              <Card className="tool-card h-100">
                <Card.Body className="d-flex flex-column p-3">
                  <div className="d-flex gap-2 align-items-center mb-2">
                    {tool.logoUrl ? (
                      <img src={tool.logoUrl} alt={tool.name} className="tool-logo" />
                    ) : (
                      <div className="tool-logo-placeholder">{tool.name?.charAt(0)}</div>
                    )}
                    <div>
                      <h6 className="mb-0 fw-semibold">{tool.name}</h6>
                      <small className="text-muted">{tool.category?.name}</small>
                    </div>
                  </div>

                  <p className="text-muted flex-grow-1" style={{ fontSize: '0.84rem' }}>
                    {tool.description?.substring(0, 100)}...
                  </p>

                  <div className="d-flex gap-2">
                    <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer"
                      className="btn btn-sm btn-primary flex-grow-1" style={{ background: '#6366f1', border: 'none' }}>
                      Visit ↗
                    </a>
                    <Button variant="outline-danger" size="sm"
                      onClick={() => dispatch(removeFavourite(tool._id))}>
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default FavouritesPage;

