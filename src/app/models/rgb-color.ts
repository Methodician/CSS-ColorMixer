export class RgbColor {
    r: number;
    g: number;
    b: number;
    rgb: string;
    hex: string;
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        let hexR = r == 0 ? '00' : r.toString(16)
        while (hexR.length < 2)
            hexR = '0' + hexR;
        let hexG = g == 0 ? '00' : g.toString(16)
        while (hexG.length < 2)
            hexG = '0' + hexG;
        let hexB = b == 0 ? '00' : b.toString(16)
        while (hexB.length < 2)
            hexB = '0' + hexB;

        this.rgb = 'rgb(' + r + ',' + g + ',' + b + ')';
        this.hex = ('#' + hexR + hexG + hexB).toUpperCase();
    }
}