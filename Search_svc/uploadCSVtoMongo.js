const fs = require('fs');
const mongoutil = require('./ResturantUtil');

function bulkSaveDocument(model, instanceArray) {
    model.insertMany(instanceArray, function (err, result) {
        if (!err) {
            console.log('Data Saved Successfully');
        } else {
            console.log(err);
        }
    })
}

function ReadCSVFileSync(){
    const data = fs.readFileSync('./Resturants.csv',{encoding: 'utf-8'});
    const lines = data.split('\n');
    let values,x = 0;
    let resturants = [];
    for(let i = 1; i < lines.length; i++){
        try{
            let values;
            if(lines[i].indexOf('"') !== -1){
                let temp = lines[i].split(new RegExp(',"|",'));
                if(temp.length === 3){
                    temp[1] = temp[1].split(',').join('%');
                }
                else{
                    temp[1] = temp[1].split(',').join('%');
                    temp[3] = temp[3].split(',').join('%');
                    temp[4] = temp[4].split(',').join('%');
                }
                let str = temp.join(',');
                values = str.split(',');
            }else{
                values = lines[i].split(',');
            }
            if(values.length !== 16){
                x++;
            }else{
                let resturant = new mongoutil.resturantModel({
                    dateAdded : values[1],
                    address : values[3],
                    categories : values[4].replace(/%/g,','),
                    city : values[6],
                    country : values[7],
                    lat: parseFloat(values[9]),
                    log :parseFloat(values[10]),
                    name : values[11],
                    postal : parseInt(values[12]),
                    province:values[13],
                    source : values[14].replace(/%/g,','),
                    website : values[15].replace(/%/g,',')
                });
                resturants.push(resturant);
            }
        }catch(err){
            //console.log(err);
        }
    }
    //console.log(resturants);
    bulkSaveDocument(mongoutil.resturantModel,resturants);
}

async function main(){
    await mongoutil.mongoConnect(mongoutil.mongoose);
    ReadCSVFileSync();
}

main();  