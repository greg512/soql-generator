function generateSOQL(options) {

    var soqlConfig = {
            select: [], // Required. List of SObject fields.  Could also be SOQL inside of parenthesis for relationship queries
            from: null, // Required. SOBject name
            where: [], // List SOQL Where clauses
            groupyBy: null, // Field to group result by
            orderBy: null, // Order results by this field
            orderByDirection: 'ASC', //Order result by ASC or DESC order
            limit: null, // Limit number of results by this value
            offset: null // Offset results by this value
        },
        soql;

    options = Object.assign(soqlConfig, options);

    if (Array.isArray(options.select) && options.select.length > 0 && options.from !== null) {

        soql = 'SELECT ';
        options.select.forEach(function(field, index, fields) {
            soql += field + (fields.length === index + 1 ? '' : ', ');
        })

        soql += ' FROM ' + options.from;

        if(options.where.length > 0) {
            options.where.forEach(function(whereClause, index, whereClauses) {
                soql += (index === 0 ? ' WHERE ' : ' AND ') + whereClause;
            })
        }

        if(options.groupBy) {soql += ' GROUP BY ' + options.groupBy;}
        if(options.orderBy) {soql += ' ORDER BY ' + options.orderBy + ' ' + options.orderByDirection;}
        if(options.limit) {soql += ' LIMIT ' + options.limit;}
        if(options.offset) {soql += ' OFFSET ' + options.offset;}

        return soql;

    } else {

        if (!Array.isArray(options.select)) {
            throw 'generateSOQL Error:  select must be an array.'
        }
        if (options.select.length === 0) {
            throw 'generateSOQL Error:  Add at least one field to the "select" option.'
        }
        if (options.from === null) {
            throw 'generateSOQL Error:  from is required.'
        }

    }
};

var robot = (function($) {
    return {
        throwWords: function() {
            var containerEl = $('.robot'),
                destinationEl = $('#Mouth'),
                words = ['Name', 'Id', 'Account', 'Type = Customer', '10'],
                duration = 350,
                delay = duration * words.length,
                wordEl;


            var robotFoods = document.createDocumentFragment();
            words.forEach(function(word, i) {
                console.log(word);
                var wordEl = document.createElement('span');
                wordEl.className = 'robot-food';
                wordEl.appendChild(document.createTextNode(word));
                robotFoods.appendChild(wordEl);
            });

            $(containerEl)[0].appendChild(robotFoods);

            $.each($('.robot-food'), function(i, el) {
                console.log(el);
                $('#Mouth').velocity({
                    height: 8
                },{duration: duration * .5}).velocity('reverse', {duration: duration * .5});

                $(el).velocity({
                    opacity: .3,
                    left: destinationEl.offset().left,
                    top: destinationEl.offset().top
                }, {
                    duration: duration,
                    delay: duration * i,
                    display: 'none'
                });
            })


            var soql = generateSOQL({
                select: ['Id', 'Name'],
                from: 'Account',
                where: ["Type = 'Customer'"],
                orderBy: 'Name',
                limit: 10
            });
            window.setTimeout(function() {
                var soqlEl = $('.alert-soql').addClass('robot-vomit').text(soql);
                $(soqlEl).velocity({
                    translateX: [0, destinationEl.offset().left],
                    translateY: [0, destinationEl.offset().top],
                    opacity: [1, 0]
                })
            }, delay)

        }
    }

}(jQuery));


robot.throwWords();
