
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-16 bg-white border-t border-gray-100">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Pricing</Link></li>
              <li><Link to="/download" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Download</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">About</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Blog</Link></li>
              <li><Link to="/guides" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Guides</Link></li>
              <li><Link to="/help" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Terms</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-600 hover:text-calmi-accent transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-medium">Calmi</Link>
          </div>
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()} Calmi. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
