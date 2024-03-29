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
    <script src="js/scheduler1/scheduler.js"></script>
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
            <li><div id="info"></div></li>
            <li><div id="intro"></div></li>
          </ul>
        </div>
      </div>
      <div class="tab-content">
        <div class="tab-pane" id="configure">
          <div id="config" class="container-fluid ">
            <div class="row"></div>
            <div class="headline">Tell us about any specific limitations that apply to you.</div>
          </div>
        </div>
        <div class="tab-pane" id="waived">
          <div class="container-fluid">
            <div class="row">
            </div>
            <div class="headline">If you have permission from UMSL to waive any courses, do it here.</div>
            <div class="row">
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
            <div class="headline">Put the courses you have already taken at UMSL, if any, here.</div>
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
            <div class="headline">Here is where you choose any specific courses you want to take, or choose nothing and let the system choose for you.</div>
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
<div id="sidebar" class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">More information</h4>
      </div>
      <div class="modal-body">
        <h4>This project was made by Group 1</h4>
        Peter Zylka, Ryan Chrisco, Shahrouz Yousefi and Tjaart van der Walt<br>
        <br>
        <h4>README</h4>
        <a href="http://comp.umsl.edu/~Group1/graduate-advisor/README.html" target="_blank">A short description of our project</a>
        <h4>Useful Links</h4>
        <a href="http://www.umsl.edu/mathcs/graduate-studies/grad-course-descrip.html" target="_blank">
          Graduate Course Descriptions </a><br>
        <a href="http://www.umsl.edu/mathcs/undergraduate-studies/coursedescriptions.html" target="_blank">Undergraduate
          Course Descriptions</a><br>
        <a href="http://www.cs.umsl.edu/degree/MS-cs.html" target="_blank">MS in Computer Science Website</a><br>
        <a href="http://www.cs.umsl.edu/index_items/colloquia.html" target="_blank">Colloquia Dates and Times</a><br>
        <a href="http://www.umsl.edu/divisions/graduate/formsregs/mastforms.html" target="_blank">Forms</a><br>
        <a href="http://www.umsl.edu/divisions/graduate/index.html" target="_blank">Important Dates</a> (see Important Dates header)<br>
        <br>
        <h4>Notices</h4>
        <ul>
          <li><i>You must attend at least five colloquia over the course of your
              graduate program</i></li>
          <li><i>You must keep track of important deadlines for forms (M1, M4,
              etc.)</i></li>
        </ul>
        <br><b>Disclaimer: This is only used for estimation and planning - ALWAYS
          check with an advisor</b>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
</body>
</html>
