CREATE EXTENSION IF NOT EXISTS postgis;   -- для гео‑точек
CREATE SCHEMA delivery;

CREATE TABLE delivery.points (
    point_id  SERIAL PRIMARY KEY,
    address   TEXT,
    coord     geometry(Point, 4326)
);

CREATE TABLE delivery.couriers (
    courier_id SERIAL PRIMARY KEY,
    name       VARCHAR(80),
    phone      VARCHAR(20)
);

CREATE TABLE delivery.statuses (
    status_id  SERIAL PRIMARY KEY,
    status_name VARCHAR(40)
);

INSERT INTO delivery.statuses(status_name)
VALUES ('CREATED'),('ON_ROUTE'),('DELIVERED'),('CANCELLED');

CREATE TABLE delivery.routes (
    route_id  SERIAL PRIMARY KEY,
    route_name VARCHAR(120),
    courier_id INT REFERENCES delivery.couriers
);

CREATE TABLE delivery.route_points (
    route_id INT REFERENCES delivery.routes,
    point_id INT REFERENCES delivery.points,
    seq_no   INT,
    PRIMARY KEY (route_id, point_id)
);

CREATE TABLE delivery.deliveries (
    delivery_id SERIAL PRIMARY KEY,
    pickup_id   INT REFERENCES delivery.points,
    dropoff_id  INT REFERENCES delivery.points,
    courier_id  INT REFERENCES delivery.couriers,
    status_id   INT REFERENCES delivery.statuses,
    route_id    INT REFERENCES delivery.routes
); 