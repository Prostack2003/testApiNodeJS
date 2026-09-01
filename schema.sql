--
-- PostgreSQL database dump
--

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: meal_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.meal_items (
                                   id integer NOT NULL,
                                   user_id integer NOT NULL,
                                   product_id integer,
                                   weight_grams integer NOT NULL,
                                   date_eat date DEFAULT CURRENT_DATE NOT NULL,
                                   CONSTRAINT chk_weight_grams CHECK ((weight_grams > 0))
);


--
-- Name: meal_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.meal_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: meal_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.meal_items_id_seq OWNED BY public.meal_items.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
                                 id integer NOT NULL,
                                 name character varying(254) NOT NULL,
                                 calories_per_100g numeric(5,2) NOT NULL,
                                 proteins_per_100g numeric(5,2) NOT NULL,
                                 fats_per_100g numeric(5,2) NOT NULL,
                                 carbs_per_100g numeric(5,2) NOT NULL,
                                 CONSTRAINT chk_calories CHECK ((calories_per_100g >= (0)::numeric)),
                                 CONSTRAINT chk_carbs CHECK ((carbs_per_100g >= (0)::numeric)),
                                 CONSTRAINT chk_fats CHECK ((fats_per_100g >= (0)::numeric)),
                                 CONSTRAINT chk_proteins CHECK ((proteins_per_100g >= (0)::numeric))
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
                              id integer NOT NULL,
                              name character varying(254) NOT NULL,
                              email character varying(254) NOT NULL,
                              password character varying(254) NOT NULL,
                              weight numeric(5,2) NOT NULL,
                              height integer NOT NULL,
                              age integer NOT NULL,
                              gender character(1) NOT NULL,
                              activity_level integer NOT NULL,
                              CONSTRAINT chk_activity CHECK (((activity_level >= 1) AND (activity_level <= 5))),
                              CONSTRAINT chk_age CHECK (((age > 0) AND (age < 150))),
                              CONSTRAINT chk_gender CHECK ((gender = ANY (ARRAY['M'::bpchar, 'F'::bpchar]))),
                              CONSTRAINT chk_height CHECK ((height > 0)),
                              CONSTRAINT chk_weight CHECK ((weight > (0)::numeric))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: weight_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.weight_history (
                                       id integer NOT NULL,
                                       user_id integer NOT NULL,
                                       weight numeric(5,2) NOT NULL,
                                       measured_at date DEFAULT CURRENT_DATE NOT NULL
);


--
-- Name: weight_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.weight_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: weight_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.weight_history_id_seq OWNED BY public.weight_history.id;


--
-- Name: meal_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_items ALTER COLUMN id SET DEFAULT nextval('public.meal_items_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: weight_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weight_history ALTER COLUMN id SET DEFAULT nextval('public.weight_history_id_seq'::regclass);


--
-- Name: meal_items meal_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_items
    ADD CONSTRAINT meal_items_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: users uq_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uq_email UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: weight_history weight_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weight_history
    ADD CONSTRAINT weight_history_pkey PRIMARY KEY (id);


--
-- Name: idx_meal_items_user_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_meal_items_user_date ON public.meal_items USING btree (user_id, date_eat);


--
-- Name: idx_weight_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_weight_history_user_id ON public.weight_history USING btree (user_id);


--
-- Name: meal_items meal_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_items
    ADD CONSTRAINT meal_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: meal_items meal_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.meal_items
    ADD CONSTRAINT meal_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: weight_history weight_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.weight_history
    ADD CONSTRAINT weight_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

-- Refresh tokens table
CREATE TABLE refresh_tokens (
                                id SERIAL PRIMARY KEY,
                                user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                token VARCHAR(255) NOT NULL UNIQUE,
                                expires_at TIMESTAMP NOT NULL,
                                created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);



