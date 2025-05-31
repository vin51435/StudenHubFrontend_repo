self.addEventListener('push', function (event) {
  let data = {};
  console.log('[Service Worker] Push Received.', event);

  try {
    data = event.data?.json();
  } catch (e) {
    console.warn('[Service Worker] Non-JSON push payload:', event.data?.text());
    data = { content: event.data?.text() || 'You have a new message.' };
  }

  const notificationTitle = data.senderName
    ? `New Message from ${data.senderName}`
    : 'New Notification';

  const options = {
    body: data.content || 'You have a new message.',
    data: {
      url: data.senderUsername ? `/inbox/?username=${data.senderUsername}` : '/',
    },
    icon: '/icon.png', // optional but recommended
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, options)
  );
});
;

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
