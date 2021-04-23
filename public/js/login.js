const axios = require('axios');
export const login = async (email,password)=>{
    try{
      //  console.log(email,password);
        const res = await axios({
            method:'POST',
            url:'/api/v1/users/login',
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
        
        //console.log(res.data.status);
    }catch(err){
       // console.log(err.response.data.message);
        alert(err.response.data.message);
    }
}

export const logout = async ()=>{
    try{
      
        const res = await axios({
            method:'GET',
            url:'/api/v1/users/logout'
        });
      //  console.log("akaka");

        if(res.data.status==='success'){
        location.reload(true); //reload from server side not from browser side
        }

    }catch(err){
        alert(err.response.data.message);
    }
}



