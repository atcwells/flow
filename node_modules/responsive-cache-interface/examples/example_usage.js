var RCI = require('../responsive-cache-interface.js')();

RCI.set({
	foo: 'bar'
});

console.log(RCI.getAll());
console.log(RCI.get('foo'));

RCI.flush();
