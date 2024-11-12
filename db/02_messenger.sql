CREATE SCHEMA messenger;

CREATE TABLE messenger.users (
    user_id  SERIAL PRIMARY KEY,
    username VARCHAR(80)
);

CREATE TABLE messenger.messages (
    msg_id        SERIAL PRIMARY KEY,
    content       TEXT,
    sent_time     TIMESTAMP DEFAULT now(),
    sender_id     INT REFERENCES messenger.users,
    receiver_id   INT REFERENCES messenger.users,
    reply_to_id   INT REFERENCES messenger.messages,
    fwd_from_id   INT REFERENCES messenger.messages
);

CREATE TABLE messenger.attachments (
    attach_id  SERIAL PRIMARY KEY,
    file_name  VARCHAR(120),
    file_type  VARCHAR(40),
    msg_id     INT REFERENCES messenger.messages
); 