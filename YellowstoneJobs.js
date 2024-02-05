
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
                `<div className="accordion">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-${jobCategory}" aria-expanded="false"
                                    aria-controls="panelsStayOpen-${jobCategory}">
                                ${jobCategoryName}
                            </button>
                        </h2>
                        <div id="panelsStayOpen-${jobCategory}" className="accordion-collapse collapse show">
                            <div className="accordion-body" class="accordion-body">
                            </div>
                        </div>
                    </div>
    
                </div>`;
            const accordionBody = accordion.querySelector(".accordion-body");

            for (const job of jobsMade) {
                const tempDiv = document.createElement("div");
                // console.log(job)
                const id = job.jobTitle.replaceAll(" ","");
                tempDiv.innerHTML = `<input className="form-check-input mt-0" type="checkbox" id="${id}">
                                     <label class="form-check-label" for="${id}">${job.jobTitle}</label>`;
                accordionBody.appendChild(tempDiv);
            }

            return accordion;
        }
    }

    const foodRelatedJobs = new JobList("Food Related", ["Dining Room Server Assistant***", "Employee Dining Room Crew***", "Fast Food Crew***", "Kitchen Crew***", "Room Attendant***", "Activities Sales Agent", "Bar Lead", "Barista", "Bartender", "Cocktail Server", "Cook", "Dining Room Host", "Dining Room Host Lead", "Dining Room Management", "Dining Room Server", "Employee Pub Crew/Lead", "Fast Food Management", "Food and Beverage Management", "Housekeeping Room Inspector", "Housekeeping Trainer", "Pantry Supervisor", "Snack Shop / Deli Supervisor", "Sous Chef", "Steward", "Storekeeper", "Wrangler/Driver"]);
    document.getElementById("foodRelatedJobs").appendChild(foodRelatedJobs);

    // PAGES
    let displayIndex = 1;
    // TODO: Turn into a class
    const pages = [
        new ApplicationPage(displayIndex++, "#formPage1", $continueOnlyIfAllAcceptedSubmitSection, 0),
        new ApplicationPage(displayIndex++, "#formPage2", $paginationAfter, 10),
        new ApplicationPage(displayIndex++, "#formPage3", $paginationAfter, 20),
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

    // Models
    // $('#myModal').on('shown.bs.modal', function () {
    //     $('#myInput').trigger('focus')
    // })






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