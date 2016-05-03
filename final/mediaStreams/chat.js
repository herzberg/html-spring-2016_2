var myMessagesRef = new Firebase('https://dafrol1chat.firebaseio.com/')
  console.log(myMessagesRef)
  
  /*myMessagesRef.on("value", function(snapshot) {
	values = snapshot.val()
	for (var key in values) {
		console.log("item",values[key])
	}
  });
	*/
  $('#messageInput').keypress(function (e) {
	if (e.keyCode == 13) {
	  var name = $('#nameInput').val();
	  var text = $('#messageInput').val();
	  myMessagesRef.push({name: name, text: text});
	  $('#messageInput').val('');
	}
  });
  myMessagesRef.on('child_added', function(snapshot) {
	var message = snapshot.val();
	displayChatMessage(message.name, message.text);
  });
  function displayChatMessage(name, text) {
	$('<div/>').text(text).prepend($('<em/>').text(name+': ')).appendTo($('#messagesDiv'));
	$('#messagesDiv')[0].scrollTop = $('#messagesDiv')[0].scrollHeight;
  };