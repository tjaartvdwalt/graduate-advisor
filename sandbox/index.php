<html>
  <head>
    <?php
      // parses the xml file and embeds the results as json in the html
      include 'xml-parser.php';
    ?>
    <!-- I tried to steer clear of jquery, but there is one case I could not get away from it.
         That is to check if an object is the empty object.         -->
    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>
    <!-- Parse the json data into javascript objects. Returns object called json_object -->
    <script src="json-parser.js"></script>
  </head>
  <body>
    <!-- Print the properties of the javascript objects to show that its working -->
    <script>
      // variable to add indenting to pretty print
      var nbsp = "&nbsp;&nbsp;&nbsp;&nbsp;"
      document.write("<b>Year:</b><br>");
      document.write(json_object.rotation_year.year + "<br>");
      document.write("<br>")
      document.write("<b>Courses:</b> <br>");

      // Iterate over all the courses for this year
      var courses = json_object.rotation_year.course;
      for (var i in courses){
          document.write(courses[i].subject + "<br>");
          document.write(courses[i].course_number + "<br>");
          document.write(courses[i].course_name + "<br>");
          document.write("<br>")
          document.write(nbsp + "<b>Rotation Term:</b> <br>");
      
          // Iterate over the rotations 
          var rotation_term = courses[i].rotation_term;
          for (var j in rotation_term){
              // Here we have a bit of a data issue. The json returns an
              // empty time code object if the course does not get offered that term.
              if(!jQuery.isEmptyObject(rotation_term[j].time_code)){
                  document.write(nbsp + rotation_term[j].term + "<br>");
                  document.write(nbsp + rotation_term[j].time_code + "<br>");
              }              
          }
          document.write("<br>");
      }
    </script>
    
  </body>
</html>
