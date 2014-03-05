<!doctype html>
<html>
  <head>
    <?php
      // parses the xml file and embeds the results as json in the html
      include 'php/xml-parser.php';
    ?>
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="assets/icons/favicon.ico">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    
    <!-- importing everything here is not great. We should think about using include.js -->
    <script src="js/control/CoursesController.js"></script>
    <script src="js/model/Courses.js"></script>
    <script src="js/model/JSONParser.js"></script>
    <script src="js/model/UserCourses.js"></script>
    <script src="js/view/AvailableRenderer.js"></script>
    <script src="js/view/BucketRenderer.js"></script>
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
            <li class="active"><a href="#">Select</a></li>
            <li><a href="about.html">Taken</a></li>
            <li><a href="about.html">Waived</a></li>
            <li><a href="#contact">Schedule</a></li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>
    
    <div class="container-fluid ">
      <div class="row">
        <button onclick="toRender=6000;">6000</button>
        <button onclick="toRender=5000;">5000</button>
        <button onclick="toRender=4000;">4000</button>
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
        <script>
          var controller = new CoursesController();
          //var availableBucket = document.getElementById("available-bucket");
          //console.log(availableBucket.value);
          controller.renderAvailable("6000");

          controller.renderBucket('core');
          controller.renderBucket('6000');
          controller.renderBucket('5000');
          controller.renderBucket('4000');
        </script>
        
      </div>
    </div>
    <script src="js/lib/jquery.min.js"></script>
    <script src="js/lib/bootstrap.min.js"></script>
  </body>
</html>
