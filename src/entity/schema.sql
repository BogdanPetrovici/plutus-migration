drop table Transaction_Tags
drop table Tags
drop table Transactions
drop table Users

create table Users(
	id varchar(36) not null,
	createdAt datetimeoffset not null,
	updatedAt datetimeoffset not null,
	constraint PK_Users PRIMARY KEY nonclustered (id)
)

insert into Users (id, createdAt, updatedAt) values ('e43f0893-0bb7-4bcf-827f-c77f2b5f723f', getdate(), getdate())

create table Transactions(
	id int not null identity(1,1),
	amount float not null,
	date date not null,
	payee varchar(50) not null,
	note text,
	userId varchar(36) not null,
	createdAt datetimeoffset not null,
	updatedAt datetimeoffset not null,
	constraint PK_Transactions PRIMARY KEY nonclustered (id),
	constraint FK_Transactions_Users FOREIGN KEY (userId)
	references Users (id)
)

create table Tags(
	id int not null identity(1, 1),
	name varchar(50) not null,
	userId varchar(36) not null,
	createdAt datetimeoffset not null,
	updatedAt datetimeoffset not null,
	constraint PK_Tags Primary Key nonclustered (id),
	constraint FK_Tags_Users FOREIGN KEY (userId)
	references Users (id)
)

create table Transaction_Tags(
	id int not null identity(1, 1),
	tagId int not null,
	transactionId int not null,
	createdAt datetimeoffset not null,
	updatedAt datetimeoffset not null,
	constraint PK_Transaction_Tags primary key nonclustered (id),
	constraint FK_Transactions_Tags FOREIGN KEY (tagId)
	references Tags (id),
	constraint FK_Tags_Transactions FOREIGN KEY (transactionId)
	references Transactions (id)
)