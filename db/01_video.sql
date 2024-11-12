CREATE SCHEMA video;

CREATE TABLE video.users (
    user_id SERIAL PRIMARY KEY,
    name    VARCHAR(80) NOT NULL,
    email   VARCHAR(120) UNIQUE
);

CREATE TABLE video.videos (
    video_id SERIAL PRIMARY KEY,
    title        VARCHAR(200),
    description  TEXT,
    upload_date  TIMESTAMP DEFAULT now(),
    author_id    INT REFERENCES video.users
);

CREATE TABLE video.comments (
    comment_id SERIAL PRIMARY KEY,
    content    TEXT,
    posted_at  TIMESTAMP DEFAULT now(),
    video_id   INT REFERENCES video.videos,
    author_id  INT REFERENCES video.users,
    parent_id  INT REFERENCES video.comments
);

CREATE TABLE video.tags   (
    tag_id   SERIAL PRIMARY KEY,
    tag_name VARCHAR(50) UNIQUE
);
CREATE TABLE video.video_tags (
    video_id INT REFERENCES video.videos,
    tag_id   INT REFERENCES video.tags,
    PRIMARY KEY (video_id, tag_id)
);
CREATE TABLE video.likes  (
    like_id  SERIAL PRIMARY KEY,
    video_id INT REFERENCES video.videos,
    user_id  INT REFERENCES video.users,
    UNIQUE (video_id,user_id)
); 