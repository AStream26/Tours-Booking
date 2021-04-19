import '@babel/polyfill';
const {login} = require('./login');
const {displayMap}  = require('./mapbox');

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');

if(mapBox){
    const locations = JSON.parse(mapBox.dataset.location);
    displayMap(locations);
}



if(loginForm){
    loginForm.addEventListener('submit',e=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
        login(email,password);
    })
}