const fs = require('fs');
const dotenv = require("dotenv");
dotenv.config({ path: "./.config.env" });
const Sequelize = require("sequelize");
var profileDir = './images/profile';
var blogDir = './images/blog';
const dirs = [profileDir, blogDir]

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    logging: false,
    define: {
        underscored: true, // use snake_case for all fields in the database
        // freezeTableName: true, //stop the auto-pluralization performed by Sequelize
        timestamps: false // don't add timestamps to tables by default (createdAt, updatedAt)
    },
});

const { Role, User, Category, Blog } = require("../dist/models")

db.authenticate()
    .then(() => console.log(`connected to ${db.config.database} successfully!`))
    .catch(err => console.log(`unable to connect ${db.config.database}!`, err.message));
db.sync({ force: true })
    .then(() => seedDB())
    .catch(err => console.log(`unable to sync ${db.config.database}!`, err.message));

// seeder function
const seedDB = async () => {
    try {
        for (let dir of dirs) {
            createDirIfNotExists(dir)
        }
        const roles = JSON.parse(fs.readFileSync(`${__dirname}/roles.json`, 'utf-8'));
        await Role.destroy({ truncate: { cascade: true } });
        await Role.bulkCreate(roles);

        const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
        await User.destroy({ truncate: { cascade: true } });
        const allusers = users.map(async (user) => {
            return await User.create(user)
        })
        await Promise.all(allusers);

        const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
        await Category.destroy({ truncate: { cascade: true } });
        await Category.bulkCreate(categories);

        const blogs = JSON.parse(fs.readFileSync(`${__dirname}/blogs.json`, 'utf-8'));
        await Blog.destroy({ truncate: { cascade: true } })
        const allBlogs = blogs.map(async (blog) => {
            return await Blog.create(blog)
        })
        await Promise.all(allBlogs);
        console.log('Data seeded successfully!');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        db.close()
        process.exit();
    }
};

const createDirIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return;
}

// node apiserver/data/seed.js