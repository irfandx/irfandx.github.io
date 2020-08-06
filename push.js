var webPush = require('web-push');

const vapidKeys = {
   "publicKey": "BFYUoSdhEbgKccDTsZ2715mkpsKPG9w7ktexyVzdqSRm-JN9fT3az_tngOigpSqtYSjUWYQvehWpkvXVTSz13TM",
   "privateKey": "PK0fyWrXb2fOpk5q1ZKXIEtkz-B5s9bDCSMVSUMwCTo"
};


webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/dJk6xGEq2nY:APA91bG7KcjjnhXe_etPG7NAVAD4sbVH9zz3WPIPgseBepBb6Tc55NTmReGsVsP3lEXy_mVjBSs0PV68NU2asOIf5ZKW53hGaUOBhnFm9KTUATD7LOXs_VX8ior0WnmGESUNhOFOWlfJ",
   "keys": {
       "p256dh": "BHvT9cx6xtp4h+/aZCGQU7Cc0Dzhr9d9VO1NbxYvwONYW1RuRT74AGC1hNJFDaIiYmBPbCEq85B+EpPzzF85nH8=",
       "auth": "ZidgLl5KceMv+wbeZrg4nA=="
   }
};
var payload = 'Test Push notification from GCM/FCM ';

var options = {
   gcmAPIKey: '217783669573',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
