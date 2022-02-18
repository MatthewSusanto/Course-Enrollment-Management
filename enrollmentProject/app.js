var apiUrl = 'https://corsanywhere.herokuapp.com/http://ec2-54-226-233-21.compute-1.amazonaws.com:8080/api/class';
var counter = 0;

// TOAST STUFF
var notification = new Notif({
    topPos: '90vh',
    classNames: 'success danger',
    autoClose: true,
    autoCloseTimeout: 3600
});

function Notif(option) {
    var el = this;
    el.self = $('.toast-message');
    el.close = this.self.find('.close');
    el.message = el.self.find('.message');
    el.top = option.topPos;
    el.classNames = option.classNames;
    el.autoClose = (typeof option.autoClose === "boolean") ? option.autoClose : false;
    el.autoCloseTimeout = (option.autoClose && typeof option.autoCloseTimeout === "number") ? option.autoCloseTimeout : 3000;
    el.reset = function () {
        el.message.empty();
        el.self.removeClass(el.classNames);
    };
    el.show = function (msg, type) {
        el.reset();
        el.self.css('top', el.top);
        el.message.text(msg);
        el.self.addClass(type);

        if (el.autoClose) {
            setTimeout(function () {
                el.hide();
            }, el.autoCloseTimeout);
        }
    };
    el.hide = function () {
        el.self.css('top', '-100%');
        el.reset();
    };
    el.close.on('click', this.hide);
}

// RESETTING FORM
function closeForm() {
    $('#edit_name').val('');
    $('#edit_email').val('');
    $("#create_name").val("");
    $("#create_email").val("");
    $("#role").val("Student");
    $("#start_year").val("2021");
}

// FETCHING DATA
function runAjax() {
    $('.staff__list').html('');
    $('.students__list').html('');
    $('#student_amount').html('');
    $.get(apiUrl)
        .done(function (data) {
            let studentNumber = 0;
            data.forEach((x) => {
                if (x.role !== "Student") {
                    $('.staff-members').append(`
                    <div class="item clearfix member" id="member-${x.id}">
                        <div class="member__name">${x.name}</div>
                        <div class="member_email">E-mail: <a href = "mailto:${x.email}">${x.email}</a></div>
                        <div class="current_year">Teaching Year: ${x.currentYear}</div>
                        <div class="right clearfix">
                            <div class="member__role">${x.role == "Professor" ? "Instructor" : 'TA'}</div >
                            <div class="item__delete">
                                <a href="#openModal-edit"><button class="item__delete--btn" onclick="openEditForm('${x.name}', '${x.email}', ${x.id})"><i class="fa fa-pencil"></i>
                                </button></a>
                                <button class="item__delete--btn" onclick="deleteMember(${x.id})"> <i class="fa fa-times-circle"></i>
                                </button>
                            </div>
                        </div >
                    </div >
                            `);
                } else {
                    studentNumber++;
                    $('.student-members').append(`
                    <div class="item clearfix member" id="member-${x.id}">
                        <div class="member__name">${x.name}</div>
                        <div class="member_email">E-mail: <a href = "mailto:${x.email}">${x.email}</a></div>
                        <div class="current_year">Study Year: ${x.currentYear}</div>
                        <div class="right clearfix">
                            <div class="member__role"> Student </div>

                            <div class="item__delete">
                                <a href="#openModal-edit"><button onclick="openEditForm('${x.name}', '${x.email}', ${x.id})" class="item__delete--btn"><i class="fa fa-pencil"></i>
                                </button></a>
                                <button class="item__delete--btn" onclick="deleteMember(${x.id})"><i class="fa fa-times-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                            `);
                }
            });
            $('#student_amount').append(studentNumber);
        })
        .fail(function () {
            notification.show('Something is wrong, please try again later', 'danger');
        });
}

// DELETING MEMBERS
function deleteMember(inp) {
    $.ajax({
        url: `https://corsanywhere.herokuapp.com/http://ec2-54-226-233-21.compute-1.amazonaws.com:8080/api/class/${inp}`,
        type: 'DELETE',
        success: function (result) {
            $(`#member-${inp}`).remove();
            runAjax();
        }
    });
};

// EDIT MEMBER
function openEditForm(name, email, id) {
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    $('#edit_name').val(name);
    $('#edit_email').val(email);
    $('#edit-submit').click(() => {
        let toEditName = '';
        let toEditEmail = '';
        toEditName = $('#edit_name').val();
        toEditEmail = $('#edit_email').val();
        if (toEditEmail.match(pattern) && toEditName.length > 1) {
            $.ajax({
                url: `https://corsanywhere.herokuapp.com/http://ec2-54-226-233-21.compute-1.amazonaws.com:8080/api/class/${id}?name=${toEditName}&email=${toEditEmail}`,
                type: "PUT",
                success: function (resultData) {
                    $('.staff__list').html('');
                    $('.students__list').html('');
                    runAjax();
                    closeForm();
                    window.location.href = "#close";
                },
                error: function (request, status, error) {
                    if (request.responseJSON) {
                        if (request.responseJSON.message == "Email is taken") {
                            notification.show('Email is taken', 'danger');
                        }
                    }
                }
            });
        } else {
            notification.show('Input is invalid', 'danger');
        }
    });
}

