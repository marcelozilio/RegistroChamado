<?php
	header('Access-Control-Allow-Origin: *');
	require '../Slim/Slim.php';

	\Slim\Slim::registerAutoloader();
	$app = new \Slim\Slim();
	$app->response()->header('Content-Type', 'application/json;charset=utf-8');

	$conexao = null;

	/*Método responsável pela conexão com o banco*/
	function getConn() {
		$conexao = new PDO('mysql:dbname=registrochamado;host=localhost',
		'root',
		'',
		array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
		);
		return $conexao;
	}

	$app->get('/getChamados', function(){
		$stat = getConn()->query("select * from chamados");
		$array = array();
		$array = $stat->fetchAll(PDO::FETCH_OBJ);
		//encerramento da conexão
		$conexao = null;
		echo json_encode($array);
	});

	$app->get('/getClientes', function(){
		$stat = getConn()->query("select * from clientes");
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
			echo true;						
		} catch (PDOException $e) {
			echo false;
		}
	});

	$app->run();
?>