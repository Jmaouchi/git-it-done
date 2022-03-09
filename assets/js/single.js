var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");


var getRepoName = function() {
  var queryString = document.location.search; // this will check the browser and get the url
  var repoName = queryString.split("=")[1]; // this will cut the words after the = signe (the query string)
  if(repoName) {
    repoNameEl.textContent = repoName;

    getRepoIssues(repoName);
  }
  else {
    document.location.replace("./index.html");
  }
}

// get the repos from github, with a http request
var getRepoIssues = function(repo) {
  console.log(repo);
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
      // pass response data to dom function
      displayIssues(data);
      // check if api has paginated issues
      if (response.headers.get("Link")) {
       displayWarning(repo)
    }
      });
    }
    else {
      // if not successful, redirect to homepage
      document.location.replace("./index.html");
    }
  });
};

// display the issues to the page 
var displayIssues = function(issues) {
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url); // the html_url is the object proprety on the issues
    issueEl.setAttribute("target", "_blank"); // we added blank to open the issues in a new tab when we click on it 


    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");

    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
      typeEl.textContent = "(Pull request)";
    } else {
      typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);

    issueContainerEl.appendChild(issueEl);

    
  }
}


var displayWarning = function(repo) {
  // add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
};




//function calls

getRepoName()
