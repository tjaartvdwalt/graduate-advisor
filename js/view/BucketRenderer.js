function BucketRenderer() {
    this.bucketSize = 10;

    this.renderBucket = renderBucket;
    function renderBucket(type, bucket) {
        document.write("<div class='col-md-offset-1 col-xs-1 " + type + " bucket'>");

        for(var j = Object.keys(bucket).length; j < this.bucketSize; j++) {
            document.write("<button class='spacer'>Spacer</button>");
            }

        for(var i in bucket) {
            document.write("<button>" + i + "</button>");
        }

        document.write("</div>");
    }
}
