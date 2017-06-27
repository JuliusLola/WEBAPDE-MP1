var photos;
var albums;
var photonumber;
var albumnumber;
var originalPhotoNum;
var originalAlbumNum;
var preview = 1;

$(document).ready(function(){
    $('#photofilter').click(function(){
        reloadPhoto();
        loadPhotos();
        document.getElementById('photofilter').style.color= "#0099cc";
        document.getElementById('photofilter').style.backgroundColor = "aliceblue";
        document.getElementById('photofilter').style.boxShadow = "0.5px 0.5px 1px rgba(89,89,89,1)";
        
        document.getElementById('albumfilter').style.color= "buttontext";
        document.getElementById('albumfilter').style.backgroundColor = "buttonface";
        document.getElementById('albumfilter').style.boxShadow = "none";
    });
    
    $('#albumfilter').click(function(){
        swapStream();
        albumnumber = originalAlbumNum;
        photonumber = originalPhotoNum;
        preview = 1;
        loadAlbums();
        document.getElementById('albumfilter').style.color= "#0099cc";
        document.getElementById('albumfilter').style.backgroundColor = "aliceblue";
        document.getElementById('albumfilter').style.boxShadow = "0.5px 0.5px 1px rgba(89,89,89,1)";
        
        document.getElementById('photofilter').style.color= "buttontext";
        document.getElementById('photofilter').style.backgroundColor = "buttonface";
        document.getElementById('photofilter').style.boxShadow = "none";
    });
});

function reloadPhoto() {
    swapStream();
    photonumber = originalPhotoNum;
    preview = 1;
}

function loadPhotos() {
    
    var i;
    var end =0;
    var url = new URL(window.location.href);
    var albId = parseInt(url.searchParams.get("album"));
    if ($("#endofpage").length) {
        $("#endofpage").remove();
    }

    var photocontainer = document.createElement("div");
    if(!isNaN(albId)) {
        var photo = photos[photonumber-1];
        while(photo.albumId != albId) {
            --photonumber;
            photo = photos[photonumber-1];
        }
        end = photonumber;
        while(photo.albumId == albId) {
            --end;
            photo = photos[end];
        }
        ++end;
    }
    
    
    for(i = 0 ; i < 15 && photonumber > end; i++) {
        var photo = photos[photonumber-1];
        //var album = albums[photo.albumId - 1];
        //console.log('post ' + postnumber + user.name);
        
        var image = document.createElement("img");
        $(image).addClass("img");
        $(image).attr('src', photo.thumbnailUrl);
        $(image).attr('alt',photo.url);
        $(image).attr('id',photo.id);
        $(image).attr('onclick',"openModal();currentSlide("+preview+")");
        
        var photosmall = document.createElement("div");
        $(photosmall).append(image);
        $(photosmall).addClass("photosmall"); 
        
        $(photocontainer).append(photosmall);
        
        var modalImg = document.createElement("img");
        $(modalImg).addClass("modalImg")
        $(modalImg).attr('src', photo.url);
        $(modalImg).attr('alt', photo.title);
        $(modalImg).attr('id', photo.albumId);
        
        var modalBig = document.createElement("div");
        $(modalBig).addClass("mySlides");
        $(modalBig).append(modalImg);
        $(".modal-content").append(modalBig);
        
        var captions = document.createElement("div");
        $(captions).addClass("captions");
        $(captions).append("<p>"+ photo.title +"</p>");
        var link1 = $("<a>");
        $(link1).attr("href", "photos.html?album=" + photo.albumId);           //link to album
        $(link1).text("From: " + albums[parseInt(photo.albumId)-1].title);
        var link2 = $("<a>");
        $(link2).attr("href", "profiles.html?user=" + users[parseInt(albums[parseInt(photo.albumId)-1].userId) - 1].id);
        $(link2).text("By: " + users[parseInt(albums[parseInt(photo.albumId)-1].userId) - 1].username);
        $(captions).append(link1);
        $(captions).append(" ");
        $(captions).append(link2);
        $(".caption-container").append(captions);
        
        preview++;
        photonumber--;
    }
    
     $("#maincontainer").append(photocontainer);
    
    if(photos.length == 0) {
        var nores = document.createElement("div");
        $(nores).text('No search results');
        $(nores).attr("id", "noresults");

        $("#maincontainer").append(end);
    }

    if(photonumber > 0) {
        var end = document.createElement("div");
        var loadbtn = document.createElement("button");

        $(end).attr("id", "endofpage");
        $(loadbtn).attr("id", "loadbtn");

        $(end).append(loadbtn);
        $("#maincontainer").append(end);

        $('#loadbtn').click(function(){
            loadPhotos();
        });
    } else {
        var end = document.createElement("div");
        $(end).css({
            'background-image': 'url(end.png)'
        });
        $(end).attr("id", "endofpage");

        $("#maincontainer").append(end);
    }
}

