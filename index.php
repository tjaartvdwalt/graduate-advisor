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
    <link href="css/bootstrap-select.min.css" rel="stylesheet">
    <link href="css/introjs.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    
    <script>
      var MAX_SEMESTERS = 10;
      var MAX_PER_SEM = 4;
    </script>
    <!-- importing everything here is not great. We should think about using include.js -->
    <!-- import frameworks -->
    <script src="js/lib/jquery.min.js"></script>
    <script src="js/lib/bootstrap.min.js"></script>
    <script src="js/lib/bootstrap-select.min.js"></script>
    <script src="js/lib/intro.min.js"></script>
    <script src="js/lib/jquery.bootstrap.wizard.min.js"></script>
    
    <!-- import our code -->
    <script src="js/control/CoursesController.js"></script>
    <script src="js/model/Courses.js"></script>
    <script src="js/model/JSONParser.js"></script>
    <!-- <script src="js/model/Rotation.js"></script> -->
    <script src="js/model/Rules.js"></script>
    <script src="js/model/UserCourses.js"></script>
    <script src="js/view/ConfigureRenderer.js"></script>
    <script src="js/view/ScheduleRenderer.js"></script>
    <script src="js/view/SelectedRenderer.js"></script>
    <script src="js/view/TakenRenderer.js"></script>
    <script src="js/view/WaivedRenderer.js"></script>
    <script src="js/Scheduler.js"></script>
    <script src="js/CourseParser.js"></script>
    <script src="js/Validate_Course_List.js"></script>
    <script src="js/wizard.js"></script>
  </head>
  <body>
    <div id="rootwizard">
      <div class="navbar">
        <div class="navbar-inner">
          <div class="container">
            <ul>
              <li><a href="#configure" data-toggle="tab">Configure</a></li>
              <li><a href="#waived" data-toggle="tab">Waived</a></li>
              <li><a href="#taken" data-toggle="tab">Completed</a></li>
              <li><a href="#selected" data-toggle="tab">Selected</a></li>
              <li><a href="#schedules" data-toggle="tab">Schedule</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane" id="configure">
          <div class="container-fluid ">
            <div class="row">
              <div class="col-xs-2">
                Number of semesters
              </div>
              <div id="nr-of-semesters" class="col-md-offset-1 col-xs-1">
              </div>
            </div>
            <div class="row">
              <div class="col-xs-2">
                Export current selection
              </div>
              <div id="export" class="col-md-offset-1 col-xs-1"></div>
            </div>
            <div class="row">
              <div class="col-xs-2">
                Import a JSON file
              </div>
              <div id="import" class="col-md-offset-1 col-xs-1"></div>
            </div>
          </div>
        </div>
        <div class="tab-pane" id="waived">
          <div class="container-fluid">
            <div class="row-fluid">
              <div id="waived-available" class="col-xs-1">
                <b>Not Waived</b>
              </div>
              <div class="col-xs-1 right-border"></div>
              <div class="col-xs-1"></div>
              <div id="waived-waived" class="col-xs-1">
                <b>Waived</b>
              </div>
              <!-- <div class="col-xs-1 bucket selected 5000"></div> -->
              <!-- <div class="col-md-offset-1 col-xs-1 bucket selected 5000"></div> -->
            </div>
          </div>
        </div>
        
        <div class="tab-pane" id="taken">
          <div class="container-fluid ">
            <div class="row">
              <div class="col-xs-1">
                <b>Available</b>
              </div>
              <!-- <div class="col-md-offset-1 col-xs-1"> -->
              <!--   <b>Core</b> -->
              <!-- </div> -->
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
            <div class="row-fluid">
              <div id="taken-available" class="col-xs-1">
                <div class="row-fluid"></div>
              </div>
              <div class="clearfix visible-xs"></div>
              <!-- <div class="col-md-offset-1 col-xs-1 bucket selected core"></div> -->
              <div class="col-xs-1 bucket taken 6000"></div>
              <div class="col-md-offset-1 col-xs-1 bucket taken 5000"></div>
              <div class="col-md-offset-1 col-xs-1 bucket taken 4000"></div>
            </div>
            <div class="row">
              <div id ="description" class="col-md-offset-2 col-xs-7"></div>
            </div>
          </div>
        </div>
        
        <div class="tab-pane" id="selected">
          <div class="container-fluid ">
            <div class="row">
              <div class="col-xs-1">
                <b>Available</b>
              </div>
              <!-- <div class="col-md-offset-1 col-xs-1"> -->
              <!--   <b>Core</b> -->
              <!-- </div> -->
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
            <div class="row-fluid">
              <div id="selected-available" class="col-xs-2">
                <div class="row-fluid"></div>
              </div>
              <div class="clearfix visible-xs"></div>
              <!-- <div class="col-md-offset-1 col-xs-1 bucket selected core"></div> -->
              <div class="col-xs-1 bucket selected 6000"></div>
              <div class="col-md-offset-1 col-xs-1 bucket selected 5000"></div>
              <div class="col-md-offset-1 col-xs-1 bucket selected 4000"></div>
            </div>
            <div class="row">
              <div id ="description" class="col-md-offset-2 col-xs-7"></div>
            </div>
          </div>
        </div>
        
        <div class="tab-pane" id="schedules">
          <div class="container-fluid ">
          </div>
        </div>
        <ul class="pager wizard">
          <li class="previous first" style="display:none;"><a href="#">First</a></li>
          <li class="previous"><a href="#">Previous</a></li>
          <li class="next last" style="display:none;"><a href="#">Last</a></li>
          <li class="next"><a href="#">Next</a></li>
        </ul>
      </div>
    </div>
  </body>
</html>
