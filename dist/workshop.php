<?php
  
  error_reporting(0);
  
  $res = array();

  $name = $_POST['name'];
  $mail = $_POST['mail'];
  $phone = $_POST['phone'];
  $address = $_POST['city'];
  $check = $_POST['check'];

  if (empty($name) || empty($mail) || empty($phone) || empty($address) || empty($check)) {
    $res['status'] = 1;
    $res['header'] = 'Błąd, spróbuj ponownie';
    $res['content'] = 'Proszę uzupełnić wszystkie pola formularza.';
  } else {
    require_once 'podio-php/PodioAPI.php';

    define('CLIENT_ID', 'polish-boogie-festival');
    define('CLIENT_SECRET', '5vypsd99KEoetjKjJLZZkUTmhoRi4o2dXNzx9ZhvolRB1ITUaW955BDldaqUwAFZ');

    define('APP_ID', '4525490');
    define('APP_TOKEN', '1335ba625218484f80a0103ac4a7064a');

    Podio::setup(CLIENT_ID, CLIENT_SECRET);

    try {
      Podio::authenticate('app', array('app_id' => APP_ID, 'app_token' => APP_TOKEN));
      
      // Authentication was a success, now you can start making API calls.
      
      $item = PodioItem::create(APP_ID, array('fields' => array(
        'imie' => $name,
        'adres-e-mail' => $mail,
        'telefon' => $phone,
        'miejscowosc' => $address
      )));

      if ($item > 0) {
        $res['status'] = 0;
        $res['header'] = 'Dziękujemy!';
        $res['content'] = 'Twoje zgłoszenie zostało zapisane.';
      } else {
        $res['status'] = 2;
        $res['header'] = 'Błąd';
        $res['content'] = 'Coś poszło nie tak, spróbuj ponownie.';
      }
    }
    catch (PodioError $e) {
      $res['status'] = 3;
      $res['header'] = 'Wystąpił błąd!';
      $res['content'] = $e->body['error_description'];
    }
  }

  echo json_encode($res);
?>