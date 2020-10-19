<?php

	$executionStartTime = microtime(true);

	include("../config.php");

	// setup authentication
	include("../secret.php");
    require "../../../vendor/autoload.php";
    use \Firebase\JWT\JWT;
	$secret_key = $secret;
	$jwt = null;

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	if (!isset($_SERVER['HTTP_AUTHORIZATION'])){
		
		$output['status']['code'] = "401";
		$output['status']['name'] = "Unauthorized";
		$output['status']['description'] = "Missing Token";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;
	}

	$authHeader = $_SERVER['HTTP_AUTHORIZATION'];
	$arr = explode(" ", $authHeader);
	$jwt = $arr[1];

	if($jwt){
		try {
			$decoded = JWT::decode($jwt, $secret_key, array('HS256'));
	
			// Access is granted.
	
		}catch (Exception $e){
	
			$output['status']['code'] = "401";
			$output['status']['name'] = "Unauthorized";
			$output['status']['description'] = $e->getMessage();	
			$output['data'] = [];

			mysqli_close($conn);

			echo json_encode($output); 

			exit;
		}
	}

	$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}
   
   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>