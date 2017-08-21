<?php
	header('Access-Control-Allow-Origin: *');
	require '../Slim/Slim.php';

	\Slim\Slim::registerAutoloader();
	$app = new \Slim\Slim();
	$app->response()->header('Content-Type', 'application/json');

	$conexao = null;

	/*
		Método responsável pela
		conexão com o banco
	*/
	function getConn() {
		$conexao = new PDO('mysql:dbname=registrochamado;host=localhost',
		'root',
		'',
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
		);
		return $conexao;
	}

	/*
		Início
	*/
	$app->get('/', function(){
		header('');
	});

	/*
		Recursos de chamado
	*/
	$app->group('/chamado',function() use ($app){

		$app->get('/get', function(){
			$stat = getConn()->query("select * from chamados");
			$array = array();
			$array = $stat->fetchAll(PDO::FETCH_OBJ);
			//encerramento da conexão
			$conexao = null;
			echo json_encode($array);
		});

		$app->post('/salvar', function() use ($app) {	

			try {
				$request = $app->request();
				$chamado = json_decode($request->getBody());

				$stat = getConn()->prepare("insert into chamados
					(cliente,nomepesat,data,hora,sistema,problema,solucao)
					values(?,?,?,?,?,?,?)");
				$stat->bindValue(1,$chamado->cliente);
				$stat->bindValue(2,$chamado->nomepesat);
				$stat->bindValue(3,$chamado->data);
				$stat->bindValue(4,$chamado->hora);
				$stat->bindValue(5,$chamado->sistema);
				$stat->bindValue(6,$chamado->problema);
				$stat->bindValue(7,$chamado->solucao);					
				$stat->execute();
				//encerramento da conexão
				$conexao = null;
				echo 'true';						
			} catch (PDOException $e) {
				echo 'false';
			}
		});

		$app->post('/alterar', function() use ($app) {
			try {

				$request = $app->request();
				$chamado = json_decode($request->getBody());

				$stat = getConn()->prepare("update chamados set cliente = ?, nomepesat = ?, data = ?, hora = ?, sistema = ?, problema = ?, solucao = ? where idchamado = ?");

				$stat->bindValue(1,$chamado->cliente);
				$stat->bindValue(2,$chamado->nomepesat);
				$stat->bindValue(3,$chamado->data);
				$stat->bindValue(4,$chamado->hora);
				$stat->bindValue(5,$chamado->sistema);
				$stat->bindValue(6,$chamado->problema);
				$stat->bindValue(7,$chamado->solucao);
				$stat->bindValue(8,$chamado->idchamado);

				$stat->execute();
				//encerramento da conexão
				$conexao = null;
				echo 'true';
			} catch (PDOException $e) {
				echo 'false';
			}
		});

		$app->get('/deletar/:id', function($id) {
			try {		

				$stat = getConn()->prepare("delete from chamados where idchamado=?");
				$stat->bindValue(1,$id);			
				$stat->execute();
				//encerramento da conexão
				$conexao = null;
				echo 'true';
			} catch (PDOException $e) {
				echo $e;
			}			
		});

	});

	/*
		Recursos de cliente
	*/
	$app->group('/cliente',function() use ($app){

		$app->get('/get', function(){
			$stat = getConn()->query("select * from clientes ORDER BY nome ASC");
			$array = array();
			$array = $stat->fetchAll(PDO::FETCH_OBJ);
			//encerramento da conexão
			$conexao = null;
			echo json_encode($array);
		});

		$app->post('/salvar', function() use ($app) {
			try {
				$request = $app->request();
				$cliente = json_decode($request->getBody());

				$stat = getConn()->prepare("insert into clientes (nome) values(?)");
				$stat->bindValue(1,$cliente->nome);

				$stat->execute();
				//encerramento da conexão
				$conexao = null;
				echo 'true';
			} catch (PDOException $e) {
				echo "false";
			}
		});

		$app->get('/deletar/:id', function($id) {
			try {		

				$stat = getConn()->prepare("delete from clientes where idcliente=?");
				$stat->bindValue(1,$id);			
				$stat->execute();
				//encerramento da conexão
				$conexao = null;
				echo 'true';
			} catch (PDOException $e) {
				echo $e;
			}			
		});
	});

	/*
		Recursos de usuário
	*/
	$app->group('/usuario',function() use ($app){

		$app->get('/login/:login/:senha', function($login, $senha) {			
			$stat = getConn()->query("select * from usuarios where binary login='$login' and senha='$senha'");
			$array = array();
			$array = $stat->fetchAll(PDO::FETCH_OBJ);
			//encerramento da conexão
			$conexao = null;

			if (count($array) > 0) {
				echo json_encode($array);
			} else {
				echo 'null';
			}
		});

		$app->post('/alterar', function() use ($app) {
			try {

				$request = $app->request();
				$usuario = json_decode($request->getBody());

				$stat = getConn()->prepare("update usuarios set senha = ? where idusuario = ?");

				$stat->bindValue(1,$usuario->senha);
				$stat->bindValue(2,$usuario->idusuario);
				
				$stat->execute();
				//encerramento da conexão
				$conexao = null;
				echo 'true';
			} catch (PDOException $e) {
				echo 'false';
			}
		});
	});

	$app->run();
?>