var app = (function() {
    var searchHub = {};
    var myForm = document.querySelector("#propCross");
    var placeInput = document.querySelector("#propLocation");
    var resultBlock = document.querySelector(".propResult");
 
    var perPage;
    var searhUrl;
    var currentListPos = 0;
    var resultContent = "";

    var placeName = (function() {
      var _value = "";
      return {
        get: function() {
          return _value;
        },
         set: function(val) {
          _value = val;
        }
      }
   })();

    // function getplaceName() {
    //   return document.querySelector("#propLocation").value;
    // } 
    function getitemPerPage() {
      var selectItem = document.querySelector("#placesPerPage");
      return selectItem.options[selectItem.selectedIndex].text;
    } 
   
    function eventHandler(event) {
      event.preventDefault();
        placeName.set(document.querySelector("#propLocation").value);
        perPage = getitemPerPage();
        recieveData();
    }
    function recieveData() {
      $.ajax({
        url: "http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&number_of_results=" + perPage + "&place_name=" + placeName.get(),
        method: 'GET',
        timeout: 5000,
        dataType: "jsonp",
        success: function(data) {
          switch(data.response.application_response_code) {
            case "100":
            case "101":
            case "110":
              searchHub[placeName.get()] = data;
              makeResultList(searchHub[placeName.get()].response.listings.slice(currentListPos, currentListPos + perPage - 1));
            break;
            case "200":
            case "202":
              searchHub[placeName.get()] = data;
              makeResultList(searchHub[placeName.get()].response.listings.slice(currentListPos, currentListPos + perPage - 1));
              showLoactionList(data.response);
            break;
            default:
              showErrorList(data.response);
          }
        
        }
        // error: function() {}
    });

    }
    function makeResultList(list) {
      console.log(list);
      list.forEach(renderResult);
      resultBlock.innerHTML = resultContent;
      currentListPos = currentListPos + perPage;

    }

    function renderResult(element) {
      resultContent += "<div class='resultElement'>";
      resultContent += '<img src="' + element.img_url + '" ';
      resultContent += 'class="col-sm-4" alt ="' + element.lister_name + '" />';
      resultContent += '<h4 class="col-sm-8">' + element.lister_name + '</h4>';
      resultContent += '<strong class="col-sm-8">' + element.price_formatted +'</strong>';
      resultContent += '<span class="col-sm-8">' + element.summary + '</span>';
      resultContent += '</div>';
    }


    myForm.addEventListener("submit", eventHandler);
  
 });
 app();

