const { ConsoleReporter } = require('jasmine');
var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas', function() {


    beforeAll(function(done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, { useNewUrlParser: true});

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();
        });
    });

    afterEach(function(done){
       // jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
      //  jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
     // jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
        Bicicleta.deleteMany({},  function(err, success){
            if (err) console.log(err);
            done();
        });
     
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', () => {

            var bici = Bicicleta.createInstance(1, "Verde", "Urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("Verde");
            expect(bici.modelo).toBe("Urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);
        })
    });

  
    describe('Bicicleta.allBicis', () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
        it('comienza vacia', (done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function(err, newBici){
                if (err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);

                    done();
                });
            });
        });
    });

    describe('Bicicleta.findByCode', () =>{
        it('debe devolver la bici con code 1', (done) =>{
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);

                var aBici = new Bicicleta({code: 1, color:"verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if(err) Console.log(err);

                    var aBici2 = new Bicicleta({code: 2, color: "roja", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if(err) console.log(err);
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
                            
                            done();
                        });
                    });
                });
            });


        });
    });

   

});













/*
beforeEach( () => {
    Bicicleta.allBicis = [];
});

describe('Bicicleta.allBicis', () => {
    it('Comienza vacio', () =>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add', () => {
    it('Agregamos una bici.', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        var a = new Bicicleta(1, 'Rojo', 'Montaña', [-34.6012424,-58.3861497]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () => {
    it('Debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(1, "verde", "urbana");
        var aBici2 = new Bicicleta(2, "rojo", "montaña");
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);

        var targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);

    });
});

describe('Bicicleta.removeById', () => {
    it('Debe eliminar una bicicleta', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
        var aBici = new Bicicleta(4, "verde", "urbana");
        Bicicleta.add(aBici);

        Bicicleta.removeById(4);
       // expect(Bicicleta.allBicis.length).toBe(0); //Hasta aca funciona pero no es lo ideal
      // Bicicleta.findById(4) == null;  //Aca me tira el mensaje de que no existe una bici con ese id que elimine

       expect(aBici == null); //Aca solo digo que la bici que agregue ya no existe
    });
});*/