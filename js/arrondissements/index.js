var vm = new Vue({
  el: '.intro',
  data: function () {
    var now = new Date();
    var days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
    var months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
    return  {
      intro: "En 2015, il y a quatre ans, la ville de Paris s'est engagée à rendre accessible d'ici 2020 la quasi-totalité de ses établissements recevant du public aux personnes handicapés, soit environ 1 800 établissements en plus des 400 qui l'étaient déjà à l’époque.",
      introquestion:"Qu’en est-il actuellement ? Dans quel arrondissement de Paris s'installer, lorsqu'on est atteint d'un handicap ? Trouvez celui qui est le plus adapté à vos besoins en répondant à quelques brèves questions (elles ne sont pas enregistrées).",
      now: now,
      day: days[now.getDay()],
      month: months[now.getMonth()]
    };
  }
});

var app = new Vue({
  el: '#app',
  data: {
    quiz: quiz, 
    current: -1,
    answers: [],
    reader: [],
    bestOne: [],
    score: null,
    error:null
  },
  computed: {
    step: function step () {
      return this.quiz[this.current];
    }
  },
  methods: {
    getInputInfo(index, dataName){
      return this.quiz[this.current]["items"][index][dataName]
    },
    getSubChoices(type) {
      var allItems = document.querySelectorAll(".item")
      for (var i = 0; i < allItems.length; i++) {
        let className = allItems[i].className.replace(" item", "")
        if (className == type) {
          allItems[i].style.display == "flex" ? allItems[i].style.display = "none" : allItems[i].style.display = "flex"
        }
        else
          allItems[i].style.display = "none";
      }

    },
    start: function start(){
      this.current++;
      document.getElementById("introPart").style.display = "none";
      document.getElementById("start").style.display = "none";
      
    },
    submitButton: function submitButton (answer) {
      this.answers.push(answer);
      this.current++;
      this.reader.handicap = answer.toLowerCase();
    },
    submitText: function submitText () {
      var answer = this.$refs.textInput.value;
      if (answer != ""){
        this.answers.push(answer);
        this.reader.name = answer;
        this.current++;
      }
    },
    submitSelect: function submitSelect() {
        var possibilities = document.querySelectorAll(".possibilities");
        var checked = [];
        this.reader.places = [];

        for (var i = 0; i < possibilities.length; i++) {
          if (possibilities[i].checked){
            checked.push(replaceSpec(possibilities[i].name));
            this.reader.places.push(possibilities[i].name.toLowerCase())
          }
        }
        this.answers.push(checked);
        this.current++;
        if (checked.length == 0 && this.current == this.quiz.length) {
          this.error = "Mais nous aurions besoin que vous renseigniez au moins un lieu dont vous avez besoin. Sans cette indication, difficile pour nous de déterminer quel arrondissement correspond le mieux à vos besoins."
        }
        else if (this.current == this.quiz.length){
          var results = calculateBestOne(this.answers);
          var tab = results[0]
          var map = document.getElementById("map")
          document.getElementById("map_card").style.display = "block";
          if (window.innerWidth > 800){
            map.style.height = 400;
            map.style.width = 600;
            map.position = "relative"
            map.style.left = map.style.left - 50;
          }
          else {
            map.style.height = window.innerHeight / 2.5;
            map.style.width = window.innerWidth / 1.25;
          }
          $('html, body').animate({
            scrollTop: $("#title_page").offset().top
        }, 100);
          generateMap(tab);
          var indexOfMaxValue = tab.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
          this.bestOne.num = indexOfMaxValue + 1;
          this.score = tab;
          this.bestOne.ligne14 = arrondissements[indexOfMaxValue]['Ligne 14'];
          this.bestOne.densite = arrondissements[indexOfMaxValue]['Densité/pop'];
          this.bestOne.superficie = arrondissements[indexOfMaxValue]['Superficie (km2)'];
          this.bestOne.tram = arrondissements[indexOfMaxValue]['Tram'];
        }
    },
    startOver(){
      var el = document.getElementById("tooltip");
      if (el)
        el.style.display = "none" ;
      let name = this.answers[0];
      this.current = 1;
      this.answers = [name];
      this.reader = [];
      this.reader.name = name;
      this.bestOne = [];
      this.score = null;

    
      return this.quiz[1]
      
    },
    comeBack(){
      var el = document.getElementById("tooltip");
      if (el)
        el.style.display = "none" ;
      let name = this.answers[0];
      let handicap = this.answers[1];
      this.current = 2;
      this.answers = [name, handicap];
      this.reader = [];
      this.error = null
      this.reader.name = name;
      this.reader.handicap = handicap;
      this.bestOne = [];
      this.score = null;
      return this.quiz[2]
      
    }
  }
});


