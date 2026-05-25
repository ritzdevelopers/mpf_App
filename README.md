# 🚀 MPF App

MPF App is a modern and scalable mobile application built using Expo, React Native, and TypeScript. The project is designed to deliver a smooth, fast, and responsive experience across Android and iOS platforms with a clean architecture, reusable components, and production-ready structure. The application follows modern mobile development practices and is optimized for performance, scalability, and maintainability.

## ✨ Features

- Cross-platform support for Android and iOS
- Fast and optimized application performance
- Modern and reusable UI components
- File-based routing with Expo Router
- Scalable and maintainable architecture
- API integration support
- Secure environment configuration
- TypeScript support for better development experience
- Production-ready project structure

## 🛠️ Tech Stack

The project is built using React Native, Expo, TypeScript, and Expo Router. React Hooks and Context API are used for state management and application logic. Development tools include Expo CLI, Babel, and ESLint for a better development workflow and code quality.

## ⚙️ Prerequisites

Before running the project, make sure the following tools are installed on your system:

- Node.js
- npm or yarn
- Expo CLI
- Android Studio for Android Emulator
- Xcode for iOS Simulator (macOS only)

## 📥 Installation

Clone the repository:

bash id="p5kz3n" git clone <repository-url> 

Move into the project directory:

bash id="z4uvs9" cd my-app 

Install dependencies:

bash id="s2f1qy" npm install 

or

bash id="z6r7xa" yarn install 

## ▶️ Running the Application

Start the Expo development server:

bash id="m7a2ld" npx expo start 

After starting the development server, the application can be opened using:

- Expo Go on a physical device
- Android Emulator
- iOS Simulator
- Development Build

## 📱 Running on Android

bash id="v8k3rt" npx expo run:android 

## 🍎 Running on iOS

bash id="r3n7wp" npx expo run:ios 

## 🔐 Environment Variables

Create a .env file in the root directory and add your required environment variables.

Example:

env id="x9q2um" EXPO_PUBLIC_API_URL=your_api_url 

## 📂 Project Structure

bash id="n4u7wx" my-app/ │ ├── app/                     # Main application routes and screens ├── assets/                  # Images, fonts, and icons ├── components/              # Reusable UI components ├── hooks/                   # Custom hooks ├── services/                # API services ├── constants/               # Static configuration values ├── utils/                   # Utility/helper functions ├── types/                   # TypeScript interfaces and types ├── scripts/                 # Automation scripts ├── ios/                     # Native iOS files ├── android/                 # Native Android files ├── .env                     # Environment variables └── app.json                 # Expo configuration 

## 🧹 Reset Project

To reset the starter project structure and create a fresh app directory:

bash id="g5m8ra" npm run reset-project 

## 📦 Build Commands

Build Android application:

bash id="h7n2qs" eas build -p android 

Build iOS application:

bash id="t9v4ld" eas build -p ios 

## 🚀 Deployment

The application can be deployed using Expo EAS Build and published to the Google Play Store and Apple App Store.

## 📚 Documentation & Resources

- Expo Documentation — https://docs.expo.dev/
- Expo Router Documentation — https://docs.expo.dev/router/introduction/
- React Native Documentation — https://reactnative.dev/

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Open a Pull Request

## 🐛 Troubleshooting

Clear Expo cache:

bash id="r6k2ys" npx expo start -c 

Reinstall dependencies:

bash id="d3u8jp" rm -rf node_modules npm install 

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Developed with ❤️ by Simranpreet Singh

## ⭐ Support

If you like this project, consider giving it a ⭐ on Gi