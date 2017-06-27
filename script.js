var root = 'https://jsonplaceholder.typicode.com';
var posts;
var users;
var photos;
var albums;
var postnumber;
var key;
var from;
var user;
var searchkey;
var pathname;

$(document).ready(function(){
    sizeFunction();
    
    pathname = window.location.pathname;
    pathname = pathname.substring(pathname.lastIndexOf('/')+1, pathname.indexOf('.html'));
    document.title = pathname.charAt(0).toUpperCase() + pathname.substring(1);
    
    start();

    $("#searchbtn").click(search);
    $("#searchbar").submit(function(e){
        e.preventDefault();
        search();
    });
    
    $("#searchbar").keypress(function (e) {
        if (e.which == 13) {
            $('#searchbar').submit();
            return false;
        }
    });
});

function search() {
    var searchkey = $("#searchbar").val();
    var pathname = window.location.pathname;
    pathname = pathname.substring(pathname.lastIndexOf('/')+1, pathname.indexOf('.html'));
    
    if(pathname == 'search') {
        pathname = from;
    }
    
    if(searchkey.trim() != "") {
        window.location.href = 'search.html?' + pathname + '?' + searchkey;
    }
}

$(window).on('resize', function(){
    sizeFunction();
});

function sizeFunction() {
    var win = $(this);
    
    if(win.width() < 1000) {
        $('.navtxt').text('');
        
        if (win.width() < 800) {
            $('#header').css({
                left: '-webkit-calc(50% - 200px)'
            });
            
            $('#main').css({
                left: '-webkit-calc(50% - 200px)'
            });
            
        } else {
            $('#header').css({
                left: '25%'
            });
            
            $('#main').css({
                left: '25%'
            });
        }
    } else {
        $('#hometxt').text('Home');
        $('#phototxt').text('Photos');
        $('#proftxt').text('Profiles');
        
        $('#header').css({
            left: '25%'
        });

        $('#main').css({
            left: '25%'
        });
    }
    
    searchkey = $("#searchbar").val();
    pathname = window.location.pathname;
    pathname = pathname.substring(pathname.lastIndexOf('/')+1, pathname.indexOf('.html'));
    
    if(pathname == 'profiles' && window.location.search != '') {
        var usertbsize;
        if($('.user').length){
            usertbsize = $('.user').outerHeight() + 20;
        } else{
            usertbsize = 220;
        }

        //console.log($('#main').height());

        $('#usercontainer').css({
            'height': '-webkit-calc(100% - ' + usertbsize + 'px)'
        });

        var mcheight = $('#main').height() - usertbsize - 65;
        var mcwidth = $('#main').width();
        $('#maincontainer').css({
            'height': '-webkit-calc(' + mcheight + 'px)',
            'width': mcwidth + 'px'
        });

        var uc = $('#usercontainer').height();
        //console.log(mcheight);
    }
}

$(document).on("mouseover", ".navlink", function(){
    $(this).find('.navimg').attr('src', 'spritesheethover.png');
    $(this).find('.navtxt').css({
        'text-shadow': '0.5px 0.5px 1px #0099cc'
    });
});

$(document).on("mouseout", ".navitem", function(){
    $(this).find('.navimg').attr('src', 'spritesheet.png');
    $(this).find('.navtxt').css({
        'text-shadow': 'none'
    });
});

