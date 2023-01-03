var webPush = require('web-push');

var pushSub = {
  endpoint:
    'https://fcm.googleapis.com/fcm/send/ec0f2pBc0g0:APA91bFeJ0bd2-ULf0fMKWdVcRZ-FcYHVqpmkxAiioYGoWw1eVUnTW7O6yqlvQMYrdw5d3oQhowRDBpzwYAWRwshJyqvnviSgT9eMFNStpRWXa8_ppDLII99sTO6Rsvr9M-P7uaGVzJQ',
  expirationTime: null,
  keys: {
    p256dh:
      'BHLhPmhvrkbCQGA4iWk5k8AynwoEeFCx1LWQ0ka4AI3rSNIwCikjZegCVAqRKoedXbh-Xh6S_7qVwT7riGYVZmo',
    auth: 'DOaJyy_BMTi5G-oKUAN5QA',
  },
};

var options = {
  vapidDetails: {
    subject: 'mailto: http://127.0.0.1:5500',

    publicKey:
      'BLcCyJlb-OJF3xA9_8_ksGhUxF_gt-4LJZGI-1g5N_H5PQUTryhalaohkIVlg8z4oCIcrejpvZlArjKLkWxLWjI',
    privateKey: 'NmqjKzs44OmEIFItR3CZH-MjShYooKj1mebo4FSn4_U',
  },
  TTL: 60,
};

var payload = '#programs';
webPush.sendNotification(pushSub, payload, options);
