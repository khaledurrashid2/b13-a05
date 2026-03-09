
// Global Variables

const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

const API_BASE_URL = 'https://phi-lab-server.vercel.app/api/v1/lab';

let allIssues = [];

let currentTab = 'all';


// Login function that runs when the user clicks the "Sign In" button
const handleLogin = () => {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');

  const typedUsername = usernameInput.value.trim(); 
  const typedPassword = passwordInput.value.trim();


  const errorBox = document.getElementById('login-error');


  if (typedUsername === DEFAULT_USERNAME && typedPassword === DEFAULT_PASSWORD) {
    errorBox.style.display = 'none';

    const loginPage = document.getElementById('login-page');
    loginPage.style.setProperty('display', 'none', 'important');

    const issuesPage = document.getElementById('issues-page');
    issuesPage.style.setProperty('display', 'block', 'important');

    loadAllIssues();
  } 

  else {
    errorBox.style.display = 'flex';
  }
};

document.addEventListener('keydown', (event) => {
  
  if (event.key === 'Enter') {
    
    const loginPage = document.getElementById('login-page');
    if (loginPage.style.display !== 'none') {
      handleLogin();
    }
  }
});

//----------------------------------------------
// Function to display spinner when loading data

const showSpinner = () => {
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'flex';
};


const hideSpinner = () => {
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'none';
};

//--------------------------------
// Fetch all the data from the API

const loadAllIssues = () => {
  
  showSpinner();

  fetch(API_BASE_URL + '/issues')            
    .then((response) => {
      return response.json();       
    })
    .then((data) => {

      allIssues = data.data || data || [];


      renderIssues(allIssues);

      hideSpinner();
    });
};


//---------------------------------------------------------
// Search data using the search box available on the navbar

const handleSearchKey = (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
};


const handleSearch = () => {

  const searchInput = document.getElementById('search-input');
  const searchText = searchInput.value.trim();

  if (searchText === '') {
    loadAllIssues();
    return; 
  }

  showSpinner();


  const searchURL = API_BASE_URL + '/issues/search?q=' + encodeURIComponent(searchText);

  fetch(searchURL)                            
    .then((response) => {
      return response.json();                 
    })
    .then((data) => {

      allIssues = data.data || data || [];

      switchTab(currentTab);

      hideSpinner();
    });
};

//------------------------------------
// Tab switching (All / Open / Closed)
const switchTab = (tabName) => {

  currentTab = tabName;

  const allTabButton    = document.getElementById('tab-all');
  const openTabButton   = document.getElementById('tab-open');
  const closedTabButton = document.getElementById('tab-closed');

  allTabButton.classList.remove('active');
  openTabButton.classList.remove('active');
  closedTabButton.classList.remove('active');

    if (tabName === 'all') {
    allTabButton.classList.add('active');
  } else if (tabName === 'open') {
    openTabButton.classList.add('active');
  } else if (tabName === 'closed') {
    closedTabButton.classList.add('active');
  }

  let filteredIssues = [];

  if (tabName === 'all') {
 
    filteredIssues = allIssues;

  } else if (tabName === 'open') {

    for (let i = 0; i < allIssues.length; i++) {
      if (allIssues[i].status === 'open') {
        filteredIssues.push(allIssues[i]);
      }
    }

  } else if (tabName === 'closed') {

    for (let i = 0; i < allIssues.length; i++) {
      if (allIssues[i].status === 'closed') {
        filteredIssues.push(allIssues[i]);
      }
    }
  }

  renderIssues(filteredIssues);
};

//---------------------------
// Display items on the page)

const renderIssues = (issues) => {

  const grid     = document.getElementById('issues-grid');
  const empty    = document.getElementById('empty-state');
  const countEl  = document.getElementById('issue-count');

  if (issues.length === 1) {
    countEl.textContent = '1 Issue';
  } else {
    countEl.textContent = issues.length + ' Issues';
  }

  // If there are no issues to show, display the empty state message
  if (issues.length === 0) {
    grid.innerHTML = '';          
    empty.style.display = 'block'; 
    return;
  }

  empty.style.display = 'none';

  let allCardsHTML = '';

  for (let i = 0; i < issues.length; i++) {
    const singleIssue = issues[i];
    const cardHTML = buildCard(singleIssue);
    allCardsHTML = allCardsHTML + cardHTML; 
  }

  grid.innerHTML = allCardsHTML;
};

//----------------------
// Some small functions

const getPriorityClass = (priority) => {
  if (!priority) {
    return 'priority-low'; 
  }

  const priorityLower = priority.toLowerCase();

  if (priorityLower === 'high') {
    return 'priority-high';
  } else if (priorityLower === 'medium') {
    return 'priority-medium';
  } else {
    return 'priority-low';
  }
};

