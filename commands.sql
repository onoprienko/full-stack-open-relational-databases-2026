CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('New Author', 'https://newauthor.com', 'New blog title', 9);

INSERT INTO blogs (author, url, title, likes)
VALUES ('New Author 2', 'https://newauthor2.com', 'New blog title 2', 8);