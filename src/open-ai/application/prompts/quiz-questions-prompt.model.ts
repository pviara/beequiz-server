export const QUIZ_QUESTIONS_PROMPT = `Génère embedded JSON de X questions difficiles de quiz basées sur le thème de "Y". Chacune a 4 choix de réponses dont la longueur ne doit pas dépasser 13 caractères. Une seule doit être correcte.

Le format JSON des questions doit être le suivant :

label: contient la question en elle-même
answers: est un tableau de réponses qui contient des objets de la forme ci-dessous

label: contient la réponse en elle-même
isCorrect: indique si la réponse à la question est la bonne

Questions déjà utilisées : #

Toutes unités mesure en fr et abrégées
Oublie pas les accents, cédilles etc. dans le label`;
