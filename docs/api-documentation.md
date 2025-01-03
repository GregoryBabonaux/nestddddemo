# Documentation API

## Vue d'ensemble

L'API suit les principes REST et utilise JSON pour les requêtes et réponses. La documentation complète est disponible via Swagger UI à l'adresse : `http://localhost:3000/api`

## Authentification

À implémenter : JWT Authentication

## Endpoints

### Module User

#### Créer un utilisateur
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

#### Obtenir un utilisateur
```http
GET /users/{id}
```

### Module Game

#### Créer un jeu
```http
POST /games
Content-Type: application/json

{
  "title": "Mon Jeu",
  "description": "Description du jeu",
  "userId": "user-id"
}
```

#### Obtenir un jeu
```http
GET /games/{id}
```

#### Obtenir les jeux d'un utilisateur
```http
GET /games/user/{userId}
```

## Codes de réponse

- 200 : Succès
- 201 : Création réussie
- 400 : Requête invalide
- 401 : Non authentifié
- 403 : Non autorisé
- 404 : Ressource non trouvée
- 500 : Erreur serveur

## Format des erreurs

```json
{
  "statusCode": 400,
  "message": "Description de l'erreur",
  "error": "Bad Request"
}
```

## Pagination

À implémenter : Pagination des résultats

## Filtrage

À implémenter : Filtrage des résultats

## Versioning

À implémenter : Versioning de l'API

## Limites de taux

À implémenter : Rate limiting

## Bonnes pratiques

1. Utiliser les verbes HTTP appropriés
2. Utiliser les codes de statut HTTP standards
3. Inclure des messages d'erreur descriptifs
4. Valider les entrées
5. Documenter tous les endpoints
6. Utiliser HTTPS en production
7. Implémenter le rate limiting
8. Gérer les erreurs de manière cohérente
