function CoursesController() {
    this.courses = new Courses();
    this.userCourses = new UserCourses(this.courses);


    this.renderBucket = renderBucket;
    function renderBucket(type) {
        var renderer = new BucketRenderer();
        renderer.renderBucket(type, this.userCourses["selected"][type]);
    }
    
    this.renderAvailable = renderAvailable;
    function renderAvailable(type) {
        var renderer = new AvailableRenderer();

        renderer.renderAvailable(type, this.userCourses["available"][type]);
    }

}
