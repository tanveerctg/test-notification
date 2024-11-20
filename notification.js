// (function () {
//   console.log("Notification script loaded");

//   // Function to display a popup notification
//   function showNotification(message) {
//     const notification = document.createElement("div");
//     notification.style.position = "fixed";
//     notification.style.bottom = "20px";
//     notification.style.right = "20px";
//     notification.style.backgroundColor = "#4CAF50";
//     notification.style.color = "white";
//     notification.style.padding = "15px";
//     notification.style.borderRadius = "5px";
//     notification.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.3)";
//     notification.style.zIndex = "10000";
//     notification.innerText = message;

//     document.body.appendChild(notification);

//     // Auto-remove the notification after 3 seconds
//     setTimeout(() => {
//       notification.remove();
//     }, 3000);
//   }

//   // Fetch notification configuration from your server
//   showNotification("hello");
// })();

(function () {
  const NotificationSystem = {
    container: null,
    queue: [],
    config: {
      position: "bottom-right",
      theme: "light",
      maxNotifications: 5,
    },

    init: function (userConfig = {}) {
      this.config = { ...this.config, ...userConfig };
      this.createContainer();
      this.injectStyles();
    },

    createContainer: function () {
      this.container = document.createElement("div");
      this.container.id = "notification-container";
      this.container.className = `notification-container ${this.config.position} ${this.config.theme}`;
      document.body.appendChild(this.container);
    },

    injectStyles: function () {
      const styles = `
        .notification-container {
          position: fixed;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 400px;
          padding: 12px;
          pointer-events: none;
        }
        
        .notification-container.top-right {
          top: 0;
          right: 0;
        }
        
        .notification-container.top-left {
          top: 0;
          left: 0;
        }
        
        .notification-container.bottom-right {
          bottom: 0;
          right: 0;
        }
        
        .notification-container.bottom-left {
          bottom: 0;
          left: 0;
        }
        
        .notification {
          padding: 12px 24px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: translateX(100%);
          animation: slideIn 0.3s ease forwards;
          pointer-events: auto;
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .notification.light {
          background: white;
          color: #1a1a1a;
        }
        
        .notification.dark {
          background: #1a1a1a;
          color: white;
        }
        
        .notification.success {
          border-left: 4px solid #22c55e;
        }
        
        .notification.error {
          border-left: 4px solid #ef4444;
        }
        
        .notification.info {
          border-left: 4px solid #3b82f6;
        }
        
        .notification-close {
          position: absolute;
          top: 8px;
          right: 8px;
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
        }
        
        .notification-icon {
          width: 20px;
          height: 20px;
        }
        
        .notification.success .notification-icon {
          color: #22c55e;
        }
        
        .notification.error .notification-icon {
          color: #ef4444;
        }
        
        .notification.info .notification-icon {
          color: #3b82f6;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100%);
          }
        }
        
        .notification.removing {
          animation: slideOut 0.3s ease forwards;
        }
      `;

      const styleSheet = document.createElement("style");
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    },

    createNotification: function (message, type = "info") {
      const notification = document.createElement("div");
      notification.className = `notification ${type} ${this.config.theme}`;

      // Icon based on type
      const icon = document.createElement("span");
      icon.className = "notification-icon";
      icon.innerHTML = this.getIconSvg(type);

      const content = document.createElement("span");
      content.textContent = message;

      const closeButton = document.createElement("button");
      closeButton.className = "notification-close";
      closeButton.innerHTML = "×";
      closeButton.onclick = () => this.removeNotification(notification);

      notification.appendChild(icon);
      notification.appendChild(content);
      notification.appendChild(closeButton);

      return notification;
    },

    getIconSvg: function (type) {
      const icons = {
        success:
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
        error:
          '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
        info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 16v-4m0-4h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"/></svg>',
      };
      return icons[type] || icons.info;
    },

    removeNotification: function (notification) {
      notification.classList.add("removing");
      setTimeout(() => {
        if (notification.parentElement === this.container) {
          this.container.removeChild(notification);
        }
      }, 300);
    },

    showNotification: function (message, type = "info") {
      if (!this.container) {
        console.error("Notification system not initialized");
        return;
      }

      const notification = this.createNotification(message, type);

      // Manage notification queue
      if (this.container.children.length >= this.config.maxNotifications) {
        this.removeNotification(this.container.firstChild);
      }

      this.container.appendChild(notification);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        this.removeNotification(notification);
      }, 3000);
    },
  };

  // Expose to window
  window.NotificationWidget = {
    init: function (config) {
      NotificationSystem.init(config);
    },
    showNotification: function (message, type) {
      NotificationSystem.showNotification(message, type);
    },
  };
})();

let isFirstTriggered = false;
window.NotificationWidget.init({
  position: "bottom-left",
  theme: "light",
  maxNotifications: 10,
});

const showSuccessNotification = () => {
  window.NotificationWidget.showNotification(
    "Operation completed successfully!",
    "success"
  );
};

setTimeout(() => {
  showSuccessNotification();
}, 1000);

setInterval(() => {
  showSuccessNotification();
}, 6000);
