(function () {
  console.log("Notification script loaded");

  // Function to display a popup notification
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#4CAF50";
    notification.style.color = "white";
    notification.style.padding = "15px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
    notification.style.zIndex = "10000";
    notification.innerText = message;

    document.body.appendChild(notification);

    // Auto-remove the notification after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // Fetch notification configuration from your server
  showNotification("hello");
})();
