<?php

// Please put your PHP code here
//
// You can use entered e-mail variable as $_POST['subscription']

$to      = 'YOUR_EMAIL';
$subject = 'YOUR_SUBJECT';
$message = 'Email: '.$_POST['subscription'];

mail($to, $subject, $message);

?>