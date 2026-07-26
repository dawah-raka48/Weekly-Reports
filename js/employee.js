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
const uploadBtn = document.getElementById("uploadBtn");
const uploadText = document.getElementById("uploadText");

uploadBtn.addEventListener("click", uploadReport);

async function uploadReport() {

    if (!pdfFile.files.length) {

        alert("اختر ملف PDF أولاً");

        return;

    }

    uploadBtn.disabled = true;

    uploadText.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        &nbsp;
        جارٍ رفع التقرير...
    `;

    const file = pdfFile.files[0];

    const reader = new FileReader();

    reader.onload = async function () {

        const base64 = reader.result.split(",")[1];

        const result = await api("uploadReport", {

            employeeId: currentUser.id,

            employeeName: currentUser.name,

            department: currentUser.department,

            week: getWeekNumber(new Date()),

            fileName: file.name,

            mimeType: file.type,

            fileData: base64

        });

        if (result.success) {

            uploadText.innerHTML = `
                <i class="fa-solid fa-circle-check"></i>
                تم رفع التقرير
            `;

            setTimeout(() => {

                uploadBtn.disabled = false;

                uploadText.innerHTML = `
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    رفع التقرير
                `;

                pdfFile.value = "";

                selectedFile.innerHTML = "لم يتم اختيار أي ملف";

            }, 2000);

        } else {

            uploadBtn.disabled = false;

            uploadText.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up"></i>
                رفع التقرير
            `;

            alert(result.message);

        }

    };

    reader.readAsDataURL(file);

}
