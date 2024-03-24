export const checkHealth = async (): Promise<boolean> => {
    try {
        return true; 
    } catch (error) {
        console.error('Health check error:', error);
        return false; 
    }
};