var Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function(req,res,next){
    Bicicleta.allBicis(function (err, bicis) {
        res.status(200).json({ bicicleta: bicis });
    })
}

exports.bicicleta_create = function(req, res){

    var bici = new Bicicleta({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng],
    });
    
    Bicicleta.add(bici, function (err, newBici) {
        res.status(200).json({
            bicicleta: newBici
        })
    })
}

/*
exports.bicicleta_update = function(req,res){
    var bici = Bicicleta.findById(req.params.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.status(200).json({
        bicicleta:bici
    })
};
*/


exports.bicicleta_delete = function(req,res){
    Bicicleta.removeByCode(req.body.code, function (error, targetBici) {
        res.status(204).send();    
    });
};



