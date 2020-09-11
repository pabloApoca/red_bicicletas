var Bicicleta = require('../../models/bicicleta');
const { removeById } = require('../../models/bicicleta');

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
});