function loadAlbums() {
    
    var i;
    
    if ($("#endofpage").length) {
        $("#endofpage").remove();
    }

    var photocontainer = document.createElement("div");
    $(photocontainer).attr('id', "photocontainer");
    
    for(i = 0 ; i < 15 && albumnumber > 0; i++) {
        //var album = albums[photo.albumId - 1];
        //console.log('post ' + postnumber + user.name);
        var flag = true;
        var search;
        while(flag && (albumnumber > 0)){
            var photo = photos[photonumber-1];
            if(photo.albumId == albumnumber){
                flag = false;   
            }
            photonumber--;
        }
        var image = document.createElement("img");
        $(image).addClass("img");
        $(image).attr('src', photo.thumbnailUrl);
        $(image).attr('alt',photo.url);
        $(image).attr('id',photo.id);
        $(image).attr("onclick", "reloadPhoto();removeModals();findPhotoAlbum("+photo.albumId+")");
        
        var photosmall = document.createElement("div");
        $(photosmall).append(image);
        $(photosmall).addClass("photosmall"); 
        
        $(photocontainer).append(photosmall);
        
        photonumber = originalPhotoNum;
        albumnumber--;
    }
    
     $("#maincontainer").append(photocontainer);
    
    if(albums.length == 0) {
        var nores = document.createElement("div");
        $(nores).text('No search results');
        $(nores).attr("id", "noresults");

        $("#maincontainer").append(end);
    }

    if(albumnumber > 0) {
        var end = document.createElement("div");
        var loadbtn = document.createElement("button");

        $(end).attr("id", "endofpage");
        $(loadbtn).attr("id", "loadbtn");

        $(end).append(loadbtn);
        $("#maincontainer").append(end);

        $('#loadbtn').click(function(){
            loadAlbums();
        });
    } else {
        var end = document.createElement("div");
        $(end).css({
            'background-image': 'url(end.png)'
        });
        $(end).attr("id", "endofpage");

        $("#maincontainer").append(end);
    }
}


function swapStream(){
    $('#maincontainer').remove();
    var maincont = document.createElement("div");

    $(maincont).attr("id", "maincontainer");

    $("#main").append(maincont);
}

function openModal() {
  document.getElementById('myModal').style.display = "block";
  //swapStream();
}

function closeModal() {
  document.getElementById('myModal').style.display = "none";
  //photonumber = originalPhotoNum;
  //loadPhotos();
}

var slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  //var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementsByClassName("captions");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
      captionText[i].style.display = "none";
  }
//  for (i = 0; i < dots.length; i++) {
//      dots[i].className = dots[i].className.replace(" active", "");
//  }
  slides[slideIndex-1].style.display = "block";
  captionText[slideIndex-1].style.display = "block";    
  //dots[slideIndex-1].className += " active";
  //captionText.innerHTML = slides[slideIndex-1].alt;
  //captionText.textContent(slides[slideIndex-1].alt);    
}

function findPhotoAlbum(a) {
    //a is the album id
    var i;
    
    if ($("#endofpage").length) {
        $("#endofpage").remove();
    }

    var photocontainer = document.createElement("div");
    
    for(i = 0 ; i < 15 && photonumber > 0; i++) {
        var photo = photos[photonumber-1];
        //var album = albums[photo.albumId - 1];
        //console.log('post ' + postnumber + user.name);
        
        var flag = true;
        var search;
        while(flag && (photonumber > 0)){
            var photo = photos[photonumber-1];
            if(photo.albumId == a){
                flag = false;   
            }
            photonumber--;
        }
        
        var image = document.createElement("img");
        $(image).addClass("img");
        $(image).attr('src', photo.thumbnailUrl);
        $(image).attr('alt',photo.url);
        $(image).attr('id',photo.id);
        $(image).attr('onclick',"openModal();currentSlide("+preview+")");
        
        var photosmall = document.createElement("div");
        $(photosmall).append(image);
        $(photosmall).addClass("photosmall"); 
        
        $(photocontainer).append(photosmall);
        
        var modalImg = document.createElement("img");
        $(modalImg).addClass("modalImg")
        $(modalImg).attr('src', photo.url);
        $(modalImg).attr('alt', photo.title);
        $(modalImg).attr('id', photo.albumId);
        
        var modalBig = document.createElement("div");
        $(modalBig).addClass("mySlides");
        $(modalBig).append(modalImg);
        $(".modal-content").append(modalBig);
        
        var captions = document.createElement("div");
        $(captions).addClass("captions");
        $(captions).append("<p>"+ photo.title +"</p>");
        var link1 = $("<a>");
        $(link1).attr("href", "photos.html?album=" + photos.albumId);           //link to album
        $(link1).text("From: " + albums[parseInt(photo.albumId)-1].title);
        var link2 = $("<a>");
        $(link2).attr("href", "profiles.html?user=" + users[parseInt(albums[parseInt(photo.albumId)-1].userId) - 1].id);
        $(link2).text("By: " + users[parseInt(albums[parseInt(photo.albumId)-1].userId) - 1].username);
        $(captions).append(link1);
        $(captions).append(" ");
        $(captions).append(link2);
        $(".caption-container").append(captions);
        
        preview++;
        //photonumber = originalPhotoNum;
    }
    
     $("#maincontainer").append(photocontainer);
    
    if(photos.length == 0) {
        var nores = document.createElement("div");
        $(nores).text('No search results');
        $(nores).attr("id", "noresults");

        $("#maincontainer").append(end);
    }

    if(photonumber > 0) {
        var end = document.createElement("div");
        var loadbtn = document.createElement("button");

        $(end).attr("id", "endofpage");
        $(loadbtn).attr("id", "loadbtn");

        $(end).append(loadbtn);
        $("#maincontainer").append(end);

        $('#loadbtn').click(function(){
            findPhotoAlbum(a);
        });
    } else {
        var end = document.createElement("div");
        $(end).css({
            'background-image': 'url(end.png)'
        });
        $(end).attr("id", "endofpage");

        $("#maincontainer").append(end);
    }
}

