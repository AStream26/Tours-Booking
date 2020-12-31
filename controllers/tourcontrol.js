const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8'));

exports.checkid = (req,res,next,id)=>{
    if(req.params.id>tours.length){
       return  res.status(404).json({
            status:"fail",
            message:"Data not Found"
        });
    }
    next();
}
exports.checkbody  = (req,res,next)=>{
    if(!req.params.name || !req.params.price){
        return res.status(400).json({
            status:"Bad Request",
            message:"Price or name missing"
        });
    }
    next();
}
exports.getAlltour = (req,res)=>{
    res.status(200).json({
        status:'success',
        data:{
          tours:tours
        }
    })
}
exports.gettour = (req,res)=>{
    const id = + req.params.id;
    const tour = tours.find(el =>el.id ===id);
    res.status(200).json({
        status:'success',
        Time :req.requestTime,
        data:{
          tours:tour
        }
    })
  }

  exports.newtour = (req,res)=>{
    //res.send(req.body);
     const newid = tours[tours.length-1].id +1;
     const newtour =  Object.assign({id:newid},req.body);
     tours.push(newtour);
     fs.writeFile('./dev-data/data/tours-simple.json',JSON.stringify(tours),err=>{
         res.status(201).json({
             status:'success',
             data :{
                 tour:newtour
             }
         });
     })
    }

    exports. updatetour = (req,res)=>{
   
     res.status(200).json({
         status:'success',
         data:{
           tours:tour
         }
     })

}
exports.deletetour = (req,res)=>{
     res.status(204).json({
         status:'success',
         data:{
           tours:null
         }
     })

}
