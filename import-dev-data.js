const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const Tour = require('./model/tourModel');
const User = require('./model/userModel');
const Review = require('./model/reviewModel'); // You'll need to create this
const app = require('./app');
const fs = require('fs');

const DB = process.env.DATABASE.replace(
    '<db_password>',
    process.env.DATABASE_PASSWORD,
);
console.log(DB);
mongoose.connect(DB).then(() => {
    console.log('DB connected succesfully!');
});

// READ JSON FILES
const tours = JSON.parse(
    fs.readFileSync(
        `${__dirname}/starter/dev-data/data/tours-simple.json`,
        'utf-8',
    ),
);

const users = JSON.parse(
    fs.readFileSync(
        `${__dirname}/starter/dev-data/data/users.json`,
        'utf-8',
    ),
);

const reviews = JSON.parse(
    fs.readFileSync(
        `${__dirname}/starter/dev-data/data/reviews.json`,
        'utf-8',
    ),
);

// IMPORT DATA INTO DB
const importData = async () => {
    try {
        await Tour.create(tours);
        await User.create(users, { validateBeforeSave: false });
        await Review.create(reviews);
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}