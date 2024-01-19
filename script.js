document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loading-screen").style.display = "none";

    setTimeout(function() {
        document.querySelector("header").classList.remove("hidden");
    }, 100);
    setTimeout(function() {
        document.querySelector("section").classList.remove("hidden");
    }, 300);
});