function loadPosts() {
    
    var i;
    postnumber = posts.length;
    
    if($("#endofpage").length) {
        $("#endofpage").remove();
    }

    for(i = 0 ; i < 10 && postnumber > 0; i++) {
        var post = posts[postnumber-1];
        
        if(window.location.search == '') {
           user = users[post.userId - 1];
        }
        //console.log('post ' + postnumber + user.name);

        var name = document.createElement("span");
        $(name).text(user.name);
        $(name).addClass("name");

        var link = document.createElement("a");
        $(link).addClass("userlink");
        $(link).attr("href", "profiles.html?userId=" + user.id);
        $(link).append(name);

        var username = document.createElement("span");
        $(username).text("@" + user.username);
        $(username).addClass("username");

        var usertd = document.createElement("td");
        $(usertd).append(link);
        $(usertd).append(username);

        var title = document.createElement("td");
        $(title).text(post.title);
        $(title).addClass("title");

        var content = document.createElement("td");
        $(content).text(post.body);
        $(content).addClass("content");

        var row1 = document.createElement("tr");
        $(row1).append(usertd);

        var row2 = document.createElement("tr");
        $(row2).append(title);

        var row3 = document.createElement("tr");
        $(row3).append(content);

        var posttb = document.createElement("table");
        $(posttb).addClass("post");
        $(posttb).append(row1);
        $(posttb).append(row2);
        $(posttb).append(row3);

        $("#maincontainer").append(posttb);

        postnumber--;
    }
    
    if(posts.length == 0) {
        var nores = document.createElement("div");
        $(nores).text('No search results');
        $(nores).attr("id", "noresults");

        $("#maincontainer").append(end);
    }

    if(postnumber > 0) {
        var end = document.createElement("div");
        var loadbtn = document.createElement("button");

        $(end).attr("id", "endofpage");
        $(loadbtn).attr("id", "loadbtn");

        $(end).append(loadbtn);
        $("#maincontainer").append(end);

        $('#loadbtn').click(function(){
            loadPosts();
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

function filterPosts(searchkey) {
    var temp = [];

    for(var i = 0 ; i < posts.length ; i++) {
        var post = posts[i];

        if(post.title.toLowerCase().indexOf(searchkey) != -1 || post.body.toLowerCase().indexOf(searchkey) != -1) {
            temp.push(post);
        }
    }

    posts = temp;
    postnumber = posts.length;

    loadPosts();

    $('#searchres').text(posts.length + ' search results');
}

function filterPhotos(searchkey) {
    var temp = [];
    
    for(var i = 0 ; i < photos.length ; i++) {
        var pic = photos[i];
        
        if(pic.title.toLowerCase().indexOf(searchkey) != -1) {
            temp.push(pic);
        }
    }
    
    photos = temp;
    photonumber = photos.length;
    
    loadPhotos();
    
    $('#searchres').text(photos.length + ' search results');
}

function filterAlbums(searchkey) {
    var temp = [];
    
    for(var i = 0 ; i < albums.length ; i++) {
        var album = albums[i];
        
        if(album.title.toLowerCase().indexOf(searchkey) != -1) {
            temp.push(album);
        }
    }
    
    albums = temp;
    albumnumber = albums.length;
    
    findAlbum();
    
    $('#searchres').text(albums.length + ' search results');
}

function filterUsers(searchkey) {
    var temp = [];
    
    for(var i = 0 ; i < users.length ; i++) {
        var user = users[i];
        
        if(user.name.toLowerCase().indexOf(searchkey) != -1 || user.username.toLowerCase().indexOf(searchkey) != -1) {
            temp.push(user);
        }
    }
    
    users = temp;
    usernumber = users.length;
    
    loadProfiles();
    
    $('#searchres').text(users.length + ' search results');
}

function loadProfiles() {
    var i;

    usernumber = users.length;

    if($("#endofpage").length) {
        $("#endofpage").remove();
    }

    for(i = 0 ; i < 10 && usernumber > 0; i++) {
        var user = users[usernumber-1];

        var name = document.createElement("span");
        $(name).text(user.name);
        $(name).addClass("name");

        var link = document.createElement("a");
        $(link).addClass("userlink");
        $(link).attr("href", "profiles.html?userId=" + user.id);
        $(link).append(name);

        var username = document.createElement("span");
        $(username).text("@" + user.username);
        $(username).addClass("username");

        var usertd = document.createElement("td");
        $(usertd).addClass("namerow");
        $(usertd).append(link);
        $(usertd).append(username);

        var emailtd = document.createElement("td");
        $(emailtd).addClass("emailrow");
        var email = document.createElement("span");
        $(email).text(user.email);
        $(emailtd).append(email);

        var addresstd = document.createElement("td");
        $(addresstd).addClass("address");
        var address = document.createElement("span");
        $(address).text(user.address.suite + ', ' + user.address.street + ', ' + user.address.city + ', ' + user.address.zipcode);
        $(addresstd).append(address);

        var phone = document.createElement("span");
        $(phone).text(user.phone);
        var phonetd = document.createElement("td");
        $(phonetd).addClass("phone");
        $(phonetd).append(phone);

        var website = document.createElement("span");
        $(website).text(user.website);
        var websitetd = document.createElement("td");
        $(websitetd).addClass("website");
        $(websitetd).append(website);

        var company = document.createElement("span");
        $(company).text(user.company.name);
        var companytd = document.createElement("td");
        $(companytd).addClass("company");
        $(companytd).append(company);

        var catchphrase = document.createElement("span");
        $(catchphrase).text(user.company.catchPhrase);
        var catchphrasetd = document.createElement("td");
        $(catchphrasetd).addClass("catchphrase");
        $(catchphrasetd).append(catchphrase);

        var bs = document.createElement("span");
        $(bs).text(user.company.bs);
        var bstd = document.createElement("td");
        $(bstd).addClass("bs");
        $(bstd).append(bs);

        var usertb = document.createElement("table");
        $(usertb).addClass("user");
        $(usertb).append(usertd);
        $(usertb).append(emailtd);
        $(usertb).append(addresstd);
        $(usertb).append(phonetd);
        $(usertb).append(websitetd);
        $(usertb).append(companytd);
        $(usertb).append(catchphrasetd);
        $(usertb).append(bstd);

        $("#maincontainer").append(usertb);

        usernumber--;
    }

    if(usernumber > 0) {
        var end = document.createElement("div");
        var loadbtn = document.createElement("button");

        $(end).attr("id", "endofpage");
        $(loadbtn).attr("id", "loadbtn");

        $(end).append(loadbtn);
        $("#maincontainer").append(end);

        $('#loadbtn').click(function(){
            loadProfiles();
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

