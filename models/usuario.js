var mongoose = require('mongoose');
var Reserva = require('./reserva');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
var crypto = require('crypto');
const uniqueValidator = require('mongoose-unique-validator');

const saltRounds = 10;

var Token = require('../models/token');
var mailer = require('../mailer/mailer');  

const validateEmail = function(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

var usuarioSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, 'El nombre es obligatorio']
  },
  email: {
    type: String,
    trim: true,
    required: [true, 'El email es obligatorio'],
    lowercase: true,
    unique: true,
    validate: [validateEmail,'Por favor ingrese un email valido' ],
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio']
  },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  verificado: {
    type: Boolean,
    default: false
  }
});

usuarioSchema.plugin(uniqueValidator, {message: 'El {PATH} ya existe con otro usuario'});

usuarioSchema.pre('save', function(next){
  if (this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

usuarioSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

usuarioSchema.statics.allUsuarios = function(cb) { 
  return this.find({}, cb);
};

usuarioSchema.statics.add = function(vUsuario, cb) {
  this.create(vUsuario, cb);
}

usuarioSchema.methods.reservar = function(biciId, desde, hasta, cb){
   var reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde:desde, hasta: hasta});
   console.log(reserva); 
   reserva.save(cb);
};

usuarioSchema.statics.removeByUsuario = function(vUsuario, cb) {
  return this.deleteOne({usuario: vUsuario}, cb);
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb){
  var token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
  var email_destination = this.email;
  token.save(function(err){
    if (err) { return console.log(err.message); }
    
    var mailOptions = {
      from : 'no-reply@redbicicletas.com',
      to: email_destination, 
      subject : 'Verificacion de la cuenta',
      text: 'Hola, \n\n' +  'Por favor, para verificar su cuenta haga click en este link: \n' + 'http://localhost:3000' + '\/token/confirmation\/' + token.token + '\n'
    };

    mailer.sendMail(mailOptions, function(err){
      if (err) { return console.log(err.message); }
      console.log('A verification email has been send to ' + email_destination + '.');
    
    });  

  });
};

usuarioSchema.methods.resetPassword = function(cb) {
  const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString('hex')});
  const email_destination = this.email;
  token.save(function (err) {
      if (err) { return cb(err); }

      const mailOptions = {
          from: 'no-reply@redbicicletas.com',
          to: email_destination,
          subject: 'Reseteo de password de cuenta ',
          text: 'Hola,\n\n' + 'Por favor, para resetear el password de su cuenta haga click en este link: \n' 
              + 'http://localhost:3000/' + 'resetPassword\/' + token.token + '\n' };

      mailer.sendMail(mailOptions, function (err) {
          if (err) { return cb(err); }

          console.log('Se envio un email para resetear el password a: ' + email_destination + '.');

      });

      cb(null);

  });
}
usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition, callback) {
  const self = this;
  console.log(condition);
  self.findOne({
      $or: [
          { 'googleId': condition.id }, { 'email': condition.emails[0].value }
      ]
  }, (err, result) => {
      if (result) {
          callback(err, result)
      } else {
          console.log('============ CONDITION =========');
          console.log(condition);
          let values = {};
          values.googleId = condition.id;
          values.email = condition.emails[0].value;
          values.name = condition.displayName || 'SIN NOMBRE';
          values.verificado = true;
          values.password = 'oauth'; //condition._json.etag;
          console.log('============ VALUES =========');
          console.log(values);
          self.createImageBitmap(values, (err, result) => {
              if (err) { console.log(err); }
              return callback(err, result)
          })
      }
  })
};

module.exports = mongoose.model('Usuario', usuarioSchema);

