/* ==========================================
   Weekly Reports System
   Admin Dashboard
========================================== */

const content = document.getElementById("content");

let employeesData = [];

let editingEmployeeId = null;

/* ==========================
   Menu
========================== */

const menuCards = document.querySelectorAll(".menu-card");

menuCards.forEach(card => {

    card.addEventListener("click", () => {

        menuCards.forEach(item => {

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

        case "reports":

            reportsPage();

            break;

        case "employees":

            employeesPage();

            break;

        case "settings":

            settingsPage();

            break;

    }

}

/* ==========================
   Employees
========================== */

async function employeesPage(){

    const result = await api("getEmployees");

    employeesData = result.employees || [];

    let rows = "";

    employeesData.forEach(employee=>{

        rows += `

<tr>

<td>${employee.id}</td>

<td>${employee.name}</td>

<td>${employee.department}</td>

<td>${employee.username}</td>

<td>

<span class="status ${employee.status==="active"?"active":"stop"}">

${employee.status==="active"?"نشط":"موقوف"}

</span>

</td>

<td>

<div class="actions">

<button

class="icon-btn edit-btn"

onclick="editEmployee(${employee.id})">

<i class="fa-solid fa-pen"></i>

</button>

<button

class="icon-btn delete-btn"

onclick="deleteEmployee(${employee.id})">

<i class="fa-solid fa-trash"></i>

</button>

</div>

</td>

</tr>

`;

    });

    content.innerHTML = `

<div class="section-title">

<h2>

<i class="fa-solid fa-users"></i>

الموظفون

</h2>

<button class="primary-btn">

<i class="fa-solid fa-plus"></i>

إضافة موظف

</button>

</div>

<div class="table-container">

<table>

<thead>

<tr>

<th>#</th>

<th>الاسم</th>

<th>القسم</th>

<th>اسم المستخدم</th>

<th>الحالة</th>

<th>الإجراءات</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</div>

`;

    setupEmployeeModal();

}

/* ==========================================
   Employee Modal
========================================== */

function setupEmployeeModal(){

    const addBtn = document.querySelector(".primary-btn");

    const modal = document.getElementById("employeeModal");

    const closeBtn = document.getElementById("closeModal");

    if(!addBtn || !modal || !closeBtn) return;

    addBtn.onclick = ()=>{

        modal.classList.add("show");

    };

    closeBtn.onclick = ()=>{

        modal.classList.remove("show");

    };

    modal.onclick = e=>{

        if(e.target===modal){

            modal.classList.remove("show");

        }

    };

}

/* ==========================================
   Save Employee
========================================== */

window.addEventListener("DOMContentLoaded",()=>{

    const btn = document.getElementById("saveEmployee");

    if(btn){

        btn.addEventListener("click",saveEmployee);

    }

});

async function saveEmployee(){

    const name = document.getElementById("empName").value.trim();

    const username = document.getElementById("empUsername").value.trim();

    const password = document.getElementById("empPassword").value.trim();

    const department = document.getElementById("empDepartment").value;

    const role = document.getElementById("empRole").value;

    if(!name || !username || !password){

        await showWarning("يرجى إدخال جميع البيانات");

        return;

    }

    const action = editingEmployeeId

        ? "updateEmployee"

        : "addEmployee";

    const result = await api(action,{

        id:editingEmployeeId,

        name,

        username,

        password,

        department,

        role

    });

    if(result.success){

        document.getElementById("empName").value="";

        document.getElementById("empUsername").value="";

        document.getElementById("empPassword").value="";

        document.getElementById("empDepartment").selectedIndex=0;

        document.getElementById("empRole").selectedIndex=0;

        document.getElementById("employeeModal").classList.remove("show");

        editingEmployeeId = null;

        document.querySelector(".modal-title").textContent="إضافة موظف";

        await employeesPage();

        await showSuccess("تم حفظ بيانات الموظف بنجاح");

    }else{

        await showError(result.message);

    }

}

function editEmployee(id){

    editingEmployeeId=id;

    const employee=employeesData.find(

        e=>Number(e.id)===Number(id)

    );

    if(!employee) return;

    document.getElementById("empName").value=employee.name;

    document.getElementById("empUsername").value=employee.username;

    document.getElementById("empPassword").value=employee.password;

    document.getElementById("empDepartment").value=employee.department;

    document.getElementById("empRole").value=employee.role;

    document.querySelector(".modal-title").textContent="تعديل الموظف";

    document.getElementById("employeeModal").classList.add("show");

}

async function deleteEmployee(id){

    const ok = await showConfirm(

        "هل تريد حذف هذا الموظف؟",

        "حذف موظف"

    );

    if(!ok) return;

    const result = await api("deleteEmployee",{id});

    if(result.success){

        await employeesPage();

        await showSuccess("تم حذف الموظف بنجاح");

    }else{

        await showError(result.message);

    }

}
/* ==========================
   Reports
========================== */

async function reportsPage(){

    const result = await api("getReports");

    let rows = "";

    if(result.reports.length === 0){

        rows = `

<tr>

<td colspan="7">

لا توجد تقارير

</td>

</tr>

`;

    }else{

        result.reports.forEach(report=>{

            rows += `

<tr>

<td>${report.employeeName}</td>

<td>${report.department}</td>

<td>${report.week}</td>

<td>${new Date(report.uploadDate).toLocaleString("ar-EG",{

year:"numeric",

month:"2-digit",

day:"2-digit",

hour:"2-digit",

minute:"2-digit"

})}</td>

<td>${report.status}</td>

<td>

<a

href="${report.url}"

target="_blank"

class="view-btn">

عرض

</a>

</td>

<td>

<button

class="delete-btn"

onclick="deleteReport(${report.id})">

حذف

</button>

</td>

</tr>

`;

        });

    }

    content.innerHTML = `

<div class="section-title">

<h2>

<i class="fa-solid fa-file-pdf"></i>

التقارير

</h2>

</div>

<div class="filters">

<input

type="text"

id="searchName"

placeholder="🔍 البحث باسم الموظف">

<select id="searchDepartment">

<option value="">كل الأقسام</option>

<option>الإدارية</option>

<option>المالية</option>

<option>الإعلام</option>

<option>قسم الدعوة</option>

<option>الجاليات</option>

<option>القسم النسائي</option>

<option>مركز غيم</option>

</select>

<input

type="date"

id="searchDate">

</div>

<div class="table-container">

<table>

<thead>

<tr>

<th>الموظف</th>

<th>القسم</th>

<th>الأسبوع</th>

<th>تاريخ الرفع</th>

<th>الحالة</th>

<th>عرض</th>

<th>حذف</th>

</tr>

</thead>

<tbody>

${rows}

</tbody>

</table>

</div>

`;

    setupReportsFilter(result.reports);

}

/* ==========================
   Delete Report
========================== */

async function deleteReport(id){

    const ok = await showConfirm(

        "هل تريد حذف هذا التقرير؟",

        "حذف تقرير"

    );

    if(!ok) return;

    const result = await api("deleteReport",{

        id

    });

    if(result.success){

        await reportsPage();

        await showSuccess("تم حذف التقرير بنجاح");

    }else{

        await showError(result.message);

    }

}

/* ==========================
   Reports Filter
========================== */

function setupReportsFilter(reports){

    const nameInput = document.getElementById("searchName");

    const departmentInput = document.getElementById("searchDepartment");

    const dateInput = document.getElementById("searchDate");

    function filter(){

        const name = nameInput.value.trim().toLowerCase();

        const department = departmentInput.value;

        const date = dateInput.value;

        const rows = document.querySelectorAll("tbody tr");

        rows.forEach((row,index)=>{

            const report = reports[index];

            if(!report) return;

            let show = true;

            if(name){

                show = report.employeeName

                    .toLowerCase()

                    .includes(name);

            }

            if(show && department){

                show = report.department === department;

            }

            if(show && date){

                const d = new Date(report.uploadDate);

                const reportDate =

                    d.getFullYear()+"-"+

                    String(d.getMonth()+1).padStart(2,"0")+"-"+

                    String(d.getDate()).padStart(2,"0");

                show = reportDate === date;

            }

            row.style.display = show ? "" : "none";

        });

    }

    nameInput.addEventListener("input",filter);

    departmentInput.addEventListener("change",filter);

    dateInput.addEventListener("change",filter);

}
/* ==========================
   Settings
========================== */

async function settingsPage(){

    const result = await api("getSettings");

    const settings = result.settings;

    content.innerHTML = `

<div class="section-title">

<h2>

<i class="fa-solid fa-gear"></i>

الإعدادات

</h2>

</div>

<div class="settings-grid">

<div class="setting-card">

<label>يوم رفع التقارير</label>

<select id="uploadDay">

<option value="0">الأحد</option>

<option value="1">الإثنين</option>

<option value="2">الثلاثاء</option>

<option value="3">الأربعاء</option>

<option value="4">الخميس</option>

<option value="5">الجمعة</option>

<option value="6">السبت</option>

</select>

</div>

<div class="setting-card">

<label>وقت البداية</label>

<input
id="startTime"
type="time">

</div>

<div class="setting-card">

<label>وقت النهاية</label>

<input
id="endTime"
type="time">

</div>

</div>

<br>

<button
id="saveSettingsBtn"
class="primary-btn">

<i class="fa-solid fa-floppy-disk"></i>

حفظ الإعدادات

</button>

`;

    document.getElementById("uploadDay").value = settings.uploadDay;

    document.getElementById("startTime").value = settings.startTime;

    document.getElementById("endTime").value = settings.endTime;

    document
        .getElementById("saveSettingsBtn")
        .addEventListener("click", saveSettings);

}

/* ==========================
   Save Settings
========================== */

async function saveSettings(){

    const uploadDay =
        document.getElementById("uploadDay").value;

    const startTime =
        document.getElementById("startTime").value;

    const endTime =
        document.getElementById("endTime").value;

    const result = await api("saveSettings",{

        uploadDay,

        startTime,

        endTime

    });

    if(result.success){

        await showSuccess("تم حفظ الإعدادات بنجاح");

    }else{

        await showError(result.message);

    }

}

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
   Default Page
========================== */

document.querySelectorAll(".menu-card").forEach(btn=>{

    btn.classList.remove("active");

});

const reportsBtn = document.querySelector('[data-page="reports"]');

if(reportsBtn){

    reportsBtn.classList.add("active");

}

reportsPage();

/* ==========================
   Logout
========================== */

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click", async ()=>{

        const ok = await showConfirm(

            "هل تريد تسجيل الخروج من النظام؟",

            "تسجيل الخروج"

        );

        if(!ok) return;

        localStorage.removeItem("currentUser");

        location.replace("index.html");

    });

}
