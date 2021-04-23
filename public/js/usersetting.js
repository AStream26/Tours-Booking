const axios = require('axios');

export const updatedata = async (data,type)=>{
    try{
       const url = type==='data'?'/api/v1/users/updateuser':'/api/v1/users/updatepassword';
       //console.log(data);
        const res = await axios({
            method:'PATCH',
            url,
            data
        });
        if(res.data.status==='success'){
            alert(`${type==='data'?"data":"password"} updated successfully`);
            location.reload(true); //reload from server side not from browser side
            }
    }catch(err){
        alert(err.response.data.message);
    }
}