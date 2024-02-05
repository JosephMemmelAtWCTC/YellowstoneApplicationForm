
$(function() {

    const $startApplicationSubmitButton = $("#startApplicationButton");
    const $continueOnlyIfAllAcceptedSubmitSection = $("#continueOnlyIfAllAccepted");
    const $paginationAfter = $("#paginationAfter");
    const $applicationFooter = $("#bottom-nav-pagination");
    const $applicationFooterNavs = $("#bottom-nav-pagination>ul");

    const $pageTitleText = $("#pageTitle");
    // Forms
    const $movedOutOfFormHoldingArea = $("#movedOutOfFormHoldingArea");
    const $insideFormActiveHoldingArea = $("#insideFormActiveHoldingAreaParent");
    //      Form pages
    const $allFormPages = $(".formPage");


    // $("#formPage1").removeClass("d-none");

    // .detach().appendTo($insideFormActiveHoldingArea);
    // $insideFormActiveHoldingArea.append($formPage1);



    class ApplicationPage{
        constructor(showName, jquerySelector, $submitArea){
            this.showName = showName;
            this.$jqueryPageElement = $(jquerySelector);
            this.headerTitleText = $("#formPage2").data("section");
            this.$submitArea = $submitArea;
        }

        loadIntoApplication(){
            console.log("formPage");

            //Ensure only page
            // console.log("PagesCount +"+$allFormPages.length)
            $allFormPages.each( (index, formPage) => {
                // console.log(formPage);
                // $(formPage).addClass("d-none");
                $movedOutOfFormHoldingArea.append($(formPage));
            });
            $applicationFooterNavs.each( (index, paganation ) => {
                $movedOutOfFormHoldingArea.append($(paganation));
            });
            $insideFormActiveHoldingArea.append(this.$jqueryPageElement);
            $applicationFooter.append(this.$submitArea);

            $pageTitleText.text(this.headerTitleText);
        }

        moveToNext(){
            this.next.loadIntoApplication();
        }
    }


    // PAGES
    let displayIndex = 1;
    // TODO: Turn into a class
    const pages = [
        new ApplicationPage(displayIndex++, "#formPage1", $continueOnlyIfAllAcceptedSubmitSection),
        new ApplicationPage(displayIndex++, "#formPage2", $paginationAfter),
    ];

    pages[0].loadIntoApplication();
    // pages[1].loadIntoApplication();

    // Setup pagination
    for(let i = 0; i < pages; i++) {

    }


    const expandBasedOnAnswerToggle = [
        ["#requiresSponsorship", "#requiresSponsorshipExpand"],
        ["#atLeast18", "#atLeast18Expand"],
        ["#convicted", "#convictedExpand"],
    ];
    setupToggleOnChanges(expandBasedOnAnswerToggle);


    function setupToggleOnChanges(toggleParentWithUnhide){
        for(const togglePair of toggleParentWithUnhide) {
            // console.log("togglePair+"+togglePair[0]);
            const $toggle = $(togglePair[0]);
            const $toUnhide = $(togglePair[1]);

            $toggle.on("change", e => {
                const isChecked = $(e.target).is(':checked');// :checked learned from https://stackoverflow.com/a/50112502
                // $requireSponsorshipPopup.toggleClass("d-none");
                if(isChecked){
                    $toUnhide.removeClass("d-none");
                    $toUnhide.find(".required").attr("required", true);
                }else{
                    $toUnhide.addClass("d-none");
                    $toUnhide.find(".required").removeAttr("required");
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
                    console.log("Form application");
                }else{
                    console.log("NOT +"+form.id);
                }
            }else{
                console.log("NOT");
            }
        }, false)
    })
})()

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))