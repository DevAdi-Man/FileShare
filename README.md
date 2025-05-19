# 📁 React Native File Sharing App (TCP/TLS & UDP)

[![React Native](https://img.shields.io/badge/React%20Native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactnative.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-blue)]()
[![Build Status](https://img.shields.io/badge/Status-Under%20Development-orange)]()

A **high-performance, secure, and local-first file sharing app** built with **React Native**, supporting both **TCP over TLS** and **UDP** protocols. Designed for **peer-to-peer transfers** over LAN/Wi-Fi, this app enables seamless cross-platform file sharing without relying on cloud services or the internet.

---

## 🚀 Features

- 📡 **Dual Protocol Support**  
  Use **TCP with TLS** for reliable, encrypted transfers or **UDP** for lightweight, fast sharing.

- 🔐 **End-to-End Encryption**  
  Secure your data with **TLS encryption** when using TCP.

- ⚡ **High-Speed LAN Transfers**  
  Optimized for large files with minimal delay across local networks.

- 📲 **Cross-Platform**  
  Compatible with both Android and iOS using React Native.

- 🔍 **Auto Device Discovery**  
  Automatically detect nearby devices on the same network.

- 💬 **Flexible Architecture**  
  Built with modularity for easy integration and extension.

---

## 📂 Tech Stack

- [React Native](https://reactnative.dev/)
- TCP/UDP Sockets via native modules
- TLS (Transport Layer Security)
- [Zustand](https://github.com/pmndrs/zustand) or Redux (for state, if applicable)
- Custom Native Modules (for socket communication)

---

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 14
- React Native CLI
- Android Studio / Xcode
- Devices connected to the same Wi-Fi network

### Installation

```bash
git clone https://github.com/your-username/file-sharing-app.git
cd file-sharing-app
npm install
