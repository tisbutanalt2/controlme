export default function combineClasses(...classes: any[]) {
    return classes.filter(val => typeof val === 'string').join(' ');
}