// SUBMIT FORM
function createForm(event) {
    let createName = $("#create_name").val();
    let createEmail = $("#create_email").val();
    let createRole = $("#role").val();
    let createStartYear = $("#start_year").val();
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
    if ($('#student_amount').html() < 6 || createRole !== "Student") {
        if (createEmail.match(pattern) && createName.length > 1) {
            $.ajax({
                url: "https://corsanywhere.herokuapp.com/http://ec2-54-226-233-21.compute-1.amazonaws.com:8080/api/class",
                type: "POST",
                data: JSON.stringify({
                    name: createName,
                    email: createEmail,
                    joinYear: `${createStartYear}-01-01`,
                    role: createRole
                }),
                Accept: "application/json",
                contentType: "application/json",
                dataType: "",
                success: function (resultData) {
                    runAjax();
                    closeForm();
                    window.location.href = "#close";

                },
                error: function (request, status, error) {
                    if (request.responseJSON) {
                        if (request.responseJSON.message == "Email is taken") {
                            notification.show('Email is taken', 'danger');
                        }
                    }
                }
            });
        } else {
            notification.show('Input is invalid', 'danger');
        }
    } else {
        notification.show('This course is full', 'danger');
    }
}

$('#create-submit').on('click', createForm);
runAjax();




// ======================================================================================================
// ======================================================================================================
// ======================================================================================================
// ======================================================================================================
// ======================================================================================================



// BUDGET CONTROLLER 
var budgetController = (function () {

    var Expense = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {

        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {

            this.percentage = -1;
        }

    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };


    var Income = function (id, description, value) {

        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {

        var sum = 0;

        data.allItems[type].forEach(function (cur) {

            sum = sum + cur.value;

        });
        data.totals[type] = sum;

    };

    var data = {


        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

    };


    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push it into our data structure
            data.allItems[type].push(newItem);


            // return the new element
            return newItem;

        },

        deleteItem: function (type, id) {

            var ids, index;


            // this is like a for loop, but map instead, will return a brand new array, it will return [1 2 5 6 7]
            // ids = [1 2 5 6 7]
            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            // will return the index of the id we want (maybe number?)
            index = ids.indexOf(id);

            //splice is used to remove element
            if (index !== -1) {
                data.allItems[type].splice(index, 1); // 1 here is how many time it removed

            }





        },

        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;

            // calculate the % of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {

            data.allItems.exp.forEach(function (cur) {

                cur.calcPercentage(data.totals.inc);

            });


        },

        getPercentages: function () {

            var allPerc = data.allItems.exp.map(function (cur) {

                return cur.getPercentage();

            });

            return allPerc;


        },

        getBudget: function () {


            return {

                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage

            };

        },



        testing: function () {
            console.log(data);
        }


    };




})();


//UI CONTROLLER
var UIController = (function () {


    var DOMstrings = {

        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function (num, type) {
        /*
        + or - before number
        exactly 2 decimal points
        comma separating thousands

        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00

        */

        num = Math.abs(num);
        num = num.toFixed(2);

        // split is pretty much taking a string, divide it into several piece, put it in a array with the indexes, so like you take the 'something' and split it
        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, int.length);                  // this substr first param is where it starts, the second param is how many character we want (SO start at position 0, and read 1 element)
        }

        dec = numSplit[1];

        return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;

    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);

        }

    };

    return {

        getInput: function () {

            return {

                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)

            };

        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // Create HTML string with placeholder text

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="member__name">%description%</div><div class="right clearfix"><div class="member__role">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="member__name">%description%</div><div class="right clearfix"><div class="member__role">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div>';
            }


            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));


            // Insert HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);



        },

        deleteListItem: function (selectorID) {

            var el = document.getElementById(selectorID);

            el.parentNode.removeChild(el);



        },

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            //we call the slice function, which is an array prototype function, and pass in fields, so it will think that fields is an array
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";



            });

            fieldsArr[0].focus();

        },

        displayBudget: function (obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;



            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }
            else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }


        },

        displayPercentages: function (percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);



            nodeListForEach(fields, function (current, index) {

                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }




            });


        },

        displayMonth: function () {
            var now, year, month, months;

            now = new Date();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + " " + year;




        },

        changedType: function () {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

            nodeListForEach(fields, function (cur) {


                cur.classList.toggle('red-focus');

                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');


            });





        },





        getDOMstrings: function () {

            return DOMstrings;

        }


    };

})();


//GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {


    var setupEventListeners = function () {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }


        });


        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

    };

    var updateBudget = function () {

        // 1. Calculate the budget
        budgetCtrl.calculateBudget();
        // 2. Return the budget

        var budget = budgetCtrl.getBudget();
        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);

    };

    var updatePercentages = function () {

        // 1. Calculate %
        budgetCtrl.calculatePercentages();

        // 2. Read percentages from the budget controller (get it)
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI with the new %
        UICtrl.displayPercentages(percentages);

    };


    var ctrlAddItem = function () {

        var input, newItem;

        // 1. Get the filed input data
        input = UICtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update the percentages
            updatePercentages();


        }


    };

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type, ID;


        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {

            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. delete item from the data sctructure
            budgetCtrl.deleteItem(type, ID);

            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. update and show the new budget
            updateBudget();

            // 4. Calculate and update the percentages
            updatePercentages();


        }

    };



    return {

        init: function () {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }

    };


})(budgetController, UIController);





controller.init();
