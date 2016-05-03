var myMessagesRef = new Firebase('https://dafrol1chat.firebaseio.com/')
console.log("myMessagesRef",myMessagesRef)

/*myMessagesRef.on("value", function(snapshot) {
values = snapshot.val()
for (var key in values) {
	console.log("item",values[key])
}
});
*/

function sendChatMessage(){
	var name = $('#nameInput').val();
	var text = $('#messageInput').val();
	myMessagesRef.push({name: name, text: text});
	$('#messageInput').val('');
}

$('#messageInput').keypress(function (e) {
	console.log("messageKey Press", e.keyCode)
	if (e.keyCode == 13) {
		sendChatMessage()
	}
});
console.log("made keypress fun")

console.log("made onMyMess.on func")
function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
};

myMessagesRef.on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayChatMessage(message.name, message.text);
});