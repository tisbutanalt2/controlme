//import { app } from 'electron';
//import { name } from '../../package.json';

const isDev = process.env.NODE_ENV === 'development';//!app.getPath('exe').endsWith(`${name}.exe`);
export default isDev;