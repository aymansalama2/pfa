

# Cahier des Charges – Système de Gestion des Débiteurs

## 1. Présentation Générale

Le projet consiste à développer une application web de gestion des débiteurs pour une organisation. L’objectif est de permettre un suivi efficace des débiteurs, la gestion des attributions par les employés, la génération de rapports et la sécurisation des accès.

---

## 2. Objectifs du Projet

- Centraliser la gestion des débiteurs et des employés.
- Permettre l’attribution et le suivi des débiteurs par les employés.
- Offrir une interface moderne et intuitive pour la gestion et la consultation.
- Générer des rapports et des statistiques sur les débiteurs.
- Garantir la sécurité et la traçabilité des opérations.

---

## 3. Fonctionnalités

### 3.1. Gestion des Débiteurs
- Création, modification, suppression de débiteurs.
- Suivi du montant de crédit, des coordonnées et de l’historique.
- Recherche et filtrage avancés.

### 3.2. Gestion des Employés
- Création, modification, suppression d’employés.
- Attribution de débiteurs à un ou plusieurs employés.
- Suivi des performances et des attributions.

### 3.3. Authentification et Sécurité
- Authentification des utilisateurs (employés, administrateurs).
- Gestion des rôles et permissions.
- Sécurisation des accès aux données sensibles.

### 3.4. Rapports et Statistiques
- Génération de rapports sur les débiteurs, les attributions, les paiements.
- Tableaux de bord personnalisés.
- Export des rapports (PDF, CSV).

### 3.5. Interface Utilisateur
- Application web responsive (Vue.js + Tailwind CSS).
- Tableaux, formulaires, filtres dynamiques.
- Notifications et messages d’erreur clairs.

---

## 4. Architecture Technique

- **Frontend** : Vue.js, Tailwind CSS, Vite
- **Backend** : Laravel (PHP), API RESTful
- **Base de données** : MySQL
- **Déploiement** : Nginx/Apache, architecture modulaire
- **Sécurité** : Authentification, validation des données, gestion des rôles

---

## 5. Modélisation

### 5.1. Modèles Principaux

- **Debiteur** : cin, nom, prénom, téléphone, adresse, montant_credit
- **Employee** : user_id, matricule, département, poste, date_embauche, salaire, téléphone, adresse
- **User** : id, nom, email, mot de passe, rôle
- **Pivot debiteur_employee** : debiteur_cin, employee_id, date_attribution, statut, notes

### 5.2. Relations

- Un employé est lié à un utilisateur (one-to-one)
- Un débiteur peut être attribué à plusieurs employés (many-to-many)
- Table pivot pour gérer les attributions et leur historique

---

## 6. Contraintes

- Respect des normes de sécurité (validation, authentification, autorisation)
- Interface multilingue (français par défaut)
- Respect de la RGPD pour la gestion des données personnelles
- Documentation technique et utilisateur

---

## 7. Livrables

- Code source complet (frontend, backend, scripts de migration)
- Documentation technique (structure, API, modèles)
- Manuel utilisateur
- Diagrammes UML (classes, cas d’utilisation, séquence, activité, déploiement, composants)
- Jeux de tests et résultats

---

## 8. Planning (exemple)

| Phase                | Durée estimée | Livrable attendu                |
|----------------------|--------------|---------------------------------|
| Analyse & Conception | 2 semaines   | Cahier des charges, diagrammes  |
| Développement        | 4 semaines   | Code source, migrations         |
| Tests & Validation   | 1 semaine    | Jeux de tests, rapports         |
| Documentation        | 1 semaine    | Manuel, documentation technique |
| Déploiement          | 1 semaine    | Application en production       |

---

## 9. Critères de Réussite

- Respect des fonctionnalités décrites
- Application stable, sécurisée et performante
- Documentation claire et complète
- Interface utilisateur ergonomique

---

