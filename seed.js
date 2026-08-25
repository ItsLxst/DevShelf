import pool from "./db.js";

const createProductsTableQuery = `
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    icon VARCHAR(10),
    badge_text VARCHAR(50),
    badge_type VARCHAR(50),
    meta_text VARCHAR(255),
    file_path VARCHAR(255) DEFAULT '/downloads/sample.pdf',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createOrdersTableQuery = `
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    stripe_session_id VARCHAR(255) UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createOrderItemsTableQuery = `
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10, 2) NOT NULL
);
`;

const insertProductsQuery = `
INSERT INTO products (title, description, category, price, icon, badge_text, badge_type, meta_text)
VALUES 
('Node.js API Masterclass', 'REST & GraphQL APIs with Express, JWT auth, PostgreSQL, and deployment.', 'ebook', 29.00, '📘', 'Bestseller', 'bestseller', '210 pages'),
('SaaS Starter Kit', 'Full-stack Next.js boilerplate with auth, billing, dashboard, and dark mode.', 'template', 49.00, '⚡', 'New', 'new', 'Next.js · Stripe · Prisma'),
('System Design for Juniors', 'Cache, queues, load balancers — explained for entry-level engineers.', 'ebook', 19.00, '📘', NULL, NULL, '145 pages'),
('React Component Library', 'Production-ready UI components with Storybook, tests, and Tailwind.', 'template', 39.00, '⚡', NULL, NULL, 'React · TypeScript · Tailwind'),
('Remote Job Resume Pack', 'ATS-optimized resume templates, cover letter, and LinkedIn tips for devs.', 'ebook', 15.00, '📘', 'Popular', 'popular', '80 pages'),
('Admin Dashboard Template', 'Clean analytics dashboard with charts, data tables, and mobile sidebar.', 'template', 45.00, '⚡', NULL, NULL, 'React · Recharts · TailwindCSS');
`;

async function runSeed() {
    try {
        await pool.query(createProductsTableQuery);
        await pool.query(createOrdersTableQuery);
        await pool.query(createOrderItemsTableQuery);

        const check = await pool.query('SELECT COUNT(*) FROM products');
        if (parseInt(check.rows[0].count) === 0) {
            await pool.query(insertProductsQuery);
            console.log("Products inserted.");
        } else {
            console.log("Products already exist, skipping insert.");
        }
    }
    catch (err){
        console.error("Error during database seeding:", err);
    }
    finally {
        await pool.end();
        console.log("Database connection pool closed.");
    }
}

runSeed();