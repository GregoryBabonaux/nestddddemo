# Guide d'installation

## Prérequis

- Node.js (v18 ou supérieur)
- Docker et Docker Compose
- npm ou yarn
- Git

## Installation pas à pas

1. **Cloner le repository**
```bash
git clone [repository-url]
cd dddnestlearning
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Modifier le fichier `.env` selon vos besoins :
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dddnestlearning?schema=public"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. **Générer le client Prisma**
```bash
npx prisma generate
```

5. **Exécuter les migrations**
```bash
npx prisma migrate dev
```

## Démarrage

### Mode Développement

1. **Avec Docker (recommandé)**
```bash
docker-compose up
```

2. **Sans Docker**
```bash
npm run start:dev
```

### Mode Production

1. **Build de l'image Docker**
```bash
npm run docker:build
```

2. **Lancement du conteneur**
```bash
npm run docker:prod
```

## Vérification de l'installation

1. L'API devrait être accessible sur : `http://localhost:3000`
2. La documentation Swagger sur : `http://localhost:3000/api`
3. Tester un endpoint : `curl http://localhost:3000/users`

## Dépannage

### Problèmes courants

1. **Erreur de connexion à la base de données**
   - Vérifier que PostgreSQL est en cours d'exécution
   - Vérifier les informations de connexion dans `.env`

2. **Erreur de port déjà utilisé**
   - Modifier le PORT dans `.env`
   - Ou arrêter le service utilisant le port 3000

3. **Erreur de migration Prisma**
   - Supprimer le dossier `prisma/migrations`
   - Réinitialiser la base de données
   - Relancer `npx prisma migrate dev`
