/* ==========================================
   Weekly Reports System
   Employee Page
========================================== */

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

/* ==========================
   Protection
========================== */

if (!currentUser) {

    location.href = "index.html";

}

if (currentUser.role !== "employee") {

    location.href = "index.html";

}

/* ==========================
   Employee Info
========================== */

document.getElementById("employeeName").textContent =
    currentUser.name;

document.getElementById("employeeDepartment").textContent =
    currentUser.department;

/* ==========================
   Date
========================== */

const today = new Date();

document.getElementById("todayDate").textContent =
    today.toLocaleDateString("ar-SA");

/* ==========================
   Week Number
========================== */

function getWeekNumber(date) {

    const firstDay = new Date(date.getFullYear(),0,1);

    const days = Math.floor(

        (date-firstDay) / 86400000

    );

    return Math.ceil(

        (days + firstDay.getDay() + 1) / 7

    );

}

document.getElementById("weekNumber").textContent =
"الأسبوع " + getWeekNumber(today);
