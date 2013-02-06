
$(document).ready(function() {
  clearTA();
  initSSE();
});

var clear

_CLIENT_ID = undefined;
_SSE = undefined;

var initSSE = function() {
  var initSSE = function() {
    var source = new EventSource("/data-stream");
    source.onmessage = function (event) {
      console.log(event.data);
    };

    source.addEventListener('message', function(event) {
      var data = JSON.parse(event.data);
      console.log(data);
    }, false);

    source.addEventListener('sid', function(event) {
      console.log('SSE event: sid');
      _CLIENT_ID = event.data;
      console.log(event.data);
    }, false);
    
    source.addEventListener('update1', function(event) {
      console.log('SSE event: update1');
      console.log(event.data);
      $('#ta1').val($('#ta1').val() + event.data);
    }, false);

    source.addEventListener('update2', function(event) {
      console.log('SSE event: update2');
      console.log(event.data);
      $('#ta2').val($('#ta2').val() + event.data);
    }, false);

    source.addEventListener('update3', function(event) {
      console.log('SSE event: update3');
      console.log(event.data);
      $('#ta3').val($('#ta3').val() + event.data);
    }, false);

    source.addEventListener('update4', function(event) {
      console.log('SSE event: update4');
      console.log(event.data);
      $('#ta4').val($('#ta4').val() + event.data);
    }, false);

    source.addEventListener('open', function(event) {
      console.log('SSE connected..');
    }, false);
    
    source.addEventListener('error', function(event) {
      if (event.eventPhase == 2) {
        console.log('SSE connection has interrupted..');
        source.close();
        _CLIENT_ID = undefined;
        _SSE = initSSE();
      }
    }, false);
    return source;
  }
  _SSE = initSSE();
};

$("#test_it").click(function(e) {
  e.preventDefault();
  console.log(_CLIENT_ID);
  $.get('/sse/ac/' + _CLIENT_ID + '/potter', function(res) {
    console.log(res);
  }, 'json');
});

$("#clear_it").click(function(e) {
  e.preventDefault();
  clearTA();
});

var clearTA = function() {
  $('#ta1').val('');
  $('#ta2').val('');
  $('#ta3').val('');
  $('#ta4').val('');
};
