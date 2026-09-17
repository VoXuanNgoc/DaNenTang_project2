# DaNenTang_project2 - Study Room Booking App

Mini-Project 2: Study Room Booking App for Multiplatform Development course.

An interactive mobile application for booking campus study rooms and computer labs built with Expo React Native, TypeScript, React Navigation 7, Zustand, and TanStack Query.

---

## Features

- **Browse Rooms**: Search by room name, building, or room type. Filter with chips (All, Lab, Study Room, Building A3, Available, Occupied).
- **Room Details**: View capacity, amenities, floor, high-res photos, and real-time status.
- **Date & Time Slot Selection**: Pick upcoming dates and university time slots (08:00 - 17:00).
- **Conflict Prevention Engine**: Mathematical overlap detection prevents double booking and rejects conflicting intervals.
- **My Bookings**: View confirmed/cancelled reservations, cancel bookings anytime, and immediately release time slots.
- **Student Profile**: Student ID, email, statistics counters (Active, Cancelled, Total), and campus study room rules.

---

## Tech Stack

- **Framework**: Expo Managed Workflow (SDK 57)
- **Language**: TypeScript (Strict Mode)
- **Navigation**: React Navigation 7 (Bottom Tabs + Native Stack)
- **State Management**: Zustand (Client state & bookings)
- **Server State / API**: TanStack Query (@tanstack/react-query)
- **Icons**: @expo/vector-icons (Ionicons)
- **Testing**: Jest + ts-jest (18 unit tests for conflict engine)

---

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/VoXuanNgoc/DaNenTang_project2.git
cd DaNenTang_project2

# Install dependencies
npm install

# Start the Expo development server
npm start
```

### Running on Targets

- **Web Preview**: `npm run web`
- **Android**: `npm run android`
- **iOS**: `npm run ios`

### Verification & Tests

```bash
# Type check (strict mode)
npm run typecheck

# Run Jest unit test suite
npm test
```
