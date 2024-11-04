self.addEventListener('push', function (event) {
  // Parse the incoming data from the push event
  const data = event.data ? event.data.json() : {};

  // Use `senderName` and `type` to create a dynamic title
  const notificationTitle = data.senderName
    ? `New Message from ${data.senderName}`
    : 'New Notification';

  // Set up options for the notification, including body content
  const options = {
    body: data.content || 'You have a new message.',
    data: { url: data.senderUsername ? `/inbox/?username=${data.senderUsername}` : '/' }, // Navigate to chat on click
    // Add icons or badge here if available
    // icon: '/path/to/icon.png',
    // badge: '/path/to/badge.png',
  };

  // Display the notification
  event.waitUntil(
    self.registration.showNotification(notificationTitle, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
