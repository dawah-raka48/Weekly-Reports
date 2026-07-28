/* ==========================================
   Weekly Reports System
   Employee Page
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

if (currentUser.role !== "employee") {

    location.href = "index.html";

}

/* ==========================
   Elements
========================== */

const employeeName =
document.getElementById("employeeName");

const employeeDepartment =
document.getElementById("employeeDepartment");

const todayDate =
document.getElementById("todayDate");

const weekNumber =
document.getElementById("weekNumber");

const pdfFile =
document.getElementById("pdfFile");

const selectedFile =
document.getElementById("selectedFile");

const uploadBtn =
document.getElementById("uploadBtn");

const uploadText =
document.getElementById("uploadText");

const reportsTable =
document.getElementById("reportsTable");

const uploadNotice =
document.getElementById("uploadNotice");

const logoutBtn =
document.getElementById("logoutBtn");

/* ==========================
   Employee Information
========================== */

employeeName.textContent =
currentUser.name;

employeeDepartment.textContent =
currentUser.department;

/* ==========================
   Today Date
========================== */

const today = new Date();

todayDate.textContent =
today.toLocaleDateString("ar-EG");

/* ==========================
   Week Number
========================== */

function getMonthWeek(date){

    const months = [

        "يناير",
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر"

    ];

    const weekNames = [

        "الأول",
        "الثاني",
        "الثالث",
        "الرابع",
        "الخامس"

    ];

    const week = Math.ceil(date.getDate() / 7);

    return `الأسبوع ${weekNames[week - 1]} - ${months[date.getMonth()]}`;

}
weekNumber.textContent =
getMonthWeek(today);
weekNumber.textContent = getMonthWeek(today);
/* ==========================
   Logout
========================== */

logoutBtn.addEventListener(

    "click",

    ()=>{

        if(

            confirm("هل تريد تسجيل الخروج؟")

        ){

            localStorage.removeItem(

                "currentUser"

            );

            location.href="index.html";

        }

    }

);

/* ==========================
   File Picker
========================== */

pdfFile.addEventListener(

    "change",

    ()=>{

        if(!pdfFile.files.length){

            selectedFile.innerHTML =

            "لم يتم اختيار أي ملف";

            return;

        }

        const file =
        pdfFile.files[0];

        if(

            file.type !==
            "application/pdf"

        ){

            alert(

                "يسمح فقط بملفات PDF"

            );

            pdfFile.value="";

            selectedFile.innerHTML=

            "لم يتم اختيار أي ملف";

            return;

        }

        selectedFile.innerHTML=

            file.name+

            "<br>"+

            (file.size/1024/1024)

            .toFixed(2)+

            " MB";

    }

);
/* ==========================
   Upload Report
========================== */

uploadBtn.addEventListener(

    "click",

    uploadReport

);

async function uploadReport(){

    if(!pdfFile.files.length){

        alert("اختر ملف PDF أولاً");

        return;

    }

    uploadBtn.disabled = true;

    uploadText.innerHTML =

    '<i class="fa-solid fa-spinner fa-spin"></i> جارٍ رفع التقرير...';

    const file = pdfFile.files[0];

    const reader = new FileReader();

    reader.onload = async ()=>{

        const base64 =

        reader.result.split(",")[1];

        const result = await api(

            "uploadReport",

            {

                employeeId:

                currentUser.id,

                employeeName:

                currentUser.name,

                department:

                currentUser.department,

                week:

                getWeekNumber(

                    new Date()

                ),

                fileName:

                file.name,

                mimeType:

                file.type,

                fileData:

                base64

            }

        );

        if(result.success){

            uploadText.innerHTML =

            '<i class="fa-solid fa-circle-check"></i> تم رفع التقرير';

            pdfFile.value="";

            selectedFile.innerHTML=

            "لم يتم اختيار أي ملف";

            loadReports();

        }

        else{

            alert(result.message);

        }

        uploadBtn.disabled=false;

        uploadText.innerHTML=

        '<i class="fa-solid fa-cloud-arrow-up"></i> رفع التقرير';

    };

    reader.readAsDataURL(file);

}

/* ==========================
   Upload Permission
========================== */

checkUploadPermission();

async function checkUploadPermission(){

    const result = await api("getSettings");

    if(!result.success) return;

    const settings = result.settings;

    const dayNames = {

        Sunday:"الأحد",

        Monday:"الإثنين",

        Tuesday:"الثلاثاء",

        Wednesday:"الأربعاء",

        Thursday:"الخميس",

        Friday:"الجمعة",

        Saturday:"السبت"

    };

    function formatTime(time){

        let parts = String(time).split(":");

        let hour = parseInt(parts[0]);

        let minute = parts[1];

        const period = hour >= 12 ? "م" : "ص";

        hour = hour % 12;

        if(hour === 0) hour = 12;

        return `${String(hour).padStart(2,"0")}:${minute} ${period}`;

    }

    const now = new Date();

    const todayName = [

        "Sunday",

        "Monday",

        "Tuesday",

        "Wednesday",

        "Thursday",

        "Friday",

        "Saturday"

    ][now.getDay()];

    const currentTime =

        String(now.getHours()).padStart(2,"0") +

        ":" +

        String(now.getMinutes()).padStart(2,"0");

    const start = String(settings.startTime).substring(0,5);

    const end = String(settings.endTime).substring(0,5);

    const allowed =

        todayName === settings.uploadDay &&

        currentTime >= start &&

        currentTime <= end;

    if(allowed){

        uploadNotice.style.display = "none";

        return;

    }

    uploadBtn.disabled = true;

    uploadBtn.innerHTML =

    '<i class="fa-solid fa-lock"></i> رفع التقارير غير متاح';

    uploadNotice.style.display = "block";

    uploadNotice.innerHTML = `

        <h3>

            <i class="fa-solid fa-lock"></i>

            رفع التقارير مغلق حالياً

        </h3>

        <div class="notice-row">

            <span class="notice-label">

                📅 يوم الرفع

            </span>

            <span class="notice-value">

                ${dayNames[settings.uploadDay]}

            </span>

        </div>

        <div class="notice-row">

            <span class="notice-label">

                🕓 وقت الرفع

            </span>

            <span class="notice-value">

                ${formatTime(start)}

                &nbsp;→&nbsp;

                ${formatTime(end)}

            </span>

        </div>

        <div class="notice-footer">

            سيتم تفعيل رفع التقارير تلقائياً عند بداية الموعد المحدد.

        </div>

    `;

}
/* ==========================
   Previous Reports
========================== */

loadReports();

async function loadReports(){

    const result = await api(

        "getReports",

        {

            employeeId:

            currentUser.id

        }

    );

    if(!result.success){

        reportsTable.innerHTML=

        '<div class="empty">تعذر تحميل التقارير</div>';

        return;

    }

    if(result.reports.length===0){

        reportsTable.innerHTML=

        '<div class="empty">لا توجد تقارير حتى الآن</div>';

        return;

    }

    let html="";

    result.reports.forEach(report=>{

        const date = new Date(report.uploadDate);

        const reportDate =

        date.toLocaleString(

            "ar-EG",

            {

                year:"numeric",

                month:"2-digit",

                day:"2-digit",

                hour:"2-digit",

                minute:"2-digit",

                hour12:true

            }

        );

        html+=`

        <div class="report-item">

            <div>

                <strong>

                    الأسبوع ${report.week}

                </strong>

                <br>

                ${reportDate}

            </div>

            <a

                href="${report.url}"

                target="_blank"

                class="view-btn">

                عرض

            </a>

        </div>

        `;

    });

    reportsTable.innerHTML=

    html;

}
