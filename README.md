# RH_gestion_app

Description
-----------
Une application de gestion RH complète (Spring Boot / ReactJS) pour gérer employés, congés, recrutements, rôles et rapports.

Structure du dépôt
------------------
- `RHappBack/` — Backend Spring Boot (Java)  
- `RHapp_front/` — Frontend React (JavaScript, CSS, HTML)  
- `MailHog/` — Configuration / Docker pour MailHog (outil de capture d'e-mails en dev)  
- `conception/` — Documents de conception, maquettes et spécifications

Langages principaux
-------------------
- JavaScript (React) — ~63.5%  
- Java (Spring Boot) — ~26.2%  
- CSS — ~9.4%  
- HTML — ~0.9%

Table des matières
------------------
- Prérequis
- Installation
- Configuration
- Démarrage en développement
- Build & Production
- Docker & docker-compose (avec MailHog)
- Tests
- Contribuer
- Licence
- Auteurs / Contact

Prérequis
---------
- Git  
- Java 11+ (ou version indiquée par le projet)  
- Maven (ou Gradle) — ou wrappers `./mvnw` / `./gradlew` fournis  
- Node.js 16+ et npm ou yarn  
- PostgreSQL / MySQL ou autre SGBD (si utilisé)  
- (Optionnel) Docker & Docker Compose

Installation
------------
1. Cloner le dépôt :
   ```
   git clone https://github.com/ghassouine19/RH_gestion_app.git
   cd RH_gestion_app
   ```

2. Backend (RHappBack) — installer dépendances :
   ```
   cd RHappBack
   # si présent : utiliser le wrapper Maven
   ./mvnw dependency:resolve
   # ou avec Maven global
   mvn dependency:resolve
   cd ..
   ```

3. Frontend (RHapp_front) — installer dépendances :
   ```
   cd RHapp_front
   npm install
   # ou
   yarn install
   cd ..
   ```

Configuration
-------------
Créer un fichier `.env` ou configurer les variables d'environnement nécessaires pour le backend et le frontend.

Exemple variables backend (à adapter) :
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rh_db
DB_USER=rh_user
DB_PASSWORD=changeme

SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=remplacez_par_un_secret_long

MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_FROM=no-reply@example.com
```

Exemple `application.properties` (Spring Boot) utilisant variables d'environnement :
```
spring.datasource.url=jdbc:postgresql://${DB_HOST:localhost}:${DB_PORT:5432}/${DB_NAME:rh_db}
spring.datasource.username=${DB_USER:rh_user}
spring.datasource.password=${DB_PASSWORD:changeme}
spring.jpa.hibernate.ddl-auto=update
spring.mail.host=${MAIL_HOST:localhost}
spring.mail.port=${MAIL_PORT:1025}
```

Exemple variables frontend (RHapp_front/.env) :
```
REACT_APP_API_URL=http://localhost:8080/api
```

Démarrage en développement
-------------------------

Backend (RHappBack) :
```
cd RHappBack

# avec Maven wrapper (recommandé si présent)
./mvnw spring-boot:run

# ou avec Maven global
mvn spring-boot:run

# si le projet utilise Gradle
# ./gradlew bootRun
```

Frontend (RHapp_front) :
```
cd RHapp_front
npm start
# ou
yarn start
```

Accès :
- Frontend React : http://localhost:3000  
- Backend API : http://localhost:8080  
- MailHog UI (si utilisé via docker-compose ci-dessous) : http://localhost:8025

Build & Production
------------------
Backend :
```
cd RHappBack
./mvnw clean package -DskipTests
# jar dans target/
java -jar target/*.jar
```

Frontend :
```
cd RHapp_front
npm run build
# ou
yarn build
# Le build produit le dossier `build/` à servir via Nginx ou intégration dans Spring Boot
```

Intégration optionnelle (servir frontend via Spring Boot) :
- Copier le contenu `RHapp_front/build/` dans `RHappBack/src/main/resources/static/` avant de packager le backend.

Docker & docker-compose (avec MailHog)
--------------------------------------
Exemple minimal `docker-compose.yml` à placer à la racine (adapter Dockerfile/backend/frontend existants) :

```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: rh_db
      POSTGRES_USER: rh_user
      POSTGRES_PASSWORD: changeme
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  mailhog:
    image: mailhog/mailhog
    ports:
      - "1025:1025" # SMTP
      - "8025:8025" # UI

  backend:
    build:
      context: ./RHappBack
      dockerfile: Dockerfile
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: rh_db
      DB_USER: rh_user
      DB_PASSWORD: changeme
      MAIL_HOST: mailhog
      MAIL_PORT: 1025
    depends_on:
      - db
      - mailhog
    ports:
      - "8080:8080"

  frontend:
    build:
      context: ./RHapp_front
      dockerfile: Dockerfile
    environment:
      REACT_APP_API_URL: http://backend:8080/api
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  db-data:
```

Notes :
- Assurez-vous que `RHappBack/Dockerfile` et `RHapp_front/Dockerfile` existent et exposent les bons ports.  
- MailHog UI sera disponible sur http://localhost:8025

Tests
-----
Backend :
```
cd RHappBack
./mvnw test
# ou
mvn test
```

Frontend :
```
cd RHapp_front
npm test
# ou
yarn test
```

Bonnes pratiques & suggestions d'amélioration
---------------------------------------------
- Ajouter un `.env.example` à la racine pour lister les variables d'environnement nécessaires.  
- Documenter la version Java, Maven/Gradle et Node.js recommandées.  
- Ajouter des Dockerfile prêts à l'emploi pour backend et frontend si absent.  
- Ajouter CI (GitHub Actions) pour lint, tests et build automatisés.  
- Si vous servez le frontend depuis Spring Boot, automatiser la copie du build React dans `RHappBack/src/main/resources/static` via le pipeline de build.  
- Ajouter un fichier CONTRIBUTING.md et des templates d'issues / PR pour faciliter les contributions.

Contribuer
----------
1. Forkez le dépôt.  
2. Créez une branche : `git checkout -b feat/ma-fonctionnalite`  
3. Commitez vos changements : `git commit -m "Description concise"`  
4. Ouvrez une Pull Request.
   
Auteurs / Contact
-----------------
- Auteur principal : ghassouine19  
Pour signaler un bug ou demander une fonctionnalité : ouvrez une issue dans ce dépôt.
