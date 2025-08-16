//Libreria para manejar el input de teléfono con banderas y códigos de país
//https://github.com/jackocnr/intl-tel-input

export function initPhoneInput(inputSelector) {
    const inputPhone = document.querySelector(inputSelector);
    if (!inputPhone) return null; // evita errores si no existe el input

    const iti = window.intlTelInput(inputPhone, {
        initialCountry: "auto",
        //fetch de la IP para determinar el país
        geoIpLookup: function(success, failure) {
            fetch("https://ipapi.co/json")
                .then(res => res.json())
                .then(data => success(data.country_code))
                .catch(() => failure());
        },
        preferredCountries: ['co', 'us', 'mx', 'es', 'ar','fr'],
        separateDialCode: true,
        hiddenInput: "full_phone",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js",
        //personalización del placeholder
        customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) {
            return "Ej: " + selectedCountryPlaceholder;
        }
    });

    inputPhone.placeholder = "";
    return iti; //devolver la instancia
}

// swalHelper.js
export function showAlert({ icon = 'info', title = '', html = '', draggable = false }) {
    let confirmButtonClass = 'btn-red';
    let popupClass = 'border-red';
    let iconClass = 'icon-swal';
    
    if (icon === 'success') {
        confirmButtonClass = 'btn-green';
        popupClass = 'border-green';
        iconClass = 'icon-swal-green';
    }

    Swal.fire({
        icon,
        title: `<span class="title-swal">${title}</span>`,
        html: `<div class="div-swal">${html}</div>`,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: confirmButtonClass,
            popup: popupClass,
            title: 'title-swal',
            icon: iconClass,
            htmlContainer: 'div-swal'
        },
        buttonsStyling: false,
        background: '#ffffff',
        draggable
    });
}
