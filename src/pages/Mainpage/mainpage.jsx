import React, { useEffect, useState } from "react";
import './mainpage.css';
import feature1 from '../../img/1.jpg';
import feature2 from '../../img/1.jpg';
import feature3 from '../../img/1.jpg';
import { useNavigate } from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    // Simple SVG icons (replace with your actual icons or use an icon library like react-icons)
    const TwitterIcon = () => (
        <svg className="twitter-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
        </svg>
    );

    const FacebookIcon = () => (
        <svg className="facebook-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
        </svg>
    );

    const LinkedInIcon = () => (
        <svg className="linkedin-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    );

    const InstagramIcon = () => (
        <svg className="instagram-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    );

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

            setVisible(currentScrollPos < 10 ? true : isVisible);
            setScrolled(currentScrollPos > 10);
            setPrevScrollPos(currentScrollPos);
        };

        // Throttle the scroll event
        const throttledScroll = () => {
            let ticking = false;
            return () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            };
        };

        window.addEventListener('scroll', throttledScroll());
        return () => window.removeEventListener('scroll', throttledScroll());
    }, [prevScrollPos, visible]);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Calculate position considering fixed navbar
            const offset = 80;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="mainpage-container">
            <div className={`mainpage-navbar ${visible ? '' : 'hidden'} ${scrolled ? 'scrolled' : ''}`}>
                <div className="x-penses-mainpage-title">
                    <h1>X-Penses</h1>
                </div>
                <div className="x-penses-mainpage-extras">
                    <ul>
                        <li onClick={() => scrollToSection('about-section')}>About</li>
                        <li onClick={() => scrollToSection('contact-section')}>Contact</li>
                        <li onClick={() => navigate('/loginsignup')}>Login</li>
                    </ul>
                </div>
            </div>

            <div className="mainpage-hero">
                <div className="mainpage-curosell-bg">
                    <h2 className="hero-tagline">Take Control of Your Finances</h2>
                    <h1 className="hero-title">Smart Spending Starts Here</h1>
                    <p className="hero-subtext">Track, analyze, and optimize your expenses effortlessly</p>
                    <button className="hero-cta">Start Tracking Now →</button>
                </div>
            </div>

            <div className="mainpage-content">
                <div id="about-section" className="mainpage-about-content">
                    <h1>About X-Penses</h1>
                    <p className="about-description">Take control of your finances with our intuitive expense tracking solution. X-Penses helps you monitor spending, set budgets, and achieve your financial goals.</p>

                    <div className="features-container">
                        <div className="feature">
                            <div className="feature-img-container">
                                <img src={feature1} alt="Easy-to-use interface" />
                            </div>
                            <h3>Simple & Intuitive</h3>
                            <p>Our clean interface makes tracking expenses effortless for everyone.</p>
                        </div>

                        <div className="feature">
                            <div className="feature-img-container">
                                <img src={feature2} alt="Visual analytics" />
                            </div>
                            <h3>Visual Analytics</h3>
                            <p>Beautiful graphs and charts help you understand your spending patterns.</p>
                        </div>

                        <div className="feature">
                            <div className="feature-img-container">
                                <img src={feature3} alt="Multi-device sync" />
                            </div>
                            <h3>Cross-Platform</h3>
                            <p>Access your data anywhere, anytime - on all your devices.</p>
                        </div>
                    </div>

                    <div className="about-cta">
                        <button className="cta-button" onClick={() => scrollToSection('contact-section')}>Get Started Today</button>
                    </div>
                </div>

                <div id="contact-section" className="contact-section">
                    <div className="contact-container">
                        <h1 className="section-title">Get In Touch</h1>
                        <p className="section-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>

                        <div className="contact-grid">
                            <div className="contact-info">
                                <div className="info-card">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                                        </svg>
                                    </div>
                                    <h3>Email Us</h3>
                                    <p>support@x-penses.com</p>
                                </div>

                                <div className="info-card">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3>Call Us</h3>
                                    <p>+1 (555) 123-4567</p>
                                </div>

                                <div className="info-card">
                                    <div className="info-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h3>Visit Us</h3>
                                    <p>123 Finance Street, Moneyville MV 12345</p>
                                </div>
                            </div>

                            <div className="contact-form">
                                <form className="professional-form">
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            placeholder="John Doe"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            placeholder="john@example.com"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            placeholder="How can we help?"
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="message">Your Message</label>
                                        <textarea
                                            id="message"
                                            rows="5"
                                            placeholder="Type your message here..."
                                            className="form-textarea"
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="submit-button">
                                        Send Message
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                
            </div>

            <footer className="main-footer">
                    <div className="footer-container">
                        <div className="footer-brand">
                            <h3>X-Penses</h3>
                            <p className="footer-tagline">Your smart expense tracking solution</p>
                            <div className="social-links">
                                <a href="#" aria-label="Twitter"><TwitterIcon /></a>
                                <a href="#" aria-label="Facebook"><FacebookIcon /></a>
                                <a href="#" aria-label="LinkedIn"><LinkedInIcon /></a>
                                <a href="#" aria-label="Instagram"><InstagramIcon /></a>
                            </div>
                        </div>

                        <div className="footer-links">
                            <div className="links-column">
                                <h4>Product</h4>
                                <ul>
                                    <li><a href="#">Features</a></li>
                                    <li><a href="#">Pricing</a></li>
                                    <li><a href="#">API</a></li>
                                    <li><a href="#">Integrations</a></li>
                                </ul>
                            </div>

                            <div className="links-column">
                                <h4>Company</h4>
                                <ul>
                                    <li><a href="#">About</a></li>
                                    <li><a href="#">Blog</a></li>
                                    <li><a href="#">Careers</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div>

                            <div className="links-column">
                                <h4>Resources</h4>
                                <ul>
                                    <li><a href="#">Help Center</a></li>
                                    <li><a href="#">Guides</a></li>
                                    <li><a href="#">Community</a></li>
                                    <li><a href="#">Status</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <div className="legal-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Cookie Policy</a>
                        </div>
                        <p className="copyright">&copy; {new Date().getFullYear()} X-Penses. All rights reserved.</p>
                    </div>
                </footer>
        </div>
    )
}

export default MainPage;