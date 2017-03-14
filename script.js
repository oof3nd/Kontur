$(document).ready(function() {
  var $elem = $('.autocomplete').autocomplete({
      delay: 0,
      minLength: 2,
      autoFocus: true,
      source: function(request, response) {
        $.ajax({
          url: "kladr.json",
          type: "GET",
          dataType: "json",
          cache: false,
          data: {
            term: request.term
          },
          success: function(data) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            var chosenContacts = $.grep(data, function(item) {
              return matcher.test(item.City) || matcher.test(item.Id);
            });
            var chosenEntries = $.map(chosenContacts, function(item) {
              return {
                 label: item.City,
                value: item.City
              };
            });
            response(chosenEntries.slice(0, 5));
          }
        });
      },
      response: function(event, ui) {
        if (!ui.content.length) {
          var noResult = {
            value: "",
            label: "Не найдено"
          };
          ui.content.push(noResult);
          $("#message").text("Выберите значение из списка");
          $('.autocomplete').css({
            "border": "2px solid #FF0000"
          });
        } else {
          $("#message").empty();
          $('.autocomplete').css({
            "border": "2px solid #404040"
          });
        }
      }
    }),
    elemAutocomplete = $elem.data("ui-autocomplete") || $elem.data("autocomplete");
  if (elemAutocomplete) {
    elemAutocomplete._renderItem = function(ul, item) {
      var newText = String(item.label).replace(
        new RegExp(this.term, "gi"),
        "<span class='ui-state-highlight'>$&</span>");
      return $("<li></li>")
        .data("item.autocomplete", item)
        .append("<a>" + newText + "</a>")
        .appendTo(ul);
    };
  }
  $('.autocomplete').click(function() {
    $(this).select();
  });
});