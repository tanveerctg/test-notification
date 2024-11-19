(function () {
  console.log("Notification script loaded");

  // Dynamically load the Toastr library
  function loadToastrLibrary() {
    const toastrScript = document.createElement("script");
    toastrScript.src =
      "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js";
    toastrScript.onload = function () {
      console.log("Toastr library loaded!");
      // After loading the script, load the CSS for Toastr
      const toastrCSS = document.createElement("link");
      toastrCSS.rel = "stylesheet";
      toastrCSS.href =
        "https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css";
      document.head.appendChild(toastrCSS);
    };
    document.head.appendChild(toastrScript);
  }

  // Call the function to load Toastr
  loadToastrLibrary();

  // Expose a global function to show Toastr notification
  window.showNotification = function (message) {
    if (typeof toastr !== "undefined") {
      toastr.success(message, "Notification", {
        positionClass: "toast-top-right", // Position of the toast
        timeOut: 3000, // Time before auto-close
      });
    } else {
      console.log("Toastr library is not loaded yet.");
    }
  };
  showNotification("HELLO WORLDDD!!");
})();
