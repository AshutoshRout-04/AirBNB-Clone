import React, { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Globe, Menu, User, Search, LogIn, UserPlus, HelpCircle } from "lucide-react";
import "./Navbar.css";

// Custom premium SVGs matching image 2
const GlobeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F8F9FA" stroke="#8B5A2B" strokeWidth="1.5"/>
    <path d="M12 2C14.5 5 16 8.5 16 12C16 15.5 14.5 19 12 22C9.5 19 8 15.5 8 12C8 8.5 9.5 5 12 2Z" stroke="#8B5A2B" strokeWidth="1"/>
    <path d="M2.5 12H21.5" stroke="#8B5A2B" strokeWidth="1"/>
    <path d="M12 2V22" stroke="#8B5A2B" strokeWidth="1"/>
  </svg>
);

const HomesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Tree */}
    <path d="M19 18H21M20 18V15M20 15C20.8 15 21.2 14.2 20.8 13.5C21.2 12.8 20.8 12 20 12C20 11.2 19.2 11.2 18.8 12C18.4 11.2 17.6 11.2 17.6 12C16.8 12 16.4 12.8 16.8 13.5C16.4 14.2 16.8 15 17.6 15H20Z" fill="#34A853" stroke="#2E7D32" strokeWidth="0.8"/>
    {/* House */}
    <path d="M4 18V10L10 5L16 10V18H4Z" fill="#E8EAED" stroke="#5F6368" strokeWidth="1.5"/>
    <path d="M8 18V13H12V18H8Z" fill="#BDC1C6" stroke="#5F6368" strokeWidth="1.2"/>
  </svg>
);

const ExperiencesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 5 5 5 9C5 13 8 16 10 18H14C16 16 19 13 19 9C19 5 16 2 12 2Z" fill="#EA4335" stroke="#C5221F" strokeWidth="1.5"/>
    <path d="M9 4C11 6 11 12 9 16" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1"/>
    <path d="M15 4C13 6 13 12 15 16" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="1 1"/>
    <rect x="11" y="20" width="2" height="2" rx="0.5" fill="#8B5A2B" stroke="#5C3A21" strokeWidth="1"/>
    <line x1="10" y1="18" x2="11" y2="20" stroke="#5C3A21" strokeWidth="0.8"/>
    <line x1="14" y1="18" x2="13" y2="20" stroke="#5C3A21" strokeWidth="0.8"/>
  </svg>
);

const ServicesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 6V3.5M12 3.5H10M12 3.5H14" stroke="#5F6368" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4 16C4 11 8 7 12 7C16 7 20 11 20 16H4Z" fill="#9AA0A6" stroke="#5F6368" strokeWidth="1.5"/>
    <rect x="2" y="16" width="20" height="2.5" rx="1" fill="#3C4043" stroke="#3C4043" strokeWidth="1"/>
  </svg>
);

