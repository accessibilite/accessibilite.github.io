var quiz = [
    {
      question: "Quel est votre prénom ?",
      type: "text"
    },
    {
      question: "Par quel type de handicap êtes-vous atteint ?",
      type: "choice",
      choices: ["Moteur", "Auditif", "Visuel", "Handicaps multiples"],
    },
    {
      question: "De quoi avez-vous besoin ?",
      type: "select",
      items: [
        { type: 'Education', name:"Haltes-Garderies" },
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
  