<!doctype html>
<html>
  <head>
    <?php
      // parses the xml file and embeds the results as json in the html
      include 'php/xml-parser.php';
      // The rules are not xml but in a json... we don't have to parse it just include it here.
      echo "<script id=\"rules\" type=\"application/json\">";
      $file_content = file_get_contents ("json/rules.json");
      echo "$file_content";
      echo "</script>\n";
    ?>
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="assets/icons/favicon.ico">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    
    <!-- importing everything here is not great. We should think about using include.js -->
    <script src="js/lib/jquery.min.js"></script>
    <script src="js/lib/bootstrap.min.js"></script>
    <script src="js/control/CoursesController.js"></script>
    <script src="js/model/Courses.js"></script>
    <script src="js/model/JSONParser.js"></script>
    <script src="js/model/Rules.js"></script>
    <script src="js/model/UserCourses.js"></script>
    <script src="js/view/CourseRenderer.js"></script>
  </head>
  <body>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Advisor</a>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Configure</a></li>
            <li><a href="#">Taken</a></li>
            <li><a href="#">Waived</a></li>
            <li><a href="#">Select</a></li>
            <li><a href="#contact">Schedule</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>
    
    <div class="container-fluid ">
      <div class="row">
        <button id="available-6000">6000</button>
        <button id="available-5000">5000</button>
        <button id="available-4000">4000</button>
      </div>
      <div class="row">
        <div class="col-xs-1">
          <b>Available</b>
        </div>
        <div class="col-md-offset-1 col-xs-1">
          <b>Core</b>
        </div>
        <div class="col-md-offset-1 col-xs-1">
          <b>6000</b>
        </div>
        <div class="col-md-offset-1 col-xs-1">
          <b>5000</b>
        </div>
        <div class="col-md-offset-1 col-xs-1">
          <b>4000</b>
        </div>
      </div>
      <div class="row">
        <div id="available" class="col-xs-1"></div>
        <div class="col-md-offset-1 col-xs-1 bucket selected core"></div>
        <div class="col-md-offset-1 col-xs-1 bucket selected 6000"></div>
        <div class="col-md-offset-1 col-xs-1 bucket selected 5000"></div>
        <div class="col-md-offset-1 col-xs-1 bucket selected 4000"></div>
      </div>
      <div class="row">
        <div id ="description" class="col-md-offset-2 col-xs-7"></div>
      </div>
    </div>
    <!-- We really need to make the import of the controller unobtrusive -->
    <!-- as everything else in the gui use unobtrusive js -->
    <script language="javascript">
      controller = new CoursesController();
    </script>
    
  </body>
</html>
