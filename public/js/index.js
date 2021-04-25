import '@babel/polyfill';
const {login,logout,Signup} = require('./login');
const {displayMap}  = require('./mapbox');
const{updatedata} = require('./usersetting.js');
const {checkout} = require('./stripes');

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutbtn = document.querySelector('.nav__el--logout');
const submitdatabtn = document.querySelector('.form-user-data');
const updatepassword = document.querySelector('.form-user-settings');
const bookbtn = document.getElementById('tour-booked');
const signup = document.querySelector('.form--signup');
//console.log(logoutbtn);form-user-settings
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
if(logoutbtn){
   // console.log("clicked");
    logoutbtn.addEventListener('click',logout);
}
if(submitdatabtn){
submitdatabtn.addEventListener('submit',e=>{
    e.preventDefault();
   const form = new FormData();
   form.append('name',document.getElementById('name').value);
   form.append('email',document.getElementById('email').value);
   form.append('photo',document.getElementById('photo').files[0]);


    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;
    // //console.log(name,email);
    updatedata(form,'data');
});
}

if(updatepassword){
    updatepassword.addEventListener('submit',async e=>{
        e.preventDefault();
       
        document.querySelector('.btn--updating').textContent='Updating....';
        const password = document.getElementById('password-current').value;
        const newPassword = document.getElementById('password').value;
        const confirmpassword = document.getElementById('password-confirm').value;
        //console.log(name,email);
        await updatedata({password,newPassword,confirmpassword},'password');
        
        document.getElementById('password-current').value='';
       document.getElementById('password').value='';
         document.getElementById('password-confirm').value='';
         document.querySelector('.btn--updating').textContent='Save Password';
    });
    }

    if(bookbtn){
        bookbtn.addEventListener('click',e=>{
           document.getElementById('tour-booked').textContent = 'Prcocessing ......';
            const id = e.target.dataset.tourid;
          //  console.log(id);
            checkout(id);
            bookbtn.textContent = 'Book Tour Now';
        })
    }

    const alert1 = document.querySelector('body').dataset.alert;
    if(alert1){
        alert(alert1);
    }

    if(signup){
        
     signup.addEventListener('submit',e=>{
         e.preventDefault();

        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        const confirmpassword = document.getElementById('confirm-password').value;
        if(password !== confirmpassword){
            alert("Password and Confirm Password must Match !!");
        }
        document.getElementById('creating').textContent = 'Creating .....';
       Signup(name,email,password,confirmpassword);
       document.getElementById('creating').textContent = 'Create Account';
     })

    }