export const httpRegex = /^https?:\/\//;

export const fileRegex = /^(?!^(PRN|AUX|CLOCK\$|NUL|CON|COM[1-9]|LPT[1-9])(\..*)?$)[^<>:"/\\|?*\x00-\x1F]+$/;
export const imageFileRegex = /^.*\.(jpg|jpeg|png|gif|bmp|tiff|webp|svg)$/;
export const videoFileRegex = /^.*\.(mp4|mkv|avi|mov|wmv|flv|webm)$/;
export const audioFileRegex = /^.*\.(mp3|wav|aac|flac|ogg|wma|m4a)$/;