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

/* ==========================
   File Picker
========================== */

const pdfFile =
document.getElementById("pdfFile");

const selectedFile =
document.getElementById("selectedFile");

pdfFile.addEventListener(

    "change",

    ()=>{

        if(!pdfFile.files.length){

            selectedFile.innerHTML=

            "لم يتم اختيار أي ملف";

            return;

        }

        const file=pdfFile.files[0];

        if(file.type!=="application/pdf"){

            alert("يسمح فقط بملفات PDF");

            pdfFile.value="";

            selectedFile.innerHTML=

            "لم يتم اختيار أي ملف";

            return;

        }

        selectedFile.innerHTML=

        file.name+

        "<br>"+

        (file.size/1024/1024).toFixed(2)+

        " MB";

    }

);
