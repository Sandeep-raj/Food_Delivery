const express = require('express');
const mongoutil = require('./ResturantUtil');
const bodyparser = require('body-parser');

const rad_const = 57.29577951;

const app = express();


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));

mongoutil.mongoConnect(mongoutil.mongoose);

app.get('/resturant',function(req,res){
    res.writeHead(200,{'Content-Type' : 'application/json'});
    mongoutil.resturantModel.find({},function(err,data){
        if(!err){
            res.end(JSON.stringify(data));
        }
        else{
            res.end('<p>Error' + err + '</p>');
        }
    });
});

app.post('/resturant',function(req,res){
    console.log(req.body);
    currLoc = {
        lat : parseFloat(req.body.lat),
        log : parseFloat(req.body.log)
    }
    let results = FindResturants(currLoc,parseFloat(req.body.range),(results) => {
        res.writeHead(200,{'Content-Type' : 'application/json'});
        res.end(JSON.stringify(results));
    });
    
});

app.listen(3000);
console.log('Server is listening to port 3000');


function FindResturants(currLoc,range,cb){
    mongoutil.resturantModel.find({},function(err,data){
        if(!err){
            let resturants = [];
            let temp = 100000;
            data.forEach(x => {
                let d = distance(currLoc.lat,currLoc.log,x.lat,x.log);
                if(d < temp){
                    temp = x;
                }
                if(d<=range){
                    resturants.push(x);
                }
            });
            cb(resturants);
        }else{
            return undefined;
        }
    });
}


function distance(lat1, lon1, lat2, lon2, unit = 'K') {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

//  Convert to radian --> x in radian = x / 57.29577951
//  Distance, d in km = 1.609344 * 3963.0 * arccos[(sin(lat1) * sin(lat2)) + cos(lat1) * cos(lat2) * cos(long2 – long1)]