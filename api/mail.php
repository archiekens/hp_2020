<?php

    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require 'PHPMailer/src/Exception.php';
    require 'PHPMailer/src/PHPMailer.php';
    require 'PHPMailer/src/SMTP.php';

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $response = [
            'success' => false,
            'message' => 'Mail was not sent',
            'errors' => []
        ];
    
        $isValidInputs = false;
        
        $validation = validateInputs($_POST);

		if ($validation['isValid'] === true) {
            $name = sanitizeInput($_POST['name']);
            $email = sanitizeInput($_POST['email']);
            $message = sanitizeInput($_POST['message']);

            $mail = new PHPMailer(true);

            try {
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'INSERT EMAIL HERE';
                $mail->Password   = 'INSERT PASSWORD HERE';
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = 587;

                $mail->setFrom('iamarnoldcf@gmail.com', 'I am Arnold');
                $mail->addAddress('fernandoarnoldchristopher@gmail.com');

                $mail->isHTML(true);
                $mail->Subject = "Contact Request From $name";
                $mail->Body    =
                    "<h2>Contact Request</h2>
                    <h4>Name</h4><p>$name</p>
                    <h4>Email</h4><p>$email</p>
                    <h4>Message</h4><p>$message</p>";

                $mail->send();

                $response['success'] = true;
                $response['message'] = 'Mail has been sent.';

                http_response_code(200);
            } catch (Exception $e) {
                echo $e->getMessage();
                http_response_code(500);
            }
		} else {
            $response['errors'] = $validation['errors'];
            http_response_code($validation['responseCode']);
        }
        
        echo json_encode($response);
    }
    
    function validateInputs($data) {
        $result = [
            'isValid' => true,
            'errors' => [
                'name' => '',
                'email' => '',
                'message' => ''
            ],
            'responseCode' => 200
        ];

        $fields = [
            'name',
            'email',
            'message'
        ];

        foreach ($fields as $field) {
            if (!isset($data[$field])) {
                $result['responseCode'] = 400;
                break;
            }
            if (empty($data[$field])) {
                $result['errors'][$field] = ucfirst($field) . ' is required.';
            }
        }

        if ($result['responseCode'] == 400) return $result;

        if (!empty($data['name']) && !preg_match("/[A-Za-z .]/", $data['name'])) {
            $result['errors']['name'] = 'Please use letters, spaces, and periods only.';
        }

        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $result['errors']['email'] = 'Please use a valid email address.';
        }

        if (!empty($data['message']) && strlen($data['message']) < 10) {
            $result['errors']['message'] = 'Please use at least 10 characters';
        }

        foreach ($result['errors'] as $field => $errors) {
            if (!empty($errors)) {
                $result['isValid'] = false;
                $result['responseCode'] = 422;
            }
        }

        return $result;
    }

    function sanitizeInput($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);

        return $data;
    }
?>