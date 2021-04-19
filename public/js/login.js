const axios = require('axios');
export const login = async (email,password)=>{
    try{
      //  console.log(email,password);
        const res = await axios({
            method:'POST',
            url:'http://localhost:4001/api/v1/users/login',
            data:{
                email,
                password
            }
        });
     if(res.data.status==='success'){
         alert('Logged in successfully !!');
         window.setTimeout(()=>{
           location.assign('/');
         },1500)

     }
        
        console.log(res.data.status);
    }catch(err){
        alert(err.response.message);
    }
}



