import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const sampleQuestions = [
  {
    text: '<p>Quelle est la différence principale entre <strong>let</strong> et <strong>const</strong> en JavaScript ?</p>',
    options: [
      { 
        text: 'let permet la réassignation, const non', 
        isCorrect: true, 
        details: "let permet de déclarer des variables qui peuvent être réassignées, tandis que const crée une référence qui ne peut pas être réassignée. Cependant, les propriétés d'un objet const peuvent être modifiées." 
      },
      { text: 'const est plus rapide que let', isCorrect: false },
      { text: 'let est uniquement pour les nombres', isCorrect: false },
    ]
  },
  {
    text: '<p>Qu\'est-ce que le <strong>hoisting</strong> en JavaScript ?</p>',
    options: [
      { text: 'Un mécanisme de déplacement des variables vers le haut', isCorrect: true, details: "Note : Pour des raisons de concision, j'ai montré seulement 2 questions." },
      { text: 'Une technique d\'optimisation', isCorrect: false },
      { text: 'Un type de boucle', isCorrect: false },
    ]
  },
  {
    text: '<p>Quel est le rôle de <strong>this</strong> en JavaScript ?</p>',
    options: [
      { text: 'Fait référence au contexte d\'exécution actuel', isCorrect: true, details: "Note : Pour des raisons de concision, j'ai montré seulement 2 questions." },
      { text: 'Fait référence à la fonction précédente', isCorrect: false },
      { text: 'Fait référence au DOM', isCorrect: false },
    ]
  },
  {
    text: '<p>Qu\'est-ce que le <strong>event bubbling</strong> ?</p>',
    options: [
      { text: 'La propagation des événements vers les éléments parents', isCorrect: true },
      { text: 'La création de nouveaux événements', isCorrect: false },
      { text: 'Un type de boucle événementielle', isCorrect: false },
    ]
  },
  {
    text: '<p>Comment fonctionne le <strong>garbage collector</strong> en JavaScript ?</p>',
    options: [
      { text: 'Il libère automatiquement la mémoire des objets inutilisés', isCorrect: true },
      { text: 'Il doit être appelé manuellement', isCorrect: false },
      { text: 'Il n\'existe pas en JavaScript', isCorrect: false },
    ]
  },
  {
    text: '<p>Qu\'est-ce qu\'une <strong>Promise</strong> en JavaScript ?</p>',
    options: [
      { text: 'Un objet représentant une valeur future', isCorrect: true },
      { text: 'Un type de boucle', isCorrect: false },
      { text: 'Une fonction synchrone', isCorrect: false },
    ]
  },
  {
    text: '<p>Quelle est la différence entre <strong>null</strong> et <strong>undefined</strong> ?</p>',
    options: [
      { text: 'undefined signifie non défini, null signifie absence de valeur', isCorrect: true, details: "Note : Pour des raisons de concision, j'ai montré seulement 2 questions." },
      { text: 'Ce sont exactement la même chose', isCorrect: false },
      { text: 'null est un type primitif, undefined non', isCorrect: false },
    ]
  },
  {
    text: '<p>Qu\'est-ce que le <strong>strict mode</strong> en JavaScript ?</p>',
    options: [
      { text: 'Un mode qui renforce les règles de syntaxe', isCorrect: true },
      { text: 'Un mode qui améliore les performances', isCorrect: false },
      { text: 'Un mode de débogage', isCorrect: false },
    ]
  },
  {
    text: '<p>Quels sont les types primitifs en JavaScript ? (plusieurs réponses)</p>',
    options: [
      { 
        text: 'string', 
        isCorrect: true,
        details: "string est un type primitif qui représente une séquence de caractères. Les chaînes de caractères sont immuables en JavaScript."
      },
      { 
        text: 'number', 
        isCorrect: true,
        details: "number est utilisé pour les nombres entiers et décimaux. JavaScript utilise le format IEEE 754 (double précision) pour tous les nombres."
      },
      { 
        text: 'boolean', 
        isCorrect: true,
        details: "boolean représente une valeur logique qui peut être soit true soit false. C'est le résultat des opérations de comparaison."
      },
      { text: 'array', isCorrect: false },
      { text: 'object', isCorrect: false },
    ]
  },
  {
    text: '<p>Quelles méthodes permettent de parcourir un tableau en JavaScript ? (plusieurs réponses)</p>',
    options: [
      { 
        text: 'forEach()', 
        isCorrect: true,
        details: "forEach() exécute une fonction donnée sur chaque élément du tableau. Elle ne retourne rien et ne peut pas être interrompue."
      },
      { 
        text: 'map()', 
        isCorrect: true,
        details: "map() crée un nouveau tableau avec les résultats de l'appel d'une fonction fournie sur chaque élément du tableau."
      },
      { 
        text: 'reduce()', 
        isCorrect: true,
        details: "reduce() applique une fonction qui est un accumulateur sur chaque valeur du tableau pour la réduire à une seule valeur."
      },
      { text: 'push()', isCorrect: false },
      { text: 'concat()', isCorrect: false },
    ]
  },
  {
    text: '<p>Quels sont les avantages de l\'utilisation de TypeScript ? (plusieurs réponses)</p>',
    options: [
      { text: 'Typage statique', isCorrect: true },
      { text: 'Meilleure autocomplétion', isCorrect: true },
      { text: 'Détection d\'erreurs à la compilation', isCorrect: true },
      { text: 'Code plus rapide à l\'exécution', isCorrect: false },
    ]
  },
  {
    text: '<p>Quels hooks sont fournis par React ? (plusieurs réponses)</p>',
    options: [
      { 
        text: 'useState', 
        isCorrect: true,
        details: "useState permet de gérer l'état local dans un composant fonctionnel. Il retourne une valeur et une fonction pour la mettre à jour."
      },
      { 
        text: 'useEffect', 
        isCorrect: true,
        details: "useEffect permet de gérer les effets de bord dans les composants. Il s'exécute après chaque rendu et peut être configuré pour certaines dépendances."
      },
      { 
        text: 'useContext', 
        isCorrect: true,
        details: "useContext permet de consommer un contexte React. Il évite le prop drilling en donnant accès aux données du contexte à n'importe quel niveau."
      },
      { text: 'useRouter', isCorrect: false },
      { text: 'useFetch', isCorrect: false },
    ]
  }
];

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ad.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  // Create a certification with 20 questions
  const certification = await prisma.certification.create({
    data: {
      name: 'JavaScript Fundamentals',
      description: 'Une certification complète couvrant les fondamentaux de JavaScript',
      duration: 2,
      numberOfQuestions: 5,
      questions: {
        create: sampleQuestions.map(q => ({
          text: q.text,
          options: {
            create: q.options
          }
        }))
      }
    },
  })

  console.log({ admin, certification })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
