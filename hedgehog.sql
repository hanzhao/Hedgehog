--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.2
-- Dumped by pg_dump version 9.5.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: datas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE UNLOGGED TABLE datas (
    id integer NOT NULL,
    device_id integer,
    data jsonb,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE datas OWNER TO postgres;

--
-- Name: COLUMN datas.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN datas.id IS 'Data ID';


--
-- Name: device_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE device_types (
    id integer NOT NULL,
    name text,
    user_id integer,
    content_length integer,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    fields jsonb
);


ALTER TABLE device_types OWNER TO postgres;

--
-- Name: COLUMN device_types.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN device_types.id IS 'device_type_id';


--
-- Name: COLUMN device_types.name; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN device_types.name IS 'device_type_name';


--
-- Name: COLUMN device_types.fields; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN device_types.fields IS 'device post data fields';


--
-- Name: device_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE device_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE device_types_id_seq OWNER TO postgres;

--
-- Name: device_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE device_types_id_seq OWNED BY device_types.id;


--
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE devices (
    id integer NOT NULL,
    device_type_id integer,
    user_id integer,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()),
    key text,
    name text
);


ALTER TABLE devices OWNER TO postgres;

--
-- Name: COLUMN devices.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN devices.id IS 'device_id';


--
-- Name: COLUMN devices.device_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN devices.device_type_id IS 'device type';


--
-- Name: COLUMN devices.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN devices.user_id IS 'created by user_id';


--
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE devices_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE devices_id_seq OWNER TO postgres;

--
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE devices_id_seq OWNED BY devices.id;


--
-- Name: id_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE id_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE id_id_seq OWNER TO postgres;

--
-- Name: id_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE id_id_seq OWNED BY datas.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    username text,
    password text
);


ALTER TABLE users OWNER TO postgres;

--
-- Name: COLUMN users.id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN users.id IS 'User id';


--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN users.username IS 'Username';


--
-- Name: COLUMN users.password; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN users.password IS 'Password';


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datas ALTER COLUMN id SET DEFAULT nextval('id_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY device_types ALTER COLUMN id SET DEFAULT nextval('device_types_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY devices ALTER COLUMN id SET DEFAULT nextval('devices_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: datas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY datas (id, device_id, data, created_at) FROM stdin;
\.


--
-- Data for Name: device_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY device_types (id, name, user_id, content_length, created_at, fields) FROM stdin;
\.


--
-- Name: device_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('device_types_id_seq', 1, false);


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY devices (id, device_type_id, user_id, created_at, key, name) FROM stdin;
\.


--
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('devices_id_seq', 1, false);


--
-- Name: id_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('id_id_seq', 1, false);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, username, password) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 1, false);


--
-- Name: pk_data_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datas
    ADD CONSTRAINT pk_data_id PRIMARY KEY (id);


--
-- Name: pk_device_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT pk_device_id PRIMARY KEY (id);


--
-- Name: pk_device_type_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY device_types
    ADD CONSTRAINT pk_device_type_id PRIMARY KEY (id);


--
-- Name: pk_user_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);


--
-- Name: unique_user_username; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT unique_user_username UNIQUE (username);


--
-- Name: index_data_device_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_data_device_id ON datas USING btree (device_id);


--
-- Name: index_device_type_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_device_type_user_id ON device_types USING btree (user_id);


--
-- Name: index_device_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX index_device_user_id ON devices USING btree (user_id);


--
-- Name: foreign_data_device_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY datas
    ADD CONSTRAINT foreign_data_device_id FOREIGN KEY (device_id) REFERENCES devices(id);


--
-- Name: foreign_device_device_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT foreign_device_device_type_id FOREIGN KEY (device_type_id) REFERENCES device_types(id);


--
-- Name: foreign_device_type_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY device_types
    ADD CONSTRAINT foreign_device_type_user_id FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: foreign_device_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY devices
    ADD CONSTRAINT foreign_device_user_id FOREIGN KEY (user_id) REFERENCES users(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