//for the album search thingy
function findAlbum() {
    var i;
    
    if ($("#endofpage").length) {
        $("#endofpage").remove();
    }

    var photocontainer = document.createElement("div");
    $(photocontainer).attr('id', "photocontainer");
    
    photonumber = photos.length;
    albumnumber = albums.length;
    
    for(i = 0 ; i < 15 && albumnumber > 0; i++) {
        //var album = albums[photo.albumId - 1];
        //console.log('post ' + postnumber + user.name);
        var flag = true;
        var search;
        while(flag && (albumnumber > 0)){
            var photo = photos[photonumber-1];
            if(photo.albumId == albums[albumnumber-1].id){
                flag = false;   
            }
            photonumber--;
        }
        var image = document.createElement("img");
        $(image).addClass("img");
        $(image).attr('src', photo.thumbnailUrl);
        $(image).attr('alt',photo.url);
        $(image).attr('id',photo.id);
        $(image).attr("onclick", "openModal();currentSlide("+preview+")");
        
        var photosmall = document.createElement("div");
        $(photosmall).append(image);
        $(photosmall).addClass("photosmall"); 
        
        $(photocontainer).append(photosmall);
        
        var modalImg = document.createElement("img");
        $(modalImg).addClass("modalImg")
        $(modalImg).attr('src', photo.url);
        $(modalImg).attr('alt', photo.title);
        $(modalImg).attr('id', photo.albumId);
        
        var modalBig = document.createElement("div");
        $(modalBig).addClass("mySlides");
        $(modalBig).append(modalImg);
        $(".modal-content").append(modalBig);
        
        var captions = document.createElement("div");
        $(captions).addClass("captions");
        $(captions).append("<p>"+ photo.title +"</p>");
        var link1 = $("<a>");
        $(link1).attr("href", "photos.html?album=" + photos.albumId);           //link to album
        $(link1).text("From: " + albums[albumnumber-1].title);
        var link2 = $("<a>");
        $(link2).attr("href", "profiles.html?user=" + users[parseInt(albums[albumnumber-1].userId) - 1].id);
        $(link2).text("By: " + users[parseInt(albums[albumnumber-1].userId) - 1].username);
        $(captions).append(link1);
        $(captions).append(" ");
        $(captions).append(link2);
        $(".caption-container").append(captions);
        
        photonumber = photos.length;
        albumnumber--;
        preview++;
    }
    
     $("#maincontainer").append(photocontainer);
    
    if(albums.length == 0) {
        var nores = document.createElement("div");
        $(nores).text('No search results');
        $(nores).attr("id", "noresults");

        $("#maincontainer").append(end);
    }

    if(albumnumber > 0) {
        var end = document.createElement("div");
        var loadbtn = document.createElement("button");

        $(end).attr("id", "endofpage");
        $(loadbtn).attr("id", "loadbtn");

        $(end).append(loadbtn);
        $("#maincontainer").append(end);

        $('#loadbtn').click(function(){
            findAlbum();
        });
    } else {
        var end = document.createElement("div");
        $(end).css({
            'background-image': 'url(end.png)'
        });
        $(end).attr("id", "endofpage");

        $("#maincontainer").append(end);
    }
    
}

function removeModals() {
    $('.mySlides').remove();
    $('.captions').remove();
}
