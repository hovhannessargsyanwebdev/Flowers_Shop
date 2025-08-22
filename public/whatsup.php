<!-- <?php
$phone = '37498923325'; 
$rawWhatsappNumber = '79001234567';
$whatsapp = preg_replace('/[^0-9]/', '', $rawWhatsappNumber);
// $whatsapp = '79001234567'; 
$whatsappMessage = 'Здравствуйте, у меня вопрос по вашим услугам.';
var_dump($whatsappMessage);
$telegram = 'your_telegram_username';
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Контакты</title>
</head>
<body>
    <div id="root"></div>

    <script>
      window.appConfig = {
        phone: <?php echo json_encode($phone); ?>,
        whatsapp: <?php echo json_encode($whatsapp); ?>,
        whatsappMessage: <?php echo json_encode($whatsappMessage); ?>,
        telegram: <?php echo json_encode($telegram); ?>
      };
    </script>
    </body>
</html> -->