 var FCM = require("fcm-node");
 var autotokenserver = process.env.NOTIFICATION_GOOGLE_SERVER_KEY;
    
 var serverKey = autotokenserver;
 var fcm = new FCM(serverKey);


const SendNotification = (devicetoken, title,description) => {
 
    var message = {
    to: devicetoken,
    notification: {
      title: title,
      body:description,
      sound: "ping.aiff",
    },

  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!" + err);
      console.log("Respponse:! " + response);
    } else {
      console.log("Successfully sent with response: ", response);
    }
  });
};
module.exports = SendNotification;

