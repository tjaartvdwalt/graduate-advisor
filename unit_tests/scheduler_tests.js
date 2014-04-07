
test( "Find_Options", function() {
    var rotation = new JSONParser().getJSON('rotation');
    console.log(rotation);
    var res =  FindOptions('6430', 6, rotation);
    //var res =  FindOptions('5500', 6, rotation);
    console.log(res);
    ok( 1 == "1", "Passed!" );
});
