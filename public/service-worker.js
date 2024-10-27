self.addEventListener("push", (event) => {
  const data = event.data.json();

  const options = {
    body: data.message,
    icon: "/icon.png",
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
