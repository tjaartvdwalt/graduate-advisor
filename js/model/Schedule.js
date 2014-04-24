function Schedule() {
    var json = new JSONParser();
    this.schedule = json.getJSON("schedule");
}
