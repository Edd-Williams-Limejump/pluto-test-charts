import { Link } from "react-router-dom";

import "./Nav.scss";

const Nav = () => {
  return (
    <nav className="nav">
      <ul className="nav__list">
        <li>
          <Link exact to="/">
            Home
          </Link>
        </li>
        <li>
          <Link to="/react-charts">React Charts</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
