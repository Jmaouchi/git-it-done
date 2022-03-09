var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");
var repoContainerEl = document.querySelector("#repos-container");
var repoSearchTerm = document.querySelector("#repo-search-term");


// step 1 is create this function, and everytime we click on the buttom it will call the getUserRepos function;
var formSubmitHandler = function(event) {
  event.preventDefault();
  console.log(event);
  // get value from input element
  var username = nameInputEl.value.trim();//.trim() at the end: this piece is useful if we accidentally leave a leading or trailing space in the <input> element, such as " octocat" or "octocat ".

  if (username) {
    getUserRepos(username); // we will run the getUserRepos function but with the username parameter
    nameInputEl.value = ""; // clearing the input on the form 
  } else {
    alert("Please enter a GitHub username");
}
};



// step 2 is the function called on the submitHandler function, and  when a user click on the buttom it will get the repos he want.
var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = 'https://api.github.com/users/' + user + '/repos';

  // make a get request to url
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayRepos(data, user);
      });
    } else {
      alert('Error: GitHub User Not Found');
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
  });
  }



//step 3 is called by the getUserRepos function, and it will get all the user repos and display them on the page for us.
var displayRepos = function(repos, searchTerm) {  // the repoos parameter on this function will change the data on the main function and the 
  // searchterm parametre will change the user on the main function (if we will switch the places it wont work)
  console.log(repos);
  console.log(searchTerm);
  // clear old content
  repoContainerEl.textContent = '';
  repoSearchTerm.textContent = searchTerm;

  // loop over repos
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    var repoName = repos[i].owner.login + '/' + repos[i].name;  // this will loop thru the repos every time and give us the login and the name of the repo
    // this with going to the console log and getting the infos we need from the array

      // create a link for each repo
      var repoEl = document.createElement("a");
      repoEl.classList = "list-item flex-row justify-space-between align-center";
      repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName); // this will add the repoName to the href and whenever we click on it it will take us to its repo
  
      // create a span element to hold repository name
      var titleEl = document.createElement("span");
      titleEl.textContent = repoName;
  
      // append to container
      repoEl.appendChild(titleEl);
  
      // create a status element, and this spam will hold the red x icon or the green check mark
      var statusEl = document.createElement("span");
      statusEl.classList = "flex-row align-center";

    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {  // this will go check if i have any issues on my repos and compare it to 0 =, if yes do this
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)'; //it will add the red X and how many +  issues 
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }

  // check if api returned any repos
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
   return;
}
};


// add event listeners to forms
userFormEl.addEventListener('submit', formSubmitHandler);