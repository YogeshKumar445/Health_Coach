# 🩺 Health Coach — AI-Powered Health & Wellness Assistant

An AI-powered health and wellness web application designed to help users explore health-related questions and receive personalized guidance through an intuitive interface.

<p align="center">
  <a href="https://health-coach-wine.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20App-2ea44f?style=for-the-badge" alt="Live Demo">
  </a>
  <a href="https://github.com/YogeshKumar445/Health_Coach">
    <img src="https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github" alt="GitHub Repository">
  </a>
</p>

---

## 🌐 Live Demo

**Try the application:** https://health-coach-wine.vercel.app/

## 📌 About the Project

Health Coach is a web-based application that integrates Google's Gemini AI to provide an interactive health and wellness assistance experience. The project combines a modern React frontend with AI integration to make health-related information easier to explore through a user-friendly interface.

The application is built using Vite for development and build tooling and is deployed on Vercel.

## ✨ Key Features

- **AI-Powered Assistance:** Integrates Gemini AI for AI-generated responses.
- **Health & Wellness Guidance:** Helps users explore health-related questions and general wellness information.
- **Interactive User Interface:** Provides a user-friendly interface for interacting with the application.
- **Modern Frontend:** Uses React to build a component-based web application.
- **Fast Development Workflow:** Uses Vite for local development and production builds.
- **Live Deployment:** Hosted on Vercel for convenient browser-based access.

*Note: AI responses are informational and should not be treated as medical diagnoses or a replacement for professional medical advice.*

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Building the user interface |
| JavaScript | Application logic |
| Vite | Development server and production build |
| CSS | User interface styling |
| Google Gemini AI | AI-powered responses |
| Vercel | Application deployment |
| Git & GitHub | Version control and source code management |

## 🏗️ Application Workflow

1. The user opens the Health Coach web application.
2. The user interacts with the available interface.
3. The application uses its Gemini AI integration to generate responses.
4. The generated information is presented through the user interface.

The exact workflow depends on the features and configuration enabled in the application.

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/YogeshKumar445/Health_Coach.git
```

### 2. Navigate to the Project Directory

The application source code is located inside `VED-ARYA-main`.

```bash
cd Health_Coach/VED-ARYA-main
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure the Gemini API Key

Create or update the `.env.local` file in the application root directory and configure your Gemini API key using the environment variable expected by the project.

```env
GEMINI_API_KEY=your_gemini_api_key
```

Replace `your_gemini_api_key` with your actual API key.

**Important:** Never commit API keys or other secrets to GitHub. Keep local environment files out of version control.

For Vercel, configure the environment variable required by your deployed application's code in **Project Settings → Environment Variables**, then redeploy after making changes.

### 5. Start the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

```text
http://localhost:5173
```

### 6. Create a Production Build

```bash
npm run build
```

Vite generates the production build in the `dist` directory.

To preview the production build locally, run:

```bash
npm run preview
```

## 🌍 Deployment

The application is deployed using Vercel.

To deploy your own version:

1. Import the GitHub repository into Vercel.
2. Set the project root directory to `VED-ARYA-main`.
3. Use the Vite framework preset.
4. Set the build command to `npm run build`.
5. Set the output directory to `dist`.
6. Configure the required environment variables.
7. Deploy the application.

**Security note:** If the Gemini API key is accessed directly by browser-side code, it may be exposed to users. For production use, sensitive API requests should be handled through a secure backend or server-side function.

## 🔐 Security & Privacy

- Do not upload API keys or secrets to a public repository.
- Use environment variables for local and deployment configuration.
- Review the Gemini API's data-handling policies before sending sensitive information.
- Avoid sharing personal medical information unless you understand how the application and its AI provider handle that data.

## 🎯 Project Goals

- Explore practical integration of generative AI into a web application.
- Build a responsive and user-friendly frontend.
- Understand environment configuration and API integration.
- Practice deploying a React application using Vercel.
- Apply modern frontend development concepts in a real-world project.

## 🔮 Future Improvements

Potential enhancements for future versions include:

- User authentication and personalized profiles.
- Personalized wellness plans and recommendations.
- Health progress tracking and visualizations.
- Improved error handling and loading states.
- Secure server-side AI integration.
- Accessibility and mobile usability improvements.

These are potential enhancements, not claims about features currently implemented.

## 👨‍💻 Author

**Yogesh Kumar**

B.Tech Computer Science and Engineering student interested in software development, AI integration, and building practical web applications.

- **GitHub:** [YogeshKumar445](https://github.com/YogeshKumar445)
- **Project Repository:** [Health_Coach](https://github.com/YogeshKumar445/Health_Coach)
- **Live Application:** [Health Coach](https://health-coach-wine.vercel.app/)

---

<p align="center">
  If you find this project interesting, consider giving the repository a ⭐ on GitHub.
</p>
