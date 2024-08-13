# Frontend pour le Téléchargement de Fichiers Volumineux

Ce projet est un frontend développé en React.js, conçu pour interagir avec un backend Django pour le téléchargement de fichiers volumineux.

## Table des Matières

| Section                             | Description                                                                 |
|-------------------------------------|-----------------------------------------------------------------------------|
| [Fonctionnalités](#fonctionnalités) | Fonctionnalités principales du projet                                       |
| [Prérequis](#prérequis)             | Logiciels et outils nécessaires pour installer et exécuter le projet        |
| [Installation](#installation)       | Instructions pour installer et configurer le projet                         |
| [Connexion avec le Backend](#connexion-avec-le-backend) | Comment le frontend se connecte au backend Django           |
| [Gestion du Téléchargement](#gestion-du-téléchargement) | Détails sur le téléversement de fichiers par morceaux      |
| [Dépendances](#dépendances)         | Liste des principales dépendances utilisées dans le projet                   |
| [Structure du Projet](#structure-du-projet) | Description de la structure des fichiers dans le projet             |
| [Endpoints API](#endpoints-api)     | Liste des endpoints disponibles pour interagir avec l'API                   |
| [Navigation dans l'Application](#navigation-dans-l-application) | Informations sur les routes disponibles dans l'application  |

## Fonctionnalités

| Fonctionnalité                          | Description                                                                 |
|-----------------------------------------|-----------------------------------------------------------------------------|
| Téléchargement de fichiers en morceaux  | Permet de télécharger des fichiers volumineux en plusieurs morceaux         |
| Visualisation des fichiers téléchargés  | Affiche la liste des fichiers téléchargés avec possibilité de les supprimer |

## Prérequis

- **Node.js** (v14 ou supérieur)
- **npm** (ou **yarn**)
- **Backend Django** (pour le serveur API)

## Installation

### 1. Cloner le Dépôt

\`\`\`bash
git clone https://github.com/kassanabdallah0/frontend-repo.git
cd frontend-repo
\`\`\`

### 2. Installer les Dépendances

\`\`\`bash
npm install
\`\`\`

## Connexion avec le Backend

Le frontend communique avec un backend Django via des appels API. Assurez-vous que le backend est opérationnel et accessible à partir de \`http://localhost:8000\`.

### Configuration de la Connexion

Dans les fichiers \`FileList.js\` et \`FileUpload.js\`, les appels API sont faits vers \`http://localhost:8000\`. Si votre backend est hébergé ailleurs, vous devez modifier l'URL de base (variable \`BASE_URL\`) pour qu'elle corresponde à l'URL de votre backend.

## Gestion du Téléchargement

Ce projet permet le téléchargement de fichiers volumineux en plusieurs morceaux grâce à la bibliothèque [react-dropzone](https://react-dropzone.js.org/).

### Fonctionnement

- **Sélection de Fichier**: Le composant \`FileUpload\` utilise \`react-dropzone\` pour permettre aux utilisateurs de sélectionner des fichiers par glisser-déposer.
- **Téléversement en Morceaux**: Les fichiers sont divisés en morceaux de 1MB (modifiable via la constante \`CHUNK_SIZE\`). Chaque morceau est ensuite téléchargé via un appel POST à l'endpoint \`/fileupload/upload_chunk/\`.
- **Assemblage des Fichiers**: Une fois tous les morceaux téléchargés, une requête POST est envoyée à l'endpoint \`/fileupload/complete_upload/\` pour assembler les morceaux côté serveur.

### Dépendances

| Dépendance      | Description                                                                                     |
|-----------------|-------------------------------------------------------------------------------------------------|
| **React**       | Bibliothèque JavaScript utilisée pour construire l'interface utilisateur                         |
| **Axios**       | Client HTTP utilisé pour effectuer des requêtes API HTTP                                         |
| **react-dropzone** | Composant React permettant la gestion du glisser-déposer pour les fichiers                   |

## Structure du Projet

| Fichier                         | Description                                                      |
|---------------------------------|------------------------------------------------------------------|
| \`src/components/FileList.js\`    | Composant pour afficher la liste des fichiers téléchargés         |
| \`src/components/FileUpload.js\`  | Composant pour gérer le téléchargement des fichiers en morceaux   |
| \`src/App.js\`                    | Point d'entrée de l'application React, gère les routes et l'affichage des composants |

## Endpoints API

Le frontend interagit avec les endpoints API suivants du backend Django :

| Endpoint                                         | Description                                                                 |
|--------------------------------------------------|-----------------------------------------------------------------------------|
| \`/fileupload/upload_chunk/\`                     | Endpoint pour télécharger un morceau de fichier                             |
| \`/fileupload/complete_upload/\`                  | Endpoint pour marquer la fin du téléchargement et démarrer l'assemblage du fichier |
| \`/fileupload/assembly_status/<session_id>/\`     | Endpoint pour vérifier le statut de l'assemblage du fichier                 |
| \`/fileupload/list_completed_uploads/\`           | Endpoint pour lister tous les téléchargements de fichiers terminés          |
| \`/fileupload/delete_upload/<session_id>/\`       | Endpoint pour supprimer un fichier téléchargé et ses métadonnées associées  |

## Navigation dans l'Application

L'application frontend comprend deux pages principales accessibles via les routes suivantes :

| Route                  | Description                                                                  |
|------------------------|------------------------------------------------------------------------------|
| \`/upload\`            | Page permettant de télécharger des fichiers volumineux                       |
| \`/file-list\`         | Page affichant la liste des fichiers téléchargés avec options de suppression  |

Vous pouvez accéder à ces pages en utilisant les URLs suivantes après avoir démarré le serveur de développement :

- **Téléchargement de Fichiers**: [http://localhost:3000/upload](http://localhost:3000/upload)
- **Liste des Fichiers Téléchargés**: [http://localhost:3000/file-list](http://localhost:3000/file-list)