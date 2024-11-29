import "./errorPage.scss";

import errorImage from "../../gallery/errorImage.gif";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="errorPage">
      <img src={errorImage} alt="error" />
      <p>You are lost ashen one</p>

      <Link id="errorLinkToHome" to="/">
        Return home
      </Link>
    </div>
  );
}
