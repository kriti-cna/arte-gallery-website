

$(document).ready(function() {
  
  $('#languageDropdown').click(function() {
    $('.dropdown-menu').toggleClass('show');
  });

  $('.dropdown-item').click(function() {
    var language = $(this).text().trim();

    if (language === 'English' && window.location.href.includes('_rs.html')) {
      var currentUrl = window.location.href;
      var newUrl = currentUrl.replace('_rs.html', '.html');
      window.location.href = newUrl;
    } else if (language === 'Serbian' && !window.location.href.includes('_rs.html')) {
      var currentUrl = window.location.href;
      var newUrl = currentUrl.replace('.html', '_rs.html');
      window.location.href = newUrl;
    }
  });

  $('.carousel-control-prev').click(function() {
    $(this).siblings('.carousel-inner').carousel('prev');
  });

  $('.carousel-control-next').click(function() {
    $(this).siblings('.carousel-inner').carousel('next');
  });

  $('.sub-link').on('click', function(e) {
    e.preventDefault(); 
    window.location.href = $(this).attr('href'); 
  });

  $('.sub-link').on('click', function(e) {
    e.stopPropagation(); 
  });

  $(document).click(function(e) {
    if (!$(e.target).hasClass('sub-link')) {
      $('.dropdown-menu').hide();
    }
  });

  $('.dropdown-toggle').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $(this).next('.dropdown-menu').toggle();
  });

  $('#search-input, #search-artist-input').on('input', function() {
    var searchQuery = $('#search-input').val().toLowerCase().trim();
    var artistQuery = $('#search-artist-input').val().toLowerCase().trim();
    
    $('.painting-card').each(function() {
      var paintingName = $(this).find('.painting-name').text().toLowerCase().trim();
      var artistName = $(this).find('.artist-name').text().toLowerCase().trim().replace('artist: ', '');
      var shouldDisplay = true;

      if (searchQuery && !paintingName.includes(searchQuery)) {
        shouldDisplay = false;
      }

      if (artistQuery && !artistName.includes(artistQuery)) {
        shouldDisplay = false;
      }

      if (shouldDisplay) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  });
  
  var currentSort = ""; 

  $("#button1").click(function() {
    if (currentSort !== "name") {
      sortByName();
      currentSort = "name";
    }
  });

  $("#button2").click(function() {
    if (currentSort !== "artist") {
      sortByArtist();
      currentSort = "artist";
    }
  });

  $("#button3").click(function() {
    if (currentSort !== "last-name") {
      sortByLastName();
      currentSort = "last-name";
    }
  });

  $("#button4").click(function() {
    if (currentSort !== "price") {
      sortByPrice();
      currentSort = "price";
    }
  });

  $("#button5").click(function() {
    if (currentSort !== "age") {
      sortByAge();
      currentSort = "age";
    }
  });


  $('#offerForm').submit(function(event) {
    event.preventDefault();
  
    var artworkId = '1'; 
    var username = $('#username').val();
    var price = $('#price').val();
    var comment = $('#comment').val();
  
    // Create the offer object
    var offerData = {
      username: username,
      price: price,
      comment: comment
    };
  
    // Store the offer in the local storage
    storeOffer(offerData);
  
    // Display the updated offers
    displayOffers();
    //colorOffers();
  
    // Reset the form
    this.reset();
  });



  displayOffers();
  displayUserOffers();

});

var username="elena.sladojevic";

function initMap() {
  const galleryLocation = { lat: 40.7128, lng: -74.0060 }; // Replace with the actual coordinates


  const map = new google.maps.Map(document.getElementById("map"), {
    center: galleryLocation,
    zoom: 15, 
  });


  const marker = new google.maps.Marker({
    position: galleryLocation,
    map: map,
    title: "Arte Gallery Belgrade",
  });
};

window.onload = function() {
  $('.carousel').carousel();
  initMap();
};


function sortByName() {
  var cards = $(".painting-card");
  cards.sort(function(a, b) {
    var titleA = $(a).find(".painting-name").text().toUpperCase();
    var titleB = $(b).find(".painting-name").text().toUpperCase();
    return titleA.localeCompare(titleB);
  });
  $("#paintings-container").empty().append(cards);
};

function sortByArtist() {
  var cards = $(".painting-card");
  cards.sort(function(a, b) {
    var artistA = $(a).find(".artist-name").text().toUpperCase();
    var artistB = $(b).find(".artist-name").text().toUpperCase();
    return artistA.localeCompare(artistB);
  });
  $("#paintings-container").empty().append(cards);
};

function submitForm(event) {
  event.preventDefault();

  var username = $('#username').val();
  var price = $('#price').val();
  var comment = $('#comment').val();

  var offerData = {
    username: username,
    price: price,
    comment: comment
  };

  var offers = JSON.parse(localStorage.getItem('offers')) || [];

  offers.push(offerData);

  localStorage.setItem('offers', JSON.stringify(offers));

  $('#username').val('');
  $('#price').val('');
  $('#comment').val('');

  displayOffers();
};

function displayOffers() {
  var offersTableBody = $('#offersTableBody');
  offersTableBody.empty();


  var artworkId = $('.artwork').data('artwork-id');


  var offers = retrieveOffers(artworkId);


  if (offers && offers.length > 0) {

    for (var i = 0; i < offers.length; i++) {
      var offerData = offers[i];
      var row = $('<tr>');
      row.append($('<td>').text(offerData.username));
      row.append($('<td>').text(offerData.price));
      row.append($('<td>').text(offerData.comment));
      offersTableBody.append(row);
    }
  }
}

