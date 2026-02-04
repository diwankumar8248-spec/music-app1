const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    async getRecommendations(mood) {
        try {
            const response = await fetch(`${API_BASE_URL}/recommendations?mood=${encodeURIComponent(mood)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            // Return empty list or mock error data
            return [];
        }
    }
};
