function getURLParameter(name) {
  var getParamRegex = new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)');
  return decodeURIComponent((getParamRegex.exec(location.search) || [ ,''])[1].replace(/\+/g, '%20')) || null;
}

// Shuffle array
function shuffle(o) {
  for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
}

function inputListToArray(string) {
  return string.split('\n');
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

  for (var i = 0; i < teams.length; i++) {
    html += '<div class="col-sm-6 col-md-4 col-lg-3"><h1>Team ' + (i  + 1) + '</h1><ul>';
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
  makeTeams: function(fromCache) {
    var names         = inputListToArray(getURLParameter('area')),
        nbrOfTeams    = parseInt(getURLParameter('nbrOfTeams'), 10),
        shuffledTeams = teams(names, nbrOfTeams);

    return shuffledTeams;
  },
  makeGenderTeams: function(fromCache) {
    var men           = inputListToArray(getURLParameter('mentext')),
        women         = inputListToArray(getURLParameter('womentext')),
        nbrOfTeams    = parseInt(getURLParameter('nbrOfTeams'), 10),
        shuffledTeams = teams([men, women], nbrOfTeams, true);

    return shuffledTeams;
  }
};

function renderTeamList(teamFunction) {
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

      document.getElementById('result').innerHTML = resultListHtml(teamFunction(false));
    }, drawNo * waitLength);
  }
}


function renderResult() {
  if (getURLParameter('radio') === 'random') {
    renderTeamList(Teams.makeTeams);
  } else if (getURLParameter('radio') === 'gender') {
    renderTeamList(Teams.makeGenderTeams);
  }
}

function initPage() {
  renderResult();
  hide();
  
  document.getElementById('nbrOfTeams').value = getURLParameter('nbrOfTeams');
  document.getElementById('randomnames').value = getURLParameter('area');
  document.getElementById('men').value         = getURLParameter('mentext');
  document.getElementById('women').value       = getURLParameter('womentext');
  
  if (getURLParameter('page') === 'result' || getURLParameter('page') === null) {
    document.getElementById('participant-form').setAttribute('class', 'hidden');
  } else if (getURLParameter('page') === 'names') {
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