function storeOffer(offerData) {

  var artworkId = $('.artwork').data('artwork-id');

  var offers = JSON.parse(localStorage.getItem('offers')) || {};

  var artworkOffers = offers[artworkId] || [];

  artworkOffers.push(offerData);

  offers[artworkId] = artworkOffers;

  localStorage.setItem('offers', JSON.stringify(offers));
}


function retrieveOffers(artworkId) {
  var offers = JSON.parse(localStorage.getItem('offers'));


  if (offers && artworkId in offers) {
    return offers[artworkId];
  }

  return []; 
}

function displayUserOffers() {
  var offersTableBody = $('#userOffersTableBody');
  offersTableBody.empty();
  var offers = retrieveUserOffers(username);

  for (var id in offers) {
    if (offers.hasOwnProperty(id)) {
      var artworkOffers = offers[id];

      for (var i = 0; i < artworkOffers.length; i++) {
        var offerData = artworkOffers[i];
        var row = $('<tr>');
        row.append($('<td>').text(offerData.username));
        row.append($('<td>').text(offerData.price));

        
        var artworkName = getArtworkName(id);
        row.append($('<td>').text(artworkName));

        row.append($('<td>').text(offerData.comment));

        
        var deleteButton = $('<button>')
          .text('Delete')
          .data('offerId', id)
          .data('price', offerData.price)
          .data('comment', offerData.comment)
          .click(deleteOffer);
        row.append($('<td>').append(deleteButton));

        offersTableBody.append(row);
      }
    }
  }
}


function deleteOffer() {
  var offerId = $(this).data('offerId');
  var offerPrice = $(this).data('price');
  var offerComment = $(this).data('comment');
  var offers = retrieveUserOffers(username);

  if (offers.hasOwnProperty(offerId)) {
    var artworkOffers = offers[offerId];

    
    var filteredOffers = artworkOffers.filter(function (offer) {
      return (
        offer.username !== username ||
        offer.price !== offerPrice ||
        offer.comment !== offerComment
      );
    });

    if (filteredOffers.length < artworkOffers.length) {
      
      offers[offerId] = filteredOffers;

      localStorage.setItem('offers', JSON.stringify(offers));
      displayUserOffers();
    }
  }
}

function retrieveUserOffers(username) {
  
  var offers = JSON.parse(localStorage.getItem('offers'));

  var userOffers = {};

  if (offers) {
    for (var id in offers) {
      if (offers.hasOwnProperty(id)) {
        var artworkOffers = offers[id];

        var filteredOffers = artworkOffers.filter(function (offer) {
          return offer.username === username;
        });

        if (filteredOffers.length > 0) {
          userOffers[id] = filteredOffers;
        }
      }
    }
  }

  return userOffers;
}

function getArtworkName(artworkId) {
  var artworks = {
    1: { name: "Panda" },
    2: { name: "Whitney Houston" },
    3: { name: "Moscow" },
    4: { name: "Laocoon and his Sons" },
    5: { name: "Illabi" },
    6: { name: "Ostrich" },
    7: { name: "Orca" },
    8: { name: "Cistac" },
    9: { name: "Castle" },
  };

  var artwork = artworks[artworkId];

  
  return artwork ? artwork.name : "Unknown Artwork";
}

function colorOffers() {
  var estimatedPriceText = $('p:contains("Estimated Value:")').text();
  var estimatedPrice = parseInt(estimatedPriceText.split(':')[1].trim().replace('$', ''));

  $('#offersTableBody tr').each(function() {
    var priceText = $(this).find('td:nth-child(2)').text();
    var price = parseInt(priceText.replace('$', '').trim());

    if (price > estimatedPrice) {
      $(this).css('color', 'blue');
    }
  });
}

function colorMyOffers() {
  var tableRows = document.querySelectorAll("#userOffersTableBody tr");

  tableRows.forEach(function(row) {
    var priceCell = row.querySelector("td:nth-child(2)");
    var price = parseFloat(priceCell.innerText.replace("$", ""));

    if (price < 100) {
      priceCell.style.backgroundColor = "green";
      priceCell.style.color = "white";
    } else if (price >= 100 && price < 500) {
      priceCell.style.backgroundColor = "orange";
      priceCell.style.color = "black";
    } else {
      priceCell.style.backgroundColor = "red";
      priceCell.style.color = "white";
    }
  });
}

function sortByLastName() {
  var paintings = $(".painting-card");
  paintings.sort(function(a, b) {
    var lastNameA = $(a).find(".artist-name").text().split(" ").pop();
    var lastNameB = $(b).find(".artist-name").text().split(" ").pop();
    return lastNameA.localeCompare(lastNameB);
  });
  $("#paintings-container").empty().append(paintings);
}

function sortByPrice() {
  var paintings = $(".painting-card");
  paintings.sort(function(a, b) {
    var priceA = parseFloat($(a).find(".price-name").text().replace(/[^\d.-]/g, ""));
    var priceB = parseFloat($(b).find(".price-name").text().replace(/[^\d.-]/g, ""));
    return priceA - priceB;
  });
  $("#paintings-container").empty().append(paintings);
}

function sortByAge() {
  var paintings = $(".painting-card");
  paintings.sort(function(a, b) {
    var ageA = parseInt($(a).find(".age-name").text().split(" ")[1]);
    var ageB = parseInt($(b).find(".age-name").text().split(" ")[1]);
    return ageA - ageB;
  });
  $("#paintings-container").empty().append(paintings);
}

function highlightExpensivePaintings() {
  var paintings = $(".painting-card");
  paintings.each(function() {
    var price = parseFloat($(this).find(".price-name").text().replace(/[^\d.-]/g, ""));
    if (price > 1000) {
      $(this).addClass("expensive");
    } else {
      $(this).removeClass("expensive");
    }
  });
}
