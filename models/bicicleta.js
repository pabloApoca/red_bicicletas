var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion:{
        type: {Number} , index: {type: '2dsphere', sparse: true}
    }
});



bicicletaSchema.statics.createInstance = function(code,color,modelo,ubicacion){
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};

bicicletaSchema.method.toString = function(){ 
    return "code: " + this.code + " | color: " + this.color; 
};

bicicletaSchema.statics.allBicis = function(callback){
    return this.find({},callback);
};

bicicletaSchema.statics.add = function(aBici, callback){
    this.create(aBici,callback);
};

bicicletaSchema.statics.findByCode = function(aCode, callback){
    return this.findOne({code: aCode},callback);
};

bicicletaSchema.statics.removeByCode = function(aCode, callback){
    return this.deleteOne({code: aCode},callback);
};


module.exports = mongoose.model('Bicicleta', bicicletaSchema);

/*
var Bicicleta = function(id,color,modelo,ubicacion){
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
 }

 
 Bicicleta.prototype.tostring = function(){ 
     return "id: " + this.id + " | color: " + this.color + " | modelo: " + this.modelo + " | ubicacion: " + this.ubicacion; 
 }

 Bicicleta.allBicis = [];
 Bicicleta.add = function(aBici){
     Bicicleta.allBicis.push(aBici);
 }

Bicicleta.findById = function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x => x.id == aBiciId);
    if (aBici)
        return aBici
    else
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
}

Bicicleta.removeById = function(aBiciId){
    for (var i=0; i < Bicicleta.allBicis.length; i++){
        if (Bicicleta.allBicis[i].id == aBiciId){
            Bicicleta.allBicis.splice(i,1);
            break;       
        }
    }
}


 var a = new Bicicleta(1,"rojo", "urbana",[-34.6012424,-58.3861497]);
 var b = new Bicicleta(2,"urbana", "urbana",[-34.596932, -58.3808287]);

 Bicicleta.add(a);
 Bicicleta.add(b);

 module.exports = Bicicleta;
 */