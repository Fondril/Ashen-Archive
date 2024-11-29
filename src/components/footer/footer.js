import { Link, useLocation } from "react-router-dom";
import Logo from "../../gallery/AshenArchiveLogo.png";
import "./footer.scss";

function Footer() {
  const location = useLocation();
  function handleClick() {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="containerSection centerFlex footerContainer">
      <Link to="/" onClick={handleClick}>
        <div id="logoWrapper">
          <img className="footerLogo" src={Logo} alt="Logo" />
        </div>
      </Link>

      <div>
        <p>© 2024 AshenArchive. All rights reserved.</p>
        <p>Powered by React</p>
      </div>

      <p className="email">Contact @ markojovanovic.q@yahoo.com</p>
    </div>
  );
}

export default Footer;
