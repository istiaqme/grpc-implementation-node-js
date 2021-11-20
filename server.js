const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("todo.proto", {}); 
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bind("localhost:4000", grpc.ServerCredentials.createInsecure());
// add a service
server.addService(todoPackage.Todo.service, {
    "createTodo" : createTodo, 
    "readTodos" : readTodos,
    "readTodosStream" : readTodosStream
});

server.start();
// gRPC methods always take two params
// call = request, callback = response
let todos = [];
function createTodo(call, callback){
    console.log(call)
    let newItem = {
        "id" : todos.length + 1,
        "text" : call.request.text
    }
    todos.push(newItem);
    callback(null, newItem);

}
function readTodos(call, callback) {
    callback(null, {"items": todos})   
}
function readTodosStream(call, callback) {
    todos.forEach(t => call.write(t));
    call.end();
}