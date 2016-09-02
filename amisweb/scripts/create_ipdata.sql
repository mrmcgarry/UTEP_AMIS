CREATE SCHEMA ipdata;
USE ipdata;

CREATE TABLE asnum (startIP BIGINT, endIP BIGINT, asNum BIGINT, 
organization VARCHAR(100));

LOAD DATA LOCAL INFILE '/Users/mmcgarry/Documents/asnum_sql.csv' INTO TABLE asnum 
COLUMNS TERMINATED BY ',';


CREATE TABLE iploc (startIP BIGINT, endIP BIGINT, latitude DECIMAL(9,6),
longitude DECIMAL(9,6), city VARCHAR(30), region VARCHAR(40), 
country VARCHAR(30), continent VARCHAR(15));

LOAD DATA LOCAL INFILE '/Users/mmcgarry/Documents/iploc_sql.csv' INTO TABLE iploc 
COLUMNS TERMINATED BY ',';

SELECT * FROM asnum WHERE (startIP <= 2171349092) AND (endIP >= 2171349092);

