<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload) {
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function smtp_expect($socket, array $expected): void {
    $response = '';
    while (($line = fgets($socket, 512)) !== false) {
        $response .= $line;
        if (strlen($line) < 4 || $line[3] === ' ') break;
    }
    $code = (int)substr($response, 0, 3);
    if (!in_array($code, $expected, true)) throw new RuntimeException('smtp_' . $code);
}

function smtp_command($socket, string $command, array $expected): void {
    fwrite($socket, $command . "\r\n");
    smtp_expect($socket, $expected);
}

function smtp_send(string $host, int $port, string $username, string $password, string $encryption, string $from, string $to, string $replyTo, string $subject, string $body, int $timeout): void {
    $transport = strtolower($encryption) === 'ssl' ? 'ssl://' : 'tcp://';
    $context = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'allow_self_signed' => false]]);
    $socket = stream_socket_client($transport . $host . ':' . $port, $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
    if (!$socket) throw new RuntimeException('smtp_connect');
    stream_set_timeout($socket, $timeout);
    try {
        smtp_expect($socket, [220]);
        smtp_command($socket, 'EHLO yugandco.com', [250]);
        if (strtolower($encryption) === 'tls') {
            smtp_command($socket, 'STARTTLS', [220]);
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new RuntimeException('smtp_tls');
            smtp_command($socket, 'EHLO yugandco.com', [250]);
        }
        smtp_command($socket, 'AUTH LOGIN', [334]);
        smtp_command($socket, base64_encode($username), [334]);
        smtp_command($socket, base64_encode($password), [235]);
        smtp_command($socket, 'MAIL FROM:<' . $from . '>', [250]);
        smtp_command($socket, 'RCPT TO:<' . $to . '>', [250, 251]);
        smtp_command($socket, 'DATA', [354]);
        $headers = [
            'From: Yug & Co <' . $from . '>',
            'To: <' . $to . '>',
            'Reply-To: <' . $replyTo . '>',
            'Subject: ' . $subject,
            'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
            'Message-ID: <' . bin2hex(random_bytes(12)) . '@yugandco.com>',
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit'
        ];
        $payload = implode("\r\n", $headers) . "\r\n\r\n" . preg_replace('/(^|\r?\n)\./', '$1..', $body) . "\r\n.";
        fwrite($socket, $payload . "\r\n");
        smtp_expect($socket, [250]);
        smtp_command($socket, 'QUIT', [221, 250]);
    } finally {
        fclose($socket);
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') respond(405, ['accepted' => false, 'error' => 'method_not_allowed']);

$raw = file_get_contents('php://input');
$data = json_decode($raw ?: '', true);
if (!is_array($data)) respond(400, ['accepted' => false, 'error' => 'invalid_request']);
if (trim((string)($data['website'] ?? '')) !== '') respond(400, ['accepted' => false, 'error' => 'spam_rejected']);

$clean = static function (string $key, int $max) use ($data): string {
    return mb_substr(trim((string)($data[$key] ?? '')), 0, $max);
};
$name = $clean('name', 120);
$email = $clean('email', 254);
$phone = $clean('phone', 40);
$company = $clean('company', 200);
$service = $clean('service', 120);
$message = $clean('message', 5000);
$budget = $clean('budget', 80);
$timeline = $clean('timeline', 80);
$submissionId = preg_replace('/[^A-Za-z0-9_-]/', '', $clean('submission_id', 100));

$allowedServices = ['Search Engine Optimisation', 'Google Ads', 'Meta Ads', 'Social Media Management', 'Website Design & Development', 'Content & Creative', 'Digital Marketing Strategy', 'Analytics & Conversion Tracking', 'Help me choose'];
if ($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || !in_array($service, $allowedServices, true) || strlen($submissionId) < 16) {
    respond(422, ['accepted' => false, 'error' => 'validation_failed']);
}

$host = trim((string)(getenv('MAIL_HOST') ?: ''));
$port = max(1, (int)(getenv('MAIL_PORT') ?: 587));
$username = trim((string)(getenv('MAIL_USERNAME') ?: ''));
$password = (string)(getenv('MAIL_PASSWORD') ?: '');
$encryption = strtolower(trim((string)(getenv('MAIL_ENCRYPTION') ?: 'tls')));
$recipient = trim((string)(getenv('CONTACT_TO_EMAIL') ?: ''));
$sender = trim((string)(getenv('CONTACT_FROM_EMAIL') ?: ''));
$timeout = max(5, (int)(getenv('MAIL_TIMEOUT') ?: 15));
if ($host === '' || $username === '' || $password === '' || !in_array($encryption, ['tls', 'ssl', 'none'], true) || !filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($sender, FILTER_VALIDATE_EMAIL)) {
    respond(503, ['accepted' => false, 'error' => 'delivery_not_configured']);
}

$storage = sys_get_temp_dir() . '/yug-co-contact';
if (!is_dir($storage) && !@mkdir($storage, 0700, true) && !is_dir($storage)) respond(503, ['accepted' => false, 'error' => 'storage_unavailable']);
$lock = fopen($storage . '/rate-' . hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown')) . '.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX)) respond(503, ['accepted' => false, 'error' => 'storage_unavailable']);

$now = time();
$dedupeFile = $storage . '/submission-' . hash('sha256', $submissionId) . '.json';
if (is_file($dedupeFile)) {
    $record = json_decode((string)file_get_contents($dedupeFile), true) ?: [];
    if (($record['created'] ?? 0) > $now - 86400) respond(200, ['accepted' => true, 'duplicate' => true]);
    @unlink($dedupeFile);
}

$rateFile = $storage . '/rate-' . hash('sha256', (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown')) . '.json';
$hits = is_file($rateFile) ? (json_decode((string)file_get_contents($rateFile), true) ?: []) : [];
$hits = array_values(array_filter($hits, static fn($timestamp) => is_int($timestamp) && $timestamp > $now - 3600));
$limit = max(1, (int)(getenv('CONTACT_RATE_LIMIT') ?: 5));
if (count($hits) >= $limit) respond(429, ['accepted' => false, 'error' => 'rate_limited']);

$subject = 'Yug & Co project enquiry: ' . $service;
$body = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nCompany / website: {$company}\nService: {$service}\nBudget: {$budget}\nTiming: {$timeline}\n\nProject details:\n{$message}\n";
try {
    smtp_send($host, $port, $username, $password, $encryption, $sender, $recipient, $email, $subject, $body, $timeout);
} catch (Throwable $error) {
    // Delivery failures do not write a rate hit or submission record, so a legitimate retry remains possible.
    respond(502, ['accepted' => false, 'error' => 'delivery_failed']);
}

$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);
@file_put_contents($dedupeFile, json_encode(['created' => $now]), LOCK_EX);
respond(200, ['accepted' => true]);
