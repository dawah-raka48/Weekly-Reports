/* ==========================================
   Weekly Reports System
   Admin Dashboard
========================================== */

const content = document.getElementById("content");

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

<button class="icon-btn edit-btn">

<i class="fa-solid fa-pen"></i>

</button>

<button class="icon-btn delete-btn">

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

function reportsPage(){

content.innerHTML=`

<div class="section-title">

<h2>

<i class="fa-solid fa-file-pdf"></i>

التقارير

</h2>

</div>

<div class="empty-card">

<i class="fa-solid fa-file-circle-check"></i>

<h3>

لا توجد تقارير

</h3>

<p>

ستظهر التقارير المرفوعة هنا.

</p>

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

    const result = await api("addEmployee",{

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

        await employeesPage();

        alert("تمت إضافة الموظف بنجاح");

    }

}
