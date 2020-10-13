<?php
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("../config.php");

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

	// $_REQUEST used for development / debugging. Remember to cange to $_POST for production

	if (!isset($_REQUEST['name'])|| !isset($_REQUEST['locationID']) || !isset($_REQUEST['id'])){
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "bad request";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;
	}

	$id = (int)$conn -> real_escape_string($_REQUEST['id']);
	$name = $conn -> real_escape_string($_REQUEST['name']);
	$locID = (int)$conn -> real_escape_string($_REQUEST['locationID']);
	

	$query = "UPDATE department SET name = \"$name\", locationID = $locID WHERE id = $id";

	$result = $conn->query($query);
	$affected = $conn->affected_rows;
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

    if ($affected === 0) {

		$output['status']['code'] = "404";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "ID not found";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$query = "SELECT d.id, d.name, d.locationID, l.name AS location FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id = $id";

	$result = $conn->query($query);

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