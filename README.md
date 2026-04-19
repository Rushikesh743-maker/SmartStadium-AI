# 🏟️ SmartStadium AI

An AI-powered real-time stadium management system that simulates crowd movement, predicts congestion, optimizes navigation paths, and enhances fan experience using intelligent zone monitoring and live alerts.

---

## 🚀 Live Demo
https://smart-stadium-ai-psi.vercel.app/

---

## 📌 Features

### 🧠 AI Crowd Intelligence
- Real-time crowd simulation per stadium zone
- Smart classification: Low / Medium / High / Critical
- System health analytics dashboard

### 🗺️ Smart Navigation System
- Dijkstra-based pathfinding algorithm
- Crowd-aware route optimization
- Emergency routing mode

### 🚨 Live Alert System
- Real-time alerts via Firestore
- Priority-based alert generation
- Auto filtering of critical congestion zones

### 🍔 Stadium Services
- Food stall queue simulation
- Wait-time prediction system
- Zone-based service mapping

### 🔮 Predictive View Mode
- Simulated future crowd behavior
- Early congestion detection

---

## 🧱 Tech Stack

Frontend:
- React (Vite)
- TypeScript
- TailwindCSS
- ShadCN UI
- Lucide Icons

Backend / Realtime:
- Firebase Firestore
- Firebase SDK

State / Data:
- React Query
- Custom simulation engine

Testing:
- Vitest
- React Testing Library

---

## 📁 Project Structure

src/
├── components/        UI components (Map, Alerts, Panels)
├── lib/               Core logic (AI simulation, Firebase, utils)
├── pages/             Routes (Index, NotFound)
├── __tests__/         Unit tests
├── App.tsx
├── main.tsx

---

## ⚙️ How It Works

### Crowd Simulation
- Dynamic crowd values per zone
- Random updates simulate real-world movement

### AI Routing Engine
- Weighted graph (Dijkstra algorithm)
- Avoids crowded zones for safer navigation

### Alert System
- Firestore real-time listener
- Severity-based alerts:
  - Info
  - Warning
  - Danger

### System Health
- Calculates overall stadium congestion
- Status:
  - Optimal
  - Moderate
  - Overloaded

---

## 🔥 Firebase Integration

Used for:
- Live alerts streaming
- Real-time monitoring
- Cloud-based event simulation

---

## 🧪 Testing

Run tests:
npm run test

Includes:
- Crowd system tests
- Pathfinding tests
- Utility validation tests

---

## 🛡️ Security Features

- Input sanitization (XSS protection)
- Firestore data validation
- Safe UI rendering
- Secure alert handling

---

## ♿ Accessibility

- ARIA labels for alerts
- Screen-reader support
- Semantic HTML structure
- Live region updates

---

## 📊 Performance Optimizations

- Memoized user rendering
- Efficient Firestore listeners
- Optimized SVG map rendering
- Lightweight simulation engine

---

## 📈 Future Improvements

- AI-based predictive crowd forecasting
- Mobile application
- Camera-based crowd detection
- Emergency evacuation system
- Multi-stadium dashboard

---

## 🧑‍💻 Getting Started

# clone repo
git clone https://github.com/your-username/SmartStadium-AI.git

# install dependencies
npm install

# run development server
npm run dev

# build production
npm run build

---

## 🏆 Project Goal

To build a real-time intelligent stadium system that improves:
- Crowd safety
- Navigation efficiency
- Operational intelligence

---

## 📜 License

MIT License

---

## ⭐ Support

If you like this project, give it a star ⭐
