function getURLParameter(name) {
  var getParamRegex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
  return decodeURIComponent((getParamRegex.exec(location.search) || [ ,''])[1].replace(/\+/g, '%20')) || null;
}

function getData(callback) {
  $.getJSON('/home/latest_result', function(data) {
    callback(data);
  });
}


var seeder = function() {
 var seed = [];
 return {
  set: function(length) {
    if (seed.length > 0 ) return seed;
    for (var i = 0; i < length; i++) {
      seed.push(Math.random());
    }
    return seed;
  },
  get: function() {
   return seed;
 },
 clear: function() {
   seed = []; 
 }
};
}

function randomShuffle(ar, seed) {
  var numbers  = [],
  shuffled = [];
  for (var a = 0, max = ar.length; a < max; a++) {
    numbers.push(a);
  }
  for (var i = 0, len = ar.length; i < len; i++ ) {
    var r = parseInt(seed[i] * (len - i));
    shuffled.push(ar[numbers[r]]);
    numbers.splice(r,1);
  }
  return shuffled;
}

// Shuffle array
function shuffle(o) {
  var seed = seeder();
  seed.set(o.length);
  return randomShuffle(o, seed.get())
}

function inputListToArray(string) {
  if(string === null || string === undefined) return [];
  return string.replace('\r', '').split('\n').filter(function(e) {/*Removes white-space elements*/
    return (/\S+/).test(e);
  });
}

function teams(names, nbrOfTeams, multiples) {
  var teams  = [],
  result = null;
  if (multiples === true) {
    startIndex = 0;
    for (var i = 0; i < names.length; i++) {
      result     = fillTeams(teams, names[i], nbrOfTeams, startIndex);
      teams      = result.result;
      startIndex = result.startIndex;
    }
  } else {
    teams = fillTeams(teams, names, nbrOfTeams).result;
  }
  return teams;
}

function fillTeams(teams, names, nbrOfTeams, startIndex) {
  var shuffled = shuffle(names),
  startIndex   = startIndex || 0,
  currentIndex = null;
  for (var i = 0; i < shuffled.length; i++) {
    currentIndex = ((i + startIndex) % nbrOfTeams);
    teams[currentIndex] = teams[currentIndex] || [];
    teams[currentIndex].push(shuffled[i]);
  }
  return {
    result: teams,
    startIndex: currentIndex + 1
  };
}

function resultListHtml(teams) {
  var html   = '',
  team       = null,
  teamMember = null;
  if( teams.length < 1 ) return '<h1> Not enough names!! </h1>';
  for (var i = 0; i < teams.length; i++) {
    html += '<div class="col-sm-6 col-md-4 col-lg-3 resultbox"><h1 contenteditable="true">Team '+(i+1)+'</h1><ul>';
    team = teams[i];
    for (var j = 0; j < team.length; j++) {
      teamMember = team[j];
      html += '<li>' + teamMember + '</li>'
    }
    html += '</ul></div>'
  }
  return html;
}

function teamHeading(category,index){
  var heading = '';
  switch(category){
    case "animals":
    heading = 'The ' + DOMESTIC_ANIMALS[Math.floor((Math.random() * DOMESTIC_ANIMALS.length))] + 's';
    break;
    case "cities":
    heading = 'The ' + CITIES[Math.floor((Math.random() * CITIES.length))] + 's';
    break;
    case "countries":
    heading = 'The ' + COUNTRIES[Math.floor((Math.random() * COUNTRIES.length))] + 's';
    break;
    case "names":
    heading = 'The ' + NAMES[Math.floor((Math.random() * NAMES.length))] + 's';
    break;
    case "colours":
    heading = 'The ' + COLOURS[Math.floor((Math.random() * COLOURS.length))] + 's';
    break;
    case "fruits":
    heading = 'The ' + FRUITS[Math.floor((Math.random() * FRUITS.length))] + 's';
    break;
    default:
    heading = 'Team ' + index + 1;
    break;
  }
  return heading;
}

var Teams = {
  makeTeams: function(nbrOfTeams, names) {
    var names = inputListToArray(names);
    return teams(names, nbrOfTeams);
  },
  makeGenderTeams: function(nbrOfTeams, men, women) {
    var men   = inputListToArray(men),
    women = inputListToArray(women);
    return teams([men, women], nbrOfTeams, true);
  }
};

function renderTeamList(nbrOfTeams, teamFunction, list, list1) {
  var nbrOfDraws = 100,
  waitLength     = 25,
  number         = 0,
  resultBoxes    = null,
  maxHeight      = null;
  for (var drawNo = 0; drawNo < nbrOfDraws; drawNo++) {
    setTimeout(function() {
      var procent = (((number++) + 1));
      document.getElementById('progress-bar').innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow="'
      + procent
      + '" aria-valuemin="0" aria-valuemax="100" style="width:'
      + procent
      + '%;">'
      + procent
      + '%</div>';

      document.getElementById('result').innerHTML = resultListHtml(teamFunction(nbrOfTeams, list, list1));
      resultBoxes = document.getElementsByClassName('resultbox');
      maxHeight   = resultBoxes[0].clientHeight;
      for (var i = 0; i < resultBoxes.length; i++) {
        resultBoxes[i].style.minHeight = maxHeight + 'px';
      }
    }, drawNo * waitLength);
  }
}

function renderResult(data) {
  if (getURLParameter('radio') === 'random') {
    renderTeamList(data.nbr_of_teams, Teams.makeTeams, data.area);
  } else if (getURLParameter('radio') === 'gender') {
    renderTeamList(data.nbr_of_teams, Teams.makeGenderTeams, data.mentext, data.womentext);
  }
}

function fillTextAreas(data) {
  document.getElementById('nbrOfTeams').value  = data.nbr_of_teams;
  document.getElementById('randomnames').value = data.area;
  document.getElementById('men').value         = data.mentext;
  document.getElementById('women').value       = data.womentext;
}

function initResultPage() {
  document.getElementById('music').innerHTML = '<audio autoplay="true" src="/swoosh.mp3">'
  document.getElementById('participant-form').setAttribute('class', 'hidden');
}

function initNamesPage() {
  hideShowFormFields();
  document.getElementById('random').addEventListener('click', hideShowFormFields, false);
  document.getElementById('gender').addEventListener('click', hideShowFormFields, false);
  document.getElementById('result-section').setAttribute('class', 'hidden');
}

function hideShowFormFields() {
  if (document.getElementById('random').checked) {
    document.getElementById('genderwrapper').setAttribute('class', 'hidden');
    document.getElementById('randomwrapper').setAttribute('class', '');
  } else {
    document.getElementById('randomwrapper').setAttribute('class', 'hidden');
    document.getElementById('genderwrapper').setAttribute('class', '');
  }
}

function initPage() {
  getData(function(data) {  
    fillTextAreas(data);
    renderResult(data);
  });
  
  if (getURLParameter('page') === 'result') {
    initResultPage();
  } else if (getURLParameter('page') === 'names' || getURLParameter('page') === null) {
    initNamesPage();
  }
}

window.addEventListener('load', initPage, false);
