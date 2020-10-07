exports.findWH = function (req, res,app,db) {
    var items=[];
    let results = db.query('SELECT * from Warehouse where warehouseID IN (SELECT warehouseID from EnrolledWarehouse)');
    if(results.length > 0) {
        var step;
        for(step =0;step<results.length;step++){
            var obj={};
            obj['warehouseID']=results[step].warehouseID;
            obj['warehouseName']=results[step].warehouseName;
            obj['enrolledDate']=results[step].enrolledDate;
            obj['address'] = results[step].address;
            obj['latitude'] = results[step].latitude;
            obj['longitude'] = results[step].longitude;
            obj['landArea'] = results[step].landArea;
            obj['floorArea'] = results[step].floorArea;
            obj['useableArea'] = results[step].useableArea;
            obj['infoComment'] = results[step].infoComment;
            obj['etcComment'] = results[step].etcComment;
            items.push(obj);
        }
    }
    return items;
}

exports.checkID = function(req,res,app,db){
    var memberID = req.body.memberID;
    console.log(memberID);
    var b = false;
    db.query(`SELECT * FROM Member WHERE memberID='${memberID}'`,function(error,results,fields){
        if(error){
            console.log("error ocurred",error);
            res.send(false);
        }
        else{
            console.log(results.length);
            if(!results.length)res.send(true);
            else res.send(false);
        }
    })
}
