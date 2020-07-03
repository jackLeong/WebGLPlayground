insert into supplies(s_id, s_name, s_city, s_zip, s_call)
values 
(101, 'FastFruit Inc.', 'Tianjin', '300000', '48075'),
(102, 'LT Supplies', 'Chongqing', '400000', '44333'),
(103, 'ACME', 'Shanghai', '200000', '90046'),
(104, 'FNK Inc.', 'Taiyuang', '030000', '111111'),
(105, 'Good Set', 'Tianjin', '300000', '222222'),
(106, 'Just Eat', 'Beijing', '010', '4567'),
(107, 'DK Inc', 'Zhengzhou', '450000', '333332');

select * from supplies;
use test;
show tables;

desc fruits;

CREATE TABLE fruits
(
	f_id char(10) not null,
    s_id int(11) not null,
    f_name varchar(15) not null,
    f_price decimal(8,2) not null,
    primary key(f_id)
    );
    

CREATE TABLE supplies
(
	s_id int NOT NULL AUTO_INCREMENT,
    s_name char(50) not null,
    s_city char(50) null,
    s_zip char(10) null,
    s_call char(50) not null,
    primary key (s_id)
    );
    
    
SELECT s.s_name, COUNT(s_name) AS num FROM supplies s INNER JOIN fruits f ON s.s_id = f.s_id GROUP BY s_name ORDER BY num;
