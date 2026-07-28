/* ==========================================
   Weekly Reports System
   Admin Dashboard
========================================== */

const content = document.getElementById("content");

let employeesData = [];

let editingEmployeeId = null;

const menuCards = document.querySelectorAll(".menu-card");

menuCards.forEach(card => {

    card.addEventListener("click", () => {

        menuCards.forEach(item => {

            item.classList.remove("active");

        });

        card.classList.add("active");

        const page = card.dataset.page;

        loadPage(page);

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

        case "settings":

            settingsPage();

            break;

    }

}

/* ==========================
   Employees
========================== */

async function employeesPage() {

    const result = await api("getEmployees");
    
    employeesData = result.employees;
    
    let rows = "";

    result.employees.forEach(employee => {

        rows += `

<tr>

<td>${employee.id}</td>

<td>${employee.name}</td>

<td>${employee.department}</td>

<td>${employee.username}</td>

<td>

<span class="status ${employee.status === "active" ? "active" : "stop"}">

${employee.status === "active" ? "نشط" : "موقوف"}

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

    // تشغيل نافذة إضافة الموظف
    setupEmployeeModal();

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

            <td colspan="6">

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

}

/* ==========================
   Settings
========================== */

function settingsPage(){

content.innerHTML=`

<div class="section-title">

<h2>

<i class="fa-solid fa-gear"></i>

الإعدادات

</h2>

</div>

<div class="settings-grid">

<div class="setting-card">

<label>

يوم رفع التقارير

</label>

<select>

<option>

الخميس

</option>

</select>

</div>

<div class="setting-card">

<label>

وقت البداية

</label>

<input type="time">

</div>

<div class="setting-card">

<label>

وقت النهاية

</label>

<input type="time">

</div>

</div>

`;

}

/* ==========================
   Clock
========================== */

function updateClock(){

const now=new Date();

document.getElementById("currentTime").innerHTML=

now.toLocaleTimeString("ar-SA",{

hour:"2-digit",

minute:"2-digit"

});

document.getElementById("currentDate").innerHTML=

now.toLocaleDateString("ar-SA");

}

updateClock();

setInterval(updateClock,1000);

/* ==========================
   Default
========================== */

employeesPage();

/* ==========================================
   Employee Modal
========================================== */

function setupEmployeeModal() {

    const addBtn = document.querySelector(".primary-btn");

    const modal = document.getElementById("employeeModal");

    const closeBtn = document.getElementById("closeModal");

    if (!addBtn || !modal || !closeBtn) return;

    addBtn.onclick = () => {

        modal.classList.add("show");

    };

    closeBtn.onclick = () => {

        modal.classList.remove("show");

    };

    modal.onclick = (e) => {

        if (e.target === modal) {

            modal.classList.remove("show");

        }

    };

}
/* ==========================================
   Save Employee
========================================== */

window.addEventListener("DOMContentLoaded", () => {

    document
        .getElementById("saveEmployee")
        .addEventListener("click", saveEmployee);

});

async function saveEmployee(){

    const name =
    document.getElementById("empName").value.trim();

    const username =
    document.getElementById("empUsername").value.trim();

    const password =
    document.getElementById("empPassword").value.trim();

    const department =
    document.getElementById("empDepartment").value;

    const role =
    document.getElementById("empRole").value;

    if(!name || !username || !password){

        alert("يرجى إدخال جميع البيانات");

        return;

    }

    const action = editingEmployeeId ? "updateEmployee" : "addEmployee";

    const result = await api(action, {

    id: editingEmployeeId,

    name,

    username,

    password,

    department,

    role

});

        if (result.success) {

        document.getElementById("empName").value = "";

        document.getElementById("empUsername").value = "";

        document.getElementById("empPassword").value = "";

        document.getElementById("empDepartment").selectedIndex = 0;

        document.getElementById("empRole").selectedIndex = 0;

        document
            .getElementById("employeeModal")
            .classList
            .remove("show");
        editingEmployeeId = null;

document.querySelector(".modal-title").textContent = "إضافة موظف";

        await employeesPage();

        alert("تمت إضافة الموظف بنجاح");

    }

}
function editEmployee(id){

    editingEmployeeId = id;

    const employee = employeesData.find(e => Number(e.id) === Number(id));

    if(!employee) return;

    document.getElementById("empName").value = employee.name;

    document.getElementById("empUsername").value = employee.username;

    document.getElementById("empPassword").value = employee.password;

    document.getElementById("empDepartment").value = employee.department;

    document.getElementById("empRole").value = employee.role;

    document.querySelector(".modal-title").textContent = "تعديل الموظف";

    document.getElementById("employeeModal").classList.add("show");

}
async function deleteEmployee(id){

    const ok = confirm("هل تريد حذف هذا الموظف؟");

    if(!ok) return;

    const result = await api("deleteEmployee",{

        id

    });

    if(result.success){

        await employeesPage();

        alert("تم حذف الموظف بنجاح");

    }else{

        alert(result.message);

    }

}
