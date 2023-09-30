const API = 'https://pokeapi.co/api/v2/pokemon';
let users = [];
let filteredUsers = [];

const $listContainer = document.querySelector('.users-table')
const $searchBar = document.querySelector('.search-bar')
const $field = document.querySelector('.field')
const $cross = document.querySelector('.clear-search-bar')

function setLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function getLS(key) {
    return JSON.parse(localStorage.getItem(key));
}

if(!!getLS('data')) {
    users = getLS('data');
    templateBuilder(users);
}
else{
    fetch(API)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        users = data.results;
        setLS('data', users)
        templateBuilder(users);
    });
}

function filterController(query) {
    filteredUsers = users.filter((el) => {
        return ~el.name.toLowerCase().indexOf(query.toLowerCase());
    });
    templateBuilder(filteredUsers);
}

function templateBuilder(list) {
    let template = '';
    if (!list.length) {
        template = '<tr><td><span>Not found</span></td></tr>'
    }
    else {
        list.forEach((element, i) => {
            template += '<tr><td><a class="name">' + element.name + '</a></td>' + '<td><a class="url">' + element.url + '</a></td>' + '<td><button class="delete-element" element-index="' + i + '">Delete</button></td></tr>';
        });
    }
    $listContainer.innerHTML = template;
}

$field.addEventListener('input', (e) => {
    let query = e.target.value;
    filterController(query);
});

window.addEventListener('click', (e) =>{
    if (e.target.classList.contains('name')) {
        let target = e.target.innerText
        $field.value = target;
        filterController(target)
    }
    if (e.target.classList.contains('delete-element')) {
        let index = e.target.getAttribute('element-index')
        users.splice(index, 1);
        setLS('data', users);
        templateBuilder(users);
    }
});

$field.addEventListener('focus', () => {
    $searchBar.classList.add('active');
});

$field.addEventListener('blur', () => {
    $searchBar.classList.remove('active');
});

$cross.addEventListener('click', () => {
    $field.value = "";
    filterController("");
});


