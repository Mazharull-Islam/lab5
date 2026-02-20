const mongoose = require('mongoose');
require('dotenv').config();
const Game = require('./models/gameModel');
const Player = require('./models/playerModel');
const Developer = require('./models/developerModel');
const Tournament = require('./models/tournamentModel');

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await Game.deleteMany({});
        await Player.deleteMany({});
        await Developer.deleteMany({});
        await Tournament.deleteMany({});

        // 1. Seed Games
        const games = await Game.insertMany([
            { title: 'Cyberpunk Quest', genre: 'RPG', rating: 9, multiplayer: true },
            { title: 'Fast Frag', genre: 'FPS', rating: 8, multiplayer: true },
            { title: 'Brain Tease', genre: 'Puzzle', rating: 7, multiplayer: false },
            { title: 'Empire Builder', genre: 'Strategy', rating: 8.5, multiplayer: true },
            { title: 'Life Sim', genre: 'Simulation', rating: 6, multiplayer: false }
        ]);
        console.log('5 Games seeded');

        // 2. Seed Players
        const players = await Player.insertMany([
            { name: 'Alice Smith', email: 'alice@example.com', age: 25, membershipLevel: 'elite', active: true },
            { name: 'Bob Jones', email: 'bob@example.com', age: 30, membershipLevel: 'premium', active: true },
            { name: 'Charlie Brown', email: 'charlie@example.com', age: 20, membershipLevel: 'free', active: true },
            { name: 'Diana Prince', email: 'diana@example.com', age: 28, membershipLevel: 'premium', active: true },
            { name: 'Ethan Hunt', email: 'ethan@example.com', age: 35, membershipLevel: 'elite', active: false }
        ]);
        console.log('5 Players seeded');

        // 3. Seed Developers
        const developers = await Developer.insertMany([
            { name: 'Ubisoft-like', email: 'dev1@example.com', specializations: ['RPG', 'FPS'], experienceYears: 10, hourlyRate: 50, available: true },
            { name: 'Indie Studio', email: 'dev2@example.com', specializations: ['Puzzle'], experienceYears: 5, hourlyRate: 30, available: true },
            { name: 'Strategy Kings', email: 'dev3@example.com', specializations: ['Strategy'], experienceYears: 15, hourlyRate: 80, available: false },
            { name: 'Sim World', email: 'dev4@example.com', specializations: ['Simulation'], experienceYears: 8, hourlyRate: 45, available: true },
            { name: 'Multi Dev', email: 'dev5@example.com', specializations: ['RPG', 'Strategy'], experienceYears: 12, hourlyRate: 70, available: true }
        ]);
        console.log('5 Developers seeded');

        // 4. Seed 5 Tournaments
        const tournamentData = [
            {
                playerId: players[0]._id,
                developerId: developers[0]._id,
                gameId: games[0]._id,
                tournamentDate: new Date(),
                status: 'registered',
                notes: 'Alice joining Cyberpunk Quest'
            },
            {
                playerId: players[1]._id,
                developerId: developers[1]._id,
                gameId: games[2]._id,
                tournamentDate: new Date(Date.now() + 86400000),
                status: 'registered',
                notes: 'Bob joining Brain Tease'
            },
            {
                playerId: players[3]._id,
                developerId: developers[3]._id,
                gameId: games[4]._id,
                tournamentDate: new Date(Date.now() + 172800000),
                status: 'registered',
                notes: 'Diana joining Life Sim'
            },
            {
                playerId: players[0]._id,
                developerId: developers[4]._id,
                gameId: games[3]._id,
                tournamentDate: new Date(Date.now() + 259200000),
                status: 'registered',
                notes: 'Alice joining Empire Builder'
            },
            {
                playerId: players[1]._id,
                developerId: developers[0]._id,
                gameId: games[1]._id,
                tournamentDate: new Date(Date.now() + 345600000),
                status: 'registered',
                notes: 'Bob joining Fast Frag'
            }
        ];

        await Tournament.insertMany(tournamentData);
        console.log('5 Tornaments seeded');

        console.log('Seeding complete!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
