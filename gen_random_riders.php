<?php
  include 'dbconfig.php';

  $con = mysqli_connect($HostName, $HostUser, $HostPass, $DatabaseName);

    for ($x = 0; %x < 50; $x++) {
        echo getRandomLat;
        echo getRandomLong;
    }

//  $sql =

  function getRandomLong() {
    return getRandomNum(39908531, 40003444) / 6;
  }

  function getRandomLat() {
    return getRandomNum(75142834, 75217718) / 6;
  }

  function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

 ?>
