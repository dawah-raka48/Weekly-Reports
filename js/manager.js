/* ==========================================
   Weekly Reports System
   Department Manager
========================================== */

/* ==========================
   Current User
========================== */

const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

/* ==========================
   Protection
========================== */

if (!currentUser) {

    location.href = "index.html";

}

if (currentUser.role !== "manager") {

    location.href = "index.html";

}

/* ==========================
   Elements
========================== */

const content =
document.getElementById("content");

const departmentName =
document.getElementById("departmentName");

const logoutBtn =
document.getElementById("logoutBtn");

/* ==========================
   Department
========================== */

departmentName.innerHTML =

`قسم ${currentUser.department}`;

/* ==========================
   Clock
========================== */

function updateClock(){

    const now = new Date();

    document.getElementById("currentTime").innerHTML =

        now.toLocaleTimeString("ar-SA",{

            hour:"2-digit",

            minute:"2-digit"

        });

    document.getElementById("currentDate").innerHTML =

        now.toLocaleDateString("ar-SA");

}

updateClock();

setInterval(updateClock,1000);

/* ==========================
   Logout
========================== */

logoutBtn.onclick=()=>{

    if(confirm("هل تريد تسجيل الخروج؟")){

        localStorage.removeItem("currentUser");

        location.href="index.html";

    }

};

/* ==========================
   Menu
========================== */

const menuCards =

document.querySelectorAll(".menu-card");

menuCards.forEach(card=>{

    card.addEventListener("click",()=>{

        menuCards.forEach(item=>{

            item.classList.remove("active");

        });

        card.classList.add("active");

        loadPage(card.dataset.page);

    });

});

/* ==========================
   Load Pages
========================== */

function loadPage(page){

    switch(page){

        case "employees":

            employeesPage();

            break;

        case "reports":

            reportsPage();

            break;

    }

}

/* ==========================
   Default Page
========================== */

employeesPage();
