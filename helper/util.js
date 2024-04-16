const { client } = require('../db/connection');

const { DEFAULT_MONGO_DB = 'analyDb' } = process.env;
const db = client.db(DEFAULT_MONGO_DB); // Replace with your database name

const labelList = [
    'programming',
    'art',
    'philosophy',
    'science',
    'technology',
    'history',
    'literature',
    'music',
    'film',
    'sports',
    'health',
    'food',
    'travel',
    'education',
    'business',
    'politics',
    'environment',
    'social_issues',
    'personal_development',
    'other'
];

// Function to determine query topic based on the query content
function determineQueryTopic(query) {
    // Convert query to lowercase and tokenize
    const tokens = query.toLowerCase().split(' ');

    // Define keywords or patterns for each topic
    const labelKeywords = {
        'programming': ['code', 'programming', 'javascript', 'python', 'java', 'algorithm', 'nodejs', 'api'],
        'art': ['art', 'painting', 'sculpture', 'music', 'creative', 'design'],
        'philosophy': ['philosophy', 'ethics', 'morality', 'metaphysics', 'epistemology'],
        'science': ['science', 'physics', 'chemistry', 'biology', 'astronomy', 'research'],
        'technology': ['technology', 'tech', 'innovation', 'digital', 'computing', 'internet'],
        'history': ['history', 'historical', 'ancient', 'medieval', 'modern'],
        'literature': ['literature', 'books', 'novels', 'poetry', 'fiction'],
        'music': ['music', 'musical', 'instrument', 'composer', 'song', 'performance'],
        'film': ['film', 'movie', 'cinema', 'director', 'actor', 'actress'],
        'sports': ['sports', 'athletics', 'fitness', 'exercise', 'football', 'basketball'],
        'health': ['health', 'wellness', 'fitness', 'nutrition', 'mental health', 'physical health'],
        'food': ['food', 'cooking', 'recipes', 'cuisine', 'culinary'],
        'travel': ['travel', 'tourism', 'destination', 'adventure', 'journey', 'vacation'],
        'education': ['education', 'learning', 'teaching', 'school', 'college', 'student'],
        'business': ['business', 'entrepreneurship', 'management', 'marketing', 'finance', 'economics'],
        'politics': ['politics', 'government', 'policy', 'democracy', 'election', 'political'],
        'environment': ['environment', 'nature', 'climate', 'sustainability', 'conservation', 'green'],
        'social_issues': ['social issues', 'social justice', 'inequality', 'human rights', 'poverty', 'discrimination'],
        'personal_development': ['personal development', 'self-improvement', 'growth', 'self-help', 'motivation'],
        'other': []
    };

    // Initialize counts for each category
    const labelCounts = {};
    for (const label of labelList) {
        labelCounts[label] = 0;
    }

    // Iterate over tokens and count keyword matches for each category
    for (const token of tokens) {
        for (const label of labelList) {
            if (labelKeywords[label].includes(token)) {
                labelCounts[label]++;
            }
        }
    }

    // Determine the dominant category based on the maximum count of keyword matches
    let maxCount = 0;
    let dominantLabel = 'other';
    for (const label of labelList) {
        if (labelCounts[label] > maxCount) {
            maxCount = labelCounts[label];
            dominantLabel = label;
        }
    }

    return dominantLabel;
}

let mongo = {
    async findOne(collection, filter, projection = {}) {
        const result = await db
            .collection(collection)
            .findOne(filter, projection, { maxTimeMS: 3000 });
        return result;
    },
    async insertOne(collection, data) {
        const result = await db
            .collection(collection)
            .insertOne(data);
        return result;
    },
    async updateOne(collection, filter, set) {
        const result = await db
            .collection(collection)
            .updateOne(filter, set);
        return result;
    }
}

module.exports = {
    determineQueryTopic,
    mongo
}