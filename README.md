# Alexandra IB Prep Hub

Mini-site de préparation M&A / Private Equity : questions techniques, réponses, flags, candidatures, XP, timer et sauvegarde locale.

## Lancer en local

```bash
npm install
npm run dev
```

## Mettre sur Vercel

### Méthode la plus simple avec GitHub

1. Crée un compte gratuit sur GitHub si tu n'en as pas.
2. Crée un nouveau repository GitHub, par exemple `alexandra-ib-prep`.
3. Upload tous les fichiers de ce dossier dans le repository.
4. Va sur Vercel.
5. Clique sur `Add New Project`.
6. Connecte ton compte GitHub.
7. Choisis le repository `alexandra-ib-prep`.
8. Vercel détectera automatiquement Vite.
9. Clique sur `Deploy`.
10. Ton site sera en ligne.

## Sauvegarde

La progression est sauvegardée dans le navigateur avec `localStorage`.
Donc tes scores restent sur le même ordinateur/navigateur.
Si tu changes de navigateur ou d'appareil, la progression ne suit pas encore.

## Modifier les questions

Les questions sont dans :

`src/main.jsx`

Cherche `const technicalQuestions = [` et ajoute des objets au format :

```js
{
  id: "un-identifiant-unique",
  category: "Accounting",
  question: "Ta question ?",
  answer: "Ta réponse."
}
```
