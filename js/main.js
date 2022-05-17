/*---------------------------------------------
Initial Employees to Generate + API URL
---------------------------------------------*/

let numOfEmployees = 30;

// max possible allowed to generate = 5000
let userApiURL = `https://randomuser.me/api/?results=${numOfEmployees}&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;
const peopleGrid = document.getElementById('grid-container');

/*-----------------------------------------
Initialization - Page Details / Classes
-----------------------------------------*/

pageBegin = 0;
pageLength = 12;

currentPage = 1;
totalPages = Math.ceil(numOfEmployees / pageLength);

let isFilterActive = false;
currentCardLayout = 'grid';

function logPageData() {
  console.log(  ` %c- # of Employees: ${numOfEmployees}`,'color: lightgreen','\n',
                `- Max Employees/Page: ${pageLength}`,'\n',
                `- Current Page: ${currentPage}`,'\n',
                `- # of Pages: ${totalPages}`
  );
}

/*-----------------------------
Employee Quantity Selector
-----------------------------*/

const quantityInput = document.getElementById('quantity-selector');
quantityInput.placeholder = numOfEmployees;
const generateBtn = document.querySelector('.generate-btn');

// in case generate is pressed without changing the value
let newQuantity = numOfEmployees;

quantityInput.addEventListener('keyup', () => {
  let value = quantityInput.value;

  // force quanitity of users generated 
  // to remain between 10 and 5000
  if (value < 10) {
    newQuantity = 10;
  } else if (value > 5000) {
    newQuantity = 5000;
  } else {
    newQuantity = value;
  }
})

generateBtn.addEventListener('click', () => {
  numOfEmployees = newQuantity;
  totalPages = Math.ceil(numOfEmployees / pageLength);
  quantityInput.placeholder = numOfEmployees;
  fetchData();
}); 

/*-----------------------------
Fetch and Organize API Data
-----------------------------*/

let employeeData = [];
let filteredArray;

