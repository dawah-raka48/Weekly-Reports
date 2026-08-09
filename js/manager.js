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

/* ==========================
   Employees
========================== */

async function employeesPage(){

    const result = await api(

        "getEmployees"

    );

    if(!result.success){

        content.innerHTML="تعذر تحميل الموظفين";

        return;

    }

    const employees = result.employees.filter(emp=>

        emp.department===currentUser.department

    );

    let rows="";

    employees.forEach(emp=>{

        rows+=`

<tr>

<td>${emp.name}</td>

<td>${emp.department}</td>

<td>

<span class="status active">

${emp.status==="active"?"نشط":"موقوف"}

</span>

</td>

</tr>

`;

    });

    content.innerHTML=`

<div class="section-title">

<h2>

<i class="fa-solid fa-users"></i>

موظفو القسم

</h2>

</div>

<div class="table-container">

<table>

<thead>

<tr>

<th>الاسم</th>

<th>القسم</th>

<th>الحالة</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</div>

`;

}
/* ==========================
   Reports
========================== */

async function reportsPage(){

    const result = await api(

        "getReports",

        {

            department: currentUser.department,

            role: "manager"

        }

    );

    if(!result.success){

        content.innerHTML = `

        <div class="empty">

            تعذر تحميل التقارير

        </div>

        `;

        return;

    }

    const reports = result.reports || [];

    let rows = "";

    if(reports.length === 0){

        rows = `

        <tr>

            <td colspan="5">

                لا توجد تقارير

            </td>

        </tr>

        `;

    }else{

        reports.forEach(report=>{

            const date = new Date(

                report.uploadDate

            );

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

            rows += `

            <tr>

                <td>

                    ${report.employeeName}

                </td>

                <td>

                    ${report.week}

                </td>

                <td>

                    ${reportDate}

                </td>

                <td>

                    ${report.status}

                </td>

                <td>

                    <a

                        href="${report.url}"

                        target="_blank"

                        class="view-btn">

                        <i class="fa-solid fa-eye"></i>

                        عرض التقرير

                    </a>

                </td>

            </tr>

            `;

        });

    }

    content.innerHTML = `

    <div class="section-title">

        <h2>

            <i class="fa-solid fa-file-pdf"></i>

            تقارير القسم

        </h2>

    </div>

    <div class="filters">

        <input

            type="text"

            id="managerSearchName"

            placeholder="🔍 البحث باسم الموظف">

        <input

            type="date"

            id="managerSearchDate">

    </div>

    <div class="table-container">

        <table>

            <thead>

                <tr>

                    <th>الموظف</th>

                    <th>الأسبوع</th>

                    <th>تاريخ الرفع</th>

                    <th>الحالة</th>

                    <th>التقرير</th>

                </tr>

            </thead>

            <tbody id="managerReportsBody">

                ${rows}

            </tbody>

        </table>

    </div>

    `;

    setupReportsFilter(reports);

}

/* ==========================
   Reports Filter
========================== */

function setupReportsFilter(reports){

    const nameInput =

        document.getElementById(

            "managerSearchName"

        );

    const dateInput =

        document.getElementById(

            "managerSearchDate"

        );

    const body =

        document.getElementById(

            "managerReportsBody"

        );

    function filterReports(){

        const name =

            nameInput.value

                .trim()

                .toLowerCase();

        const date =

            dateInput.value;

        let filtered = reports.filter(

            report => {

                let matchesName = true;

                let matchesDate = true;

                if(name){

                    matchesName =

                        String(

                            report.employeeName

                        )

                        .toLowerCase()

                        .includes(name);

                }

                if(date){

                    const d = new Date(

                        report.uploadDate

                    );

                    const reportDate =

                        d.getFullYear() +

                        "-" +

                        String(

                            d.getMonth()+1

                        ).padStart(2,"0") +

                        "-" +

                        String(

                            d.getDate()

                        ).padStart(2,"0");

                    matchesDate =

                        reportDate === date;

                }

                return (

                    matchesName &&

                    matchesDate

                );

            }

        );

        if(filtered.length === 0){

            body.innerHTML = `

            <tr>

                <td colspan="5">

                    لا توجد نتائج

                </td>

            </tr>

            `;

            return;

        }

        body.innerHTML =

            filtered.map(report=>{

                const date = new Date(

                    report.uploadDate

                );

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

                return `

                <tr>

                    <td>

                        ${report.employeeName}

                    </td>

                    <td>

                        ${report.week}

                    </td>

                    <td>

                        ${reportDate}

                    </td>

                    <td>

                        ${report.status}

                    </td>

                    <td>

                        <a

                            href="${report.url}"

                            target="_blank"

                            class="view-btn">

                            <i class="fa-solid fa-eye"></i>

                            عرض التقرير

                        </a>

                    </td>

                </tr>

                `;

            }).join("");

    }

    nameInput.addEventListener(

        "input",

        filterReports

    );

    dateInput.addEventListener(

        "change",

        filterReports

    );

}
