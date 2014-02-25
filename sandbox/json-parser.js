// Get the element by id. I don't use jQuery here to satisfy
// the js purists in our group
var data_id = document.getElementById("data");
var json_data = data_id.innerHTML
var json_object = JSON.parse(json_data);
