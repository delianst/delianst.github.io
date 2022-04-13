$(document).ready(function () {
    "use strict";

    let sliderContents = [];
    let activeItem = null;
    let newSlider = {};
    let updateItems = null;

    // Modal slider;

    function makeSliderElements() {
        function sliderItem(src, alt, comment) {
            return `<div class="slider_item">
                    <img src="${src}" alt="${alt}">
                    <div class="review">
                        <div class="img">
                            <img src="assets/images/profilePic.png" alt="img">
                        </div>
                        <div class="text pb-0">
                            <p class="m-0" id="preview_content">
                                ${comment}
                            </p>
                        </div>
                    </div>
                </div>`;
        }

        let stallPreviewItem = (src, alt, index) => {
            return `
                    <div class="single_item ${index == 0 && "active"}" data-index="${index}">
                        <img src="${src}" alt="${alt}">
                    </div>
                `;
        };

        $("#modalSliderContainer").html("");
        $("#small_preview").html("");

        sliderContents.forEach((slideItem, index) => {
            $("#modalSliderContainer").append(sliderItem(slideItem.src, slideItem.alt, slideItem.comment));
            $("#small_preview").append(stallPreviewItem(slideItem.src, slideItem.alt, index));
        });

        modalSlider();

        $(`[data-index]`).removeClass("active");
        $(`[data-index="0"]`).addClass("active");
    }

    function modalSlider() {
        const sliderItems = document.querySelectorAll(".slider_item");
        const sliderArrow = document.querySelector(".slider_arrows");
        const sliderActive = document.querySelector(".cornet");
        const sliderTotal = document.querySelector(".total");

        let currentItem = 0;
        sliderActive.innerText = currentItem + 1;

        sliderTotal.innerText = sliderItems.length;
        function setStyleIntoSlideItem() {
            sliderItems.forEach((item, index) => {
                item.style.transform = `translateX(${(index - currentItem) * 100}%)`;
            });
        }
        setStyleIntoSlideItem();
        // Slider  Arrows;
        sliderArrow.addEventListener("click", (e) => {
            const target = e.target.closest("button");

            if (target) {
                if (target.classList.contains("slideLeft")) {
                    currentItem > 0 && sliderItems.length - 1 > currentItem - 1 ? currentItem-- : (currentItem = sliderItems.length - 1);
                    setStyleIntoSlideItem();
                    sliderActive.innerText = currentItem + 1;
                } else {
                    sliderItems.length - 1 > currentItem ? currentItem++ : (currentItem = 0);
                    setStyleIntoSlideItem();
                    sliderActive.innerText = currentItem + 1;
                }
            }

            $(`[data-index]`).removeClass("active");
            $(`[data-index="${currentItem}"]`).addClass("active");
        });

        $(".small_preview .single_item").on("click", function () {
            let itemIndex = $(this).attr("data-index");
            currentItem = itemIndex;
            setStyleIntoSlideItem();
            $(`[data-index]`).removeClass("active");
            $(`[data-index="${currentItem}"]`).addClass("active");

            sliderActive.innerText = Number(itemIndex) + 1;
        });
    }

    // Filter btn;
    $(".filter-nav li").on("click", function () {
        $(".filter-nav li").removeClass("active");
        $(this).addClass("active");
    });

    // Set food item into element;
    function singleFoodItem(id, src, alt, title, details, category) {
        let html = `
            <div class="col-md-4 mix ${category}">
                <div class="food-item">
                    <div class="img">
                        <img src="${src}" alt="${alt}">
                    </div>
                    <div class="text">
                        <div class="top">
                            <h3 class="pe-1 mb-0">${title}</h3>
                            <div class="love">
                                <span class="count fs-5 fw-bold pe-2">0</span>
                                <span class="title fs-5 fw-bold pe-2"></span>

                                <button class="btn btn-secondary loveBtn" data-count="${0}">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                        <p>${details}</p>
                        <div class="bottom">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary view_btn" data-id="${id}" >View</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary edit_btn" data-id="${id}" >Edit</button>
                            </div>
                            <small class="text-muted"><i class="fas fa-carrot"></i> 500</small>
                            <small class="text-muted"><i class="fas fa-tshirt"></i> Large</small>
                            <small class="text-muted">9 mins</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return html;
    }

    foods.forEach((item) => {
        $("#foods").append(singleFoodItem(item.id, item.src, item.alt, item.title, item.details, item.category));
    });

    // View modal;
    $(".view_btn").on("click", function (e) {
        e.preventDefault();
        var myModal = new bootstrap.Modal(document.getElementById("viewModal"), {});
        myModal.show();
        let dataId = $(this).attr("data-id");
        const checkExistProduct = foods.findIndex((item) => item.id == dataId);
        if (checkExistProduct === -1) return;
        if (!updateItems) {
            sliderContents = foods[checkExistProduct].sliders;
        } else {
            sliderContents = updateItems[checkExistProduct].sliders;
        }
        makeSliderElements();
    });

    // Edit modal;
    $(".edit_btn").on("click", function (e) {
        e.preventDefault();
        var myModal = new bootstrap.Modal(document.getElementById("editModal"), {});
        myModal.show();

        let dataId = $(this).attr("data-id");
        activeItem = dataId;

        $("#image_upload_form")[0].reset();
        $("#image_preview").html("");
    });

    // Upload image using edit modal;
    $("#upload_image_btn").on("click", function () {
        const checkExistProduct = foods.findIndex((item) => item.id == activeItem);
        if (checkExistProduct === -1) return;

        newSlider.title = $("#comment").val();

        if (newSlider.title && newSlider.src) {
            let sliderItems = foods[checkExistProduct].sliders;
            let newItem = {
                src: newSlider.src,
                alt: newSlider.title,
                comment: newSlider.title,
            };
            (sliderItems = [newItem, ...sliderItems]),
                (foods = foods.map((itemSet, index) => {
                    if (index == checkExistProduct) {
                        return {
                            ...itemSet,
                            sliders: sliderItems,
                        };
                    }

                    return itemSet;
                }));

            updateItems = foods;

            $("#editModal").removeClass("in");
            $(".modal-backdrop").fadeOut(200);
            $("#editModal").fadeOut(200);
            $("body").removeAttr("style");
        }
    });

    $("#upload").on("change", function (e) {
        const [file] = e.target.files;
        if (file) {
            let html = `<img src="${URL.createObjectURL(file)}" alt="preview">`;
            $("#image_preview").html(html);
            newSlider.src = URL.createObjectURL(file);
        }
    });

    // Love count;
    $(".loveBtn").on("click", function () {
        let countStatus = "";
        let currentCount = Number($(this).attr("data-count"));
        $(this).attr("data-count", currentCount + 1);
        $(this)
            .siblings(".count")
            .html(currentCount + 1);
        if (currentCount <= 0) {
            countStatus = " yum";
        } else {
            countStatus = " yums";
        }
        $(this).siblings(".title").html(countStatus);
    });

    // Scroll to top;
    $(".back_to_top").on("click", function () {
        $("html, body").animate({
            scrollTop: 0,
        });
    });
});
