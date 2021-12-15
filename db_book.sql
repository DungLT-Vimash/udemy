create database db_book;
use db_book;
create table users(
	id bigint UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	name VARCHAR(255) NOT NULL,
	role VARCHAR(10) NOT NULL
);
create table books(
	id bigint UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    price float Not Null
);
create table purchase_history(
	id bigint UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id bigint  NOT NULL ,
    book_id bigint  NOT NULL ,
    price float Not Null,
    purchase_time time
);
