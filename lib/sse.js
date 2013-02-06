

var sse = module.exports = function(){};
sse.RETRY = 'retry';
sse.EVENT = 'event';
sse.DATA = 'data';
sse.ID = 'id';


sse.compose = function(type, data) {
  data = type + ':' + data + '\n';
  return data;
}

sse.send = function(res, data) {
  res.write(data + '\n');
}

sse.sendRetry = function(res, id, ms) {
  var data = sse.compose(sse.RETRY, ms);
  data += sse.compose(sse.DATA, '{"msg": "Hello"}');
  data += sse.compose(sse.ID, id);
  console.log(data);
  sse.send(res, data);
}

sse.sendEvent = function(res, id, event, msg) {
  var data = sse.compose(sse.EVENT, event);
  data += sse.compose(sse.DATA,  msg);
  data += sse.compose(sse.ID, id);
  console.log(data);
  sse.send(res, data);
}
