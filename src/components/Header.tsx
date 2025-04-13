
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="py-6 border-b border-gray-100">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-xl font-medium">
          Calmi
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-sm hover:text-calmi-accent transition-colors">
            Home
          </Link>
          <Link to="/meditations" className="text-sm hover:text-calmi-accent transition-colors">
            Meditations
          </Link>
          <Link to="/about" className="text-sm hover:text-calmi-accent transition-colors">
            About
          </Link>
          <Link to="/pricing" className="text-sm hover:text-calmi-accent transition-colors">
            Pricing
          </Link>
          <Button className="bg-calmi-accent hover:bg-blue-700 text-white">
            Get Started
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-white z-50 border-b border-gray-100 animate-fade-in">
          <div className="container py-5 flex flex-col space-y-4">
            <Link 
              to="/" 
              className="py-2 hover:text-calmi-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/meditations" 
              className="py-2 hover:text-calmi-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Meditations
            </Link>
            <Link 
              to="/about" 
              className="py-2 hover:text-calmi-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/pricing" 
              className="py-2 hover:text-calmi-accent transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Button 
              className="bg-calmi-accent hover:bg-blue-700 text-white w-full"
              onClick={() => setIsOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
