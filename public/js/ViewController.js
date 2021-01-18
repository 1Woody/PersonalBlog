
var pre_url = window.location.href.split('/home')[0] 

var url = pre_url + "/api"
console.log(pre_url)
console.log($("#test\\;dani").attr('id').split(';')[1])

//Getting the email from the res.send from the sender
//const user_email = email
var user_name = undefined
var user_id = undefined

var post = {}
var all_users = {}
var following = {}
var followers = {}


// --------------- HASH CLASS --------------

function addHash(json, hash){
    let email = json.email
    hash[email] = json
}

function addPostHash(json, hash){
    let id_hash = "post_" + json._id
    hash[id_hash] = json
}

function removeHash(key, hash){
    delete hash[key]
}

function getHash(key, hash) { 
    return hash[key]
}


function formatpage(){
    //Coloca el nom de l'usuari a la capçalera
    $('#name_user').text(user_name)
    $('#btn_logout').on("click", logout)
    $('#blog_logo').on("click", function(){
        window.location.href ="/home"
    })
}


function logout(){
    //proyecto de futuro
    user_name = undefined
    user_email = undefined
    user_id = undefined
}

// --------------- GET DATA --------------

function getPost(){
    $.ajax({
        dataType: "json",
        url: url + '/post/user/' + user_email
    })
    .then(user => {
        let jsonData = JSON.stringify(user.response)
        jsonData = JSON.parse(jsonData)
        jsonData.forEach(json => {
            addPostHash(json, post)
        });
        PostViewController(jsonData.length)
    })
    .catch(error => {
        console.log(error)
    })
}

function getAllUsers(){
    $.ajax({
        dataType: "json",
        url: url + '/user'
    })
    .then(user => {
        let jsonData = JSON.stringify(user.usersArray)
        jsonData = JSON.parse(jsonData)
        jsonData.forEach(json => {
            if(json.email != user_email) addHash(json, all_users)
        });
        FollowersController()
    })
    .catch(error => {
        console.log(error)
    })
}


function getFollowing() {  
    $.ajax({
        dataType: "json",
        url: url + '/follower/following/' + user_email
    })
    .then(user => {
        let array = user.id_followers
        array.forEach(email => {
            let json = getHash(email, all_users)
            addHash(json, following)
        })
    })
    .catch(error => { console.log(error) })
}


function getFollowers() {  
    $.ajax({
        dataType: "json",
        url: url + '/follower/followers/' + user_email
    })
    .then(user => {
        let array = user.id_followers
        array.forEach(email => {
            let json = getHash(email, all_users)
            addHash(json, followers)
        })
        FollowersViewController()
    })
    .catch(error => { console.log(error) })
}


function getUserData(){
// funció principal amb la que agafarem les dades rellevants de l'usuari
    //user_email = $('#email_user').text()
    $.ajax({
        dataType: "json",
        url: url + '/user/' + user_email
    })
    .then(user => {
        let jsonData = JSON.stringify(user.response);
        jsonData = JSON.parse(jsonData)
        user_name = jsonData.name
        //user_email = jsonData.email
        user_id = jsonData._id
        DataController()
    })
    .catch(error => {
        console.log(error)
    })
}


// --------------- CREATES --------------

function createListPost(post_size){
    let num = 0
    if(post_size == 0){
        let title = "Nothing posted yet"
        let content = "Go to stories to add your first post!"
        let resume = "Nothing to see here."
        addCardPost(0, title, resume, content, "cardlist", num)
    }
    else{
        Object.values(post).forEach(post => {
            num++
            let post_id = post._id
            let title = post.title
            let content = post.content
            let resume = "Oh! it's empty"
            if(content.length > 170) resume = content.substring(0,170) + "..."
            else resume = content
            addCardPost(post_id, title, resume, content, "cardlist", num)   
        })
    }
}

