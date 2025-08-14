import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiChevronDown,
  FiMonitor,
  FiCpu,
  FiHeadphones,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { FaGamepad } from "react-icons/fa6";
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.css';
// Import both logos
import logoWhite from '../../assets/GGG_logo_white.png';
import logoBlack from '../../assets/GGG_logo_black.png';

const Navbar = ({ theme, toggleTheme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { getTotalItems, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme-based logo selection (inverted as requested)
  const currentLogo = theme === 'light' ? logoBlack : logoWhite;

  const menuCategories = [
    {
      name: 'PC GAMER',
      slug: 'pc-gamer',
      icon: <FiCpu />,
      subcategories: [
        { name: 'Desktop Config', slug: 'desktop-config' },
        { name: 'Full Gaming Setup', slug: 'full-gaming-setup' }
      ]
    },
    {
      name: 'MONITOR',
      slug: 'monitor',
      icon: <FiMonitor />
    },
    {
      name: 'WORKSTATION',
      slug: 'workstation',
      icon: <FiCpu />
    },
    {
      name: 'LAPTOP',
      slug: 'laptop',
      icon: <FiCpu />
    },
    {
      name: 'GAMING ACCESSORIES',
      slug: 'gaming-accessories',
      icon: <FaGamepad />,
      subcategories: [
        { name: 'Gaming Mouse', slug: 'gaming-mouse' },
        { name: 'Gaming Keyboards', slug: 'gaming-keyboards' },
        { name: 'Gaming Headsets', slug: 'gaming-headsets' },
        { name: 'Gaming Mouse Pads', slug: 'gaming-mouse-pads' },
        { name: 'Controllers & Wheels', slug: 'controllers-wheels' },
        { name: 'Webcams', slug: 'webcams' },
        { name: 'Gaming Bundles', slug: 'gaming-bundles' },
        { name: 'Microphones', slug: 'microphones' },
        { name: 'PC Speakers', slug: 'pc-speakers' },
        { name: 'Gaming Monitors', slug: 'gaming-monitors' },
        { name: 'Pro Stations', slug: 'pro-stations' },
        { name: 'Desktop PCs', slug: 'desktop-pcs' },
        { name: 'Gaming Laptops', slug: 'gaming-laptops' }
      ]
    },
    {
      name: 'COMPONENTS',
      slug: 'components',
      icon: <FiCpu />,
      subcategories: [
        { name: 'Processors', slug: 'processors' },
        { name: 'Motherboards', slug: 'motherboards' },
        { name: 'Graphics Cards', slug: 'graphics-cards' },
        { 
          name: 'Memory Modules', 
          slug: 'memory-modules',
          subsub: [
            { name: 'Laptop Memory', slug: 'laptop-memory' },
            { name: 'Desktop Memory', slug: 'desktop-memory' }
          ]
        },
        {
          name: 'Storage HDD / SSD',
          slug: 'storage',
          subsub: [
            { name: 'USB Flash Drives', slug: 'usb-flash-drives' },
            { name: 'Memory Cards', slug: 'memory-cards' },
            { name: 'Internal Hard Drives', slug: 'internal-hard-drives' },
            { name: 'SSD / NVMe', slug: 'ssd-nvme' },
            { name: 'External Hard Drives', slug: 'external-hard-drives' },
            { name: 'Storage Accessories', slug: 'storage-accessories' }
          ]
        },
        { name: 'PC Cases', slug: 'pc-cases' },
        { name: 'Power Supplies', slug: 'power-supplies' },
        {
          name: 'Cooling Systems',
          slug: 'cooling-systems',
          subsub: [
            { name: 'Case Cooling', slug: 'case-cooling' },
            { name: 'CPU Cooling', slug: 'cpu-cooling' },
            { name: 'Thermal Paste', slug: 'thermal-paste' },
            { name: 'Laptop Coolers', slug: 'laptop-coolers' }
          ]
        }
      ]
    }
  ];

  // Handle search functionality
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMobileMenuOpen(false);
    }
  };

  // Handle category navigation
  const handleCategoryClick = (categorySlug, subcategorySlug = null) => {
    const url = subcategorySlug 
      ? `/products?category=${categorySlug}&subcategory=${subcategorySlug}`
      : `/products?category=${categorySlug}`;
    navigate(url);
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  // Handle dropdown hover for desktop
  const handleMouseEnter = (categoryName) => {
    if (window.innerWidth > 768) {
      setActiveDropdown(categoryName);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setActiveDropdown(null);
    }
  };

  // ✅ UPDATED: Handle mobile dropdown toggle for both category and arrow
  const handleMobileCategoryClick = (category, event) => {
    event.stopPropagation();
    
    if (category.subcategories) {
      // If category has subcategories, toggle dropdown
      setActiveDropdown(activeDropdown === category.name ? null : category.name);
    } else {
      // If no subcategories, navigate directly
      handleCategoryClick(category.slug);
    }
  };

  // Handle logo click
  const handleLogoClick = () => {
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Handle cart toggle
  const handleCartClick = () => {
    toggleCart();
  };

  // ✅ NEW: Handle mobile menu close
  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Close dropdowns and mobile menu when route changes
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cartCount = getTotalItems();

  return (
    <nav className={styles.navbar}>
      {/* Upper Section */}
      <div className={styles.upperNav}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo} onClick={handleLogoClick}>
            <img src={currentLogo} alt="GGG - Good Game Guys" />
          </div>

          {/* Search Bar - Hidden on mobile */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={`${styles.searchBar} ${isSearchFocused ? styles.focused : ''}`}>
              <input 
                type="text" 
                placeholder="Search for products..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <button 
                type="submit" 
                className={styles.searchBtn}
                disabled={!searchTerm.trim()}
              >
                <FiSearch />
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className={styles.rightActions}>
            {/* Theme Toggle */}
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? <FiMoon /> : <FiSun />}
            </button>

            {/* User Account */}
            <Link to="/account" className={styles.accountBtn} title="My Account">
              <FiUser />
            </Link>
            
            {/* Shopping Cart */}
            <button 
              className={styles.cartBtn}
              onClick={handleCartClick}
              aria-label={`Shopping cart with ${cartCount} items`}
              title={`Cart (${cartCount} items)`}
            >
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className={styles.cartCount}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className={styles.mobileMenuBtn}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Lower Section - Desktop Navigation */}
      <div className={styles.lowerNav}>
        <div className={styles.container}>
          <div className={styles.menuCategories}>
            {menuCategories.map((category) => (
              <div 
                key={category.slug}
                className={styles.categoryWrapper}
                onMouseEnter={() => handleMouseEnter(category.name)}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`${styles.categoryButton} ${activeDropdown === category.name ? styles.active : ''}`}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  {category.subcategories && <FiChevronDown className={styles.chevron} />}
                </button>

                {/* Desktop Dropdown Menu */}
                {category.subcategories && activeDropdown === category.name && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownContent}>
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.slug} className={styles.subcategoryItem}>
                          <button
                            className={styles.subcategoryButton}
                            onClick={() => handleCategoryClick(category.slug, subcategory.slug)}
                          >
                            {subcategory.name}
                          </button>
                          
                          {/* Third Level Menu */}
                          {subcategory.subsub && (
                            <div className={styles.subsubMenu}>
                              {subcategory.subsub.map((subsubcategory) => (
                                <button
                                  key={subsubcategory.slug}
                                  className={styles.subsubButton}
                                  onClick={() => handleCategoryClick(category.slug, subsubcategory.slug)}
                                >
                                  {subsubcategory.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Navigation Links */}
            <Link to="/products" className={styles.allProductsLink}>
              All Products
            </Link>
            <Link to="/contact" className={styles.contactLink}>
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            {/* ✅ NEW: Mobile Menu Header with Close Button */}
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileMenuTitle}>
                <img src={currentLogo} alt="GGG" className={styles.mobileMenuLogo} />
                <span>Menu</span>
              </div>
              <button 
                className={styles.mobileMenuClose}
                onClick={handleMobileMenuClose}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className={styles.mobileSearchForm}>
              <div className={styles.mobileSearchBar}>
                <input 
                  type="text" 
                  placeholder="Search for products..."
                  className={styles.mobileSearchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                  type="submit" 
                  className={styles.mobileSearchBtn}
                  disabled={!searchTerm.trim()}
                >
                  <FiSearch />
                </button>
              </div>
            </form>

            {/* Mobile Categories */}
            <div className={styles.mobileCategories}>
              {menuCategories.map((category) => (
                <div key={category.slug} className={styles.mobileCategoryGroup}>
                  {/* ✅ UPDATED: Mobile Category Header - Clickable entire area */}
                  <div 
                    className={styles.mobileCategoryHeader}
                    onClick={(e) => handleMobileCategoryClick(category, e)}
                  >
                    <div className={styles.mobileCategoryButton}>
                      {category.icon}
                      <span>{category.name}</span>
                    </div>
                    {category.subcategories && (
                      <div className={styles.mobileDropdownToggle}>
                        <FiChevronDown 
                          className={`${styles.mobileChevron} ${
                            activeDropdown === category.name ? styles.rotated : ''
                          }`} 
                        />
                      </div>
                    )}
                  </div>

                  {/* Mobile Subcategories */}
                  {category.subcategories && activeDropdown === category.name && (
                    <div className={styles.mobileSubcategories}>
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.slug} className={styles.mobileSubcategoryGroup}>
                          <button
                            className={styles.mobileSubcategoryButton}
                            onClick={() => handleCategoryClick(category.slug, subcategory.slug)}
                          >
                            {subcategory.name}
                          </button>
                          
                          {/* Mobile Third Level */}
                          {subcategory.subsub && (
                            <div className={styles.mobileSubsubCategories}>
                              {subcategory.subsub.map((subsubcategory) => (
                                <button
                                  key={subsubcategory.slug}
                                  className={styles.mobileSubsubButton}
                                  onClick={() => handleCategoryClick(category.slug, subsubcategory.slug)}
                                >
                                  {subsubcategory.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Navigation Links */}
              <div className={styles.mobileNavLinks}>
                <Link 
                  to="/products" 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  All Products
                </Link>
                <Link 
                  to="/contact" 
                  className={styles.mobileNavLink}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
