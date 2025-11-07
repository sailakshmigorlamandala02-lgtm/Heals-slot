# HealSlot - Hospital Management System

A comprehensive multi-portal hospital management system built with Node.js, Express, MongoDB, and Socket.IO.

## Features

- **Multi-Hospital Support**: Manage multiple hospitals from a single platform
- **Role-Based Access**: Separate portals for different user roles
  - Admin
  - Doctor
  - Nurse
  - Patient
  - Pharmacist
  - Receptionist
  - Lab Technician
- **Real-time Updates**: Socket.IO integration for live notifications
- **Appointment Management**: Schedule and manage patient appointments
- **Medical Records**: Maintain patient medical history
- **Prescription Management**: Create and track prescriptions
- **Payment Processing**: Handle billing and payments
- **Equipment Tracking**: Monitor hospital equipment
- **Leave Management**: Staff leave request system

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5
- **Icons**: Font Awesome

## Installation

1. Clone the repository:

```bash
git clone https://github.com/sailakshmigorlamandala02-lgtm/Heals-slot.git
cd Heals-slot
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your MongoDB connection string:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

4. Start the server:

```bash
npm start
```

5. Access the application at `http://localhost:3000`

## Deployment

### Deploy to Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: healslot
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variable:
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string
7. Click "Create Web Service"

## Available Hospitals

- City General Hospital
- Sunrise Medical Center
- Hope Regional Hospital
- Apollo Hospital
- KIMS

## Usage

1. Select a hospital from the homepage
2. Choose your role (Patient, Doctor, Admin, etc.)
3. Login or register a new account
4. Access role-specific features and dashboards

## License

ISC

## Author

Hospital Management Team
