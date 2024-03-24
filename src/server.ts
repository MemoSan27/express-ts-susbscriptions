import app from './app';

const PORT: number = Number(process.env.APP_PORT) || 8080;

const main = async (): Promise<void> => {
    try {
        app.listen(PORT);
        console.log(`Server running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
}

main();