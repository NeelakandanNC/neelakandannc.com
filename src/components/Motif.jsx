import './Motif.css';

/**
 * Generative, image-free visuals for venture cards.
 * variant: 'orbit' | 'network' | 'waves' | 'pulse'
 * glyph:   optional character shown in the orbit node (default 'A').
 */
export default function Motif({ variant = 'orbit', glyph = 'A' }) {
  return (
    <div className="motif-wrap" aria-hidden="true">
      <div className="motif-grid" />
      {variant === 'orbit' && (
        <div className="motif motif--orbit">
          <div className="motif__ring motif__ring--2">
            <span className="motif__sat" />
          </div>
          <div className="motif__ring motif__ring--1">
            <span className="motif__sat" />
          </div>
          <div className="motif__node">{glyph}</div>
        </div>
      )}

      {variant === 'network' && (
        <div className="motif motif--net">
          <span className="motif__n motif__n1" />
          <span className="motif__n motif__n2" />
          <span className="motif__n motif__n3" />
          <span className="motif__n motif__n4" />
          <span className="motif__n motif__n5" />
          <span className="motif__n motif__n6" />
          <svg className="motif__lines" viewBox="0 0 300 300" preserveAspectRatio="none">
            <line x1="60" y1="70" x2="160" y2="120" />
            <line x1="160" y1="120" x2="240" y2="60" />
            <line x1="160" y1="120" x2="110" y2="220" />
            <line x1="160" y1="120" x2="230" y2="210" />
            <line x1="110" y1="220" x2="230" y2="210" />
          </svg>
        </div>
      )}

      {variant === 'waves' && (
        <div className="motif motif--waves">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      )}

      {variant === 'pulse' && (
        <div className="motif motif--pulse">
          <span />
          <span />
          <span />
          <span className="motif__core" />
        </div>
      )}
    </div>
  );
}
