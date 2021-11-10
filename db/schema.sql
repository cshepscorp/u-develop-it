DROP TABLE IF EXISTS voters;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;

CREATE TABLE parties (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);
-- comment 

CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

-- In SQL, a DATETIME field's value will look something like 2020-01-01 13:00:00
CREATE TABLE voters (
    id INTEGER AUTO_INCREMENT PRIMARY Key,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    email VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- we're specifying CURRENT_TIMESTAMP as the value for DEFAULT
);
-- return the current date and time in the same 2020-01-01 13:00:00 format. Note that the time will be based on what time it is according to your server, not the client's machine