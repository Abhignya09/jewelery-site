import React from "react";

const About = () => {
  return (
    <div className="about-page">
      <h1>About Jewel AI</h1>
      <p>
        Jewel AI is a platform that helps jewelry designers and enthusiasts visualize their ideas
        faster. Instead of waiting for a full CAD or manual rendering process, you can simply
        upload a sketch and get an AI-generated 3D gold-finish preview of what the final piece
        could look like.
      </p>

      <h2>Why we built this</h2>
      <p>
        Traditional jewelry design workflows require specialized 3D modeling skills or expensive
        CAD software. Jewel AI lowers that barrier by using a trained Generative Adversarial
        Network (GAN) to interpret sketches and generate realistic renders automatically.
      </p>

      <h2>Tech stack</h2>
      <ul>
        <li>
          <strong>Frontend:</strong> React, React Router
        </li>
        <li>
          <strong>Backend:</strong> Node.js, Express
        </li>
        <li>
          <strong>Database:</strong> MongoDB (Mongoose) — stores user accounts and every sketch /
          generated design
        </li>
        <li>
          <strong>AI Model:</strong> A GAN-based image-to-image model served via a Flask
          microservice (integration in progress)
        </li>
      </ul>

      <h2>Roadmap</h2>
      <ul>
        <li>✅ User authentication (signup/login)</li>
        <li>✅ Sketch upload and design history</li>
        <li>🔄 Flask + GAN microservice integration for real 3D gold renders</li>
        <li>⏳ Multiple metal finishes (gold, silver, rose gold)</li>
        <li>⏳ Downloadable 3D model export</li>
      </ul>
    </div>
  );
};

export default About;