function generateMap(data) {
  d3.queue()
      .defer(d3.json, "js/arrondissements/ardt.json")
      .await(ready);

  function ready(error, topo) {
      
    if (error) throw error;

      let min = d3.min(data);
      let max = d3.max(data);
      let step = (max - min) / 5;

      var colorScale = d3.scaleThreshold()
          .domain(d3.range(min, max + 1, step))
          .range(d3.schemeBlues[5]);

      var paris = topojson.feature(topo, topo.objects.arrondissements);

      //select svg file
      var svg = d3.select("svg.paris_ardt");

      var Tooltip = d3.select("#map_card")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

      var mouseover = function(d) {
        d3.select(this)
        .transition()
        .duration(100)

        Tooltip
          .style("opacity", 1)
          .html(d.properties.l_ar);    
      }

      var mousemove = function(d) {
        d3.select(this)
        .transition()
        .duration(100);

        Tooltip
          .style("left", (d3.mouse(this)[0]+7) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
          
      }

      // var mouseleave = function(d, i) {
      //   console.log("out");
      //   console.log(d, i)
      //   //  d3.select(".tooltip").remove();
      //   // .attr('opacity', function (d, j) {
         
      //   //   return j == i ? 1 : 0;
      //   // })
      //   // console.log(d)
      //   // d3.select(this)
      //   // .transition()
      //   // .duration(100);
        
      //   // Tooltip
      //   //   .style("opacity", 0)
      //   // d3.select(this)
      //   //   .style("stroke", "white")
      //   //   .style("opacity", 1)
      // }

      // projection and path
 
      if (window.innerWidth > 800){
        var height = 400;
        var width = 600;
      }
      else {
        var height = window.innerHeight / 2.5;
        var width = window.innerWidth / 1.25;
      }
      projection = d3.geoMercator()
          .center([ 2.339823, 48.858947 ]) //comment centrer la carte, longitude, latitude
          .translate([ width / 2, height / 2 ]) // centrer l'image obtenue dans le svg
          .scale( width / .005 ); // zoom, plus la valeur est petit plus le zoom est gros 

      var geoPath = d3.geoPath()
          .projection(projection);

      svg.selectAll("path")
          
          .data(paris.features)
          .enter()
          .append("path")
          .on('mouseover',mouseover)
          .on("mousemove", mousemove)
          // .on("mouseout", mouseleave)
          .attr("stroke", "white")
          .attr("stroke-width", 1.5)
              .style("stroke", "white")
              .attr("d", geoPath)
              .attr("class", "contours")
              .attr("fill", function(d) {
                  let arrondissement = d.properties.c_ar;
                  let nb = data[arrondissement - 1];
                  if (arrondissement - 1 == data.indexOf(max)) {
                    return 'red'
                  }
                  else
                    return colorScale(nb);
              });
              // .on("mouseout", mouseleave)
              
              // .on("mouseleave", mouseleave);
       
        
   
  
    

      
      let index = data.indexOf(max);
      // d3.select("h2").html("Le meilleur arrondissement pour vous est le " + (index + 1) + "e arrondissement");
  }

}
