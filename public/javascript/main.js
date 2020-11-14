$("#counter").css("display", "none");
var counter = Number($("#counter").text());

// normal car
function Cost(In, cost, rentC, err) {
    $(In).change(function () {
        var rentCost = Number($(cost).text());
        var daysInput = Number($(In).val());
        var price = daysInput * rentCost;
        if (price < 0) {
            $(err).css("display", "block");
            $(rentC).text("0.00")
        }
        else {
            $(err).css("display", "none");
            $(rentC).text(price);
        }
    });
}

for (var i = 0; i <= counter; i++) {
    Cost("#input" + i, "#cost" + i, "#rentCost" + i, ".error" + i);
};


// cermony car

function rent(input, p, driver, decoration, r, err) {
    $(driver).prop("checked", false);
    $(decoration).prop("checked", false);
    $(input).change(function () {
        $(driver).prop("checked", false);
        $(decoration).prop("checked", false);
        var CermonyPrice = Number($(p).text());
        var CermonyDays = Number($(input).val());
        var CRentCost = CermonyPrice * CermonyDays;
        $(r).text(CRentCost);

        if (CRentCost < 0) {
            $(err).css("display", "block");
            $(r).text("0.00");
        }
        else {
            $(err).css("display", "none");
            $(r).text(CRentCost);
        }

        $(driver).click(function () {
            if ($(driver).prop("checked") == true) {
                CRentCost += 100;
                $(r).text(CRentCost)
            }
            else if ($(driver).prop("checked") == false) {
                CRentCost -= 100;
                $(r).text(CRentCost)
            }
        });

        $(decoration).click(function () {
            if ($(decoration).prop("checked") == true) {
                CRentCost += 50;
                $(r).text(CRentCost)
            }
            else if ($(decoration).prop("checked") == false) {
                CRentCost -= 50;
                $(r).text(CRentCost)
            }
        });

    });
}

for (var i = 0; i <= counter; i++) {
    rent("#Input" + i, "#Price" + i, ".cbDriver" + i, ".cbDecoration" + i, "#RentCost" + i, ".error" + i);
}

//installment

var CarPrice;
var carPriceAfter;
var carPriceMonthly;
$(".car-select").click(function () {
    CarPrice = Number($(".car-select").val());
});
// // first pay
$(".first-payment").click(function () {
    $(".displayBlock").css("display", "block");
    if ($(".first-payment").val() === "30%") {
        carPriceAfter = CarPrice + 6000;
        $("#firstPayment").html(carPriceAfter * 0.3);
        carPriceMonthly = carPriceAfter - carPriceAfter * 0.3;
    }
    else if ($(".first-payment").val() === "40%") {
        carPriceAfter = CarPrice + 5000;
        $("#firstPayment").html(carPriceAfter * 0.4);
        carPriceMonthly = carPriceAfter - carPriceAfter * 0.4;
    }
    if ($(".first-payment").val() === "50%") {
        carPriceAfter = CarPrice + 4000;
        $("#firstPayment").html(carPriceAfter * 0.5);
        carPriceMonthly = carPriceAfter - carPriceAfter * 0.5;
    }
});
$(".monthly-Payment").click(function () {
    if ($(".monthly-Payment").val() === "36") {
        $("#monthlyPayment").html(Math.floor(carPriceMonthly / 36));
    }
    else if ($(".monthly-Payment").val() === "48") {
        $("#monthlyPayment").html(Math.floor(carPriceMonthly / 48));
    }

    else if ($(".monthly-Payment").val() === "60") {
        $("#monthlyPayment").html(Math.floor(carPriceMonthly / 60));
    }
});