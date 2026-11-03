function Header() {
  return (
    <header>
      <div className="header-controls">
        <div className="logo">
          RIV<span>OLT</span>
        </div>
      </div>

      <nav id="main-menu" aria-label="Основна навігація">
        <ul>
          <li><a href="#tshirts">Футболки</a></li>
          <li><a href="#hoodies">Кофти та худі</a></li>
          <li><a href="#about">Про бренд</a></li>
          <li><a href="#contacts">Контакти</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;