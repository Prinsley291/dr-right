# Dr. Right

Application web statique de gestion des étudiants, compagnies, produits, opérations et paiements.

## Structure

- `index.html` — accueil
- `connexion-etudiant.html` — connexion étudiant
- `connexion-administrateur.html` — connexion administrateur
- `administrateur.html` — espace administrateur
- `etudiants.html` — gestion des étudiants
- `etudiant.html` — espace étudiant
- `compagnies.html` — gestion des compagnies
- `produits.html` — gestion des produits
- `operations.html` — enregistrement des opérations
- `paiements.html` — enregistrement des paiements
- `rapports.html` — rapports
- `app.js` — logique de la page d'accueil
- `supabase-client.js` — configuration Supabase partagée
- `style.css` — styles communs

## Principes importants

Les écritures métier critiques passent par des RPC PostgreSQL atomiques :

- `enregistrer_operations_panier_atomique`
- `enregistrer_operation_atomique`
- `enregistrer_paiement_atomique`

Les soldes Jus/Manger sont donc modifiés dans la même transaction que l'écriture correspondante. Les soldes négatifs (crédits) restent autorisés.

Les autorisations reposent sur Supabase Auth + RLS. Les RPC métier sont `SECURITY INVOKER` et ne sont pas accessibles aux utilisateurs anonymes.

## Nettoyage effectué

- Suppression définitive de `etudiants-sauvegarde.html`.
- Centralisation de la configuration du client Supabase dans `supabase-client.js`.
- Suppression des copies de configuration Supabase présentes dans chaque page.
- Conservation d'une seule référence CDN Supabase par page.
- Conservation des fonctionnalités existantes et des rapports.

## Déploiement

Le projet ne nécessite ni build ni framework : il peut être servi comme site statique.

Supabase utilisé :
`https://kmxaragxfewlwtbfmqyx.supabase.co`

