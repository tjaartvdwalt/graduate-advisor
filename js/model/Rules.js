function Rules() {
    this.getRules = function getRules() {
        var json = new JSONParser();
        var rules = json.getJSON("rules");
        return rules;
    }
}
