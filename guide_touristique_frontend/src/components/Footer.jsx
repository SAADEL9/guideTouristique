import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__column">
          <div className="footer__title">HiddenSpots</div>
          <p className="footer__text">
            Discover the most beautiful and secret locations shared by our community of travelers and explorers.
          </p>
        </div>

        <div className="footer__column">
          <div className="footer__title">Team Members</div>
          <ul className="footer__list">
            <li className="footer__item">Mohamed Moughamir</li>
            <li className="footer__item">Adam Boussid</li>
            <li className="footer__item">Saad Elmahi</li>
            <li className="footer__item">Soukaina Gourram</li>
            <li className="footer__item">Doha Elgarouaz</li>
          </ul>
        </div>

        <div className="footer__column">
          <div className="footer__title">Project</div>
          <p className="footer__text">Guide Touristique Frontend</p>
          <p className="footer__text">Built with React & Passion</p>
        </div>
      </div>

      <div className="footer__copyright">© 2026 HiddenSpots. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
