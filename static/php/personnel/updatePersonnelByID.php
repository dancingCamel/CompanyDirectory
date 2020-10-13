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

	if (!isset($_REQUEST['id']) || !isset($_REQUEST['firstName']) || !isset($_REQUEST['lastName']) || !isset($_REQUEST['jobTitle']) || !isset($_REQUEST['email']) || !isset($_REQUEST['departmentID'])){
		
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "bad request";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;
	}

	$id = (int)$conn -> real_escape_string($_REQUEST['id']);
	$firstName = $conn -> real_escape_string($_REQUEST['firstName']);
	$lastName = $conn -> real_escape_string($_REQUEST['lastName']);
	$jobTitle = $conn -> real_escape_string($_REQUEST['jobTitle']);
	$email = $conn -> real_escape_string($_REQUEST['email']);
	$deptID = (int)$conn -> real_escape_string($_REQUEST['departmentID']);


	$query = "UPDATE personnel SET firstName = \"$firstName\", lastName = \"$lastName\", jobTitle = \"$jobTitle\", email = \"$email\", departmentID = \"$deptID\" WHERE id = $id";

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

	$query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.id = $id";

	$result = $conn->query($query);

	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['affected'] = $affected;
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>