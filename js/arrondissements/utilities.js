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
          let for_user = data_access[i][replaceSpec(handicap)];
          let num_arr = Number(data_access[i]["Arrondissement"]);
          let type = data_access[i]["Type"];
          score[num_arr - 1] = score[num_arr - 1] + for_user["0"] * 0.1 + for_user["1"] * 2 + for_user["2"] * 3 + for_user["3"] * 4 + for_user["4"] * 4.5;

          if (score[num_arr - 1] > score_best) {
            score_best = score[num_arr - 1];
            info_best[type] = []
            info_best[type].type3 = for_user["3"];
            info_best[type].type4 = for_user["4"];
          }
        }
        
    }
    return([score, info_best])
}
