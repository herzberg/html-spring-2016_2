function $_GET(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace( 
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;    
    }
    return vars;
}

var domainName = 'http://herzberg.github.io/html-spring-2016_2/final/mediaStreams/?p='
function setPeerLink(peerId){
    console.log("setPeerLink",myPeerId,peerId)
    if(myPeerId == null && peerId != null){
        myPeerId = peerId
        console.log("have a peerId...",peerId)
        myDataRef.push({peerId: peerId});
        myUsersDataRef.push({peerId: peerId,random:myRandom});      
        link = domainName + peerId
        jQuery("#peerlink").html("<a href='" + link + "'>" + link + "</a>");
    }else{
        console.log("not setting peer link",myPeerId,peerId)
    }
}

var ranMain  = false;


var $_num2 = function (selector, el) {
    if (!el) el = document;
    return el.querySelector(selector);
}

var trace = function (what, obj) {
    var pre = document.createElement("pre");
    pre.textContent = JSON.stringify(what) + " - " + JSON.stringify(obj || "");
    $_num2("#immediate").appendChild(pre);
};

var myUsersDataRef = new Firebase('https://dafrol1users.firebaseio.com/')
var myDataRef = new Firebase('https://dafrol1.firebaseio.com/')

myUsersDataRef.on('child_added', function(snapshot) {
    return//this doesn't workm
    var message = snapshot.val();
    console.log("new user? :", message)
    if(message.random == myRandom)
        return;
    peerId = message.peerId
    console.log("new person joined :", peerId)
    if(peerId != null && peerId == myPeerId){
        console.log("A person has joined reloading page...")
        alert("A person has joined reloading page...")
        location.reload()
    }
});

var myPeerId = null
var myRandom = Math.random();
setPeerLink($_GET('p'))

console.log(myDataRef)
myDataRef.on("value", function(snapshot) {
    console.log("value",snapshot.val());  // Alerts "San 
    values = snapshot.val()
    if(window.location.search.length <1){
        for (var key in values) {
            console.log("item",values[key])
            
                currLocation = location.protocol+'//'+location.host+location.pathname
                console.log("going to another place" + values[key]['peerId'])
                window.location.href =  currLocation + "?p=" + values[key]['peerId']
                return;
            }

    }
    // if it didn't find anything 
    console.log("calling main")
    if(!ranMain){
        main()
        ranMain = true;
    }
});


var main = (function () {
    var broker;
    var rtc;
    trace("Ready");
    trace("Try connect the connectionBroker");
    var ws = new XSockets.WebSocket("wss://rtcplaygrouund.azurewebsites.net:443", ["connectionbroker"], {
        ctx: '23fbc61c-541a-4c0d-b46e-1a1f6473720a'
    });

    var onError = function (err) {
        trace("error", arguments);
    };

    var recordMediaStream = function (stream) {
        if ("MediaRecorder" in window === false) {
            trace("Recorder not started MediaRecorder not available in this browser. ");
            return;

        }
        var recorder = new XSockets.MediaRecorder(stream);
        recorder.start();
        trace("Recorder started.. ");
        recorder.oncompleted = function (blob, blobUrl) {
            trace("Recorder completed.. ");
            var li = document.createElement("li");
            var download = document.createElement("a");
            download.textContent = new Date();
            download.setAttribute("download", XSockets.Utils.randomString(8) + ".webm");
            download.setAttribute("href", blobUrl);
            li.appendChild(download);
            $_num2("ul").appendChild(li);

        };
    };

    var addRemoteVideo = function (peerId, mediaStream) {
        var remoteVideo = document.createElement("video");
        remoteVideo.setAttribute("autoplay", "autoplay");
        remoteVideo.setAttribute("rel", peerId);
        attachMediaStream(remoteVideo, mediaStream);
        $_num2(".remotevideos").appendChild(remoteVideo);
    };
    var onConnectionLost = function (remotePeer) {
        trace("onconnectionlost", arguments);
        var peerId = remotePeer.PeerId;
        var videoToRemove = $_num2("video[rel='" + peerId + "']");
        $_num2(".remotevideos").removeChild(videoToRemove);
    };
    var onConnectionCreated = function () {
        console.log(arguments, rtc);
        trace("oncconnectioncreated", arguments);

    };
    var onGetUerMedia = function (stream) {
        trace("Successfully got some userMedia , hopefully a goat will appear..");
        rtc.connectToContext(); // connect to the current context?
    };

    var onRemoteStream = function (remotePeer) {

        addRemoteVideo(remotePeer.PeerId, remotePeer.stream);
        trace("Opps, we got a remote stream. lets see if its a goat..");
    };
    var onLocalStream = function (mediaStream) {
        trace("Got a localStream", mediaStream.id);
        attachMediaStream($_num2(".localvideo video "), mediaStream);
        // if user click, video , call the recorder
        
        $(".localvideo video ").addEventListener("click", function () {
            //recordMediaStream(rtc.getLocalStreams()[0]);
            rtc.muteAudio(true)
        });
          
    };
    var onContextCreated = function (ctx) {
        trace("RTC object created, and a context is created - ", ctx);
        peerId = ctx['PeerId']             
        setPeerLink(peerId)
        rtc.getUserMedia(rtc.userMediaConstraints.hd(true), onGetUerMedia, onError); //true is using audio
    };
    var onOpen = function () {
        trace("Connected to the brokerController - 'connectionBroker'");
        rtc = new XSockets.WebRTC(this);

        rtc.onlocalstream = onLocalStream;
        rtc.oncontextcreated = onContextCreated;
        rtc.onconnectioncreated = onConnectionCreated;
        rtc.onconnectionlost = onConnectionLost;
        rtc.onremotestream = onRemoteStream;


        rtc.onanswer = function (event) {
            trace("on answer")

        };

        rtc.onoffer = function (event) {
            trace("on offer")
        };

    };



    var onConnected = function () {
        trace("connection to the 'broker' server is established");
        trace("Try get the broker controller form server..");
        broker = ws.controller("connectionbroker");
        broker.onopen = onOpen;
    };
    ws.onconnected = onConnected;

    /*
    jQuery("#mute").on("click", function(){
        console.log("The paragraph was clicked.");
        rtc.muteAudio(true)                
    });
    */
});
//document.addEventListener("DOMContentLoaded", main);