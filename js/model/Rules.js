function Rules() {
    var json = new JSONParser();
    this.rules = json.getJSON("rules");
}
