<div align="center">

# Nest ChatApp

**A real-time chat application backend built with NestJS, Socket.IO, and MongoDB.**

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## Overview

Nest ChatApp is a chat backend that combines a REST API for authentication and users with a Socket.IO gateway for real-time messaging. WebSocket connections are authenticated with JWTs, and users, rooms, and messages are stored in MongoDB.

## Features

- **Authentication:** register and login with bcrypt password hashing and JWT access tokens.
- **JWT-authenticated WebSocket connections,** with connect and disconnect handling.
- **Chat rooms and messages,** with DTOs for creating rooms and sending messages.
- **User management** endpoints.
- **Shared library** (`@app/common`) for database entities and JWT services.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | NestJS |
| Language | TypeScript |
| Real-time | Socket.IO |
| Database | MongoDB (TypeORM) |
| Authentication | Passport JWT, bcrypt |

## Getting Started

### Prerequisites

- Node.js and npm
- A MongoDB instance

### Installation

```bash
git clone https://github.com/RithyBondeth/Nest-ChatApp.git
cd Nest-ChatApp
npm install
npm run start:dev
```

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | MongoDB connection string |
| `DATABASE_SSL`, `DATABASE_SYNCHRONIZE` | Connection options |
| `JWT_SECRET`, `JWT_EXPIRES` | Token signing |

## Project Structure

```text
Nest-ChatApp/
├── src/
│   ├── auth/           # Register and login
│   ├── user/           # User endpoints
│   ├── chat/           # Socket.IO gateway, chat service, room and message DTOs
│   └── main.ts
└── libs/common/src/
    ├── database/       # User, room, and message entities and config
    └── jwt/            # JWT module and service
```

## Author

**Rithy Bondeth** — Full Stack Developer & AI Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RithyBondeth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rithy-bondeth-484073282/)

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
