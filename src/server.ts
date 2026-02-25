import app from './app';
import env from './config/env';

const PORT: number = env.PORT;

app.listen(PORT, () => {
    console.log(`HR Management API is running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
