import { useEffect, useState } from "react";
import axios from "axios";
import "./About.css";

function About() {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/about`
        );
        setAbout(res.data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      }
    };

    fetchAbout();
  }, []);

  if (!about) return <div className="about-page">Loading...</div>;

  return (
    <div className="about-page">
      <div className="about-wrapper">
        <h2 className="about-heading">About {about.appName}</h2>

        <div className="about-content">
          <div className="about-image">
            {about.image && (
              <img src={about.image} alt={about.appName} />
            )}
          </div>

          <div className="about-text">
            <p className="about-intro">{about.description}</p>

            <div className="about-section">
              <h3>Application Details</h3>
              <ul>
                <li><strong>Version:</strong> {about.version}</li>
                <li><strong>Developer:</strong> {about.developer}</li>
              </ul>
            </div>

            <div className="about-section">
              <h3>Our Mission</h3>
              <p>
                We aim to deliver high-quality AI-powered solutions that
                simplify workflows and enhance productivity for modern users.
              </p>
            </div>
          </div>
        </div>

        <div className="about-footer">
          © {new Date().getFullYear()} {about.developer}. All Rights Reserved.
        </div>
      </div>
    </div>
  );
}

export default About;