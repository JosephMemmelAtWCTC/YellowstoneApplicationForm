
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

    let currentPage = null;

    class ApplicationPage{

        constructor(showName, jquerySelector, $submitArea, startingPercentageInt){
            this.showName = showName;
            this.$jqueryPageElement = $(jquerySelector);
            this.headerTitleText = $("#formPage2").data("section");
            this.$submitArea = $submitArea;
            this.startingPercentageInt = startingPercentageInt;

            // Progress bar
            this.$applicationProgressBar = $("#applicationProgressBar");
        }

        setPageProgressBar(percentage){
            this.$applicationProgressBar.width(percentage+"%");
            this.$applicationProgressBar.attr("aria-valuenow", percentage);
        }

        loadIntoApplication(){
            currentPage = this;

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
            this.setPageProgressBar(this.startingPercentageInt);
        }

        moveToNext(){
            this.next.loadIntoApplication();
        }
        moveToPrevious(){
            this.previous.loadIntoApplication();
        }
    }


    // PAGES
    let displayIndex = 1;
    // TODO: Turn into a class
    const pages = [
        new ApplicationPage(displayIndex++, "#formPage1", $continueOnlyIfAllAcceptedSubmitSection, 0),
        new ApplicationPage(displayIndex++, "#formPage2", $paginationAfter, 20),
    ];
    pages[0].loadIntoApplication();


    // Setup pagination
    for(let i = 0; i < pages.length-1; i++) {
        pages[i].next = pages[i+1];
    }
    for(let i = 1; i < pages.length; i++) {
        pages[i].previous = pages[i-1];
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

                // console.log(event.submitter);
                const submitterId = event.submitter.id;

                if(submitterId === "pageMoveToPrevious"){
                    currentPage.moveToPrevious();
                }
                if(completelyValidated){
                    form.classList.add("completelyValidated");
                    console.log(`Page "#${form.id}" validated`);

                    if(submitterId === "startApplicationButton" || submitterId === "pageMoveToNext"){
                        currentPage.moveToNext();
                    }else{
                        currentPage.moveToNext();
                    }
                }else{
                    console.log(`Page "#${form.id}" unable to  be validatidated`);
                }
            }, false)
        })
    })()
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))