//----------------------------------------------
const getLabelClass = (label) => {
  if (!label) {
    return 'label-default';
  }

  const labelLower = label.toLowerCase();

  if (labelLower.includes('bug')) {
    return 'label-bug';
  } else if (labelLower.includes('enhance')) {
    return 'label-enhancement';
  } else if (labelLower.includes('help')) {
    return 'label-help';
  } else if (labelLower.includes('good first') || labelLower.includes('good-first')) {
    return 'label-good-first-issue';
  } else if (labelLower.includes('doc')) {
    return 'label-documentation';
  } else {
    return 'label-default';
  }
};

//----------------------------------------------
const formatDate = (dateString) => {
  if (!dateString) {
    return '';
  }

  const dateObject = new Date(dateString);
  return dateObject.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
};

//----------------------------------------------
const formatDateModal = (dateString) => {
  if (!dateString) {
    return '';
  }

  const dateObject = new Date(dateString);

  const day   = String(dateObject.getDate()).padStart(2, '0');  
  const month = String(dateObject.getMonth() + 1).padStart(2, '0'); 
  const year  = dateObject.getFullYear();

  return day + '/' + month + '/' + year;
};

//----------------------------------------------
const getStatusIcon = (status) => {
  if (status === 'open') {
    // Green circle icon for open issues
    return '<img src="../assets/open-status.png" alt="open status icon">';
  } else {
    // Purple checkmark icon for closed issues
    return '<img src="../assets/closed-status.png" alt="icon for closed status"></img>';
  }
};


//----------------------------------------------
const getLabelIcon = (label) => {
  const labelLower = label.toLowerCase();

  if (labelLower.includes('bug')) {
    // Bug icon
    return '<i class="fa-solid fa-bug"></i>';
  } else if (labelLower.includes('help')) {
    // Help wanted icon
    return '<i class="fa-regular fa-circle-stop"></i>';
  } else if (labelLower.includes('enhance')) {
    // Enhancement icon
    return '<i class="fa-solid fa-wand-magic-sparkles"></i>';
  } else if (labelLower.includes('good first') || labelLower.includes('good-first')) {
    // Good first issue icon
    return '<i class="fa-regular fa-thumbs-up"></i>';
  } else if (labelLower.includes('doc')) {
    // Documentation icon
    return '<i class="fa-regular fa-file-lines"></i>';
  } else {
    // Default: use a tag icon for anything else
    return '<i class="fa-solid fa-tag"></i>';
  }
};

//----------------------------------------------
const getLabelBadgeClass = (label) => {
  const labelLower = label.toLowerCase();

  if (labelLower.includes('bug')) {
    return 'badge badge-error badge-outline';
  } else if (labelLower.includes('help')) {
    return 'badge badge-warning badge-outline';
  } else if (labelLower.includes('enhance')) {
    return 'badge badge-success badge-outline';
  } else if (labelLower.includes('good first') || labelLower.includes('good-first')) {
    return 'badge badge-info badge-outline';
  } else if (labelLower.includes('doc')) {
    return 'badge badge-secondary badge-outline';
  } else {
    return 'badge badge-secondary badge-outline';
  }
};

//----------------------------------------------
const getPriorityBadgeClass = (priority) => {
  if (priority === 'HIGH') {
    return 'badge badge-error text-white font-bold';
  } else if (priority === 'MEDIUM') {
    return 'badge badge-warning text-white font-bold';
  } else {
    return 'badge badge-ghost font-bold';
  }
};


//-------------------------------------------------------------------------------
// Function that takes one issue object and returns the HTML string for its card

