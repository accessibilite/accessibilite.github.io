function replaceSpec(Texte){
    var TabSpec = {"à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","ø":"o","è":"e","é":"e","ê":"e","ë":"e","ç":"c","ì":"i","í":"i","î":"i","ï":"i","ù":"u","ú":"u","û":"u","ü":"u","ÿ":"y","ñ":"n","-":" ","_":" "}; 
      var reg=/[àáäâèéêëçìíîïòóôõöøùúûüÿñ_-]/gi; 
      return Texte.replace(reg,function(){ return TabSpec[arguments[0].toLowerCase()];}).toLowerCase();
  }

function calculateBestOne(answers) {
    var handicap = answers[1];
    var places_needed = answers[2];
    var score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    var score_best = 0;
    var info_best = [];

    for (var i = 0; i < data_access.length; i++) {
        if (places_needed.indexOf(replaceSpec(data_access[i]["Type"])) >= 0){
          let num_arr = Number(data_access[i]["Arrondissement"]);
          let population = Number(arrondissements[num_arr - 1].Population);
          if (replaceSpec(data_access[i]["Type"]) == 'mairie') {
            population = 1;
          }
          let type = data_access[i]["Type"];
          if (handicap == "Handicaps multiples"){
            score = calculateScore("Moteur", score, num_arr, i, population);
            score = calculateScore("Auditif", score, num_arr, i, population);
            score = calculateScore("Visuel", score, num_arr, i, population);
          }
          else {
            score = calculateScore(handicap, score, num_arr, i, population);
          }
          if (score[num_arr - 1] > score_best) {
            score_best = score[num_arr - 1];
            info_best[type] = [];
            if (handicap != "Handicaps multiples"){
              let for_user = data_access[i][replaceSpec(handicap)];
              info_best[type].type3 = for_user["3"];
              info_best[type].type4 = for_user["4"];
            }
          }
        }
        
    }
    return([score, info_best])
}

function calculateScore(handicap, score, num_arr, i, population){
  let for_user = data_access[i][replaceSpec(handicap)];
  score[num_arr - 1] = Math.round((score[num_arr - 1] + (for_user["0"] / population) * 100 + (for_user["1"]/ population) * 2000 
  + (for_user["2"]/ population) * 3000 + (for_user["3"]/ population) * 4500 + (for_user["4"]/ population) * 5000) * 100) / 100;
  return(score)
}