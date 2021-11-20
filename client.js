const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("todo.proto", {}); 
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo("localhost:4000", grpc.credentials.createInsecure());

client.createTodo({
    "id" : -1, 
    "text" : "New Text"
}, (error, response) => {
    console.log("Error: ", JSON.stringify(error));
    console.log("CTD Response: ", JSON.stringify(response));
})

client.readTodos(null, (err, response) => {
    console.log("read the todos from server " + JSON.stringify(response))
    if (!response.items)
        response.items.forEach(a=>console.log(a.text));
})

const call = client.readTodosStream();
call.on("data", item => { // here data is an event defined by user
    console.log("received item from server " + JSON.stringify(item)); // getting stream data one by one
})

call.on("end", e => console.log("server done!")); // end is gRPC defined event