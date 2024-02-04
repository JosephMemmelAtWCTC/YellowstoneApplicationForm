
$(function() {
    $startApplicationSubmitButton = $("#startApplicationButton");
    // $startApplicationSubmitButton.on("submit", e => {
    //     console.log("AAAAA");
    //     e.preventDefault();
    //     // const startFormQuestions =
    //
    //     if($startApplicationSubmitButton.hasClass("completelyValidated")){
    //         console.log("TEST33333");
    //     }else{
    //         console.log("NOT");
    //     }
    // });


    const expandBasedOnAnswerToggle = [
        ["#requiresSponsorship", "#requiresSponsorshipExpand"],
        ["#atLeast18", "#atLeast18Expand"],
        ["#convicted", "#convictedExpand"],
    ];
    setupToggleOnChanges(expandBasedOnAnswerToggle);


    function setupToggleOnChanges(toggleParentWithUnhide){
        for(const togglePair of toggleParentWithUnhide) {
            console.log("togglePair+"+togglePair[0]);
            const $toggle = $(togglePair[0]);
            const toUnhide = $(togglePair[1]);

            $toggle.on("change", e => {
                const isChecked = $(e.target).is(':checked');// :checked learned from https://stackoverflow.com/a/50112502
                // $requireSponsorshipPopup.toggleClass("d-none");
                if(isChecked){
                    toUnhide.removeClass("d-none");
                }else{
                    toUnhide.addClass("d-none");
                }
            });
        }

    }

});


// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            let completelyValidated = true;

            event.preventDefault()
            if (!form.checkValidity()) {
                event.stopPropagation()
                completelyValidated = false;
            }
            form.classList.add('was-validated')

            if(completelyValidated){
                form.classList.add("completelyValidated");
                if(form.id === "applicationForm"){
                    console.log("TEST33333");
                }else{
                    console.log("NOT +"+form.id);
                }
            }
        }, false)
    })
})()

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))