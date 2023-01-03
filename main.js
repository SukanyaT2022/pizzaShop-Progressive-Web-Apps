
var publicKey = 'BLcCyJlb-OJF3xA9_8_ksGhUxF_gt-4LJZGI-1g5N_H5PQUTryhalaohkIVlg8z4oCIcrejpvZlArjKLkWxLWjI';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4); const base64 = (base64String + padding)
  .replace(/-/g, '+')
  .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
  outputArray[i] = rawData.charCodeAt(i); }
  return outputArray; }
  



var pwaSupport = false;

function placeOrder() {
  var crust = document.getElementById('crust').value;
  var total = 0;
  if (crust == 'Thin crust') {
    total = 75;
  } else if (crust == 'Cheese crust') {
    total = 120;
  } else {
    total = 100;
  }
  //how many top customer choose
  var topping = document.getElementsByName('topping');
  var count = 0;
  for (var i = 0; i < topping.length; i++) {
    if (topping[i].checked == true) count = count + 1;
  }
  total += count * 5;
  var quantity = parseInt(document.getElementById('quantityBox').value);
  total = total * quantity;
  document.getElementById('Total').innerText = 'Final price is  ' + total;
}
//base on page 271
//Chrome 68+
var installEvt;
window.addEventListener('beforeinstallprompt', function (evt) {
  console.log('Before Install Prompt');
  //Store the event
  installEvt = evt;
  //Prevent chrome 67 or less from automatically showing prompt evt.preventDefault();
  //show the install ui
  document.getElementById('addToHomeScreen').style.display = 'block';
});

function hidePrompt() {
  document.getElementById('addToHomeScreen').style.display = 'none';
}
function installApp() {
  //hide the install ui
  hidePrompt();
  //show the install prompt installEvt.prompt();
  //wait on prompt Promise to resolve installEvt.userChoice.then(function(result){
  if (result.outcome === 'accepted') console.log('App Installed');
  else console.log('App Not Installed');
}
//clear the saved event - it can't be used again anyway installEvt = null;

window.addEventListener('appinstalled', function (evt) {
  //The user installed the app
  console.log('App Installed');
});

//programe chapter 10 page 303
if ('serviceWorker' in navigator) {
  pwaSupport = true;
  //register service worker
  navigator.serviceWorker.register('sw.js').then(
    function (result) {
      console.log('Service Worker Registered');
      console.log('Scope: ' + result.scope);
      subscribeToPush();



      //page303
/*
      if ('Notification' in window) {
        //Write a message to the console
        console.log('Notications Supported');
        //Request permission from the user on the Notification object
        Notification.requestPermission(function (status) {
          //A status value is passed to the handler, show in console //Possible values: granted, default, denied
          console.log('Notification Permission: ', status);
        });
        //page 308
        var options = {
          body: "See What's New!",
          icon: './android-chrome-96x96.png',
          data: {
            timestamp: Date.now(),
            loc: 'index.html#info',
          },
          actions: [{ action: 'go', title: 'Go Now' }],
        };

        console.log('notify');
        notify('NCC Computer Science', options);
      }
      */
    },
    function (error) {
      console.log('Service Worker Registration Failed');
      console.log(error.toString());
    }
  );
} else {
  console.log('Service Worker Not Supported');
}

window.onload = function () {
  if (pwaSupport) {
    //PWAs supported
    //Get the platform
    var p = navigator.platform;
    if (p === 'iPhone' || p === 'iPad' || p === 'iPod') {
      //if we are on iOS if(!navigator.standalone){
      //if we haven't already launched from Home Screen
      var lastShown = parseInt(localStorage.getItem('lastShown'));
      var now = new Date().getTime();
      if (isNaN(lastShown) || lastShown + 1000 * 60 * 60 * 24 * 7 <= now) {
        //It's either the first visit or it's been a week. Show the instructions.
        document.getElementById('instructions').style.display = 'block'; //We showed the instructions, store the date. localStorage.setItem('lastShown',now);
      }
    }
  }
};

function hideInstructions() {
  document.getElementById('instructions').style.display = 'none';
}
//page 307
function notify(title, options) {
  //Make sure notification permission is granted
  console.log(Notification.permission);
  if (Notification.permission === 'granted') {
    console.log('if block');
    //Service worker registration object has a ready property that a promise and passes the registration to the handler
    //Then chain a then call to actually show the notification //Pass in the title to display to showNotification
    navigator.serviceWorker.ready.then(function (reg) {
      reg.showNotification(title, options);
    });
  }
}

//page 310
function closeNotification(msg, evt) {
  console.log(msg, evt.notification.data);
  evt.notification.close();
}

self.addEventListener('notificationclose', function (evt) {
  closeNotification('Notification Closed', evt);
});

//page 311
self.addEventListener('notificationclick', function (evt) {
  if (evt.action !== 'close') {
    //get all of the clients associated with the service worker
    evt.waitUntil(
      self.clients
        .matchAll({ type: 'window', includeUncontrolled: true })
        .then(function (allClients) {
          //Pass all matching clients along. See what they look like.
          console.log(allClients);
          //Loop through clients to see if any are visible
          for (var i = 0; i < allClients.length; i++) {
            //If the app is visible, navigate to loc
            if (allClients[i].visibilityState === 'visible') {
              //found a visible client
              console.log('Navigating');
              allClients[i].navigate(evt.notification.data.loc); //No need to continue
              break;
            }
          }
        })
    );
  }
  closeNotification('Notification Clicked', evt);
});


/*function subscribeToPush(){ navigator.serviceWorker.ready.then(function(reg){
  reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub){ console.log(JSON.stringify(sub));
  console.log("Endpoint:", sub.endpoint);
  console.log("User Subscribed");
}); });
}
*/



 function subscribeToPush(){
navigator.serviceWorker.ready.then(function(reg){
//convert the publicKey to Uint8Array
var convertedPublicKey = urlBase64ToUint8Array(publicKey); //Tell the pushManager to subscribe
//userVisible property means no background, invisible messages
reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: convertedPublicKey}).then(function(sub){
//Write the subscription and endpoint to the console
 console.log(JSON.stringify(sub));
console.log("Endpoint:", sub.endpoint);
console.log("User Subscribed");
}); });
}


