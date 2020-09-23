var Bicicleta = require('../../models/bicicleta');
const { findById } = require('../../models/bicicleta');

exports.bicicleta_list = function(req, res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}

exports.bicicleta_create = function (req, res){
    var bici = new Bicicleta({id : req.body.id, color: req.body.color,modelo: req.body.modelo});
    bici.ubicacion = [req.body.lat, req.body.lng];

    bici.save(function(err){
        res.status(200).json(bici);
    });

}
//es lo mismo que el create nomas que hay que ponerle una busqueda al principio
exports.bicicleta_update = function(req, res){
   
    var bici = Bicicleta.findById(req.body.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];
  // Bicicleta.update(bici);

   res.status(200).json({
       bicicleta: bici
   });
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id);
    res.status(204).send();
}