var quiz = [
    {
      question: "Quel est votre prénom ?",
      type: "text"
    },
    {
      question: "Par quel type de handicap êtes-vous atteint ?\n (Nous ne pouvons malheureusement pas faire de calculs pour les handicaps psychiques, qui sont actuellement très peu pris en compte dans les problématiques d'accessibilité).",
      type: "choice",
      choices: ["Moteur", "Auditif", "Visuel"],
    },
    {
      question: "De quoi avez-vous besoin ?",
      type: "select",
      items: [
        { type: 'Education', name:"Halte-Garderie" },
        { type: 'Education', name:"Crèches" },
        { type: 'Education', name:"Écoles maternelles" },
        { type: 'Education', name:"Écoles élémentaires" },
        { type: 'Education', name:"Collèges" },
        { type: 'Education', name:"Lycées" },
        { type: 'Politique', name:"Mairie" },
        { type: 'Culture et loisirs', name:"Musées" },
        { type: 'Culture et loisirs', name:"Bibliothèques" },
        { type: 'Culture et loisirs', name:"Jardins" },
        { type: 'Sport', name:"Piscines" },
        { type: 'Sport', name:"Équipements sportifs" }
      ]
    }
  ];
  