function createListAllUsers(){
    let btn_text = ""
    Object.values(all_users).forEach(user => {
        let name = user.name
        let email = user.email
        if(getHash(email, following) != undefined) btn_text = "Unfollow"
        else btn_text = "Follow"
        addCardUser(name, email, btn_text, "allusers_id", "all_button(id)", "all")
    })
}

function createListFollowers(){
    Object.values(followers).forEach(user => {
        let name = user.name
        let email = user.email
        let btn_text = ""
        if(getHash(email, following) != undefined) btn_text = "Unfollow"
        else btn_text = "Follow"
        addCardUser(name, email, btn_text, "followers_id", "all_button(id)", "fller")
    })
}

function createListFollowing(){
    Object.values(following).forEach(user => {
        let name = user.name
        let email = user.email
        addCardUser(name, email, "Unfollow", "following_id", "following_button(id)", "fwing")
    })
}

//---------- BUTTONS USER CARD POST ------------

function deletePost(id){
    let post_id = id.split('_')[1]
    $.ajax({
        dataType: "json",
        type: "DELETE",
        url: url + '/post/' + post_id
    })
    .then(() => {
        let card_post_id = "card_"+ post_id
        let hash_id = "post_" + post_id
        removeHash(hash_id, post)
        document.getElementById(card_post_id).remove()
    })
    .catch((error) => {console.log(error)})  
}

function addPost(){
    if($("#card_0")) $("#card_0").remove()
    let title = $("#new_post_title").val()
    let content = $("#new_post_content").val()
    if(title == "") title = "You didn't put a title on it"
    if(content == "") content = "Nothing added by you"
    $.ajax({
        dataType : "json",
        type : "POST",
        url : url + '/post/' + user_email,
        data : {
            "title" : title,
            "content" : content,
            "public" : true
        }
    })
    .then((res) => {
        let post_id = res.response._id
        let resume = "Oh! it's empty"
        if(content.length > 170) resume = content.substring(0,170) + "..."
        else resume = content
        $("#new_post_title").val("")
        $("#new_post_content").val("")
        addCardPost (post_id, title, resume, content, "cardlist", post.length+1)
        
    })
    .catch((error) => {console.log(error)})  
}

//----------- EVENTLISTENERS Tabs
// Serveixen per tenir sempre actualitzats els botons (si estem seguint al usuari o no)
function addClickActionTab(){
    document.getElementById("myTaball").addEventListener("click", function() {
        let div = document.getElementById("allusers_id")
        let newdiv = `<div id="allusers_id"></div>`
        if(div != null){
            div.remove()
            $("#allusers").append(newdiv)
        }
        createListAllUsers()
        visitUsers()
    })
    document.getElementById("myTabfollowers").addEventListener("click", function() {
        let div = document.getElementById("followers_id")
        let newdiv = `<div id="followers_id"></div>`
        if(div != null){
            div.remove()
            $("#followers").append(newdiv)
        }
        createListFollowers()
        visitUsers()
    })
    document.getElementById("myTabfollowing").addEventListener("click", function() {
        let div = document.getElementById("following_id")
        let newdiv = `<div id="following_id"></div>`
        if(div != null){
            div.remove()
            $("#following").append(newdiv)
        }
        createListFollowing()
        visitUsers()
    })


}

// ------- BUTTON FROM TABS -----------

function all_button(id){
    let user_dest = id.split(';')[1]
    let user_state = document.getElementById(id).textContent
    if(user_state == "Follow"){
        $.ajax({
            dataType: "json",
            type: "POST",
            url: url + '/follower/' + user_email,
            data: {
                "email_dest": user_dest
            }
        })
        .then((res) => {
            if(document.getElementById(id).textContent != "Unfollow"){
                addHash(getHash(user_dest, all_users), following)
            }
            document.getElementById(id).textContent="Unfollow"
            //document.getElementById("allusers_id").remove()
            //createListAllUsers()
        })
        .catch((error) => {console.log(error)})
    }else{
        $.ajax({
            dataType: "json",
            type: "DELETE",
            url: url + '/follower/unfollow/' + user_email,
            data: {
                "email_dest": user_dest
            }
        })
        .then((res) => {
            if(document.getElementById(id).textContent == "Unfollow"){
                removeHash(user_dest, following)
            }
            document.getElementById(id).textContent="Follow" 
        })
        .catch((error) => {console.log(error)})  
    }
}


