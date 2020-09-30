var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require ('crypto')
const saltRound = 10;

const Token = require('../models/token');
const mailer = require('../mailer/mailer');

const validateEmail = function(email){
    const re = /^<\w+([\.-]?\w+)@\w+([\.-]?\w+)*(\.w{2,3})+$/;
  //  return re.test(email);
}

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio.']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio.'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingresar un email válido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
    },
    password: {
            type: String,
            required: [true, 'El password es obligatorio.']
        
    },
    passwordReserToken: String,
    passwordReserTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario.'});

usuarioSchema.pre('save', function(next){
    if(this.isModified('password')){
        this.password = bcrypt.hashSync(this.password, saltRound);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.statics.updateUser = function(userObj, cb){
    //console.log(userObj);
    console.log(userObj.nombre);
    this.updateOne({ _id: userObj._id }, {$set: {nombre: userObj.nombre}}, cb);
};


usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
    var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    console.log(reserva);
    reserva.save(cb);
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
    const email_destination = this.email;
    token.save(function (err){
        if(err) { return console.log(err.message); }

        const mailOptions = {
            from: 'no-reply@redbicicletas.com',
            to: email_destination,
            subject: 'Verificacion de cuenta',
            text: 'Hola,\n\n' + 'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '\n'
        };

        mailer.sendMail(mailOptions, function(err){
            if(err) {return console.log(err.message); }
           
            console.log('Se ha enviado un email de Bienvenida a '+ email_destination);
        });
    });

}

module.exports = mongoose.model('Usuario', usuarioSchema);