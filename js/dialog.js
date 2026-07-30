/* ==========================================
   Dialog System
========================================== */

class Dialog {

    static create(type, title, message, buttons) {

        const old = document.querySelector(".dialog-overlay");

        if (old) old.remove();

        const overlay = document.createElement("div");

        overlay.className = "dialog-overlay";

        let icon = "";

        switch (type) {

            case "success":
                icon = "fa-circle-check";
                break;

            case "error":
                icon = "fa-circle-xmark";
                break;

            default:
                icon = "fa-triangle-exclamation";
                break;

        }

        overlay.innerHTML = `

<div class="dialog ${type}">

    <div class="dialog-icon">

        <i class="fa-solid ${icon}"></i>

    </div>

    <div class="dialog-title">

        ${title}

    </div>

    <div class="dialog-message">

        ${message}

    </div>

    <div class="dialog-actions">

        ${buttons}

    </div>

</div>

`;

        document.body.appendChild(overlay);

        document.body.classList.add("dialog-open");

        requestAnimationFrame(() => {

            overlay.classList.add("show");

        });

        return overlay;

    }

    static close(overlay) {

        overlay.classList.remove("show");

        setTimeout(() => {

            overlay.remove();

            document.body.classList.remove("dialog-open");

        }, 250);

    }

}

/* ==========================================
   Success
========================================== */

function showSuccess(message, title = "تمت العملية بنجاح") {

    return new Promise(resolve => {

        const dialog = Dialog.create(

            "success",

            title,

            message,

            `

<button class="dialog-btn primary">

حسناً

</button>

`

        );

        dialog.querySelector(".primary").onclick = () => {

            Dialog.close(dialog);

            resolve(true);

        };

    });

}

/* ==========================================
   Error
========================================== */

function showError(message, title = "حدث خطأ") {

    return new Promise(resolve => {

        const dialog = Dialog.create(

            "error",

            title,

            message,

            `

<button class="dialog-btn danger">

إغلاق

</button>

`

        );

        dialog.querySelector(".danger").onclick = () => {

            Dialog.close(dialog);

            resolve(false);

        };

    });

}

/* ==========================================
   Warning
========================================== */

function showWarning(message, title = "تنبيه") {

    return new Promise(resolve => {

        const dialog = Dialog.create(

            "warning",

            title,

            message,

            `

<button class="dialog-btn primary">

حسناً

</button>

`

        );

        dialog.querySelector(".primary").onclick = () => {

            Dialog.close(dialog);

            resolve(true);

        };

    });

}

/* ==========================================
   Confirm
========================================== */

function showConfirm(

    message,

    title = "تأكيد"

) {

    return new Promise(resolve => {

        const dialog = Dialog.create(

            "warning",

            title,

            message,

            `

<button class="dialog-btn gray">

إلغاء

</button>

<button class="dialog-btn danger">

تأكيد

</button>

`

        );

        dialog.querySelector(".gray").onclick = () => {

            Dialog.close(dialog);

            resolve(false);

        };

        dialog.querySelector(".danger").onclick = () => {

            Dialog.close(dialog);

            resolve(true);

        };

    });

}