function following_button(id){
    let user_dest = id.split(';')[1]
    $.ajax({
        dataType: "json",
        type: "DELETE",
        url: url + '/follower/unfollow/' + user_email,
        data: {
            "email_dest": user_dest
        }
    })
    .then((res) => {
        removeHash(user_dest, following)
        let card_id = "cardfwing_" + user_dest
        document.getElementById(card_id).remove()
    })
    .catch((error) => {console.log(error)})  
}



//----------- SEARCH FILTER ---------------

function SearchUsers() {
    $('#search_input').on("keyup", function(){
        var value = $(this).val().toLowerCase()
        $(".usercard_header").filter(function(){
            if ($(this).text().toLowerCase().indexOf(value)>-1) $(this).parent().parent().show()
            else $(this).parent().parent().hide()
        })
    })
}


//------------- VISIT USERS ----------------------

function visitUsers(){
    $(".uservisit").on("click", function(){
        let url_new = pre_url + "/visit/" + $(this).parent().attr('id').split(';')[1]
        console.log(url_new)
        window.open(
            url_new,
            '_blank'
          );
    })
}


//----------- MAIN CALL CONTROLLERS --------------

//Informació prioritaria del usuari
//Click events
$(document).ready(function() {
    getUserData()
    addClickActionTab()
    SearchUsers()
})

//Recollecció de dades de totes les colleccions
function DataController(){
    formatpage()
    getPost()
    getAllUsers()
}

//Recollecció de dades de la relació follow
function FollowersController() {
    getFollowing()
    getFollowers()
}

//Implantació de dades al html
function FollowersViewController() {
    createListFollowers()
    createListFollowing()
    createListAllUsers()
    visitUsers()
}

//Implantació de nou post
function PostViewController(post_size){
    createListPost(post_size)
}

//---------- TEMPLATES FOR CREATE ----------------------

function addCardUser(name, email, btn_text, tab_id, action, id){
    let fullid = id + ";" + email
    let html_card = 
    `
    <div id="card${fullid}" class="usercard card text-center card-body border-0 mt-2">
        <div class="uservisit">
        <h5 class="usercard_header card-title"> <i class="fas fa-user"></i>${name}</h5>
        </div>
        <p class="card-text">${email}</p>
        <button id="btn${fullid}" href="#" class="card_user_bt btn btn-primary" onclick="${action}">${btn_text}</button>
    </div>
    `
    $("#" + tab_id).append(html_card)
}


function addCardPost (post_id, title, resume, content, tab_id, num){
    let html_card = 
    `
    <div id="card_${post_id}" class="card_post card border-0 card-body mb-3">
        <h5 class="card-title lead">${title}</h5>
        <p class="card-text content_post">${resume}</p>
        <div class="row justify-content-center">
            <a href="" class="read_bt btn btn-warning btn-md" data-bs-toggle="modal" data-bs-target="#fullcontentModal${num}">Read More</a>
        </div>

        <div class="modal fade" id="fullcontentModal${num}" tabindex="-1" aria-labelledby="fullcontentModalLabel${num}" aria-hidden="true">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="fullcontentModalLabel${num}">${title}</h4>
                    <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                </div>
                <div class="modal-footer">
                    <button id="btn_${post_id}" type="button" class="btn btn-danger" onclick="deletePost(id)" data-bs-dismiss="modal">Delete Post</button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
            </div>
        </div>
    </div>
    `
    $("#" + tab_id).prepend(html_card)
}
