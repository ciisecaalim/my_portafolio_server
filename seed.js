const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('MongoDB Connected');

        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const admin = new User({
            username: 'admin',
            password: 'password123', // Will be hashed by pre-save hook
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created');
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
