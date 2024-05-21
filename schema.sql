CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    production_date DATE NOT NULL,
    producer VARCHAR(255),
    rating FLOAT
);