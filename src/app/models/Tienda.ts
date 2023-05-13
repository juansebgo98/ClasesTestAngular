export class Tienda {
    id: number;
    nombre: string;

    /**
     * 
     * @param id 
     * @param nombre 
     */
    constructor(id: number, nombre?: string) {
        this.id = id;
        this.nombre = nombre;
    }

}