function getURLParameter(name) {
  var getParamRegex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
  return decodeURIComponent((getParamRegex.exec(location.search) || [ ,''])[1].replace(/\+/g, '%20')) || null;
}


function getData(callback) {
  $.getJSON('/home/latest_result', function(data) {
    callback(data);
  });
}

// Shuffle array
function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function inputListToArray(string) {
  if(string === null || string === undefined) return [];
  return string.replace('\r', '').split('\n').filter(function(e) {/*Removes white-space elements*/
    return (/\S+/).test(e);
  });
}

function teams(names, nbrOfTeams, multiples) {
  var teams = [];
  if (multiples === true) {
    var nameLists  = names,
    startIndex = 0;
    for (var i = 0; i < nameLists.length; i++) {
      var result = fillTeams(teams, nameLists[i], nbrOfTeams, startIndex);
      teams      = result.result;
      startIndex = result.startIndex;
    }
  } else {
    teams = fillTeams(teams, names, nbrOfTeams).result;
  }
  return teams;
}

function fillTeams(teams, names, nbrOfTeams, startIndex) {
  var shuffled     = shuffle(names),
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
  var html       = '',
  team       = null,
  teamMember = null;
  if( teams.length < 1 ){
    return "<h1> Not enough names!! </h1>";
  }
  for (var i = 0; i < teams.length; i++) {
    html += '<div class="col-sm-6 col-md-4 col-lg-3 resultbox"><h1>Team ' + (i  + 1) + '</h1><ul>';
    team = teams[i];
    for (var j = 0; j < team.length; j++) {
      teamMember = team[j];
      html += '<li>' + teamMember + '</li>'
    }
    html += '</ul></div>'
  }
  return html;
}

var Teams = {
  makeTeams: function(nbrOfTeams, names) {
    var names     = inputListToArray(names),
    shuffledTeams = teams(names, nbrOfTeams);

    return shuffledTeams;
  },
  makeGenderTeams: function(nbrOfTeams, men, women) {
    var men       = inputListToArray(men),
    women         = inputListToArray(women),
    shuffledTeams = teams([men, women], nbrOfTeams, true);

    return shuffledTeams;
  }
};

function renderTeamList(nbrOfTeams, teamFunction, list, list1) {
  var nbrOfDraws = 100,
  waitLength = 15,
  number     = 0;
  for (var drawNo = 0; drawNo < nbrOfDraws; drawNo++) {
    setTimeout(function() {
      var procent = ((number++) + 1);
      document.getElementById('progress-bar').innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow="'
      + procent
      + '" aria-valuemin="0" aria-valuemax="100" style="width:'
      + procent
      + '%;">'
      + procent
      + '%</div>';

      document.getElementById('result').innerHTML = resultListHtml(teamFunction(nbrOfTeams, list, list1));
      var resultBoxes = document.getElementsByClassName('resultbox');
      var maxHeight   = resultBoxes[0].clientHeight;
      for (var i = 0; i < resultBoxes.length; i++){
        resultBoxes[i].style.minHeight = maxHeight + 'px';
      }

    }, drawNo * waitLength);
  }
}


function renderResult() {
  var myFunc = function(data) {
    if (getURLParameter('radio') === 'random') {
      renderTeamList(data.nbr_of_teams, Teams.makeTeams, data.area);
    } else if (getURLParameter('radio') === 'gender') {
      renderTeamList(data.nbr_of_teams, Teams.makeGenderTeams, data.mentext, data.womentext);
    }
  }
  getData(myFunc);
}

function initPage() {
  renderResult();
  hide();
  
  getData(function(data) {  
    document.getElementById('nbrOfTeams').value  = data.nbr_of_teams;
    document.getElementById('randomnames').value = data.area;
    document.getElementById('men').value         = data.mentext;
    document.getElementById('women').value       = data.womentext;
  });

  
  if (getURLParameter('page') === 'result') {
    document.getElementById('participant-form').setAttribute('class', 'hidden');
  } else if (getURLParameter('page') === 'names' || getURLParameter('page') === null) {
    document.getElementById('result-section').setAttribute('class', 'hidden');
  }
}

function hide() {
  if (document.getElementById('random').checked) {
    document.getElementById('genderwrapper').setAttribute('class', 'hidden');
    document.getElementById('randomwrapper').setAttribute('class', '');
  } else {
    document.getElementById('randomwrapper').setAttribute('class', 'hidden');
    document.getElementById('genderwrapper').setAttribute('class', '');
  }
}

function switchOnRadio() {
  document.getElementById("random").addEventListener("click", hide, false);
  document.getElementById("gender").addEventListener("click", hide, false);
}

window.addEventListener('load', initPage, false);
window.addEventListener("load", switchOnRadio, false);

