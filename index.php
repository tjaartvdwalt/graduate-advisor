<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    
    <?php
      // parses the xml file and embeds the results as json in the html
      include 'php/xml-parser.php';
      // The rules are not xml but in a json... we don't have to parse it just include it here.
      echo "<script id=\"rules\" type=\"application/json\">";
      $file_content = file_get_contents ("json/rules.json");
      echo "$file_content";
      echo "</script>\n";
    ?>
    
    <link rel="shortcut icon" href="assets/icons/favicon.ico">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-select.min.css" rel="stylesheet">
    <link href="css/trip.min.css" rel="stylesheet">
    
    <!-- <link href="css/jquery-ui.custom.min.css" rel="stylesheet"> -->
    <!-- <link href="css/jasny-bootstrap.min.css" rel="stylesheet"> -->
    <link href="css/style.css" rel="stylesheet">
    
    <!-- <script> -->
    <!--   var MAX_SEMESTERS = 10; -->
    <!--   var MAX_PER_SEM = 4; -->
    <!-- </script> -->
    <!-- importing everything here is not great. We should think about using include.js -->
    <!-- import frameworks -->
    <script src="js/lib/jquery.js"></script>
    
    <!-- <script src="js/lib/jquery-ui.custom.min.js"></script> -->
    <script src="js/lib/bootstrap.js"></script>
    <script src="js/lib/bootstrap-select.js"></script>
    <script src="js/lib/dojo.js"></script>
    <script src="js/lib/jquery-bootstrap-wizard.js"></script>
    <script src="js/lib/require.js"></script>
    <script src="js/lib/trip.js"></script>
    
    <!-- import our code -->
    <script src="js/control/ClickController.js"></script>
    <script src="js/control/RootController.js"></script>
    <script src="js/control/RenderController.js"></script>
    <script src="js/model/LoadAndSave.js"></script>
    <script src="js/model/Courses.js"></script>
    <script src="js/model/JSONParser.js"></script>
    <script src="js/model/Rotation.js"></script>
    <script src="js/model/RotationTranslator.js"></script>
    <script src="js/model/Schedule.js"></script>
    <script src="js/model/ScheduleTranslator.js"></script>
    <script src="js/model/Rules.js"></script>
    <script src="js/model/UserCourses.js"></script>
    <script src="js/view/ConfigureRenderer.js"></script>
    <script src="js/view/ErrorRenderer.js"></script>
    <script src="js/view/IntroRenderer.js"></script>
    <script src="js/view/LoadSaveRenderer.js"></script>
    <script src="js/view/PopoverRenderer.js"></script>
    <script src="js/view/ScheduleRenderer.js"></script>
    <script src="js/view/ScoreboardRenderer.js"></script>
    <script src="js/view/SelectedRenderer.js"></script>
    <script src="js/view/WaivedRenderer.js"></script>
    <script src="js/scheduler0/Scheduler.js"></script>
    <script src="js/scheduler0/CourseParser.js"></script>
    <script src="js/wizard.js"></script>
    
  </head>
  <body>
    <div id="rootwizard">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">UMSL CS Graduate Advisor</a>
        <div id="searchbar" class="navbar-collapse navbar-right"></div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="#configure" data-toggle="tab">Configure</a></li>
            <li><a href="#waived" data-toggle="tab">Waived<span id="waived-badge" class="badge"></span></a></li>
            <li><a href="#taken" data-toggle="tab">Completed<span id="completed-badge" class="badge"></span></a></li>
            <li><a href="#selected" data-toggle="tab">Selected<span id="selected-badge" class="badge"></span></a></li>
            <li><a href="#schedules" data-toggle="tab">Schedule<span id="schedule-badge" class="badge"></span></a></li>
          </ul>
          <ul class="nav navbar-nav nav-pills navbar-right">
            <li>
              <input id="import" type="file" style="display:none">
              <button id="import-button" onclick="$('input[id=import]').click();"></button>
            </li>
            <li><div id="export"></div></li>
            <li><button class="btn glyphicon glyphicon-trash" onclick="window.location.reload();"></button></li>
            <li><div id="intro"></div></li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane" id="configure">
          <div class="container-fluid ">
            <!-- <div class="row"> -->
            <table class="table table-striped">
              <th>Time frame</th>
              <tr>
                <td>Maximum number of courses per semesters</td>
                <td><div id="courses-per-semester"></td>
              </tr>
              <tr>
                <td>Minimum number of semesters remaining</td>
                <td><div id="semesters"</td>
                         </tr>
              <tr>
                <td>Link courses per semester and semesters remaining</td>
                <td><div id="link-courses-semesters"</td>
                         </tr>
              
              <th>Preferred Class Times</th>
              <tr>
                <td>Night only</td>
                <td><div id="night-only"></div></td>
              </tr>
              <tr>
                <td>Days of the week</td>
                <td><div id="week-days"></div></td>
              </tr>
              
              <th>Dates</th>
              <tr>
                <td>Starting semester</td>
                <td>
                  <div id="starting-semester"></div>
                  <div id="starting-year"></div>
                  
                </td>
              </tr>
              <th>Additional Settings</th>
              <tr>
                <td>International Student</td>
                <td>
                  <div id="int-student"></div>
                </td>
              </tr>
              <tr>
                <td>Restricted Status</td>
                <td>
                  <div id="restricted-student"></div>
                </td>
              </tr>
              
              <th class="warning">Developer options</th>
              <tr>
                <td>Current semester</td>
                <td>
                  <div id="current-semester"></div>
                  <div id="current-year"></div>
                </td>
              </tr>
              <tr>
                <td>Nr of courses required</td>
                <td><div id="total-courses"></div></td>
              </tr>
              <tr>
                <td>Scheduling Algorithm</td>
                <td><div id="backend"></div></td>
              </tr>
            </table>
            </div>
          </div>
          <div class="tab-pane" id="waived">
            <div class="container-fluid">
              <div class="row">
              </div>
              <div class="row-fluid">
                <div id="waived-available" class="col-xs-2">
                  <b>Not Waived</b>
                  <div id ="waived-groups" class="row-fluid"></div>
                  <div id ="waived-group"></div>
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
              </div>
              <div class="row">
                <div class="col-xs-1">
                  <b>Available</b>
                </div>
                <div id="show-restricted-header-taken"></div>
                <div class="col-md-offset-1 col-xs-1">
                  <b>4000</b>
                </div>
                <div class="col-md-offset-1 col-xs-1">
                  <b>5000</b>
                </div>
                <div class="col-md-offset-1 col-xs-1">
                  <b>6000</b>
                </div>
              </div>
              <div class="row-fluid">
                <div id="taken-available" class="col-xs-2">
                  <div id ="available-groups" class="row-fluid"></div>
                  <div id ="taken-group"></div>
                </div>
                <div class="clearfix visible-xs"></div>
                <div id="show-restricted-bucket-taken"></div>
                <div class="col-xs-1 bucket taken 4000"></div>
                <div class="col-md-offset-1 col-xs-1 bucket taken 5000"></div>
                <div class="col-md-offset-1 col-xs-1 bucket taken 6000"></div>
              </div>
              <div class="row">
                <div id ="description" class="col-md-offset-2 col-xs-7"></div>
              </div>
            </div>
          </div>
          
          <div class="tab-pane" id="selected">
            <div class="container-fluid ">
              <div class="row">
              </div>
              <div class="row">
                <div class="col-xs-1">
                  <b>Available</b>
                </div>
                <!-- <div class="col-md-offset-1 col-xs-1"> -->
                <!--   <b>Core</b> -->
                <!-- </div> -->
                <div id="show-restricted-header-selected"></div>
                <div class="col-md-offset-1 col-xs-1">
                  <b>4000</b>
                </div>
                <div class="col-md-offset-1 col-xs-1">
                  <b>5000</b>
                </div>
                <div class="col-md-offset-1 col-xs-1">
                  <b>6000</b>
                </div>
              </div>
              <div class="row-fluid">
                <div id="selected-available" class="col-xs-2">
                  <div id ="available-groups" class="row-fluid"></div>
                  <div id ="selected-group"></div>
                </div>
                <div class="clearfix visible-xs"></div>
                <!-- <div class="col-md-offset-1 col-xs-1 bucket selected core"></div> -->
                
                <div id="show-restricted-bucket-selected"></div>
                <div class="col-xs-1 bucket selected 4000"></div>
                <div class="col-md-offset-1 col-xs-1 bucket selected 5000"></div>
                <div class="col-md-offset-1 col-xs-1 bucket selected 6000"></div>
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
        </div>
      </div>
    </div>
  </body>
</html>
