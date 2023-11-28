export const QUIZ_THEMES_PROMPT = `Génère liste de X thèmes pour un quiz au format embedded JSON avec les propriétés suivantes :

"code" : nom du thème minuscules, sans accent, espaces remplacés par des dash
"label" : nom du thème minuscules

Thèmes déjà utilisés : #

Toutes unités mesure en fr et abrégées
Oublie pas les accents, cédilles etc. dans le label
Pas de texte dans ta réponse
Je veux directement l'array des thèmes, pas de { themes: [] } mais bien directement []`;
