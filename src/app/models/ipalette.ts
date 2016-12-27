import { IrgbColor } from './irgb-color';

export interface IPalette {
    colors: IrgbColor[];
    name: string;
    $key?: string;
}