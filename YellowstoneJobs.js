
$(function() {

    // Paganation Buttons Start
    const $startApplicationButton = $("#startApplicationButton");
    const $moveToNextPageButton = $("#pageMoveToNext");
    const $moveToPreviousPageButton = $("#pageMoveToPrevious");
    // Paganation Buttons End


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
            this.headerTitleText = this.$jqueryPageElement.data("section");
            this.$submitArea = $submitArea;
            this.startingPercentageInt = startingPercentageInt;

            // Progress bar
            this.$applicationProgressBar = $("#applicationProgressBar");
        }

        setPageProgressBar(percentage){
            this.$applicationProgressBar.width(percentage+"%");
            this.$applicationProgressBar.attr("aria-valuenow", percentage);
        }

        loadPageIntoApplication(){
            currentPage = this;
            if(typeof currentPage.previous === "undefined"){
                $moveToPreviousPageButton.attr("disabled", "disabled");
            }else{
                $moveToPreviousPageButton.removeAttr("disabled");
            }
            if(typeof currentPage.next === "undefined"){
                $moveToNextPageButton.attr("disabled", "disabled");
            }else{
                $moveToNextPageButton.removeAttr("disabled");
            }

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
            // Validate
            this.$jqueryPageElement.addClass('was-validated');
            // this.$jqueryPageElement.addClass("PPP");
            if(this.$jqueryPageElement.find(':invalid').add(this.$jqueryPageElement.parent().find('.set-invalid')).length > 0){
                this.$jqueryPageElement.addClass('was-validated');
                this.$jqueryPageElement.find(':invalid').first().focus();
                return;
            }
            this.next.loadPageIntoApplication();
        }
        moveToPrevious(){
            this.previous.loadPageIntoApplication();
        }
    }
    // Custom - at least one checkbox
    $('.atLeastOneCheckbox').on('change', function (e) {
        const $areaToCheck = $(this);
        const $feedbackContainer = $areaToCheck.find('.feedback-container');

        if ($areaToCheck.find(":checked").length >= 1) {
            $areaToCheck.removeClass('was-validated');
            $areaToCheck.addClass('needs-validation');
            $areaToCheck.removeClass('set-invalid');
            $feedbackContainer.find('.invalid-feedback').hide();
            $feedbackContainer.find('.valid-feedback').show();
        } else {
            e.preventDefault();
            e.stopPropagation();
            $areaToCheck.removeClass('needs-validation');
            $areaToCheck.addClass('was-validated');
            $feedbackContainer.find('.valid-feedback').hide();
            $feedbackContainer.find('.invalid-feedback').show();
            $areaToCheck.addClass('set-invalid');

        }
    });



    class JobList {
        constructor(jobCategoryName, jobsStrings) {
            const jobCategory = jobCategoryName.replaceAll(" ","");
            const jobsMade = [];
            for(const jobString of jobsStrings){
                jobsMade.push(
                    {
                        jobTitle: jobString.replaceAll("***", "").replaceAll("(D.L.)", ""),
                        requiresDriversLicence: jobString.includes("(D.L.)"),
                    }
                );
            }

            const accordion = document.createElement("div");
            accordion.innerHTML =
                `
                <!--<div className="accordion">
                    <div className="accordion-item">
                        <h2 class="accordion-header">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${jobCategory}" aria-expanded="false" aria-controls="panelsStayOpen-${jobCategory}">
                            <span class="text-center w-100">${jobCategoryName}</span>
                          </button>
                        </h2>
                        <div id="panelsStayOpen-${jobCategory}" class="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                            </div>
                        </div>
                    </div>
                </div>-->
                <div class="accordion accordion-flush" id="accordionFlushExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-${jobCategory}" aria-expanded="false" aria-controls="flush-collapseOne">
                                <span class="text-center w-100">${jobCategoryName}</span>
                            </button>
                        </h2>
                            <div id="panelsStayOpen-${jobCategory}" class="accordion-collapse collapse" data-bs-parent="#panelsStayOpen-${jobCategory}">
                            <div class="accordion-body"></div>
                        </div>
                    </div>
                </div>

`;
            const accordionBody = accordion.querySelector(".accordion-body");

            for (const job of jobsMade) {
                const tempDiv = document.createElement("div");
                // console.log(job)
                const id = job.jobTitle.replaceAll(" ","");
                tempDiv.innerHTML = `<div class="input-group">
                                        <input className="form-check-input mt-0" type="checkbox" id="${id}">
                                        <label class="form-check-label text-wrap" for="${id}">${job.jobTitle}</label>
                                     </div>`;
                accordionBody.appendChild(tempDiv);
            }

            return accordion;
        }
    }

    const foodRelatedJobs = new JobList("Food Related", ["Dining Room Server Assistant***", "Employee Dining Room Crew***", "Fast Food Crew***", "Kitchen Crew***", "Room Attendant***", "Activities Sales Agent", "Bar Lead", "Barista", "Bartender", "Cocktail Server", "Cook", "Dining Room Host", "Dining Room Host Lead", "Dining Room Management", "Dining Room Server", "Employee Pub Crew/Lead", "Fast Food Management", "Food and Beverage Management", "Housekeeping Room Inspector", "Housekeeping Trainer", "Pantry Supervisor", "Snack Shop / Deli Supervisor", "Sous Chef", "Steward", "Storekeeper", "Wrangler/Driver"]);
    const transportationRelatedJobs = new JobList("Transportation Related", ["Bus Driver/Guide (D.L.)", "Bus Service Person (D.L.)", "Distribution Center Truck Driver (D.L.)", "Tour Guide (D.L.)", "Touring Car Driver- Interpretive Guide Non CDL (D.L.)", "Traveling Night Auditor", "Warehouse Driver (OFI)"]);

    document.getElementById("foodRelatedJobs").appendChild(foodRelatedJobs);
    document.getElementById("transportationRelatedJobs").appendChild(transportationRelatedJobs);

    // PAGES
    let displayIndex = 1;
    // TODO: Turn into a class?
    const pages = [
        // TODO: PERCENTAGES
        new ApplicationPage(displayIndex++, "#formPage1", $continueOnlyIfAllAcceptedSubmitSection, 0),
        new ApplicationPage(displayIndex++, "#formPage2", $paginationAfter, 10),
        new ApplicationPage(displayIndex++, "#formPage3", $paginationAfter, 20),
        new ApplicationPage(displayIndex++, "#formPage4", $paginationAfter, 30),
        new ApplicationPage(displayIndex++, "#formPage4", $paginationAfter, 30),
    ];
    pages[0].loadPageIntoApplication();
    // pages[3].loadPageIntoApplication();


    // Setup pagination

    for(let i = 0; i < pages.length-1; i++) {
        pages[i].next = pages[i+1];
    }
    for(let i = 1; i < pages.length; i++) {
        pages[i].previous = pages[i-1];
    }

    // Events for page movement
    ($startApplicationButton.add($moveToNextPageButton)).on('click', (e) => {
        currentPage.moveToNext();
    });
    $moveToPreviousPageButton.on('click', (e) => {
        currentPage.moveToPrevious();
    });

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

    // Models
    // $('#myModal').on('shown.bs.modal', function () {
    //     $('#myInput').trigger('focus')
    // })


    // (() => {
    //     'use strict'
    //
    //     // Fetch all the forms we want to apply custom Bootstrap validation styles to
    //     const forms = document.querySelectorAll('.needs-validation')
    //
    //     // Loop over them and prevent submission
    //     Array.from(forms).forEach(form => {
    //         form.addEventListener('submit', event => {
    //             let completelyValidated = true;
    //
    //             event.preventDefault()
    //             if (!form.checkValidity()) {
    //                 event.stopPropagation()
    //                 completelyValidated = false;
    //             }
    //             form.classList.add('was-validated')
    //
    //             // console.log(event.submitter);
    //             const submitterId = event.submitter.id;
    //
    //             if(submitterId === "pageMoveToPrevious"){
    //                 currentPage.moveToPrevious();
    //             }
    //             if(completelyValidated){
    //                 form.classList.add("completelyValidated");
    //                 console.log(`Page "#${form.id}" validated`);
    //
    //                 if(submitterId === "startApplicationButton" || submitterId === "pageMoveToNext"){
    //                     currentPage.moveToNext();
    //                 }else{
    //                     currentPage.moveToNext();
    //                 }
    //             }else{
    //                 console.log(`Page "#${form.id}" unable to  be validatidated`);
    //             }
    //         }, false)
    //     })
    // })()
});

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))