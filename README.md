# 💍 Jewel AI — Sketch to 3D Gold Render Platform

**Jewel AI** is an AI-powered platform designed for jewelry designers and enthusiasts to rapidly visualize their concepts. Instead of relying on full manual CAD rendering processes, users can upload a 2D sketch and instantly receive an AI-generated 3D gold-finish preview of the final piece.
---
## 💡 Why Jewel AI?
Traditional jewelry design workflows often require complex CAD software and specialized 3D modeling skills. Jewel AI streamlines this experience by utilizing a trained **Generative Adversarial Network (GAN)** image-to-image model that interprets hand-drawn or digital sketches and automatically transforms them into realistic gold renders.
---

## 🛠️ Tech Stack

- **Frontend:** React, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose) — stores user authentication, uploaded sketches, and generated design history
- **AI / ML Service:** Python, Flask (serves the GAN-based image-to-image render model)

---

## 📁 Repository Structure

```text
jewelery-site/
├── backend/     # Express API server (auth, user routes, metadata)
├── flask/       # Python microservice serving the GAN image processing model
└── frontend/    # React SPA (Dashboard, Design Studio, History, About)

```

---

## ✨ Core Features

* 🔐 **User Authentication:** Secure signup and login flow.
* 🎨 **Design Studio:** Interactive space to upload sketches for AI rendering.
* 📜 **Design History:** Personal dashboard to track, view, and store all past sketches and rendered outputs.
* 🤖 **GAN-Powered Renders:** Automated conversion from 2D sketch to 3D gold-finish preview.

---

## 🗺️ Roadmap
* [x] User authentication (signup/login)
* [x] Sketch upload and design history
* [🔄] Flask + GAN microservice integration for real-3D gold renders 
---

## 🚀 Getting Started

### Prerequisites

* **Node.js** (v16+)
* **Python** (v3.8+)
* **MongoDB** instance running locally or via MongoDB Atlas

---

### Setup Instructions

1. **Clone the Repository:**
```bash
git clone [https://github.com/Abhignya09/jewelery-site.git](https://github.com/Abhignya09/jewelery-site.git)
cd jewelery-site

```


2. **Configure the Backend:**
```bash
cd backend
npm install
# Configure your .env file with MONGODB_URI and JWT_SECRET
npm start

```


3. **Configure the AI Flask Microservice:**
```bash
cd ../flask
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

```


4. **Configure & Start the Frontend:**
```bash
cd ../frontend
npm install
npm start

```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Abhignya09/jewelery-site/issues) if you want to contribute.