function fetchData() {
  let userApiURL = `https://randomuser.me/api/?results=${numOfEmployees}&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;

  fetch(userApiURL)
    .then(res => res.json())
    .then(res => sortEmployees(res))
    .then(res => generateHTML(res))
    .then(logPageData);
}

function sortEmployees(data) {
  let employees = [];
  data.results.forEach(person => employees.push(person));
  return employeeData = employees.sort(sortArray);
}

function sortArray(a, b) {
  if (a.name.last < b.name.last) {return -1;}
  if (a.name.last > b.name.last) {return 1;}
  return 0;
}

fetchData(userApiURL);

/*-----------------------------
Button Functionality
-----------------------------*/

/*------ Layout options ------*/

const rowLayoutBtn = document.getElementById('layout-rows-btn');
const gridLayoutBtn = document.getElementById('layout-grid-btn');

rowLayoutBtn.addEventListener('click', () => {
  if (peopleGrid.className == 'grid-layout') {
    peopleGrid.className = 'row-layout';

    // returns to page 1 on layout change
    // to prevent weird paging breaks
    currentPage = 1;
    pageBegin = 0; 

    // number of employees shown when in row mode
    pageLength = 24;
    totalPages = Math.ceil(numOfEmployees / pageLength);
    
    // determines card class on generation
    currentCardLayout = 'row';
    console.log('Layout: Row');

    // generate and log first page of new layout
    if (isFilterActive) {
      generateHTML(filteredArray)
    } else {
      generateHTML(employeeData)
    }

    logPageData();
  }
})

gridLayoutBtn.addEventListener('click', () => {
  if (peopleGrid.className == 'row-layout') {
    peopleGrid.className = 'grid-layout';

    // returns to page 1 on layout change
    // to prevent weird paging breaks
    currentPage = 1;
    pageBegin = 0;

    // number of employees shown when in grid mode
    pageLength = 12;
    totalPages = Math.ceil(numOfEmployees / pageLength);

    // determines card class on generation
    currentCardLayout = 'grid';
    console.log('Layout: Grid');

    // generate and log first page of new layout
    if (isFilterActive) {
      generateHTML(filteredArray)
    } else {
      generateHTML(employeeData)
    }
    logPageData();
  }
})

/*------ Page Left and Right ------*/

const pageLeftBtn = document.querySelector('.page-left-btn');
const pageRightBtn = document.querySelector('.page-right-btn');

pageLeftBtn.addEventListener('click', () => {
  previousPage();
});

function previousPage() {
  if (currentPage > 1) {
    pageBegin -= pageLength;
    currentPage--;
    if (isFilterActive) {
      generateHTML(filteredArray)
    } else {
      generateHTML(employeeData)
    }
    logPageData();
  }
}

pageRightBtn.addEventListener('click', () => {
  nextPage();
});

function nextPage() {
  if (currentPage < totalPages) {
    pageBegin += pageLength;
    currentPage++;
    if (isFilterActive) {
      generateHTML(filteredArray)
    } else {
      generateHTML(employeeData)
    }
    logPageData();
  }
}

/*-----------------------------
Generate Card HTML
-----------------------------*/

function generateHTML(employees) {

  // clear grid
  peopleGrid.innerHTML = '';

  // loop through employeeData array via range of indexes
  // equivalent to page length 
  for(let i=pageBegin; i<(pageBegin + pageLength); i++) {
    let p = employees[i];

    // check to prevent attempts at creating
    // cards where info does not exist
    if (p !== undefined) {

      // select all necessary information
      let imgTmb = p.picture.thumbnail;
      let imgMed = p.picture.medium;
      let imgLg = p.picture.large;
      let fn = p.name.first;
      let ln = p.name.last;
      let email = p.email;
      let city = p.location.city;
      let phone = p.phone;
      let street = `${p.location.street.number} ${p.location.street.name}`;
      let address = `${street}, ${p.location.state} ${p.location.postcode}`;
      let dob = p.dob.date.slice(0, 10);

      // construct and insert card
      peopleGrid.innerHTML +=  `
        <div id="${fn.toLowerCase()}${ln.toLowerCase()}" class="card card-${currentCardLayout}">
          <img class="card-img-tmb" src="${imgTmb}" alt="A photo of ${fn} ${ln}"> 
          <img class="card-img-med" src="${imgMed}" alt="A photo of ${fn} ${ln}"> 
          <img class="card-img-lg" src="${imgLg}" alt="A photo of ${fn} ${ln}"> 
          <div class="card-text-1">
            <h3 class="card-name">${fn} ${ln}</h3>
            <a class="card-email" href="mailto:${email}">${email}</a>
            <p class="card-city">${city}</p>
          </div>
          <div class="card-text-2">
            <p class="card-phone">${phone}</p>
            <p class="card-address">${address}</p>
            <p class="card-dob">${dob}</p>
          </div>
        </div>
      `;
    }
  }
}

/*-----------------------------
Search Filter 
-----------------------------*/

const searchBar = document.getElementById('searchBar');


// keyup allows active filtering
searchBar.addEventListener('keyup', (e) => {
  // key check to prevent duplicate event firing
  if (e.key !== 'Enter') {
    search();
  }
});

// search allows use of enter key and clear 'x'
searchBar.addEventListener('search', () => {
  search();
});

function search() {
  let userInput = searchBar.value.toLowerCase();

  filteredArray = employeeData.filter(employee => {
    let fullname = `${employee.name.first} ${employee.name.last}`;
    let name = fullname.toLowerCase();
    return name.includes(userInput);
  });
  
  if (userInput == '') {
    currentPage = 1;
    pageBegin = 0;
    totalPages = Math.ceil(numOfEmployees / pageLength);
    isFilterActive = false;
    generateHTML(employeeData);
    logPageData();
  } else {
    currentPage = 1;
    pageBegin = 0;
    totalPages = Math.ceil(filteredArray.length / pageLength);
    isFilterActive = true;
    generateHTML(filteredArray);
    logPageData();
  }
}

/*-----------------------------
Modals
-----------------------------*/

const modalInsert = document.querySelector('.modal-card-insert');
const modal = document.querySelector('.modal');

const closeModalBtn = document.querySelector('.close-modal-btn');
const previousModalBtn = document.querySelector('.previous-modal-btn');
const nextModalBtn = document.querySelector('.next-modal-btn');

let currentCardId;
let isModalOpen = false;

// show modal on card click
peopleGrid.addEventListener('click', (e) => {
  
  // target check to allow access to email 
  // without opening modal
  if (e.target.classList.contains('card')) {
    currentCardId = e.target.id;
    modalInsert.innerHTML = e.target.outerHTML;
    changeModalClasses(modalInsert);
    modal.showModal();
    isModalOpen = true;
  }
});

function changeModalClasses(modalInsert) {
  modalInsert.firstElementChild.classList.remove('card-row');
  modalInsert.firstElementChild.classList.remove('card-grid');
  modalInsert.firstElementChild.classList.add('card-modal');
}

// Allows closing modal via 'x' button and backdrop
closeModalBtn.addEventListener('click', () => {
  modal.close();
  isModalOpen = false;
});

modal.addEventListener('click', (e) => {
  let m = e.target;
  if (m.className == 'modal') {
    modal.close();
    isModalOpen = false;
  }
});

// Allows arrow keys to control switching modals
window.addEventListener('keydown', (e) => {
  if (isModalOpen && e.key == 'ArrowLeft') {
    openPreviousModal();
  } else if ((isModalOpen && e.key == 'ArrowRight')) {
    openNextModal();
  }
});

// if available, create modal for previous employee in list
previousModalBtn.addEventListener('click', () => {
  openPreviousModal();
});

function openPreviousModal() {
  let currentModal = document.getElementById(currentCardId);

  if (currentModal.previousElementSibling !== null) {
    let previousModal = currentModal.previousElementSibling;
    currentCardId = previousModal.id;
    modalInsert.innerHTML = previousModal.outerHTML;
    changeModalClasses(modalInsert);
  
  } else {
    previousPage();
    let previousModal = peopleGrid.lastElementChild;
    currentCardId = peopleGrid.lastElementChild.id;
    modalInsert.innerHTML = previousModal.outerHTML;
    changeModalClasses(modalInsert);

  }
}

// if available, create modal for next employee in list
nextModalBtn.addEventListener('click', () => {
  openNextModal();
});

function openNextModal() {
  let currentModal = document.getElementById(currentCardId);

  if (currentModal.nextElementSibling !== null) {
    let nextModal = currentModal.nextElementSibling;
    currentCardId = nextModal.id;
    modalInsert.innerHTML = nextModal.outerHTML;
    changeModalClasses(modalInsert);
  
  } else {
    nextPage();
    let nextModal = peopleGrid.firstElementChild;
    currentCardId = peopleGrid.firstElementChild.id;
    modalInsert.innerHTML = nextModal.outerHTML;
    changeModalClasses(modalInsert);
    
  }
}



