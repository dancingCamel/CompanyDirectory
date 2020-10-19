<?php 
  // https://www.techiediaries.com/php-jwt-authentication-tutorial/#:~:text=The%20JWT%3A%3Aencode%20%28%29%20method%20will%20transform%20the%20PHP,token%20that%20will%20be%20sent%20to%20the%20client
	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    include("../config.php");
    include("../secret.php");
    require "../../../vendor/autoload.php";
    use \Firebase\JWT\JWT;

    header('Content-Type: application/json; charset=UTF-8');
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


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
    
    if (!isset($_REQUEST['username']) || !isset($_REQUEST['password'])){
		
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "bad request";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;
    }
    
    $username = '"'.$_REQUEST['username'].'"';
    $password = $_REQUEST['password'];

    $query = "SELECT id, username, password FROM user WHERE username = $username LIMIT 1";

    // $stmt = $conn->prepare( $query );

    // $stmt->bind_param('s', $username);
    
    // if(!$stmt->execute()){
    //    echo("Error : $conn->error");
   
    // } else{
    //     echo("Error preparing: $conn->error");
    // }
    
    // $stmt->execute();
    
    // $affected = mysqli_stmt_affected_rows($stmt);
    // $stmt->close();
    
    $result = $conn->query($query);
    $affected = $conn->affected_rows;

    if($affected > 0){
        $row = $row = mysqli_fetch_assoc($result);
        $id = $row['id'];
        $username = $row['username'];
        $password2 = $row['password'];
    
        if(password_verify($password, $password2))
        {
          $secret_key = $secret;
          $issuer_claim = "Bellport"; // this can be the servername
          $audience_claim = "user";
          $issuedat_claim = time(); // issued at
          $notbefore_claim = $issuedat_claim + 5; //not before in seconds
          $expire_claim = $issuedat_claim + 14400; // expire time in seconds - 4 hours
          $token = array(
              "iss" => $issuer_claim,
              "aud" => $audience_claim,
              "iat" => $issuedat_claim,
              "nbf" => $notbefore_claim,
              "exp" => $expire_claim,
              "data" => array(
                  "id" => $id,
                  "username" => $username,
          ));
  
          mysqli_close($conn);

          $jwt = JWT::encode($token, $secret_key);

          $output['status']['code'] = "200";
          $output['status']['name'] = "ok";
          $output['status']['description'] = "success";
          $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
          $output['data']['message'] = "Successful login.";
          $output['data']['jwt'] = $jwt;
          $output['data']['username'] = $username;
          $output['data']['expireAt'] = $expire_claim;
          echo json_encode($output); 
        }

        else{
          mysqli_close($conn);

          $output['status']['code'] = "401";
          $output['status']['name'] = "failed";
          $output['status']['description'] = "Unauthorized";
          $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
          $output['data'] = [];
          echo json_encode($output); 
        }

    } else {
      mysqli_close($conn);

          $output['status']['code'] = "400";
          $output['status']['name'] = "executed";
          $output['status']['description'] = "Unauthorized";
          $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
          $output['data'] = [];
          echo json_encode($output); 
    }

?>