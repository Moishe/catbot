create table user_data (
       id varchar(9) not null,
       data_key varchar(64) not null,
       data_value varchar(4096)
       ,
       primary key (id, data_key)
) engine=InnoDB;