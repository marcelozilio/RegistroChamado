
create table usuarios (
	idusuario int auto_increment,
	login varchar (30),
	senha varchar (15),
	primary key (idusuario)
);

create table chamados (
	idchamado int auto_increment,
	fk_idusuario int,
	cliente varchar(60),
	nomepesat varchar(60),
	data varchar(10),
	hora varchar(5),
	sistema varchar(60),
	problema varchar(500),
	solucao varchar(500),
	primary key (idchamado),
	foreign key (fk_idusuario) references as usuarios (idusuario)
);


