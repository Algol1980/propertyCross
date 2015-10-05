var app = function() {
    var searchHub = {};
    var myForm = document.querySelector("#propCross");
    var placeInput = document.querySelector("#propLocation");
    var resultBlock = document.querySelector(".propResult");
    var placeName;
    var perPage;
    var searhUrl;
    var currentListPos = 0;
    var resultContent = "";


    function getplaceName() {
      return document.querySelector("#propLocation").value;
    } 
    function getitemPerPage() {
      var selectItem = document.querySelector("#placesPerPage");
      return selectItem.options[selectItem.selectedIndex].text;
    } 
   
    function eventHandler(event) {
      event.preventDefault();
      if (( event.keyCode === 13) || (event == "submit")) {
        placeName = getplaceName();
        perPage = getitemPerPage();
        recieveData();

      };
    }
    function recieveData() {
      $.ajax({
        url: "http://api.nestoria.co.uk/api?country=uk&pretty=1&action=search_listings&encoding=json&listing_type=buy&page=1&number_of_results=" + perPage + "&place_name=" + placeName,
        method: 'GET',
        timeout: 5000,
        dataType: "jsonp",
        success: function(data) {
        searchHub[placeName] = data;
        makeResultList(searchHub[placeName].response.listings.slice(currentListPos, currentListPos + perPage - 1));
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
    placeInput.addEventListener("keyup", eventHandler);
  
 };
 app();

