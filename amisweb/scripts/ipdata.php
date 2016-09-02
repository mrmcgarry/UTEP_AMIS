<?php
	
	// Turn on PHP error reporting
	ini_set('display_errors', 'On');
	error_reporting(E_ALL | E_STRICT);
	
//    echo "Connect to MySQL<br>";
    // Create connection to MySQL server
	$servername = "129.108.156.59:3306";
	$username = "amis";
	$password = "amis0415";
	$dbname = "ipdata";
	
	class ipData
	{
		public $orgname = "";
		public $asnum = 0;
		public $latitude = 0.0;
		public $longitude = 0.0;
		public $city = "";
		public $region = "";
		public $country = "";
		public $continent = "";
	}

	// Create connection
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	if (!$conn)
	{
    	die("Connection failed: " . mysqli_connect_error());
	}
	
//	echo "Issue query<br>";
	// Obtain IP address argument from URL
	$ipdotdec = $_GET['ip'];
	// Convert to 32-bit integer from dotted decimal
	$ipnums = explode('.',$ipdotdec);
	if(count($ipnums) == 4)
	{
		$ipaddr = $ipnums[0]*16777216 + $ipnums[1]*65536 + $ipnums[2]*256 + $ipnums[3];
		// Build query strings
		$sql1 = "SELECT * FROM asnum WHERE (startIP <= " . $ipaddr . ") AND (endIP >= " . $ipaddr .")";
		$sql2 = "SELECT * FROM iploc WHERE (startIP <= " . $ipaddr . ") AND (endIP >= " . $ipaddr .")";
//		echo $sql1. "<br>";
//		echo $sql2. "<br>";
		//Issue query
		$result1 = mysqli_query($conn, $sql1);
		$result2 = mysqli_query($conn, $sql2);
		
		if(mysqli_num_rows($result1) > 0) 
		{
			$asnumData = mysqli_fetch_assoc($result1);
			$asNum = $asnumData["asNum"];
			$organization = $asnumData["organization"];
		}
		else
		{
			$asNum = "?";
			$organization = "?";
		}
		
		if(mysqli_num_rows($result2) > 0)
		{
			$iplocData = mysqli_fetch_assoc($result2);
			$latitude = $iplocData["latitude"];
			$longitude = $iplocData["longitude"];
			$city = $iplocData["city"];
			$region = $iplocData["region"];
			$country = $iplocData["country"];
			$continent = $iplocData["continent"];
		}
		else
		{
			$latitude = "?";
			$longitude = "?";
			$city = "?";
			$region = "?";
			$country = "?";
			$continent = "?";
		}
//		echo "<br>Query results<br>";
//		echo $organization . "(AS# " . $asNum . ") [lat = " . $latitude . ", long = " . $longitude . "]" . $city . ", " . $region . ", " . $country . ", " . $continent . "<br>";
		$ipdata = new ipData();
		$ipdata->orgname = $organization;
		$ipdata->asnum = $asNum;
		$ipdata->latitude = $latitude;
		$ipdata->longitude = $longitude;
		$ipdata->city = $city;
		$ipdata->region = $region;
		$ipdata->country = $country;
		$ipdata->continent = $continent;
		
		print json_encode($ipdata);
		mysqli_close($conn);
				
	}
	else
	{
		print "Malformed dotted decimal IP address";
	}
	
?>