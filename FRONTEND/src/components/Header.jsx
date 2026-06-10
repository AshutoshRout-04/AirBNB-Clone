function Header() {
  return (
    <header className="header">
      <div className="logo">
        Airbnb
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search destinations"
        />
      </div>

      <div className="menu">
        Become a host
      </div>
    </header>
  );
}

export default Header;