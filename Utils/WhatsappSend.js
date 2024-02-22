// todo 31/05/2023
const axios =require('axios');
const WhatsappSend = (number,message) => {
 
 
  const token=process.env.WHATSAPPTOKEN;
 
    const numbers=`91${number}`;
     const config = {
       headers: {'Content-Type': 'application/json'}
   }
     let payload =JSON.stringify( {
       "token": token,
       data: [  {
         "number": numbers,
         "message": ` ${message}`
     }]
     });
     
     axios({
        url: 'http://www.wpadmin.star52app.com/api-panel/api/personalise_message.php',
       method: 'post',
       data: payload,
       config,
     })
    //  .then(function (response) {
        
    //      console.log(response);
    //  })
    //  .catch(function (error) {
        
    //      console.log(error);
    //  });
   
  };
  
  module.exports =  WhatsappSend;
  