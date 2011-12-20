<?php

$matchTerm = $_GET['matchTerm'];
$countries = array();
$file = fopen('countries.csv', 'r');
$header = fgetcsv($file);
while (($country = fgetcsv($file)) !== false) {
    if (stripos($country[1], $matchTerm) !== false) {
        $countries[] = array(
            'value'    => $country[10],
            'label'    => $country[1],
            'pinned'   => false,
            'required' => false
        );
    }
}
fclose($file);

header('Content-type: application/javascript');
echo json_encode($countries);