const Navbar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const dateRef = useRef(null);
  const guestRef = useRef(null);

  // Parse state from URL search params
  const activeTab = searchParams.get("tab") || "All";
  const searchQuery = searchParams.get("search") || "";
  const checkInParam = searchParams.get("checkIn") || "";
  const checkOutParam = searchParams.get("checkOut") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "1");

  // State for search fields
  const [whereInput, setWhereInput] = useState(searchQuery);
  const [checkInDate, setCheckInDate] = useState(checkInParam);
  const [checkOutDate, setCheckOutDate] = useState(checkOutParam);
  const [guestsCount, setGuestsCount] = useState(guestsParam);

  // Sync inputs with search params when they change externally
  useEffect(() => {
    setWhereInput(searchQuery);
    setCheckInDate(checkInParam);
    setCheckOutDate(checkOutParam);
    setGuestsCount(guestsParam);
  }, [searchQuery, checkInParam, checkOutParam, guestsParam]);

  // Handle outside clicks to close profile, date and guest dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setIsDateDropdownOpen(false);
      }
      if (guestRef.current && !guestRef.current.contains(event.target)) {
        setIsGuestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tabName) => {
    const nextParams = Object.fromEntries(searchParams);
    nextParams.tab = tabName;
    setSearchParams(nextParams);
    if (window.location.pathname !== "/") {
      navigate(`/?tab=${tabName}`);
    }
  };

  const handleGuestChange = (change) => {
    setGuestsCount(prev => Math.max(1, prev + change));
  };

  const handleSearchSubmit = () => {
    const nextParams = { ...Object.fromEntries(searchParams) };
    
    if (whereInput) nextParams.search = whereInput;
    else delete nextParams.search;

    if (checkInDate) nextParams.checkIn = checkInDate;
    else delete nextParams.checkIn;

    if (checkOutDate) nextParams.checkOut = checkOutDate;
    else delete nextParams.checkOut;

    if (guestsCount > 1) nextParams.guests = guestsCount;
    else delete nextParams.guests;

    setIsDateDropdownOpen(false);
    setIsGuestDropdownOpen(false);

    if (window.location.pathname !== "/") {
      // Navigate to homepage with query params
      const qStr = new URLSearchParams(nextParams).toString();
      navigate(`/?${qStr}`);
    } else {
      setSearchParams(nextParams);
    }
  };

  const clearSearch = () => {
    setSearchParams({ tab: activeTab });
    setWhereInput("");
    setCheckInDate("");
    setCheckOutDate("");
    setGuestsCount(1);
  };

  // Helper labels for Date and Guest picker
  const dateText = checkInDate && checkOutDate 
    ? `${checkInDate.substring(5)} to ${checkOutDate.substring(5)}`
    : "Add dates";

  const guestText = guestsCount > 1 
    ? `${guestsCount} guests` 
    : "Add guests";

  return (
    <header className="navbar-header">
      <div className="navbar-container container">
        {/* Top Row: Logo, Tabs, User Menu */}
        <div className="navbar-top-row">
          {/* Left: Logo */}
          <Link to="/" className="navbar-logo" onClick={clearSearch}>
            <svg
              className="logo-svg"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836 1.455 3.402.533 7.543-2.316 9.877-1.742 1.428-3.908 2.017-6.112 2.017-.93 0-1.866-.102-2.772-.338l-1.015-.296c-.347-.116-.763-.116-1.11 0l-1.015.296c-.906.236-1.842.338-2.772.338-2.204 0-4.37-.589-6.112-2.017-2.849-2.334-3.77-6.475-2.316-9.877.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.298 0-2.202.603-3.116 2.233l-.527 1.013C10.42 10.05 6.29 18.728 5.345 20.927c-1.016 2.373-.346 5.215 1.636 6.84 1.22 1 2.741 1.4 4.28 1.4.747 0 1.492-.09 2.21-.278l1.016-.297c1-.291 2.03-.291 3.03 0l1.015.297c.718.188 1.463.278 2.21.278 1.539 0 3.06-.4 4.28-1.4 1.982-1.625 2.652-4.467 1.636-6.84-.945-2.199-5.076-10.877-7.012-14.681l-.527-1.013C18.202 3.603 17.298 3 16 3zm0 7.42c1.78 0 3.22 1.444 3.22 3.222 0 1.6-1.16 2.924-2.673 3.174l-.19.022c-1.78 0-3.22-1.444-3.22-3.222 0-1.6 1.16-2.924 2.673-3.174l.19-.022zm0 2c-.674 0-1.22.548-1.22 1.222 0 .633.48 1.155 1.096 1.214l.124.008c.674 0 1.22-.548 1.22-1.222 0-.633-.48-1.155-1.096-1.214l-.124-.008zm0 7.462c-3.12 0-5.7 1.962-6.7 4.747-.13.358-.02.763.277 1.006.299.243.723.255 1.037.031l.1-.077c1.378-1.14 3.124-1.761 4.93-1.761 1.806 0 3.552.62 4.93 1.761.27.224.66.248.955.07l.102-.072c.338-.276.435-.745.215-1.127l-.078-.12c-1.002-2.71-3.582-4.639-6.697-4.639z" />
            </svg>
            <span className="logo-text">airbnb</span>
          </Link>

          {/* Center Tabs Row */}
          <div className="navbar-tabs">
            <button
              className={`tab-item ${activeTab === "All" ? "active" : ""}`}
              onClick={() => handleTabClick("All")}
            >
              <GlobeIcon />
              <span>All</span>
            </button>
            <button
              className={`tab-item ${activeTab === "Homes" ? "active" : ""}`}
              onClick={() => handleTabClick("Homes")}
            >
              <HomesIcon />
              <span>Homes</span>
            </button>
            <button
              className={`tab-item ${activeTab === "Experiences" ? "active" : ""}`}
              onClick={() => handleTabClick("Experiences")}
            >
              <ExperiencesIcon />
              <span>Experiences</span>
            </button>
            <button
              className={`tab-item ${activeTab === "Services" ? "active" : ""}`}
              onClick={() => handleTabClick("Services")}
            >
              <ServicesIcon />
              <span>Services</span>
            </button>
          </div>

          {/* Right: User Menu */}
          <div className="navbar-user-menu" ref={dropdownRef}>
            <button className="become-host-btn">
              Become a host
            </button>
            
            <button className="globe-btn" aria-label="Choose a language">
              <Globe size={18} />
            </button>

            <button
              className="user-profile-btn"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
              aria-label="User menu"
            >
              <Menu size={18} />
              <div className="avatar-placeholder">
                <User size={18} className="user-icon" />
              </div>
            </button>

            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <ul className="dropdown-list">
                  <li className="dropdown-item bold">
                    <UserPlus size={16} />
                    <span>Sign up</span>
                  </li>
                  <li className="dropdown-item">
                    <LogIn size={16} />
                    <span>Log in</span>
                  </li>
                  <hr className="dropdown-divider" />
                  <li className="dropdown-item">
                    <span>Become a host</span>
                  </li>
                  <li className="dropdown-item">
                    <HelpCircle size={16} />
                    <span>Help Center</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Detailed Search Bar Panel */}
        <div className="navbar-bottom-row">
          <div className="search-panel-container">
            <div className="search-panel">
              {/* Where */}
              <div className="search-panel-field where-field">
                <label htmlFor="search-where">Where</label>
                <input
                  id="search-where"
                  type="text"
                  placeholder="Search destinations"
                  value={whereInput}
                  onChange={(e) => setWhereInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchSubmit();
                  }}
                />
              </div>

              <div className="field-divider"></div>

              {/* When */}
              <div 
                className="search-panel-field when-field" 
                ref={dateRef}
                onClick={() => {
                  setIsDateDropdownOpen(!isDateDropdownOpen);
                  setIsGuestDropdownOpen(false);
                }}
              >
                <span className="field-label">When</span>
                <span className="field-value">{dateText}</span>
                
                {isDateDropdownOpen && (
                  <div className="date-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="date-inputs-row">
                      <div className="date-input-wrapper">
                        <label>Check-in</label>
                        <input 
                          type="date" 
                          value={checkInDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setCheckInDate(e.target.value)}
                        />
                      </div>
                      <div className="date-input-wrapper">
                        <label>Check-out</label>
                        <input 
                          type="date" 
                          value={checkOutDate}
                          min={checkInDate || new Date().toISOString().split("T")[0]}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                        />
                      </div>
                    </div>
                    <button className="apply-btn" onClick={() => setIsDateDropdownOpen(false)}>Apply</button>
                  </div>
                )}
              </div>

              <div className="field-divider"></div>

              {/* Who */}
              <div 
                className="search-panel-field who-field" 
                ref={guestRef}
                onClick={() => {
                  setIsGuestDropdownOpen(!isGuestDropdownOpen);
                  setIsDateDropdownOpen(false);
                }}
              >
                <span className="field-label">Who</span>
                <span className="field-value">{guestText}</span>

                {isGuestDropdownOpen && (
                  <div className="guest-picker-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="guest-counter-row">
                      <div className="guest-counter-label">
                        <strong>Guests</strong>
                        <span>Number of guests</span>
                      </div>
                      <div className="counter-controls">
                        <button type="button" onClick={() => handleGuestChange(-1)} disabled={guestsCount <= 1}>-</button>
                        <span>{guestsCount}</span>
                        <button type="button" onClick={() => handleGuestChange(1)}>+</button>
                      </div>
                    </div>
                    <button className="apply-btn" onClick={() => setIsGuestDropdownOpen(false)}>Apply</button>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button className="search-submit-btn" onClick={handleSearchSubmit} aria-label="Search">
                <Search size={16} color="#FFFFFF" strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