const buildCard = (issue) => {
  let borderClass = '';
  if (issue.status === 'open') {
    borderClass = 'card-open';   // Sets the border colours to green
  } else {
    borderClass = 'card-closed'; // Sets the border colour to purple
  }

  const labels = issue.labels || [];

  let labelsHTML = '';
  for (let i = 0; i < labels.length && i < 3; i++) {
    const label      = labels[i];
    const labelClass = getLabelClass(label);
    const labelIcon  = getLabelIcon(label);
    labelsHTML = labelsHTML + '<span class="text-xs px-2 py-1 rounded-full font-medium inline-flex items-center gap-1 ' + labelClass + '">' + labelIcon + ' ' + label.toUpperCase() + '</span>';
  }

  const priorityClass = getPriorityClass(issue.priority);
  const priorityText  = (issue.priority || 'LOW').toUpperCase();

  let description = issue.body || issue.description || '';
  if (description.length > 80) {
    description = description.substring(0, 80) + '...';
  }

  const author = issue.user || issue.author || 'unknown';

  const dateText = formatDate(issue.created_at || issue.createdAt);

  const cardHTML =
    '<div class="issue-card ' + borderClass + '">' +

      '<div class="flex items-start justify-between mb-2">' +
        '<div class="flex items-center gap-1">' + getStatusIcon(issue.status) + '</div>' +
        '<span class="text-xs px-2 py-0.5 rounded-full font-semibold ' + priorityClass + '">' + priorityText + '</span>' +
      '</div>' +

      '<h3 class="font-semibold text-gray-900 text-sm mb-1 cursor-pointer hover:text-indigo-600 transition-colors leading-snug" onclick="openIssueModal(' + issue.id + ')">' +
        (issue.title || '') +
      '</h3>' +

      '<p class="text-gray-500 text-xs mb-3 leading-relaxed">' + description + '</p>' +

      '<div class="flex flex-wrap gap-1 mb-3">' + labelsHTML + '</div>' +

      '<div class="text-xs text-gray-400">' +
        '<p>#' + issue.number + ' by <span class="text-gray-600 font-medium">' + author + '</span></p>' +
        '<p>' + dateText + '</p>' +
      '</div>' +

    '</div>';

  return cardHTML;
};


//-----------------------------------------------------------------
// This function shows a modal popup for a specific issue by its ID

const openIssueModal = (issueId) => {

  showSpinner();

  fetch(API_BASE_URL + '/issue/' + issueId)   
    .then((response) => {
      return response.json(); 
    })
    .then((data) => {

      const issue = data.data || data;

      renderModal(issue);

      hideSpinner();

      const modalCheckbox = document.getElementById('issue_modal');
      modalCheckbox.checked = true;
    });
};

//------------------------------------------------------------
// This function fills the modal popup with all the issue's information
const renderModal = (issue) => {

  const modalContentArea = document.getElementById('modal-content');

  const labels     = issue.labels || [];
  const isOpen     = issue.status === 'open';
  const statusText = isOpen ? 'Opened' : 'Closed';
  const author     = issue.user || issue.author || 'Unknown';
  const createdAt  = formatDateModal(issue.created_at || issue.createdAt);
  const priority   = (issue.priority || 'LOW').toUpperCase();
  const description = issue.body || issue.description || 'No description provided.';
  const title      = issue.title || 'Untitled Issue';

  let statusBadgeClass = '';
  if (isOpen) {
    statusBadgeClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white';
  } else {
    statusBadgeClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-500 text-white';
  }

  const priorityBadgeClass = getPriorityBadgeClass(priority);

  let labelsHTML = '';
  for (let i = 0; i < labels.length; i++) {
    const label          = labels[i];
    const icon           = getLabelIcon(label);
    const badgeClass     = getLabelBadgeClass(label);

    labelsHTML = labelsHTML +
      '<span class="' + badgeClass + ' gap-1 font-semibold text-xs py-3 px-3">' +
        icon + ' ' + label.toUpperCase() +
      '</span>';
  }

  let labelsRowHTML = '';
  if (labels.length > 0) {
    labelsRowHTML = '<div class="flex flex-wrap gap-2 mb-5">' + labelsHTML + '</div>';
  }

  const modalHTML =

    '<h3 class="text-xl font-extrabold text-gray-900 mb-3 leading-snug">' +
      title +
    '</h3>' +

    '<div class="flex flex-wrap items-center gap-2 mb-4">' +
      '<span class="' + statusBadgeClass + '">' + statusText + '</span>' +
      '<span class="text-gray-300 select-none font-bold">•</span>' +
      '<span class="text-sm text-gray-500">' +
        statusText + ' by <span class="font-semibold text-gray-700">' + author + '</span>' +
      '</span>' +
      '<span class="text-gray-300 select-none font-bold">•</span>' +
      '<span class="text-sm text-gray-500">' + createdAt + '</span>' +
    '</div>' +

    labelsRowHTML +

    '<p class="text-sm text-gray-600 leading-relaxed mb-6">' + description + '</p>' +

    '<div class="flex overflow-hidden rounded-xl border border-base-300 bg-base-200">' +
      '<div class="flex-1 px-5 py-4 border-r border-base-300">' +
        '<p class="text-xs text-gray-500 mb-1">Assignee:</p>' +
        '<p class="text-sm font-bold text-gray-900">' + author + '</p>' +
      '</div>' +
      '<div class="flex-1 px-5 py-4">' +
        '<p class="text-xs text-gray-500 mb-1">Priority:</p>' +
        '<span class="' + priorityBadgeClass + '">' + priority + '</span>' +
      '</div>' +
    '</div>';
  
  modalContentArea.innerHTML = modalHTML;
};

