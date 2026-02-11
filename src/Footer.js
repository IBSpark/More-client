
import './Footer.css';
import { Link } from 'react-router-dom';
export default function Footer(){
    return(
        <>
         <footer className="footer">
        <div className="footer-links">
          <Link to="/contact us">Questions? Contact us.</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/help center">Help Center</Link>
          <Link to="/terms of use">Terms of Use</Link>
          <Link to="/privacy policy">Privacy Policy</Link>
          <Link to="/cookie prefernce">Cookie Preferences</Link>
          <Link to="/company info">Company Info</Link>
        </div>
      </footer>
        </>
    );
}