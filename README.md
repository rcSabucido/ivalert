# IVAlert

IVAlert is a real-time IV (Intravenous) fluid monitoring system consisting of mobile, server, and embedded components. The system tracks fluid levels in IV bags and alerts healthcare providers when levels are critically low.

## Components

### Mobile App
- React Native + Expo based mobile application
- Real-time fluid level monitoring
- Visual and audio alerts for low fluid levels
- Fluid level visualization
- WebSocket-based live updates 

### Server
- Golang-based WebSocket server
- Secure authentication system
- Real-time data broadcasting

### Embedded System
- ESP32 microcontroller
- Load cell integration for fluid measurement
- WiFi connectivity
- Automatic server updates

## Setup Instructions

### Mobile App Setup
1. Install dependencies:
```bash
npx expo install
```

2. Create `.env` file with:
```
EXPO_PUBLIC_POLL_PASSWORD=[password]
```

3. Run the app:
```bash
npx expo start
```

4. Run the go websocket in server directory:
```bash
go run .
```

## Built With
- React Native / Expo
- Go
- ESP32
- WebSocket
- HX711 Load Cell
- TypeScript

---

## Developers
1. Ryz Clyd Sabucido
2. Juan Miguel Agunod
3. Aaron Keith Berongon