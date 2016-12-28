import { IrgbColor } from './irgb-color';

export interface IPalette {
    colors: any;
    colorSet?: IrgbColor[];
    name: string;
    $key?: string;
}