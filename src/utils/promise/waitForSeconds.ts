const waitForSeconds = (seconds: number) => new Promise<void>(res => {
    setTimeout(res, seconds * 1000);
});

export default waitForSeconds;