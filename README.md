# 🏋️‍♂️ Fitness Tracker

Una aplicació de seguiment de fitness full-stack desenvolupada amb Angular i Supabase.

## ⚙️ Configuració del Backend

### Prerequisits
- Node.js >= 18
- npm >= 9
- Compte a Supabase

### Variables d'Entorn

Crea un fitxer `.env` amb les següents variables:

```env
VITE_SUPABASE_URL=https://erngjtqjcjocxraztabj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Instal·lació i Execució

```bash
# Instal·lar dependències
npm install

# Iniciar servidor de desenvolupament
npm start   # Port per defecte: 4200
```

## 📁 Estructura del Projecte

```
src/
├── app/
│ ├── components/ # Components compartits
│ ├── models/ # Interfícies i classes TypeScript
│ ├── pages/ # Components de pàgina
│ ├── services/ # Serveis per a la gestió de dades
│ └── shared/ # Utilitats i interfícies compartides
├── environments/ # Configuració d'entorns
└── supabase/
└── migrations/ # Migracions de base de dades
```


## 🗄️ Base de Dades

### Diagrama Entitat-Relació

```mermaid
erDiagram
    users ||--o{ user_roles : té
    users ||--o{ user_profiles : té
    users ||--o{ user_weight_history : registra
    users ||--o{ exercises : crea
    users ||--o{ workout_plans : crea
    workout_plans ||--o{ workout_exercises : conté
    workout_exercises }|--|| exercises : fa referència
    users ||--o{ user_workout_plans : inicia

    users {
        uuid id PK
        string email
        timestamp created_at
    }

    user_roles {
        uuid user_id PK,FK
        enum role
        timestamp created_at
    }

    user_profiles {
        uuid id PK,FK
        float weight_kg
        float height_cm
        timestamp created_at
        timestamp updated_at
    }

    user_weight_history {
        uuid id PK
        uuid user_id FK
        float weight_kg
        timestamp recorded_at
    }

    exercises {
        uuid id PK
        string name
        integer duration
        integer calories
        enum difficulty
        float met_value
        uuid created_by FK
        timestamp created_at
    }

    workout_plans {
        uuid id PK
        string name
        string description
        uuid created_by FK
        timestamp created_at
    }

    workout_exercises {
        uuid id PK
        uuid workout_plan_id FK
        uuid exercise_id FK
        integer order
    }

    user_workout_plans {
        uuid id PK
        uuid user_id FK
        uuid workout_plan_id FK
        timestamp started_at
    }
```

## 🔐 Autenticació

### Característiques
- ✉️ Autenticació amb correu electrònic/contrasenya
- 🔄 Gestió de sessions
- 👥 Control d'accés basat en rols (Usuaris/Admins)
- 🛡️ Polítiques de Seguretat a Nivell de Fila (RLS)

## 🔌 API Endpoints

### 🔑 Autenticació

#### Registre
```http
POST /auth/sign-up
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "token",
    "refresh_token": "token"
  }
}
```

#### Inici de Sessió
```http
POST /auth/sign-in
```

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "token",
    "refresh_token": "token"
  }
}
```

## ⚠️ Gestió d'Errors

### Codis HTTP

| Codi | Descripció | Exemple |
|------|------------|---------|
| 400 | Bad Request | Dades d'entrada no vàlides |
| 401 | Unauthorized | Autenticació invàlida |
| 403 | Forbidden | Permisos insuficients |
| 404 | Not Found | Recurs no trobat |
| 409 | Conflict | Recurs ja existent |
| 500 | Server Error | Error intern |

### Format de Resposta d'Error
```json
{
  "code": "ERROR_CODE",
  "message": "Missatge d'error comprensible",
  "details": {}
}
```

### Codis d'Error Comuns

| Codi | Descripció |
|------|------------|
| `INVALID_CREDENTIALS` | Credencials incorrectes |
| `USER_EXISTS` | Usuari ja registrat |
| `INVALID_INPUT` | Dades invàlides |
| `NOT_FOUND` | Recurs no trobat |
| `UNAUTHORIZED` | No autenticat |
| `FORBIDDEN` | No autoritzat |
| `SERVER_ERROR` | Error intern |

---
