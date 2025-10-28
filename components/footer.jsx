export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="footer-title">About FactChecker</h4>
          <p className="footer-text">
            Dedicated to helping you verify information and find the truth in an age of misinformation.
          </p>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                How It Works
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Our Sources
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="footer-copyright">© 2025 FactChecker. All rights reserved.</p>
      </div>
    </footer>
  )
}
