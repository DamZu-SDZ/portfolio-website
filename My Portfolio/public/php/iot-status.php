// iot-status.php
<?php
// Sambungan ke MySQL XAMPP anda
$conn = mysqli_connect("localhost", "root", "", "smart_locker");

$sql = "SELECT last_update FROM device_status WHERE device_id = 'ESP32_01'";
$result = mysqli_query($conn, $sql);
$data = mysqli_fetch_assoc($result);

$last_seen = strtotime($data['last_update']);
$current_time = time();

if (($current_time - $last_seen) < 120) {
    echo '<span class="badge bg-success">Device Online</span>';
} else {
    echo '<span class="badge bg-danger">Device Offline</span>';
}
?>