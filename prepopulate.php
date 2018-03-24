<?php
    include 'dbconfig.php';

    $con = mysqli_connect($HostName,$HostUser,$HostPass,$DatabaseName);

  // Getting the received JSON into $json variable.
    $json = file_get_contents('php://input');

	// decoding the received JSON and store into $obj variable.
	$obj = json_decode($json,true);
	
	$email = $obj['email'];

    $success = "success";
    $failed = "failed";
    
    // Get current credentials
    if ($email != "") {
        $getCredentialsQuery = "SELECT * FROM User WHERE email = '$email'";
    
        $credentials = mysqli_query($con,$getCredentialsQuery);
        $credentialsRow = mysqli_fetch_array($credentials, MYSQLI_ASSOC);

        // Set variable values from the returned row
        $firstName = $credentialsRow['firstName'];
        $lastName = $credentialsRow['lastName'];
        $email = $credentialsRow['email'];
        $phoneNumber = $credentialsRow['phoneNumber'];
        $password = $credentialsRow['password'];

        $myObj->firstName = $firstName;
        $myObj->lastName = $lastName;
        $myObj->email = $email;
        $myObj->phoneNumber = $phoneNumber;
        $myObj->password = $password;

        $myJSON = json_encode($myObj);

        echo $myJSON;

    } else {
        echo json_encode("Error. Did not receive a user email.");
    }
?>
