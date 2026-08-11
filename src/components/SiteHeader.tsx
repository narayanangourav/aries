import { UI_TEXT } from "../content";

export const SiteHeader = (): JSX.Element => (
  <header className="app-site-header">
    <a
      className="app-brand"
      href="#top"
      id="brand-home-link"
      aria-label={UI_TEXT.brandHomeLabel}
    >
      <span className="app-brand-mark" aria-hidden="true">
        <span>A</span>
      </span>
      <span className="app-brand-copy">
        <span className="app-brand-name">Aries</span>
        <span className="app-brand-product">Resume</span>
      </span>
    </a>
  </header>
);

