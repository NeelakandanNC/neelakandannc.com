import { Link } from 'react-router-dom';
import './pages.css';

export default function NotFound() {
  return (
    <div className="page container notfound">
      <span className="eyebrow">404</span>
      <h1 className="display display--xl">Lost the thread.</h1>
      <p className="lede">That page doesn't exist — or hasn't been built yet.</p>
      <Link to="/" className="back-link">← Back to index</Link>
    </div>
  );
}
