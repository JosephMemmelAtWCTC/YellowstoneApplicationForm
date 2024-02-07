
$(function() {

    // Paganation Buttons Start
    const $startApplicationButton = $("#startApplicationButton");
    const $moveToNextPageButton = $("#pageMoveToNext");
    const $moveToPreviousPageButton = $("#pageMoveToPrevious");
    // const $previousPage = $('#previousPage');
    // Paganation Buttons End

    // Driver's license show
    const $showDriversLicenceRequiredForJob = $('#showDriversLicenceRequiredForJob');

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
    let maxPageNum = null;

    class ApplicationPage{

        constructor(pageOrder, jquerySelector, $submitArea, startingPercentageInt){
            this.pageOrder = pageOrder;
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
            maxPageNum = Math.max(maxPageNum, this.pageOrder);//TODO: Do a better wau
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

        if ($areaToCheck.find('.input-group input[type="checkbox"]:checked').length > 0) {
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
                tempDiv.innerHTML = `<div class="input-group job ${job.requiresDriversLicence? "requiresDriversLicence":""}">
                                        <input className="form-check-input mt-0" type="checkbox" id="${job.jobTitle}<">
                                        <label class="form-check-label text-wrap" for="${id}">${job.jobTitle}</label>
                                     </div>`;
                accordionBody.appendChild(tempDiv);
            }

            return accordion;
        }
    }

    const foodRelatedJobs = new JobList("Food", ["Dining Room Server Assistant***", "Employee Dining Room Crew***", "Fast Food Crew***", "Kitchen Crew***", "Room Attendant***", "Activities Sales Agent", "Bar Lead", "Barista", "Bartender", "Cocktail Server", "Cook", "Dining Room Host", "Dining Room Host Lead", "Dining Room Management", "Dining Room Server", "Employee Pub Crew/Lead", "Fast Food Management", "Food and Beverage Management", "Housekeeping Room Inspector", "Housekeeping Trainer", "Pantry Supervisor", "Snack Shop / Deli Supervisor", "Sous Chef", "Steward", "Storekeeper", "Wrangler/Driver"]);
    const transportationRelatedJobs = new JobList("Transportation", ["Bus Driver/Guide (D.L.)", "Bus Service Person (D.L.)", "Distribution Center Truck Driver (D.L.)", "Tour Guide (D.L.)", "Touring Car Driver- Interpretive Guide Non CDL (D.L.)", "Traveling Night Auditor", "Warehouse Driver (OFI)"]);
    const managementRelatedJobs = new JobList("Management", ["Asst. HR Manager", "Cafeteria Management", "Campground Management", "Employee Dining Room Management", "Front Office Management", "General Accounting Office", "Guest Services Agent", "Guest Services Agent (Campground)", "Housing Manager", "Internship", "Location Controller/Assistant", "Night Auditor", "Personnel Management", "Recreation Coordinator (D.L.)", "Recreation Supervisor (D.L.)", "Reservations Sales Agent", "Residence Coordinator", "Retail Management", "R&M Staff Assistant", "Senior Guest Services Agent (Campground)", "Traveling Night Auditor", "Warehouse Manager"]);

    $showDriversLicenceRequiredForJob.on('change', (e) => {
        $('.job').each((index, job) => {
            if($(job).hasClass('requiresDriversLicence')){
                if(e.target.checked){
                    $(job).removeClass('d-none');
                }else{
                    $(job).addClass('d-none');
                }
            }

        });
    });


    document.getElementById("foodRelatedJobs").appendChild(foodRelatedJobs);
    document.getElementById("transportationRelatedJobs").appendChild(transportationRelatedJobs);
    document.getElementById("managementRelatedJobs").appendChild(managementRelatedJobs);

    // PAGES
    let displayIndex = 1;
    // TODO: Turn into a class?
    const pages = [
        // TODO: PERCENTAGES
        new ApplicationPage(displayIndex++, "#formPage1", $continueOnlyIfAllAcceptedSubmitSection, 0),
        new ApplicationPage(displayIndex++, "#formPage2", $paginationAfter, 10),
        new ApplicationPage(displayIndex++, "#formPage3", $paginationAfter, 20),
        new ApplicationPage(displayIndex++, "#formPageEducation", $paginationAfter, 40),
        new ApplicationPage(displayIndex++, "#formPageExperience", $paginationAfter, 60),
        new ApplicationPage(displayIndex++, "#formPageExtra", $paginationAfter, 60),

    ];
    pages[0].loadPageIntoApplication();
    pages[displayIndex-2].loadPageIntoApplication();


    // Setup pagination

    // pages[0].next = pages[1];
    // pages[pages.length-1].previous = pages[pages.length-2];
    for(let i = pages.length-1; i >= 0; i--) {
        if(i !== 0){
            pages[i].previous = pages[i-1];
        }
        if(i !== pages.length-1){
            pages[i].next = pages[i+1];
        }

        const paginationDirect = document.createElement("div");
        paginationDirect.innerHTML = `<li class="page-item"><a class="page-link rounded-0" href="#">${i+1}</a></li>`;
        $moveToPreviousPageButton.after(paginationDirect);
        const page = pages[i];
        $(paginationDirect).on('click', (e)=>{
            if(maxPageNum >= page.pageOrder){
                page.loadPageIntoApplication();
            }
        });
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
        ["#workedUnderBefore", "#workedUnderBeforeExpand"],
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

    // Addboxes
    const eductionBoxHtmlString = `
        <div class="mt-2 p-2 border-primary border-1 bg-primary-subtle additional-education">
            <div class="row justify-content-between">
                <div class="col">
                    <label for="" class="form-label">Institute Name</label>
                    <input type="text" class="form-control" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        The name of the institution is required
                    </div>
                </div>
                <div class="col-auto btn-square me-2">
                    <button class="btn btn-primary btn-square removeEducation" type="button"><i class="bi bi-trash"></i></button>
                </div>
            </div>
            <div class="">
                <label for="" class="form-label">Location</label>
                <input type="text" class="form-control" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    The location of the institution is required
                </div>
            </div>
            <div class="">
                <label for="" class="form-label">Field of Study</label>
                <input type="text" class="form-control" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Your field of study is required
                </div>
            </div>
            <div class="">
                <label for="" class="form-label">Degree Received</label>
                <input type="text" class="form-control">
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input required" type="checkbox" value="">
                <label class="form-check-label" for="proofOfWorkEligibility">
                    Did you graduate?
                </label>
            </div>
        </div>
    `;
    const workExperienceBoxHtmlString = `
        <div class="mt-3 p-2 border-primary border-1 bg-primary-subtle additional-workExperience">
            <div class="row">
                <div class="col">
                    <label for="" class="form-label">Employer Name</label>
                    <input type="text" class="form-control" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        The name of your employer is required
                    </div>
                </div>
                <div class="col-auto btn-square me-2">
                    <button class="btn btn-primary btn-square removeWorkExperience" type="button"><i class="bi bi-trash"></i></button>
                </div>
            </div>
            
            <div class="">
                <label for="" class="form-label">Address</label>
                <input type="text" class="form-control" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    The location of your previous employer is required
                </div>
            </div>
            <div class="">
                <label for="" class="form-label">Position</label>
                <input type="text" class="form-control" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
                <div class="invalid-feedback">
                    Your Position is required
                </div>

                <div class="">
                        <label for="" class="form-label">Supervisor Name</label>
                        <input type="text" class="form-control" required>
                        <div class="valid-feedback">
                            Looks good!
                        </div>
                        <div class="invalid-feedback">
                            Supervisor name is required
                        </div>
                    </div>
                </div>
                <div class="">
                    <label for="" class="form-label">Supervisor Position</label>
                    <input type="text" class="form-control" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Supervisor position is required
                    </div>
                </div>
                <div class="">
                    <label for="" class="form-label">Supervisor Contact</label>
                    <input type="text" class="form-control">
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            <div class="row">
                <div class="col-md-6">
                    <label for="" class="form-label">Starting Date</label>
                    <input type="date" class="form-control" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                    <div class="invalid-feedback">
                        Start date is required
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="" class="form-label">End Date</label>
                    <input type="date" class="form-control" >
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </div>
            <div class="col">
                <label class="form-label">Position Duties</label>
                <textarea type="text" class="form-control" required></textarea>
                <div class="valid-feedback">
                    Details provided!
                </div>
                <div class="invalid-feedback">
                    Duties explanation is required
                </div>
            </div>
            <div class="form-check form-switch">
                <input class="form-check-input required" type="checkbox" value="">
                <label class="form-check-label" for="">
                    May we contact this employer?
                </label>
            </div>
        </div>
    `;

    const $educationBoxes = $("#educationBoxes");
    const $addAnotherEducation = $("#addAnotherEduction");
    $addAnotherEducation.on('click',  (e) => {
        const additionalEducations = $educationBoxes.find('.removeEducation').length;
        if(additionalEducations <= 1){
            $educationBoxes.append(eductionBoxHtmlString).find('.removeEducation').on('click', function(e){
                $(e.target).parents('.additional-education').remove();
                $addAnotherEducation.removeClass('disabled');
            });
            if(additionalEducations === 1){
                $addAnotherEducation.addClass('disabled');
            }
        }
    });
    const $workExperienceBoxes = $("#experienceBoxes");
    const $addAnotherWorkExperience = $("#addAnotherWorkExperience");
    $addAnotherWorkExperience.on('click',  (e) => {
        const additionalWorkExperiences = $workExperienceBoxes.find('.removeWorkExperience').length;
        if(additionalWorkExperiences <= 1){
            $workExperienceBoxes.append(workExperienceBoxHtmlString).find('.removeWorkExperience').on('click', function(e){
                $(e.target).parents('.additional-workExperience').remove();
                $addAnotherWorkExperience.removeClass('disabled');
            });
            if(additionalWorkExperiences === 1){
                $addAnotherWorkExperience.addClass('disabled');
            }
        }
    });




    // Orignal Validation
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