// Anonymous function gets executed on page load
// $(function() {
//     var courses = getGraduateCourses(getCMPCourses(getCourses()));
//     console.log(courses);
// });

function JSONParser() {

    this.getJSON = getJSON;
    function getJSON(type) {
        // Get the element by id. I don't use jQuery here to satisfy the js purists in our group
        var data_id = document.getElementById(type);
        var json_data = data_id.innerHTML
        return JSON.parse(json_data);
    }
}
