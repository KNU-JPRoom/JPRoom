exports.findWH = function (req, res,app,db) {
    var items="{";
    let results = db.query('SELECT * from Warehouse where warehouseID IN (SELECT warehouseID from EnrolledWarehouse)');
    console.log(results.length);
    if(results.length > 0) {
        var step;
        for(step =0;step<results.length;step++){
            items+= ("\"item"+step+"\":");
            var obj="{"+
                "\"warehouseID\" :"+ results[step].warehouseID+","+
                "\"warehouseName\" :\""+ results[step].warehouseName+"\","+
                "\"enrolledDate\" :\"" + results[step].enrolledDate+"\","+
                "\"address\" :\""+ results[step].address+"\","+
                "\"latitude\" :"+ results[step].latitude+","+
                "\"longitude\" :"+ results[step].longitude+","+
                "\"landArea\" :"+ results[step].landArea +","+
                "\"floorArea\" :"+ results[step].floorArea +","+
                "\"useableArea\" :"+ results[step].useableArea +","+
                "\"infoComment\" :\""+ results[step].infoComment+"\","+
               "\"etcComment\" :\""+ results[step].etcComment+"\""+
            "}";
            items+=obj;
            if(step+1!=results.length)items+=","
        }
    }
    items +="}";
    return items;
}

