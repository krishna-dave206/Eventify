import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Events.js';

dotenv.config();

// Dummy data arrays
const eventData = {
    College: [
        { title: "Artificial Intelligence Workshop", location: "Tech Lab 101", daysFromNow: 5 },
        { title: "Annual College Fest 2025", location: "Main Auditorium", daysFromNow: 15 },
        { title: "Guest Lecture on Quantum Computing", location: "Seminar Hall B", daysFromNow: 8 },
        { title: "Coding Hackathon Finals", location: "Computer Center", daysFromNow: 12 },
        { title: "Career Fair & Job Expo", location: "Exhibition Ground", daysFromNow: 20 },
        { title: "Data Science Symposium", location: "Conference Room A", daysFromNow: 18 },
        { title: "Student Council Elections", location: "Central Campus", daysFromNow: 25 },
        { title: "Web Development Bootcamp", location: "IT Block", daysFromNow: 10 },
        { title: "Research Paper Presentation", location: "Auditorium 2", daysFromNow: 7 },
        { title: "Alumni Meet & Greet", location: "Student Center", daysFromNow: 30 }
    ],
    Festival: [
        { title: "Diwali Celebration 2025", location: "City Park", daysFromNow: 45 },
        { title: "New Year Music Festival", location: "Riverside Arena", daysFromNow: 60 },
        { title: "Spring Flower Festival", location: "Botanical Gardens", daysFromNow: 90 },
        { title: "Summer Food Festival", location: "Downtown Plaza", daysFromNow: 120 },
        { title: "Cultural Heritage Week", location: "Convention Center", daysFromNow: 35 },
        { title: "Jazz & Blues Night", location: "Amphitheater", daysFromNow: 22 },
        { title: "Street Art Festival", location: "Arts District", daysFromNow: 28 },
        { title: "Independence Day Parade", location: "Main Street", daysFromNow: 150 },
        { title: "Lantern Festival", location: "Lakeside Park", daysFromNow: 40 },
        { title: "Comedy Festival Weekend", location: "Comedy Club", daysFromNow: 14 }
    ],
    Sports: [
        { title: "Inter-College Basketball Tournament", location: "Sports Complex A", daysFromNow: 6 },
        { title: "Marathon 2025", location: "City Stadium", daysFromNow: 17 },
        { title: "Swimming Championship", location: "Aquatic Center", daysFromNow: 11 },
        { title: "Cricket League Finals", location: "Cricket Ground", daysFromNow: 21 },
        { title: "Tennis Open Tournament", location: "Tennis Courts", daysFromNow: 9 },
        { title: "Football League Playoffs", location: "Football Stadium", daysFromNow: 13 },
        { title: "Badminton Championships", location: "Indoor Sports Hall", daysFromNow: 16 },
        { title: "Yoga & Fitness Workshop", location: "Wellness Center", daysFromNow: 4 },
        { title: "Table Tennis Competition", location: "Recreation Hall", daysFromNow: 19 },
        { title: "Athletics Meet", location: "Running Track", daysFromNow: 24 }
    ],
    Personal: [
        { title: "Birthday Party - Sarah", location: "The Garden Restaurant", daysFromNow: 3 },
        { title: "Wedding Anniversary Dinner", location: "Grand Hotel Ballroom", daysFromNow: 31 },
        { title: "Family Reunion Picnic", location: "Sunset Beach", daysFromNow: 42 },
        { title: "Book Club Meeting", location: "Coffee House", daysFromNow: 2 },
        { title: "Photography Exhibition Opening", location: "Art Gallery", daysFromNow: 26 },
        { title: "Piano Recital", location: "Music Hall", daysFromNow: 33 },
        { title: "Cooking Class - Italian Cuisine", location: "Culinary Institute", daysFromNow: 8 },
        { title: "Weekend Hiking Trip", location: "Mountain Trail", daysFromNow: 5 },
        { title: "Movie Night with Friends", location: "Home Theater", daysFromNow: 1 },
        { title: "Pottery Workshop", location: "Art Studio", daysFromNow: 12 }
    ]
};

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Find a user to assign events to
        let user = await User.findOne();

        if (!user) {
            console.log('No users found. Please create a user first by registering on the website.');
            process.exit(1);
        }

        console.log('Using user:', user.email);

        // Clear existing events (optional - comment out if you want to keep existing events)
        await Event.deleteMany({});
        console.log('Cleared existing events');

        // Create events
        const events = [];
        const today = new Date();

        for (const [category, items] of Object.entries(eventData)) {
            for (const item of items) {
                const eventDate = new Date(today);
                eventDate.setDate(today.getDate() + item.daysFromNow);

                events.push({
                    title: item.title,
                    date: eventDate,
                    category: category,
                    location: item.location,
                    createdBy: user._id
                });
            }
        }

        // Insert all events
        await Event.insertMany(events);
        console.log('Created', events.length, 'dummy events!');

        // Show breakdown
        console.log('\nEvents by Category:');
        for (const [category, items] of Object.entries(eventData)) {
            console.log(' ', category + ':', items.length, 'events');
        }

        console.log('\nDatabase seeded successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDatabase();
