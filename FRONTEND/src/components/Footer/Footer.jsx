import React from "react";
import { Globe, ArrowUp } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer-wrapper">
      <div className="footer-container container">
        {/* Upper Footer: Multi-column links */}
        <div className="footer-links-grid">
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#aircover">AirCover</a></li>
              <li><a href="#anti-discrimination">Anti-discrimination</a></li>
              <li><a href="#disability-support">Disability support</a></li>
              <li><a href="#cancellation">Cancellation options</a></li>
              <li><a href="#neighborhood-concern">Report neighborhood concern</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3>Hosting</h3>
            <ul>
              <li><a href="#host-home">Airbnb your home</a></li>
              <li><a href="#host-cover">AirCover for Hosts</a></li>
              <li><a href="#host-resources">Hosting resources</a></li>
              <li><a href="#host-forum">Community forum</a></li>
              <li><a href="#host-responsibly">Hosting responsibly</a></li>
              <li><a href="#host-apartments">Airbnb-friendly apartments</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Airbnb</h3>
            <ul>
              <li><a href="#news">Newsroom</a></li>
              <li><a href="#features">New features</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#investors">Investors</a></li>
              <li><a href="#giftcards">Gift cards</a></li>
              <li><a href="#emergency">Airbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Lower Footer: Copyright & Settings */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© 2026 Airbnb, Inc.</span>
            <span className="dot">·</span>
            <a href="#privacy" className="footer-legal-link">Privacy</a>
            <span className="dot">·</span>
            <a href="#terms" className="footer-legal-link">Terms</a>
            <span className="dot">·</span>
            <a href="#sitemap" className="footer-legal-link">Sitemap</a>
            <span className="dot">·</span>
            <a href="#uk-slavery" className="footer-legal-link">UK Modern Slavery Act</a>
          </div>

          <div className="footer-bottom-right">
            <div className="footer-settings">
              <button className="settings-btn">
                <Globe size={16} />
                <span>English (US)</span>
              </button>
              <button className="settings-btn">
                <span>$ USD</span>
              </button>
            </div>

            <div className="footer-socials">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>


            <button onClick={scrollToTop} className="scroll-top-btn" title="Scroll to top" aria-label="Scroll to top">
              <ArrowUp size={16} />
              <span className="scroll-text">Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
