const axios  = require('axios');
const stripe = Stripe('pk_test_51Ij8OXSH1C37cGzWl4sThDGLUSkTp35GzORiGv2WIeJ6nXOARfpy8DkePzakttixwU7j0IaqVyTdM5h3XowWgAb200xXYtgWew');
export const checkout  = async tourid =>{
  
    //1 get checkout session from api

   try{
    const session = await axios(`http://localhost:4001/api/v1/bookings/checkout-session/${tourid}`);
    //console.log(session);
    await stripe.redirectToCheckout({
        sessionId:session.data.session.id
    });
   }catch(err){
       console.log(err);
       alert("payment Failed");
   }


}