

let restList = [];
let foodList = [];
let activeItem = 0;
let count = 0;


function imagePreview (input) {
    const [file] = input[0].files
    if (file) {
        let src = URL.createObjectURL(file)
        input.parents('form').find('.image-preview').show();
        input.parents('form').find('.image-preview img').attr('src', src);
        input.parents('form').find('.image-preview input').val(src)
    }
}

$('input[type="file"]').on('change', function() {
    imagePreview ($(this))
})


// Add res;
$('#addResForm').on('submit', function(e) {
    e.preventDefault();
    let formInfo = $(this).serializeArray();
    $('#addResForm')[0].reset();
    $(this).find('.image-preview').hide();

    let item = {};

    // Add data;
    formInfo.forEach(elem => {
        item[elem.name] = elem.value;
    });
    
    item.id = count;
    count++;

    restList.push(item);
    

    $('#restaurantList').prepend( restaurant(item.id, item.name, item.image, item.address, item.about, item.ratting) );

})


// Restaurant
function restaurant(id, name, image, address, about, ratting) {
    return `<div class="col-lg-4 col-md-6 mb-4">
    <div class="res-item bg-light shadow p-3">
            <img class="img-fluid w-100" src="${image}" />
            <span class="d-none">${address}</span>
            <div class="text">
                <div class="title">
                    <h3>${name}</h3>
                    <div class="yum">
                        <span class="yum-count">${ratting}</span>
                        <span>Yums</span>
                    </div>
                </div>
                <div class="des">
                    <p>${about}</p>
                </div>
                <div class="action">
                    <button data-id="${id}" class="btn btn-secondary btn-sm me-1 viewFood" data-bs-toggle="modal" data-bs-target="#viewRes">View Restaurant</button>
                    <button data-id="${id}" class="btn btn-warning btn-sm me-1" data-bs-toggle="modal" data-bs-target="#addFood">Add Food</button>
                </div>
            </div>
    </div>
</div>`;
}



// Add Food;
$('#add_food').on('submit', function(e) {
    e.preventDefault();

    let formInfo = $(this).serializeArray();
    $('#add_food')[0].reset();
    $(this).find('.image-preview').hide();

    let item = {};

    // Add data;
    formInfo.forEach(elem => {
        item[elem.name] = elem.value;
    });
    
    item.id = activeItem;

    foodList.push(item);

    console.log(foodList);
})

$("body").on("click", function(e) {
    if($(e.target).is("[data-id]")) {
        activeItem = e.target.getAttribute('data-id');
    }

    if($(e.target).is(".viewFood")) {
        let foods = foodList.filter(function(elem) {
            return elem.id == activeItem;
        })

        let resImg = e.target.closest('.res-item').querySelector('img').getAttribute('src');
        $('#viewRes .modal-body > img').attr('src', resImg);

        // foods = foods.reverse();

        let tr = (n, image, name, price, size) => {
            return `<tr>
            <td>${n}</td>
            <td>
            <img width="100" src="${image}" alt="image">
            </td>
            <td>${name}</td>
            <td>${price}</td>
            <td>${size}</td>
          </tr>`
        }

        foods.forEach(function(elem, index) {
            $('#food_table').prepend( tr(index+1, elem.image, elem.name, elem.price, elem.size) )
        })
    }


});