var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function (req, res){
    Bicicleta.allBicis((err, bicicletas) => { 
        res.render('bicicletas/index', {bicis: bicicletas});
    });
};


module.exports.bicicleta_create_get = function(req,res,next){
    res.render('bicicletas/create');
};

module.exports.bicicleta_create_post = function(req,res){
    var bici = new Bicicleta(req.body.code, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici, function (err, bici) {
        if (err) return console.log(err);     
        res.redirect('/bicicletas');
    });
};


module.exports.bicicleta_update_get = function(req,res,next){
    var bici = Bicicleta.findById(req.params.id);

    res.render('bicicletas/update', {bici:bici});
};

module.exports.bicicleta_update_post = function(req,res){
    var bici = Bicicleta.findById(req.params.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.redirect('/bicicletas');
};

module.exports.bicicleta_delete_post = function(req,res){
    Bicicleta.removeById(req.params.id);

    res.redirect('/bicicletas');
}
